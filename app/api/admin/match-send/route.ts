// import { NextResponse } from "next/server";
// import { Pool } from "pg";
// import nodemailer from "nodemailer";

// export const runtime = "nodejs";

// const RADIUS_M = 500;
// const EMAIL_CAP = 10;
// const SMS_CAP = 5;

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// });

// // ---------- helpers ----------
// function maskEmail(e?: string | null) {
//   if (!e) return "";
//   const [u, d] = e.split("@");
//   if (!d) return e;
//   const safeUser = u.length <= 2 ? u[0] + "*" : u[0] + "*".repeat(Math.max(1, u.length - 2)) + u[u.length - 1];
//   return `${safeUser}@${d}`;
// }

// function maskPhone(p?: string | null) {
//   if (!p) return "";
//   const digits = p.replace(/\D/g, "");
//   if (digits.length <= 4) return "*".repeat(digits.length);
//   return digits.slice(0, 2) + "*".repeat(Math.max(0, digits.length - 4)) + digits.slice(-2);
// }

// type Attempt = { to: string; ok: boolean; error?: string; request_id: string; listing_id: number };
// function pushAttempt(bucket: Attempt[], to: string, ok: boolean, request_id: string, listing_id: number, error?: string) {
//   bucket.push({ to, ok, request_id, listing_id, error });
// }

// // Build a stable UUID from a string using md5 (no extensions needed)
// const UUID_FROM_TEXT_SQL = (txtExpr: string) =>
//   `(
//     (substr(md5(${txtExpr}),1,8) || '-' ||
//      substr(md5(${txtExpr}),9,4) || '-' ||
//      substr(md5(${txtExpr}),13,4) || '-' ||
//      substr(md5(${txtExpr}),17,4) || '-' ||
//      substr(md5(${txtExpr}),21,12)
//     )::uuid
//   )`;

// async function sendEmailSMTP(to: string, subject: string, html: string) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_SERVER_HOST,
//       port: Number(process.env.EMAIL_SERVER_PORT || 465),
//       secure: String(process.env.EMAIL_SERVER_SECURE || "true") === "true",
//       auth: {
//         user: process.env.EMAIL_SERVER_USER,
//         pass: process.env.EMAIL_SERVER_PASSWORD, // Gmail App Password
//       },
//     });

//     const fromName = process.env.EMAIL_FROM_NAME || "Online Home Nepal";
//     const fromAddr = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_SERVER_USER!;

//     const info = await transporter.sendMail({
//       from: `"${fromName}" <${fromAddr}>`,
//       to,
//       subject,
//       html,
//     });

//     return { ok: true, id: info.messageId };
//   } catch (e: any) {
//     console.error("SMTP error:", e?.message || e);
//     return { ok: false, error: String(e?.message || e) };
//   }
// }

// async function sendSparrowSMS(to: string, text: string) {
//   const url = process.env.SPARROW_URL || "https://api.sparrowsms.com/v2/sms/";
//   const token = process.env.SPARROW_TOKEN || process.env.SPARROW_SMS_TOKEN;
//   const from = process.env.SPARROW_FROM;
//   if (!url || !token || !from) return { ok: false, error: "Missing SPARROW_URL/SPARROW_TOKEN/SPARROW_FROM" };

//   try {
//     const res = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, from, to, text }),
//     });
//     const body = await res.text();
//     if (!res.ok) {
//       console.error("Sparrow error:", body);
//       return { ok: false, error: `HTTP ${res.status}: ${body}` };
//     }
//     return { ok: true, body };
//   } catch (e: any) {
//     console.error("Sparrow fetch error:", e?.message || e);
//     return { ok: false, error: String(e?.message || e) };
//   }
// }

// export async function POST() {
//   const client = await pool.connect();
//   try {
//     // —— SQL with safe uuid comparison ——
//     // We compute a stable UUID for each listing as uuid_from_text('listing:'||l.id)
//     // and compare it to property_requests.lastlistingsent (uuid).
//     const lUuid = UUID_FROM_TEXT_SQL(`'listing:' || l.id::text`);
//     const mUuid = (listingIdParam = "m.listing_id") =>
//       UUID_FROM_TEXT_SQL(`'listing:' || ${listingIdParam}::text`);

