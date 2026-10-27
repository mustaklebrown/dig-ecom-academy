"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface FaqFormData {
  question: string;
  answer: string;
  category?: string;
  order?: number;
}

export async function createFaqAction(data: FaqFormData) {
  try {
    if (!data.question || !data.answer) {
      return { success: false, error: "La question et la réponse sont requises." };
    }

    const count = await prisma.faqItem.count();

    const faq = await prisma.faqItem.create({
      data: {
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category?.trim() || "Général",
        order: data.order ?? count + 1,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, faq };
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: error.message || "Erreur lors de la création de la FAQ." };
  }
}

export async function updateFaqAction(id: string, data: Partial<FaqFormData>) {
  try {
    const faq = await prisma.faqItem.update({
      where: { id },
      data: {
        ...(data.question && { question: data.question.trim() }),
        ...(data.answer && { answer: data.answer.trim() }),
        ...(data.category && { category: data.category.trim() }),
        ...(typeof data.order === "number" && { order: data.order }),
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, faq };
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: error.message || "Erreur lors de la mise à jour." };
  }
}

export async function deleteFaqAction(id: string) {
  try {
    await prisma.faqItem.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: error.message || "Erreur lors de la suppression." };
  }
}
