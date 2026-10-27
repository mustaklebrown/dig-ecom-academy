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
      <header className="dash-header">
        <div className="w dash-header-inner">
          <div className="dash-header-title-group">
            <Link href="/" className="dash-back-link">
              <ArrowLeft size={16} />
              <span>Retour</span>
            </Link>
            <div className="dash-header-sep" />
            <h1 className="dash-title">
              Administration &amp; Gestion
            </h1>
          </div>

          <div className="dash-db-badge">
            <span className="dash-db-dot" />
            <span className="dash-db-text">PostgreSQL Neon</span>
          </div>
        </div>
      </header>

      <main className="w" style={{ marginTop: 24 }}>
        {/* KPI Cards */}
        <div className="dash-kpi-grid">
          <div className="dash-kpi-card">
            <div className="dash-kpi-header" style={{ color: "var(--blue)" }}>
              <span>Total Demandes</span>
              <Users size={18} />
            </div>
            <strong className="dash-kpi-num">{totalLeads}</strong>
            <p className="dash-kpi-sub">Inscriptions enregistrées</p>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-header" style={{ color: "var(--orange)" }}>
              <span>À traiter</span>
              <Clock size={18} />
            </div>
            <strong className="dash-kpi-num">{pendingLeads}</strong>
            <p className="dash-kpi-sub">Candidats en attente</p>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-header" style={{ color: "#3b82f6" }}>
              <span>Contactés</span>
              <MessageCircle size={18} />
            </div>
            <strong className="dash-kpi-num">{contactedLeads}</strong>
            <p className="dash-kpi-sub">Échanges WhatsApp</p>
          </div>

          <div className="dash-kpi-card">
            <div className="dash-kpi-header" style={{ color: "#10b981" }}>
              <span>Confirmés</span>
              <CheckCircle size={18} />
            </div>
            <strong className="dash-kpi-num">{enrolledLeads}</strong>
            <p className="dash-kpi-sub">Inscriptions finalisées</p>
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