//     const sql = `
//       with req as (
//         select
//           r.id as request_id,
//           r.full_name,
//           r.email,
//           r.phone,
//           r.property_type,
//           r.location,
//           r.coordinates as req_coords,
//           r."emailCount",
//           r."messageCount",
//           r.lastlistingsent,
//           case
//             when r.coordinates ~ '^[0-9.-]+,[0-9.-]+$' then split_part(r.coordinates, ',', 1)::float
//             else (r.coordinates::json->>'lat')::float
//           end as req_lat,
//           case
//             when r.coordinates ~ '^[0-9.-]+,[0-9.-]+$' then split_part(r.coordinates, ',', 2)::float
//             else (r.coordinates::json->>'lng')::float
//           end as req_lng
//         from public.property_requests r
//         where r."hasPaid" in ('yes','partial')
//           and coalesce(r.status, 'pending') = 'pending'
//           and (coalesce(r."emailCount",0) < $1 or coalesce(r."messageCount",0) < $2)
//       ),
//       cand as (
//         select
//           req.*,
//           l.id as listing_id,
//           l.post_title,
//           l.full_address,
//           l.price,
//           l."propertyType",
//           case when l.coordinates::text like '%"lat"%' then (l.coordinates::json->>'lat')::float end as l_lat,
//           case when l.coordinates::text like '%"lng"%' then (l.coordinates::json->>'lng')::float end as l_lng,
//           ${lUuid} as listing_uuid
//         from req
//         join public.listing l on
//           l.active is true
//           and coalesce(l.sold,false) = false
//           and coalesce(l.admin_status,'Pending') <> 'Rejected'
//           and (req.property_type is null or l."propertyType" = req.property_type)
//           and (req.lastlistingsent is null or req.lastlistingsent <> ${lUuid})
//       ),
//       dist as (
//         select
//           *,
//           2 * 6371000 * asin(
//             sqrt(
//               pow(sin(radians((l_lat - req_lat)/2)), 2) +
//               cos(radians(req_lat)) * cos(radians(l_lat)) *
//               pow(sin(radians((l_lng - req_lng)/2)), 2)
//             )
//           ) as distance_m
//         from cand
//         where req_lat is not null and req_lng is not null and l_lat is not null and l_lng is not null
//       ),
//       within as (
//         select * from dist where distance_m <= $3
//       )
//       select distinct on (request_id)
//         request_id,
//         full_name, email, phone, location,
//         listing_id, post_title, full_address, price, distance_m
//         "propertyType"  
//       from within
//       order by request_id, distance_m asc
//     `;

//     const { rows: matches } = await client.query(sql, [EMAIL_CAP, SMS_CAP, RADIUS_M]);

//     const emailAttempts: Attempt[] = [];
//     const smsAttempts: Attempt[] = [];
//     const perRequest: any[] = [];
//     let sent = 0;

//     for (const m of matches) {
//       const { rows: [reqRow] } = await client.query(
//         `select "emailCount", "messageCount" from public.property_requests where id=$1`,
//         [m.request_id]
//       );
//       const emailCount = Number(reqRow?.emailCount ?? 0);
//       const messageCount = Number(reqRow?.messageCount ?? 0);
//       if (emailCount >= EMAIL_CAP && messageCount >= SMS_CAP) continue;

//       const title = m.post_title ?? "Property";
//       const addr = m.full_address ?? m.location ?? "";
//       const priceTxt = m.price != null ? `Rs ${Math.round(m.price)}` : "";
//       const emailSubject = `Match found near ${addr}`;
//      // Build the listing URL from the id you already have
// const baseUrl =
//   process.env.NEXT_PUBLIC_DOMAIN_URL?.replace(/\/$/, "") ||
//   "https://www.onlinehome.com.np";
// const listingUrl = `${baseUrl}/view-listing/${m.listing_id}`;

// // Optional small helpers
// const distTxt =
//   typeof m.distance_m === "number" ? `${Math.round(m.distance_m)} m` : "—";
// const typeTxt = (m as any).propertyType || "—"; // add "propertyType" to final SELECT if you want this filled

