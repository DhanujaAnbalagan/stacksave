"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { loadReport } from "@/lib/audit-engine/reports";
import type { SavedReport } from "@/lib/audit-engine/reports";
import { ReportView } from "@/components/results/ReportView";
import { ReportSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap, ArrowRight, AlertCircle } from "lucide-react";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : (params.id as string[])?.[0] ?? "";

  const [report, setReport] = useState<SavedReport | null | undefined>(undefined);

  useEffect(() => {
    if (!id) { setReport(null); return; }
    // Small delay lets the skeleton render before the heavy compute
    const timer = setTimeout(() => {
      const found = loadReport(id);
      setReport(found);
    }, 50);
    return () => clearTimeout(timer);
  }, [id]);

  // Loading — show content-shaped skeleton to prevent layout shift
  if (report === undefined) {
    return <ReportSkeleton />;
  }

  // Not found
  if (!report) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-4"
        aria-labelledby="not-found-heading"
      >
        <div className="text-center space-y-5 max-w-sm">
          <div
            role="img"
            aria-label="StackSave logo"
            className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto"
          >
            <Zap className="w-7 h-7 text-white" />
          </div>

          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </div>

          <div>
            <h1 id="not-found-heading" className="text-xl font-bold mb-2">
              Report not found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This report ID doesn&apos;t exist in your browser&apos;s local storage.
              Reports are stored locally — they can&apos;t be accessed from another
              device or after clearing your browser data.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/audit">
              <Button className="gradient-brand text-white border-0 gap-2 w-full sm:w-auto">
                Start a new audit
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 w-full sm:w-auto"
            >
              Go back
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return <ReportView report={report} />;
}
