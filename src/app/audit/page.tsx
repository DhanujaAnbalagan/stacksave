import type { Metadata } from "next";
import { AuditForm } from "@/components/audit/AuditForm";

export const metadata: Metadata = {
  title: "Run Your AI Spend Audit — StackSave",
  description:
    "Analyze your team's AI tool subscriptions across ChatGPT, Claude, Cursor, Copilot, and more. Get a prioritized report of wasted spend and smart alternatives.",
};

export default function AuditPage() {
  return <AuditForm />;
}