// const emailHtml = `<!doctype html>
// <html>
//   <head>
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
//     <title>Property match</title>
//   </head>
//   <body style="margin:0;padding:0;background:#f6f7fb;">
//     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;">
//       <tr>
//         <td align="center" style="padding:24px;">
//           <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
//             <tr>
//               <td style="padding:24px 24px 8px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
//                 <div style="font-size:16px;">Hi ${m.full_name?.split(" ")[0] ?? "there"},</div>
//                 <div style="margin-top:8px;font-size:14px;color:#374151;">
//                   We found a matching property near <b>${addr}</b>.
//                 </div>
//               </td>
//             </tr>

//             <tr>
//               <td style="padding:12px 24px 0 24px;">
//                 <!-- Card -->
//                 <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:10px;">
//                   <tr>
//                     <td style="padding:16px 16px 4px 16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
//                       <div style="font-weight:600;font-size:16px;color:#111827;">${title}</div>
//                       <div style="margin-top:2px;font-size:13px;color:#6b7280;">ID: #${m.listing_id}</div>
//                     </td>
//                   </tr>
//                   <tr>
//                     <td style="padding:0 16px 12px 16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
//                       <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#111827;">
//                         <tr>
//                           <td style="padding:6px 0;width:120px;color:#6b7280;">Type</td>
//                           <td style="padding:6px 0;">${typeTxt}</td>
//                         </tr>
//                         <tr>
//                           <td style="padding:6px 0;width:120px;color:#6b7280;">Price</td>
//                           <td style="padding:6px 0;">${priceTxt || "—"}</td>
//                         </tr>
//                         <tr>
//                           <td style="padding:6px 0;width:120px;color:#6b7280;">Address</td>
//                           <td style="padding:6px 0;">${addr}</td>
//                         </tr>
//                         <tr>
//                           <td style="padding:6px 0;width:120px;color:#6b7280;">Distance</td>
//                           <td style="padding:6px 0;">${distTxt}</td>
//                         </tr>
//                       </table>
//                     </td>
//                   </tr>
//                 </table>
//                 <!-- /Card -->
//               </td>
//             </tr>

//             <tr>
//               <td align="center" style="padding:20px 24px 8px 24px;">
//                 <a href="${listingUrl}" target="_blank"
//                    style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;
//                           font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
//                           font-weight:600;font-size:14px;line-height:20px;padding:10px 16px;border-radius:8px;">
//                   View full details
//                 </a>
//               </td>
//             </tr>

//             <tr>
//               <td style="padding:8px 24px 24px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;">
//                 If the button doesn't work, copy and paste this link into your browser:<br/>
//                 <span style="word-break:break-all;"><a href="${listingUrl}" target="_blank" style="color:#4f46e5;text-decoration:underline;">${listingUrl}</a></span>
//               </td>
//             </tr>

//           </table>

//       const smsText = `Hi ${m.full_name?.split(" ")[0] ?? ""}, found: ${title} ${priceTxt ? "• " + priceTxt : ""} near ${addr}. Reply YES for details.`;

//       // EMAIL first (if under cap)
//       let emailRes: any = { ok: false, error: "skipped" };
//       if (m.email && emailCount < EMAIL_CAP) {
//         emailRes = await sendEmailSMTP(m.email, emailSubject, emailHtml);
//         if (emailRes.ok) {
//           await client.query(
//             `update public.property_requests
//              set "emailCount" = coalesce("emailCount",0) + 1,
//                  lastlistingsent = ${UUID_FROM_TEXT_SQL(`'listing:' || $1::text`)}
//              where id = $2`,
//             [m.listing_id, m.request_id]
//           );
//         }
//       }

//       // SMS next (if under cap)
//       let smsRes: any = { ok: false, error: "skipped" };
//       if (m.phone && messageCount < SMS_CAP) {
//         const to = m.phone; // add "977" prefix here if Sparrow requires country code
//         smsRes = await sendSparrowSMS(to, smsText);
//         if (smsRes.ok) {
//           await client.query(
//             `update public.property_requests
//              set "messageCount" = coalesce("messageCount",0) + 1,
//                  lastlistingsent = ${UUID_FROM_TEXT_SQL(`'listing:' || $1::text`)}
//              where id = $2`,
//             [m.listing_id, m.request_id]
//           );
//         }
//       }

