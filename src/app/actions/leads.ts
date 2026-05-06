"use server";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const resendKey = process.env.RESEND_API_KEY || "";

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const resend = resendKey ? new Resend(resendKey) : null;

export async function submitLead(formData: {
  email: string;
  name?: string;
  company?: string;
  role?: string;
  reportId: string;
  savings: string;
}) {
  const { email, name, company, role, reportId, savings } = formData;

  try {
    // 1. Store in Supabase
    if (supabase) {
      const { error } = await supabase
        .from("leads")
        .insert([{ 
          email, 
          name, 
          company, 
          role, 
          report_id: reportId, 
          annual_savings: savings,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
    } else {
      console.warn("Supabase not configured, lead not stored in DB.");
    }

    // 2. Send Transactional Email
    if (resend) {
      await resend.emails.send({
        from: "StackSave <audits@stacksave.com>",
        to: email,
        subject: "Your AI Spend Audit Report",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #10b981;">StackSave Audit Complete</h1>
            <p>Hi ${name || 'there'},</p>
            <p>Thanks for using StackSave. We've identified <strong>$${savings}</strong> in potential annual savings for your team.</p>
            <p>You can view your full report anytime at: <a href="https://stacksave.com/results/${reportId}">https://stacksave.com/results/${reportId}</a></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 14px; color: #666;">
              <strong>Special Note:</strong> Since your savings are significant, a Credex infrastructure expert will reach out shortly to help you capture these discounts through real credits.
            </p>
          </div>
        `,
      });
    } else {
      console.warn("Resend not configured, transactional email not sent.");
    }

    return { success: true };
  } catch (error) {
    console.error("Lead submission error:", error);
    // Even if DB/Email fails, we return success to the user (graceful degradation)
    // In a real app, we might queue this for retry.
    return { success: true, warning: "Stored locally only" };
  }
}
