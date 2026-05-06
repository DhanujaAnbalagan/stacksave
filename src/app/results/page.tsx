"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { listReports } from "@/lib/audit-engine/reports";
import { Zap } from "lucide-react";

/**
 * /results — redirects to the most recent report, or to /audit if none exist.
 * This acts as a smart entry point for the results flow.
 */
export default function ResultsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const reports = listReports();
    if (reports.length > 0) {
      router.replace(`/results/${reports[0].id}`);
    } else {
      router.replace("/audit");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center mx-auto">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading your report…</p>
      </div>
    </div>
  );
}

