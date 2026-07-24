"use server";

import { prisma } from "@/lib/db";
import { createLeadSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function createLead(formData: FormData) {
  // Rate limit lead generation to prevent spam
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
  if (!rateLimit(`submit_lead_${ip}`, 5, 60 * 1000)) {
    return { error: "You are submitting too fast. Please wait a minute." };
  }

  const data = Object.fromEntries(formData.entries());
  
  const validated = createLeadSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }
  
  try {
    const lead = await prisma.lead.create({
      data: validated.data,
    });
    return { success: true, lead };
  } catch (err) {
    console.error(err);
    return { error: "Failed to submit form. Please try again." };
  }
}

export async function updateLeadStatus(id: string, status: "NEW" | "CONTACTED" | "CLOSED") {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin");
    return { success: true, lead };
  } catch (err) {
    return { error: "Failed to update lead status" };
  }
}

export async function softDeleteLead(id: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  try {
    const newLead = await prisma.lead.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
    revalidatePath("/admin");
    return { success: true, lead: newLead };
  } catch (err) {
    return { error: "Failed to soft delete lead" };
  }
}
