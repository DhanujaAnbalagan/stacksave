"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { z } from "zod";

const leadSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  companyName: z.string().min(2, "Company name is too short"),
});

export async function submitLead(formData: FormData) {
  const email = formData.get("email") as string;
  const companyName = formData.get("companyName") as string;

  // 1. Server-side validation
  const result = leadSchema.safeParse({ email, companyName });
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0].message,
    };
  }

  const supabase = await createClient();
  const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

  try {
    // 2. Save to Supabase
    const { error: dbError } = await supabase.from("leads").insert([
      {
        email: result.data.email,
        company_name: result.data.companyName,
        status: "new",
      },
    ]);

    if (dbError) throw dbError;

    // 3. Send confirmation via Resend
    // Skip if placeholder key is used (prevents crash in dev/CI if keys missing)
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "StackSave <onboarding@resend.dev>",
        to: result.data.email,
        subject: "Your StackSave Audit is Ready",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #0f172a;">Welcome to StackSave, ${result.data.companyName}!</h2>
            <p style="color: #475569; line-height: 1.6;">
              Thanks for your interest in optimizing your AI spend. One of our specialists will review your 
              audit within 24 hours to provide a deeper breakdown of your savings opportunities.
            </p>
            <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; color: #0f172a;">What's next?</p>
              <ul style="color: #475569; padding-left: 20px;">
                <li>Customized vendor negotiation strategy</li>
                <li>Consolidated billing roadmap</li>
                <li>API usage optimization patterns</li>
              </ul>
            </div>
            <p style="color: #64748b; font-size: 14px;">
              Best,<br>The StackSave Team
            </p>
          </div>
        `,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Lead submission error:", error);
    return {
      success: false,
      error: "Failed to submit request. Please try again.",
    };
  }
}
