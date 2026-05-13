"use server";

import { createClient } from "@/lib/supabase/server";
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
    return { success: true };
  } catch (error) {
    console.error("Lead submission error:", error);
    return {
      success: false,
      error: "Failed to submit request. Please try again.",
    };
  }
}
