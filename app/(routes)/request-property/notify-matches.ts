import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase/client";
import sendSMS from "@/utils/sendSMS";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch property requests who have paid
    const { data: requests, error: reqErr } = await supabase
      .from("property_requests")
      .select("*")
      .eq("hasPaid", true);

    if (reqErr) throw reqErr;

    // Fetch listings created in the last 10 minutes
    const { data: listings, error: listErr } = await supabase
      .from("listing")
      .select("*")
      .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

    if (listErr) throw listErr;

    let sent = 0;

    for (const request of requests) {
      for (const listing of listings) {
        const match =
          (listing.address?.toLowerCase().includes(request.location.toLowerCase()) ||
           listing.full_address?.toLowerCase().includes(request.location.toLowerCase())) &&
          listing.propertyType === request.property_type &&
          listing.active === true &&
          listing.sold !== true && 
          listing.admin_status === "Approved";
          

        if (match) {
          // Check if already notified
          const { data: alreadySent } = await supabase
            .from("sent_notifications")
            .select("id")
            .eq("request_id", request.id)
            .eq("listing_id", listing.id)
            .maybeSingle();

          if (!alreadySent) {
            // Send SMS
            await sendSMS({
              to: request.phone,
              message: `📢 New ${listing.propertyType} available in ${listing.address}. Matches your request.`,
            });

            // Save notification record
            await supabase.from("sent_notifications").insert([
              {
                request_id: request.id,
                listing_id: listing.id,
              },
            ]);

            sent++;
          }
        }
      }
    }

    res.status(200).json({ message: `✅ ${sent} messages sent.` });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
