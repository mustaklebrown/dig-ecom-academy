"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface FormationFormData {
  title: string;
  slug?: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor?: string;
  duration?: string;
  price?: string;
  level?: string;
  popular?: boolean;
  order?: number;
  modules?: string[];
  bullets?: string[];
}

export async function createFormationAction(data: FormationFormData) {
  try {
    if (!data.title || !data.tagline || !data.description) {
      return { success: false, error: "Le titre, le sous-titre et la description sont requis." };
    }

    const slug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const count = await prisma.formation.count();

    const formation = await prisma.formation.create({
      data: {
        title: data.title.trim(),
        slug,
        tagline: data.tagline.trim(),
        description: data.description.trim(),
        icon: data.icon?.trim() || "🎓",
        accentColor: data.accentColor || "blue",
        duration: data.duration?.trim() || "4 à 6 semaines",
        price: data.price?.trim() || "Sur demande",
        level: data.level?.trim() || "Tous niveaux",
        popular: !!data.popular,
        order: data.order ?? count + 1,
        modules: data.modules && data.modules.length > 0 ? data.modules : ["Module 1", "Module 2"],
        bullets: data.bullets && data.bullets.length > 0 ? data.bullets : ["Contenu pratique", "Cas réels"],
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, formation };
  } catch (error: any) {
    console.error("Error creating formation:", error);
    return { success: false, error: error.message || "Erreur lors de la création de la formation." };
  }
}

export async function updateFormationAction(
  id: string,
  data: Partial<FormationFormData>
) {
  try {
    const formation = await prisma.formation.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.tagline && { tagline: data.tagline.trim() }),
        ...(data.description && { description: data.description.trim() }),
        ...(data.icon && { icon: data.icon.trim() }),
        ...(data.accentColor && { accentColor: data.accentColor }),
        ...(data.duration && { duration: data.duration.trim() }),
        ...(data.price && { price: data.price.trim() }),
        ...(data.level && { level: data.level.trim() }),
        ...(typeof data.popular === "boolean" && { popular: data.popular }),
        ...(typeof data.order === "number" && { order: data.order }),
        ...(data.modules && { modules: data.modules }),
        ...(data.bullets && { bullets: data.bullets }),
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true, formation };
  } catch (error: any) {
    console.error("Error updating formation:", error);
    return { success: false, error: error.message || "Erreur lors de la mise à jour." };
  }
}

export async function deleteFormationAction(id: string) {
  try {
    await prisma.formation.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting formation:", error);
    return { success: false, error: error.message || "Erreur lors de la suppression." };
  }
}
