"use client";
import React, { useState } from "react";
import { Button } from "./Button";
import { toast } from "sonner";

const MatchNotifier = () => {
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    setLoading(true);
    toast("🔄 Matching started...");

    try {
      const response = await fetch("/api/match-and-notify", {
        method: "POST",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to notify users");

      toast.success(`✅ Notifications sent to ${result.notifiedCount} users.`);
    } catch (err: any) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleNotify} disabled={loading}>
        {loading ? "Sending Notifications..." : "Send Property Match Notifications"}
      </Button>
    </div>
  );
};

export default MatchNotifier;
