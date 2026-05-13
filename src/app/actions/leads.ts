"use server";

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

  // Placeholder for DB logic
  console.log("Validation successful for:", result.data);
  return { success: true };
}
