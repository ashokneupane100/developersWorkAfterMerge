import { NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";         // ensure it runs server-side
export const runtime = "nodejs";                // not edge (needs 'pg')

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

const RADIUS_M = 500;
const EMAIL_CAP = 10;
const SMS_CAP = 5;

// --------- helpers ----------
async function sendEmailResend(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "notify@yourdomain.com",
      to,
      subject,
      html,
    }),
  });
  return res.ok;
}

async function sendSparrowSMS(to: string, text: string) {
  const url = process.env.SPARROW_URL!;
  const token = process.env.SPARROW_TOKEN!;
  const from = process.env.SPARROW_FROM!;
  if (!url || !token || !from) return false;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, from, to, text }),
  });
  return res.ok;
}

// --------- main handler ----------
export async function POST() {
  const client = await pool.connect();
  try {
    /**
     * One SQL to:
     * - pick eligible requests (hasPaid yes/partial, status pending)
     * - parse their lat/lng from coordinates (supports "lat,lng" or JSON {lat,lng})
     * - join active listings and parse listing lat/lng
     * - compute Haversine distance in SQL
     * - filter <= 500 m
     * - enforce caps (emailCount<10 OR messageCount<5 so at least one channel can be sent)
     * - skip the lastlistingsent to avoid immediate repeat
     * - pick the *closest* listing per request with DISTINCT ON
     */
    const sql = `
      with req as (
        select
          r.id as request_id,
          r.full_name,
          r.email,
          r.phone,
          r.property_type,
          r.location,
          r.coordinates as req_coords,
          r."emailCount",
          r."messageCount",
          r.lastlistingsent,
          case
            when r.coordinates ~ '^[0-9.-]+,[0-9.-]+$' then split_part(r.coordinates, ',', 1)::float
            else (r.coordinates::json->>'lat')::float
          end as req_lat,
          case
            when r.coordinates ~ '^[0-9.-]+,[0-9.-]+$' then split_part(r.coordinates, ',', 2)::float
            else (r.coordinates::json->>'lng')::float
          end as req_lng
        from public.property_requests r
        where r."hasPaid" in ('yes','partial')
          and coalesce(r.status, 'pending') = 'pending'
          and (coalesce(r."emailCount",0) < $1 or coalesce(r."messageCount",0) < $2)
      ),
      cand as (
        select
          req.*,
          l.id as listing_id,
          l.post_title,
          l.full_address,
          l.price,
          l."propertyType",
          case when l.coordinates::text like '%"lat"%' then (l.coordinates::json->>'lat')::float end as l_lat,
          case when l.coordinates::text like '%"lng"%' then (l.coordinates::json->>'lng')::float end as l_lng
        from req
        join public.listing l on
          l.active is true
          and coalesce(l.sold,false) = false
          and coalesce(l.admin_status,'Pending') <> 'Rejected'
          and (req.property_type is null or l."propertyType" = req.property_type)
          and (req.lastlistingsent is null or l.id <> req.lastlistingsent)
      ),
      dist as (
        select
          *,
          2 * 6371000 * asin(
            sqrt(
              pow(sin(radians((l_lat - req_lat)/2)), 2) +
              cos(radians(req_lat)) * cos(radians(l_lat)) *
              pow(sin(radians((l_lng - req_lng)/2)), 2)
            )
          ) as distance_m
        from cand
        where req_lat is not null and req_lng is not null and l_lat is not null and l_lng is not null
      ),
      within as (
        select * from dist where distance_m <= $3
      )
      select distinct on (request_id)
        request_id,
        full_name, email, phone, location,
        listing_id, post_title, full_address, price, distance_m
      from within
      order by request_id, distance_m asc
    `;

    const { rows: matches } = await client.query(sql, [EMAIL_CAP, SMS_CAP, RADIUS_M]);

    let sent = 0;
    for (const m of matches) {
      // Get the latest counts + guard again (race-safe)
      const { rows: [reqRow] } = await client.query(
        `select "emailCount", "messageCount" from public.property_requests where id=$1`,
        [m.request_id]
      );
      const emailCount = Number(reqRow?.emailCount ?? 0);
      const messageCount = Number(reqRow?.messageCount ?? 0);
      if (emailCount >= EMAIL_CAP && messageCount >= SMS_CAP) continue;

      const title = m.post_title ?? "Property";
      const addr = m.full_address ?? m.location ?? "";
      const priceTxt = m.price != null ? `Rs ${Math.round(m.price)}` : "";
      const emailSubject = `Match found near ${addr}`;
      const emailHtml = `
        <p>Hi ${m.full_name?.split(" ")[0] ?? "there"},</p>
        <p>We found a matching property: <b>${title}</b> ${priceTxt ? "(" + priceTxt + ")" : ""} near ${addr}.</p>
        <p>Reply to this email to get more details.</p>
      `;
      const smsText = `Hi ${m.full_name?.split(" ")[0] ?? ""}, found: ${title} ${priceTxt ? "• " + priceTxt : ""} near ${addr}. Reply YES for details.`;

      // 1) Email (if under cap)
      let emailOK = true;
      if (m.email && emailCount < EMAIL_CAP) {
        emailOK = await sendEmailResend(m.email, emailSubject, emailHtml);
        if (emailOK) {
          await client.query(
            `update public.property_requests
             set "emailCount" = coalesce("emailCount",0) + 1,
                 lastlistingsent = $1
             where id = $2`,
            [m.listing_id, m.request_id]
          );
        }
      }

      // 2) SMS (if under cap)
      let smsOK = true;
      if (m.phone && messageCount < SMS_CAP) {
        smsOK = await sendSparrowSMS(m.phone, smsText);
        if (smsOK) {
          await client.query(
            `update public.property_requests
             set "messageCount" = coalesce("messageCount",0) + 1,
                 lastlistingsent = $1
             where id = $2`,
            [m.listing_id, m.request_id]
          );
        }
      }

      if (emailOK || smsOK) sent++;
    }

    return NextResponse.json({ ok: true, matches: matches.length, sent });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e?.message ?? e) }, { status: 500 });
  } finally {
    client.release();
  }
}