//       if (m.email) pushAttempt(emailAttempts, m.email, !!emailRes?.ok, m.request_id, m.listing_id, emailRes?.error);
//       if (m.phone) pushAttempt(smsAttempts, m.phone, !!smsRes?.ok, m.request_id, m.listing_id, smsRes?.error);

//       perRequest.push({
//         request_id: m.request_id,
//         listing_id: m.listing_id,
//         name: m.full_name,
//         email: m.email,
//         phone: m.phone,
//         address: addr,
//         distance_m: Math.round(Number(m.distance_m ?? 0)),
//         emailsent: { attempted: !!m.email, ok: !!emailRes?.ok, error: emailRes?.error },
//         sms:   { attempted: !!m.phone, ok: !!smsRes?.ok,   error: smsRes?.error },
//       });

//       if (emailRes?.ok || smsRes?.ok) sent++;
//     }

//     const emailSuccess = emailAttempts.filter(a => a.ok);
//     const emailFailed  = emailAttempts.filter(a => !a.ok);
//     const smsSuccess   = smsAttempts.filter(a => a.ok);
//     const smsFailed    = smsAttempts.filter(a => !a.ok);
//     const sample = <T extends Attempt>(arr: T[], n = 5) => arr.slice(0, n);

//     const summary = {
//       ok: true,
//       matches: matches.length,
//       sent,
//       email: {
//         attempted: emailAttempts.length,
//         successCount: emailSuccess.length,
//         failCount: emailFailed.length,
//         successTo: sample(emailSuccess).map(a => maskEmail(a.to)),
//         failed: sample(emailFailed).map(a => ({ to: maskEmail(a.to), error: a.error ?? "unknown" })),
//       },
//       sms: {
//         attempted: smsAttempts.length,
//         successCount: smsSuccess.length,
//         failCount: smsFailed.length,
//         successTo: sample(smsSuccess).map(a => maskPhone(a.to)),
//         failed: sample(smsFailed).map(a => ({ to: maskPhone(a.to), error: a.error ?? "unknown" })),
//       },
//       details: perRequest,
//     };

//     return NextResponse.json(summary);
//   } catch (e: any) {
//     console.error(e);
//     return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
//   } finally {
//     client.release();
//   }
// }
import { NextResponse } from "next/server";
import { Pool } from "pg";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const RADIUS_M = 500;
const EMAIL_CAP = 10;
const SMS_CAP = 5;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// ---------- helpers ----------
function maskEmail(e?: string | null) {
  if (!e) return "";
  const [u, d] = e.split("@");
  if (!d) return e;
  const safeUser =
    u.length <= 2 ? u[0] + "*" : u[0] + "*".repeat(Math.max(1, u.length - 2)) + u[u.length - 1];
  return `${safeUser}@${d}`;
}

function maskPhone(p?: string | null) {
  if (!p) return "";
  const digits = p.replace(/\D/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length);
  return digits.slice(0, 2) + "*".repeat(Math.max(0, digits.length - 4)) + digits.slice(-2);
}

type Attempt = { to: string; ok: boolean; error?: string; request_id: string; listing_id: number };
function pushAttempt(bucket: Attempt[], to: string, ok: boolean, request_id: string, listing_id: number, error?: string) {
  bucket.push({ to, ok, request_id, listing_id, error });
}

// Build a stable UUID from text using md5 (no extension needed)
const UUID_FROM_TEXT_SQL = (txtExpr: string) =>
  `(
    (substr(md5(${txtExpr}),1,8) || '-' ||
     substr(md5(${txtExpr}),9,4) || '-' ||
     substr(md5(${txtExpr}),13,4) || '-' ||
     substr(md5(${txtExpr}),17,4) || '-' ||
     substr(md5(${txtExpr}),21,12)
    )::uuid
  )`;

