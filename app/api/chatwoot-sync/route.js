import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📩 Received from Chatwoot:", JSON.stringify(body, null, 2));

    // Safely extract sender info
    const contact = body?.meta?.sender;
    if (!contact) {
      return new Response(JSON.stringify({ error: 'Missing sender object' }), { status: 400 });
    }

    const full_name = contact?.name?.trim() || 'Anonymous';
    const email = contact?.email?.trim() || null;
    const phone = contact?.phone_number?.trim() || null;

    // At least one of email or phone is required
    if (!email && !phone) {
      return new Response(JSON.stringify({ error: 'Missing email or phone' }), { status: 400 });
    }

    const { error } = await supabase.from('chatwoot_contacts').insert([
      { full_name, email, phone }
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return new Response(JSON.stringify({ error: 'Database insert failed' }), { status: 500 });
    }

    console.log("✅ Contact saved:", { full_name, email, phone });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

// Optional: verify endpoint from browser
export async function GET() {
  return new Response("✅ Chatwoot Webhook is active", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
