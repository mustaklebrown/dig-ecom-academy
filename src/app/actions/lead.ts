"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface LeadFormData {
  fullName: string;
  phone?: string;
  email?: string;
  formation: string;
  format: string;
  message?: string;
}

export async function createLeadAction(data: LeadFormData) {
  try {
    if (!data.fullName || !data.formation) {
      return { success: false, error: "Le nom et la formation sont obligatoires." };
    }

    // Try to find matching formation in DB
    const matchingFormation = await prisma.formation.findFirst({
      where: {
        title: {
          contains: data.formation,
          mode: "insensitive",
        },
      },
    });

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        formation: data.formation,
        format: data.format || "Présentiel",
        message: data.message?.trim() || null,
        status: "PENDING",
        formationId: matchingFormation?.id || null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, leadId: lead.id };
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return { success: false, error: error.message || "Erreur lors de l'enregistrement." };
  }
}

export async function getLeadsAction() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        formationRef: {
          select: { title: true, icon: true },
        },
      },
    });
    return { success: true, leads };
  } catch (error: any) {
    console.error("Error fetching leads:", error);
    return { success: false, error: error.message, leads: [] };
  }
}

export async function updateLeadStatusAction(leadId: string, status: string) {
  try {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });
    revalidatePath("/dashboard");
    return { success: true, lead };
  } catch (error: any) {
    console.error("Error updating lead status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLeadAction(leadId: string) {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return { success: false, error: error.message };
  }
}