async function sendEmailSMTP(to: string, subject: string, html: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT || 465),
      secure: String(process.env.EMAIL_SERVER_SECURE || "true") === "true",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD, // Gmail App Password
      },
    });

    const fromName = process.env.EMAIL_FROM_NAME || "Online Home Nepal";
    const fromAddr = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_SERVER_USER!;

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddr}>`,
      to,
      subject,
      html,
    });

    return { ok: true, id: info.messageId };
  } catch (e: any) {
    console.error("SMTP error:", e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
}

async function sendSparrowSMS(to: string, text: string) {
  const url = process.env.SPARROW_URL || "https://api.sparrowsms.com/v2/sms/";
  const token = process.env.SPARROW_TOKEN || process.env.SPARROW_SMS_TOKEN;
  const from = process.env.SPARROW_FROM;
  if (!url || !token || !from) return { ok: false, error: "Missing SPARROW_URL/SPARROW_TOKEN/SPARROW_FROM" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, from, to, text }),
    });
    const body = await res.text();
    if (!res.ok) {
      console.error("Sparrow error:", body);
      return { ok: false, error: `HTTP ${res.status}: ${body}` };
    }
    return { ok: true, body };
  } catch (e: any) {
    console.error("Sparrow fetch error:", e?.message || e);
    return { ok: false, error: String(e?.message || e) };
  }
}

export async function POST() {
  const client = await pool.connect();
  try {
    // compute a stable UUID for each listing to compare with lastlistingsent (uuid)
    const lUuid = UUID_FROM_TEXT_SQL(`'listing:' || l.id::text`);

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
          case when l.coordinates::text like '%"lng"%' then (l.coordinates::json->>'lng')::float end as l_lng,
          ${lUuid} as listing_uuid
        from req
        join public.listing l on
          l.active is true
          and coalesce(l.sold,false) = false
          and coalesce(l.admin_status,'Pending') <> 'Rejected'
          and (req.property_type is null or l."propertyType" = req.property_type)
          and (req.lastlistingsent is null or req.lastlistingsent <> ${lUuid})
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
        listing_id, post_title, full_address, price, distance_m,
        "propertyType"
      from within
      order by request_id, distance_m asc
    `;

    const { rows: matches } = await client.query(sql, [EMAIL_CAP, SMS_CAP, RADIUS_M]);

    const emailAttempts: Attempt[] = [];
    const smsAttempts: Attempt[] = [];
    const perRequest: any[] = [];
    let sent = 0;

    for (const m of matches as any[]) {
      const { rows: [reqRow] } = await client.query(
        `select "emailCount", "messageCount" from public.property_requests where id=$1`,
        [m.request_id]
      );
      const emailCount = Number(reqRow?.emailCount ?? 0);
      const messageCount = Number(reqRow?.messageCount ?? 0);
      if (emailCount >= EMAIL_CAP && messageCount >= SMS_CAP) continue;

      // ----- build email + sms content -----
      const title = m.post_title ?? "Property";
      const addr = m.full_address ?? m.location ?? "";
      const priceTxt = m.price != null ? `Rs ${Math.round(m.price)}` : "";
      const typeTxt = m.propertyType ?? "—";
      const distTxt = typeof m.distance_m === "number" ? `${Math.round(m.distance_m)} m` : "—";
      const firstName = (m.full_name || "").split(" ")[0] || "there";

      // Link -> https://www.onlinehome.com.np/view-listing/{id}
      const baseUrl =
        process.env.NEXT_PUBLIC_DOMAIN_URL?.replace(/\/$/, "") ||
        "https://www.onlinehome.com.np";
      const listingUrl = `${baseUrl}/view-listing/${String(m.listing_id)}`;

      const emailSubject = `Match found near ${addr}`;
      const emailHtml = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Property match</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f7fb;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7fb;">
      <tr>
        <td align="center" style="padding:24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:24px 24px 8px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
                <div style="font-size:16px;">Hi ${firstName},</div>
                <div style="margin-top:8px;font-size:14px;color:#374151;">
                  We found a matching property near <b>${addr}</b>.
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 24px 0 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:10px;">
                  <tr>
                    <td style="padding:16px 16px 4px 16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                      <div style="font-weight:600;font-size:16px;color:#111827;">${title}</div>
                      <div style="margin-top:2px;font-size:13px;color:#6b7280;">ID: #${String(m.listing_id)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 16px 12px 16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#111827;">
                        <tr>
                          <td style="padding:6px 0;width:120px;color:#6b7280;">Type</td>
                          <td style="padding:6px 0;">${typeTxt}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;width:120px;color:#6b7280;">Price</td>
                          <td style="padding:6px 0;">${priceTxt || "—"}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;width:120px;color:#6b7280;">Address</td>
                          <td style="padding:6px 0;">${addr}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;width:120px;color:#6b7280;">Distance</td>
                          <td style="padding:6px 0;">${distTxt}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:20px 24px 8px 24px;">
                <a href="${listingUrl}" target="_blank"
                   style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;
                          font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
                          font-weight:600;font-size:14px;line-height:20px;padding:10px 16px;border-radius:8px;">
                  View full details
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 24px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#6b7280;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <span style="word-break:break-all;"><a href="${listingUrl}" target="_blank" style="color:#4f46e5;text-decoration:underline;">${listingUrl}</a></span>
              </td>
            </tr>
          </table>
          <div style="max-width:560px;margin-top:12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;color:#9ca3af;">
            Reply to this email to get more details.
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

      const smsText = `Hi ${firstName}, found: ${title} ${priceTxt ? "• " + priceTxt : ""} near ${addr}. Reply YES for details.`;

      // EMAIL first (if under cap)
      let emailRes: any = { ok: false, error: "skipped" };
      if (m.email && emailCount < EMAIL_CAP) {
        emailRes = await sendEmailSMTP(m.email, emailSubject, emailHtml);
        if (emailRes.ok) {
          await client.query(
            `update public.property_requests
             set "emailCount" = coalesce("emailCount",0) + 1,
                 lastlistingsent = ${UUID_FROM_TEXT_SQL(`'listing:' || $1::text`)}
             where id = $2`,
            [m.listing_id, m.request_id]
          );
        }
      }

      // SMS next (if under cap)
      let smsRes: any = { ok: false, error: "skipped" };
      if (m.phone && messageCount < SMS_CAP) {
        // If Sparrow requires country code, uncomment:
        // const to = m.phone.startsWith("977") ? m.phone : "977" + m.phone;
        const to = m.phone;
        smsRes = await sendSparrowSMS(to, smsText);
        if (smsRes.ok) {
          await client.query(
            `update public.property_requests
             set "messageCount" = coalesce("messageCount",0) + 1,
                 lastlistingsent = ${UUID_FROM_TEXT_SQL(`'listing:' || $1::text`)}
             where id = $2`,
            [m.listing_id, m.request_id]
          );
        }
      }

      if (m.email) pushAttempt(emailAttempts, m.email, !!emailRes?.ok, m.request_id, m.listing_id, emailRes?.error);
      if (m.phone) pushAttempt(smsAttempts, m.phone, !!smsRes?.ok, m.request_id, m.listing_id, smsRes?.error);

      perRequest.push({
        request_id: m.request_id,
        listing_id: m.listing_id,
        name: m.full_name,
        emailAddress: m.email,
        phoneNumber: m.phone,
        address: addr,
        distance_m: Math.round(Number(m.distance_m ?? 0)),
        emailStatus: { attempted: !!m.email, ok: !!emailRes?.ok, error: emailRes?.error },
        smsStatus:   { attempted: !!m.phone, ok: !!smsRes?.ok,   error: smsRes?.error },
      });

      if (emailRes?.ok || smsRes?.ok) sent++;
    }

    const emailSuccess = emailAttempts.filter(a => a.ok);
    const emailFailed  = emailAttempts.filter(a => !a.ok);
    const smsSuccess   = smsAttempts.filter(a => a.ok);
    const smsFailed    = smsAttempts.filter(a => !a.ok);
    const sample = <T extends Attempt>(arr: T[], n = 5) => arr.slice(0, n);

    const summary = {
      ok: true,
      matches: matches.length,
      sent,
      email: {
        attempted: emailAttempts.length,
        successCount: emailSuccess.length,
        failCount: emailFailed.length,
        successTo: sample(emailSuccess).map(a => maskEmail(a.to)),
        failed: sample(emailFailed).map(a => ({ to: maskEmail(a.to), error: a.error ?? "unknown" })),
      },
      sms: {
        attempted: smsAttempts.length,
        successCount: smsSuccess.length,
        failCount: smsFailed.length,
        successTo: sample(smsSuccess).map(a => maskPhone(a.to)),
        failed: sample(smsFailed).map(a => ({ to: maskPhone(a.to), error: a.error ?? "unknown" })),
      },
      details: perRequest,
    };

    return NextResponse.json(summary);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  } finally {
    client.release();
  }
}
