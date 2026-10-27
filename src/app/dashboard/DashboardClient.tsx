"use client";

import { useState } from "react";
import { updateLeadStatusAction } from "@/app/actions/lead";
import { Search, MessageSquare, Phone, Mail, Calendar, ArrowUpRight } from "lucide-react";

export interface LeadItem {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  formation: string;
  format: string;
  status: string;
  message: string | null;
  createdAt: Date | string;
  formationRef?: {
    title: string;
    icon: string;
  } | null;
}

interface DashboardClientProps {
  initialLeads: LeadItem[];
}

export default function DashboardClient({ initialLeads }: DashboardClientProps) {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
      lead.formation.toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone && lead.phone.includes(search));

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleStatusChange(leadId: string, newStatus: string) {
    setUpdatingId(leadId);
    try {
      await updateLeadStatusAction(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "PENDING":
        return { label: "En attente", bg: "rgba(245, 158, 11, 0.16)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.35)" };
      case "CONTACTED":
        return { label: "Contacté", bg: "rgba(59, 130, 246, 0.16)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.35)" };
      case "ENROLLED":
        return { label: "Inscrit", bg: "rgba(16, 185, 129, 0.16)", color: "#34d399", border: "rgba(16, 185, 129, 0.35)" };
      case "ARCHIVED":
        return { label: "Archivé", bg: "rgba(148, 163, 184, 0.16)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.35)" };
      default:
        return { label: status, bg: "rgba(148, 163, 184, 0.16)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.35)" };
    }
  }

  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--bd)",
        borderRadius: 22,
        padding: "24px 28px",
        boxShadow: "var(--sh)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
          Liste des inscriptions récentes
        </h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* Search bar */}
          <div style={{ position: "relative", width: 240 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--mu)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: 10,
                border: "1px solid var(--bd)",
                background: "var(--bg2)",
                fontSize: 13.5,
                color: "var(--tx)",
                outline: "none",
              }}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "1px solid var(--bd)",
              background: "var(--bg2)",
              fontSize: 13.5,
              fontWeight: 600,
              color: "var(--tx)",
            }}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="PENDING">À traiter (En attente)</option>
            <option value="CONTACTED">Contactés</option>
            <option value="ENROLLED">Inscrits</option>
            <option value="ARCHIVED">Archivés</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1.5px solid var(--bd)", color: "var(--mu)" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>CANDIDAT</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>FORMATION</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>FORMAT</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>DATE</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>STATUT</th>
                <th style={{ padding: "12px 14px", fontWeight: 700, fontSize: 13 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => {
                const badge = getStatusBadge(lead.status);
                const dateStr = new Date(lead.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: "1px solid var(--bd)",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      <strong style={{ display: "block", fontSize: 14.5 }}>{lead.fullName}</strong>
                      {lead.phone && (
                        <span style={{ fontSize: 12.5, color: "var(--mu)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Phone size={12} /> {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span style={{ fontSize: 12.5, color: "var(--mu)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Mail size={12} /> {lead.email}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span style={{ fontWeight: 600 }}>{lead.formation}</span>
                    </td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "3px 8px",
                          borderRadius: 8,
                          background: "var(--bg2)",
                          fontSize: 12.5,
                          fontWeight: 600,
                        }}
                      >
                        {lead.format}
                      </span>
                    </td>

                    <td style={{ padding: "14px", color: "var(--mu)", fontSize: 13 }}>
                      {dateStr}
                    </td>

                    <td style={{ padding: "14px" }}>
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: `1px solid ${badge.border}`,
                          fontSize: 12.5,
                          fontWeight: 700,
                          background: badge.bg,
                          color: badge.color,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="PENDING">En attente</option>
                        <option value="CONTACTED">Contacté</option>
                        <option value="ENROLLED">Inscrit</option>
                        <option value="ARCHIVED">Archivé</option>
                      </select>
                    </td>

                    <td style={{ padding: "14px" }}>
                      {lead.phone ? (
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Bonjour ${lead.fullName}, nous faisons suite à votre demande d'inscription pour la formation « ${lead.formation} » chez Dig e-com Academy.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-o btn-sm"
                          style={{ padding: "6px 12px", fontSize: 12, gap: 4 }}
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp</span>
                          <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: "var(--mu)" }}>Pas de tél</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "48px 16px", color: "var(--mu)" }}>
          <p style={{ fontSize: 16, margin: "0 0 8px" }}>Aucune inscription trouvée</p>
          <p style={{ fontSize: 13, margin: 0 }}>
            Les candidatures soumises depuis le formulaire du site s&apos;afficheront automatiquement ici.
          </p>
        </div>
      )}
    </div>
  );
}
