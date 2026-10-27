'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface SiteSettingsData {
  campusName: string;
  campusAddress: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  announcement?: string;
}

export async function getSiteSettingsAction(): Promise<SiteSettingsData> {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'default',
          campusName: 'Campus Moroni Hadoudja',
          campusAddress:
            'Moroni Hadoudja (ancien Campus France), Grande Comore',
          whatsappNumber: '+269 333 00 00',
          email: 'contact@dig-ecom.academy',
          openingHours: 'Lun - Sam : 08h30 - 18h00',
          announcement: 'Admissions ouvertes • Session 2026',
        },
      });
    }

    return {
      campusName: settings.campusName,
      campusAddress: settings.campusAddress,
      whatsappNumber: settings.whatsappNumber,
      email: settings.email,
      openingHours: settings.openingHours,
      announcement: settings.announcement || '',
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {
      campusName: 'Campus Moroni Hadoudja',
      campusAddress: 'Moroni Hadoudja (ancien Campus France), Grande Comore',
      whatsappNumber: '+269 333 00 00',
      email: 'contact@dig-ecom.academy',
      openingHours: 'Lun - Sam : 08h30 - 18h00',
      announcement: 'Admissions ouvertes • Session 2026',
    };
  }
}

export async function updateSiteSettingsAction(
  data: Partial<SiteSettingsData>,
) {
  try {
    const updated = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        ...(data.campusName && { campusName: data.campusName.trim() }),
        ...(data.campusAddress && { campusAddress: data.campusAddress.trim() }),
        ...(data.whatsappNumber && {
          whatsappNumber: data.whatsappNumber.trim(),
        }),
        ...(data.email && { email: data.email.trim() }),
        ...(data.openingHours && { openingHours: data.openingHours.trim() }),
        ...(typeof data.announcement === 'string' && {
          announcement: data.announcement.trim(),
        }),
      },
      create: {
        id: 'default',
        campusName: data.campusName?.trim() || 'Campus Moroni Hadoudja',
        campusAddress:
          data.campusAddress?.trim() ||
          'Moroni Hadoudja (ancien Campus France), Grande Comore',
        whatsappNumber: data.whatsappNumber?.trim() || '+269 333 00 00',
        email: data.email?.trim() || 'contact@dig-ecom.academy',
        openingHours: data.openingHours?.trim() || 'Lun - Sam : 08h30 - 18h00',
        announcement:
          data.announcement?.trim() || 'Admissions ouvertes • Session 2026',
      },
    });

    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true, settings: updated };
  } catch (error: any) {
    console.error('Error updating site settings:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour.',
    };
  }
}
