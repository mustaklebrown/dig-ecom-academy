import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Users, CheckCircle, Clock, MessageCircle } from "lucide-react";
import DashboardClient from "@/app/dashboard/DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const [leads, formations, faqs] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        formationRef: {
          select: { title: true, icon: true },
        },
      },
    }),
    prisma.formation.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.faqItem.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: "default",
        campusName: "Campus Moroni Hadoudja",
        campusAddress: "Moroni Hadoudja (ancien Campus France), Grande Comore",
        whatsappNumber: "+269 333 00 00",
        email: "contact@dig-ecom.academy",
        openingHours: "Lun - Sam : 08h30 - 18h00",
        announcement: "Admissions ouvertes • Session 2026",
      },
    });
  }

  const totalLeads = leads.length;
  const pendingLeads = leads.filter((l) => l.status === "PENDING").length;
  const contactedLeads = leads.filter((l) => l.status === "CONTACTED").length;
  const enrolledLeads = leads.filter((l) => l.status === "ENROLLED").length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg2)", paddingBottom: 60 }}>
      {/* Dashboard Header */}
      <header style={{ background: "var(--card)", borderBottom: "1px solid var(--bd)" }}>
        <div
          className="w"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 72,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--blue)",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              <ArrowLeft size={16} />
              <span>Retour au site</span>
            </Link>
            <div style={{ width: 1, height: 24, background: "var(--bd)" }} />
            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
              Administration &amp; Gestion Académique
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#10b981",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--mu)" }}>
              PostgreSQL Connecté (Neon Cloud)
            </span>
          </div>
        </div>
      </header>

      <main className="w" style={{ marginTop: 32 }}>
        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--bd)",
              borderRadius: 18,
              padding: 22,
              boxShadow: "var(--sh)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--blue)", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>Total Demandes</span>
              <Users size={20} />
            </div>
            <strong style={{ fontSize: 32, fontWeight: 800 }}>{totalLeads}</strong>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--mu)" }}>Inscriptions enregistrées</p>
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--bd)",
              borderRadius: 18,
              padding: 22,
              boxShadow: "var(--sh)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--orange)", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>À traiter</span>
              <Clock size={20} />
            </div>
            <strong style={{ fontSize: 32, fontWeight: 800 }}>{pendingLeads}</strong>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--mu)" }}>Candidats en attente</p>
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--bd)",
              borderRadius: 18,
              padding: 22,
              boxShadow: "var(--sh)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#3b82f6", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>Contactés</span>
              <MessageCircle size={20} />
            </div>
            <strong style={{ fontSize: 32, fontWeight: 800 }}>{contactedLeads}</strong>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--mu)" }}>Échanges en cours sur WhatsApp</p>
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--bd)",
              borderRadius: 18,
              padding: 22,
              boxShadow: "var(--sh)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase" }}>Confirmés</span>
              <CheckCircle size={20} />
            </div>
            <strong style={{ fontSize: 32, fontWeight: 800 }}>{enrolledLeads}</strong>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--mu)" }}>Inscriptions finalisées</p>
          </div>
        </div>

        {/* Multi-Tab Control Center */}
        <DashboardClient
          initialLeads={leads}
          initialFormations={formations}
          initialFaqs={faqs}
          initialSettings={{
            campusName: settings.campusName,
            campusAddress: settings.campusAddress,
            whatsappNumber: settings.whatsappNumber,
            email: settings.email,
            openingHours: settings.openingHours,
            announcement: settings.announcement || "",
          }}
        />
      </main>
    </div>
  );
}
