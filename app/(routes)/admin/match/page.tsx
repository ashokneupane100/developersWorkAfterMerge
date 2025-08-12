"use client";
import { useState } from "react";

type ChannelStatus = { attempted?: boolean; ok?: boolean; error?: string };

type Result = {
  ok: boolean;
  matches: number;
  sent: number;
  email: {
    attempted: number;
    successCount: number;
    failCount: number;
    successTo: string[];
    failed: { to: string; error: string }[];
  };
  sms: {
    attempted: number;
    successCount: number;
    failCount: number;
    successTo: string[];
    failed: { to: string; error: string }[];
  };
  details: Array<{
    request_id: string;
    listing_id: number | string;
    name: string;
    // old fields (kept optional for back-compat):
    email?: any;
    sms?: any;
    // new fields:
    emailAddress?: string;
    phoneNumber?: string;
    address?: string;
    distance_m?: number;
    emailStatus?: ChannelStatus;
    smsStatus?: ChannelStatus;
  }>;
};

function renderStatus(s?: ChannelStatus) {
  if (!s || !s.attempted) return "—";
  return s.ok ? "✅ Sent" : `❌ ${s.error || "Failed"}`;
}

export default function AdminMatchPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/match-send", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      setResult(json);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Run Matching & Notifications</h1>
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
          style ={{
            backgroundColor: "blue"
          }}
        >
          {loading ? "Running…" : "Run now"}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Matches</div>
              <div className="text-2xl font-semibold">{result.matches}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Messages sent (email or SMS)</div>
              <div className="text-2xl font-semibold">{result.sent}</div>
            </div>
            <div className="p-4 border rounded">
              <div className="text-sm text-gray-500">Run Status</div>
              <div className="text-2xl font-semibold">{result.ok ? "OK" : "Error"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* EMAIL SUMMARY */}
            <div className="p-4 border rounded">
              <h2 className="font-semibold mb-2">Email summary</h2>
              <ul className="text-sm space-y-1">
                <li>Attempted: <b>{result.email.attempted}</b></li>
                <li>Success: <b>{result.email.successCount}</b></li>
                <li>Failed: <b>{result.email.failCount}</b></li>
              </ul>
              {result.email.successTo.length > 0 && (
                <>
                  <div className="mt-3 text-sm text-gray-600">Sample successes:</div>
                  <ul className="mt-1 text-sm list-disc pl-5">
                    {result.email.successTo.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </>
              )}
              {result.email.failed.length > 0 && (
                <>
                  <div className="mt-3 text-sm text-gray-600">Sample failures:</div>
                  <ul className="mt-1 text-sm list-disc pl-5">
                    {result.email.failed.map((f, i) => (
                      <li key={i}>{f.to} – <span className="text-red-600">{f.error}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* SMS SUMMARY */}
            <div className="p-4 border rounded">
              <h2 className="font-semibold mb-2">SMS summary</h2>
              <ul className="text-sm space-y-1">
                <li>Attempted: <b>{result.sms.attempted}</b></li>
                <li>Success: <b>{result.sms.successCount}</b></li>
                <li>Failed: <b>{result.sms.failCount}</b></li>
              </ul>
              {result.sms.successTo.length > 0 && (
                <>
                  <div className="mt-3 text-sm text-gray-600">Sample successes:</div>
                  <ul className="mt-1 text-sm list-disc pl-5">
                    {result.sms.successTo.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </>
              )}
              {result.sms.failed.length > 0 && (
                <>
                  <div className="mt-3 text-sm text-gray-600">Sample failures:</div>
                  <ul className="mt-1 text-sm list-disc pl-5">
                    {result.sms.failed.map((f, i) => (
                      <li key={i}>{f.to} – <span className="text-red-600">{f.error}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* DETAILED TABLE */}
          <div className="p-4 border rounded w-full">
            <h2 className="font-semibold mb-3">Per-match details</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Request</th>
                    <th className="text-left p-2">Listing</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">Addr</th>
                    <th className="text-right p-2">Dist (m)</th>
                    <th className="text-left p-2">Email status</th>
                    <th className="text-left p-2">SMS status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.details.map((r, i) => {
                    // Back-compat: use new status fields if present, otherwise fallback to old ones
                    const emailStatus: ChannelStatus = r.emailStatus ?? (r as any).email ?? { attempted: false };
                    const smsStatus: ChannelStatus   = r.smsStatus   ?? (r as any).sms   ?? { attempted: false };

                    return (
                      <tr key={i} className="border-t">
                        <td className="p-2">{r.request_id}</td>
                        <td className="p-2">{r.listing_id}</td>
                        <td className="p-2">{r.name}</td>
                        <td className="p-2">{r.emailAddress || (r as any).emailAddress || (r as any).email?.to || "-"}</td>
                        <td className="p-2">{r.phoneNumber || (r as any).phoneNumber || (r as any).phone || "-"}</td>
                        <td className="p-2">{r.address || "-"}</td>
                        <td className="p-2 text-right">{r.distance_m ?? "-"}</td>
                        <td className="p-2">{renderStatus(emailStatus)}</td>
                        <td className="p-2">{renderStatus(smsStatus)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Tip: SMS failing with “Invalid IP Address” = whitelist your server’s public IP in Sparrow, or run from a host with a static egress IP and whitelist that.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
