"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, Building2, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { submitLead } from "@/app/actions/leads";

interface LeadCaptureProps {
  reportId: string;
  totalSavings: number;
}

export function LeadCapture({ reportId, totalSavings }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await submitLead({
        email,
        name,
        company,
        reportId,
        savings: totalSavings.toLocaleString(),
      });
      setSubmitted(true);
      // Persist submission state locally
      localStorage.setItem(`stacksave-lead-${reportId}`, "true");
    } catch (err) {
      console.error("Lead submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="p-8 text-center bg-emerald-500/5 border-emerald-500/20">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Report Sent!</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          We've emailed your full audit breakdown to <span className="text-foreground font-medium">{email}</span>.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8 border-primary/20 bg-card relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold mb-2">Get Your Full Audit Report</h3>
            <p className="text-muted-foreground text-sm">
              Enter your details to receive a detailed breakdown of your savings, including 
              vendor negotiation scripts and implementation steps.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 w-full max-w-sm space-y-4">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="lead-email" className="text-xs font-medium text-muted-foreground">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="lead-email"
                    type="email" 
                    placeholder="name@company.com" 
                    className="pl-9 h-11 bg-background"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-name" className="text-xs font-medium text-muted-foreground">Full Name</Label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="lead-name"
                      placeholder="Jane Doe" 
                      className="pl-9 h-10 bg-background"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-company" className="text-xs font-medium text-muted-foreground">Company</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="lead-company"
                      placeholder="Acme Inc" 
                      className="pl-9 h-10 bg-background"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 gradient-brand text-white border-0 shadow-lg shadow-primary/20 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send My Audit Report"
              )}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground">
              By submitting, you agree to receive a one-time audit email and Credex outreach for high-savings cases.
            </p>
          </form>
        </div>
      </div>
    </Card>
  );
}
