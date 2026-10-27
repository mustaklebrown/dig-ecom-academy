"use client";

import { useState } from "react";
import { updateLeadStatusAction, deleteLeadAction } from "@/app/actions/lead";
import {
  createFormationAction,
  updateFormationAction,
  deleteFormationAction,
  FormationFormData,
} from "@/app/actions/formation";
import {
  updateSiteSettingsAction,
  SiteSettingsData,
} from "@/app/actions/settings";
import {
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
  FaqFormData,
} from "@/app/actions/faq";
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  ArrowUpRight,
  Users,
  BookOpen,
  Settings as SettingsIcon,
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Save,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

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

export interface FormationItem {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  duration: string | null;
  price: string | null;
  level: string | null;
  popular: boolean;
  order: number;
  modules: string[];
  bullets: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface DashboardClientProps {
  initialLeads: LeadItem[];
  initialFormations: FormationItem[];
  initialFaqs: FaqItem[];
  initialSettings: SiteSettingsData;
}

export default function DashboardClient({
  initialLeads,
  initialFormations,
  initialFaqs,
  initialSettings,
}: DashboardClientProps) {
  // Tabs: 'leads' | 'formations' | 'settings' | 'faqs'
  const [activeTab, setActiveTab] = useState<
    "leads" | "formations" | "settings" | "faqs"
  >("leads");

  // Leads State
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Formations State
  const [formations, setFormations] =
    useState<FormationItem[]>(initialFormations);
  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] =
    useState<FormationItem | null>(null);
  const [formationForm, setFormationForm] = useState<FormationFormData>({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    icon: "🎓",
    accentColor: "blue",
    duration: "4 à 6 semaines",
    price: "Sur demande",
    level: "Tous niveaux",
    popular: false,
    modules: [],
    bullets: [],
  });
  const [modulesInput, setModulesInput] = useState("");
  const [bulletsInput, setBulletsInput] = useState("");
  const [formationLoading, setFormationLoading] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // FAQ State
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [faqForm, setFaqForm] = useState<FaqFormData>({
    question: "",
    answer: "",
    category: "Admission",
  });
  const [faqLoading, setFaqLoading] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }

  // --- Leads Handlers ---
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.fullName.toLowerCase().includes(search.toLowerCase()) ||
      lead.formation.toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone && lead.phone.includes(search));

    const matchesStatus =
      statusFilter === "ALL" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleStatusChange(leadId: string, newStatus: string) {
    setUpdatingId(leadId);
    try {
      await updateLeadStatusAction(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      showToast("Statut mis à jour.");
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteLead(leadId: string) {
    if (!confirm("Voulez-vous vraiment supprimer cette candidature ?")) return;
    try {
      await deleteLeadAction(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      showToast("Candidature supprimée.");
    } catch (e) {
      console.error(e);
    }
  }

  function exportLeadsToCSV() {
    const headers = [
      "ID",
      "Nom complet",
      "Téléphone",
      "Email",
      "Formation",
      "Format",
      "Statut",
      "Message",
      "Date",
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.fullName.replace(/"/g, '""')}"`,
      `"${l.phone || ""}"`,
      `"${l.email || ""}"`,
      `"${l.formation}"`,
      `"${l.format}"`,
      `"${l.status}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString("fr-FR")}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `candidatures-dig-ecom-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "PENDING":
        return {
          label: "En attente",
          bg: "rgba(245, 158, 11, 0.16)",
          color: "#fbbf24",
          border: "rgba(245, 158, 11, 0.35)",
        };
      case "CONTACTED":
        return {
          label: "Contacté",
          bg: "rgba(59, 130, 246, 0.16)",
          color: "#60a5fa",
          border: "rgba(59, 130, 246, 0.35)",
        };
      case "ENROLLED":
        return {
          label: "Inscrit",
          bg: "rgba(16, 185, 129, 0.16)",
          color: "#34d399",
          border: "rgba(16, 185, 129, 0.35)",
        };
      case "ARCHIVED":
        return {
          label: "Archivé",
          bg: "rgba(148, 163, 184, 0.16)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.35)",
        };
      default:
        return {
          label: status,
          bg: "rgba(148, 163, 184, 0.16)",
          color: "#94a3b8",
          border: "rgba(148, 163, 184, 0.35)",
        };
    }
  }

  // --- Formation Handlers ---
  function openAddFormation() {
    setEditingFormation(null);
    setFormationForm({
      title: "",
      slug: "",
      tagline: "",
      description: "",
      icon: "🎓",
      accentColor: "blue",
      duration: "4 à 6 semaines",
      price: "Sur demande",
      level: "Tous niveaux",
      popular: false,
      modules: [],
      bullets: [],
    });
    setModulesInput("");
    setBulletsInput("");
    setIsFormationModalOpen(true);
  }

  function openEditFormation(f: FormationItem) {
    setEditingFormation(f);
    setFormationForm({
      title: f.title,
      slug: f.slug,
      tagline: f.tagline,
      description: f.description,
      icon: f.icon,
      accentColor: f.accentColor,
      duration: f.duration || "4 à 6 semaines",
      price: f.price || "Sur demande",
      level: f.level || "Tous niveaux",
      popular: f.popular,
      modules: f.modules || [],
      bullets: f.bullets || [],
    });
    setModulesInput((f.modules || []).join("\n"));
    setBulletsInput((f.bullets || []).join("\n"));
    setIsFormationModalOpen(true);
  }

  async function handleSaveFormation(e: React.FormEvent) {
    e.preventDefault();
    setFormationLoading(true);

    const modules = modulesInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const bullets = bulletsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingFormation) {
        const res = await updateFormationAction(editingFormation.id, {
          ...formationForm,
          modules,
          bullets,
        });
        if (res.success && res.formation) {
          setFormations((prev) =>
            prev.map((f) => (f.id === editingFormation.id ? (res.formation as any) : f))
          );
          showToast("Formation modifiée avec succès.");
          setIsFormationModalOpen(false);
        } else {
          alert(res.error || "Erreur de mise à jour");
        }
      } else {
        const res = await createFormationAction({
          ...formationForm,
          modules,
          bullets,
        });
        if (res.success && res.formation) {
          setFormations((prev) => [...prev, res.formation as any]);
          showToast("Nouvelle formation ajoutée avec succès !");
          setIsFormationModalOpen(false);
        } else {
          alert(res.error || "Erreur de création");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormationLoading(false);
    }
  }

  async function handleDeleteFormation(id: string, title: string) {
    if (
      !confirm(
        `Voulez-vous vraiment supprimer la formation « ${title} » ? Cette action est irréversible.`
      )
    )
      return;
    try {
      await deleteFormationAction(id);
      setFormations((prev) => prev.filter((f) => f.id !== id));
      showToast("Formation supprimée.");
    } catch (e) {
      console.error(e);
    }
  }

  // --- Settings Handlers ---
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      const res = await updateSiteSettingsAction(settings);
      if (res.success) {
        setSettingsSaved(true);
        showToast("Coordonnées et paramètres enregistrés !");
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        alert(res.error || "Erreur d'enregistrement");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSettingsLoading(false);
    }
  }

  // --- FAQ Handlers ---
  function openAddFaq() {
    setEditingFaq(null);
    setFaqForm({
      question: "",
      answer: "",
      category: "Admission",
    });
    setIsFaqModalOpen(true);
  }

  function openEditFaq(item: FaqItem) {
    setEditingFaq(item);
    setFaqForm({
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
    setIsFaqModalOpen(true);
  }

  async function handleSaveFaq(e: React.FormEvent) {
    e.preventDefault();
    setFaqLoading(true);
    try {
      if (editingFaq) {
        const res = await updateFaqAction(editingFaq.id, faqForm);
        if (res.success && res.faq) {
          setFaqs((prev) =>
            prev.map((f) => (f.id === editingFaq.id ? res.faq! : f))
          );
          showToast("Question FAQ modifiée.");
          setIsFaqModalOpen(false);
        }
      } else {
        const res = await createFaqAction(faqForm);
        if (res.success && res.faq) {
          setFaqs((prev) => [...prev, res.faq!]);
          showToast("Nouvelle question FAQ ajoutée !");
          setIsFaqModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFaqLoading(false);
    }
  }

  async function handleDeleteFaq(id: string) {
    if (!confirm("Voulez-vous supprimer cette question ?")) return;
    try {
      await deleteFaqAction(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showToast("Question FAQ supprimée.");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="dash-tabs-bar">
        <button
          type="button"
          onClick={() => setActiveTab("leads")}
          className={`dash-tab-btn ${activeTab === "leads" ? "active" : ""}`}
        >
          <Users size={17} />
          <span>Inscriptions &amp; Candidatures</span>
          <span className="dash-tab-counter">{leads.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("formations")}
          className={`dash-tab-btn ${activeTab === "formations" ? "active" : ""}`}
        >
          <BookOpen size={17} />
          <span>Gestion des Formations</span>
          <span className="dash-tab-counter">{formations.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`dash-tab-btn ${activeTab === "settings" ? "active" : ""}`}
        >
          <SettingsIcon size={17} />
          <span>Coordonnées &amp; Siège</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("faqs")}
          className={`dash-tab-btn ${activeTab === "faqs" ? "active" : ""}`}
        >
          <HelpCircle size={17} />
          <span>Questions Fréquentes (FAQ)</span>
          <span className="dash-tab-counter">{faqs.length}</span>
        </button>
      </div>

      {/* TAB 1: LEADS MANAGEMENT */}
      {activeTab === "leads" && (
        <div className="dash-card">
          <div className="dash-leads-controls">
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
              Liste des inscriptions récentes
            </h2>

            <div className="dash-filter-group" style={{ flex: 1, justifyContent: "flex-end" }}>
              {/* Search */}
              <div className="dash-search-box">
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
                    color: "var(--tx)",
                    fontSize: 13.5,
                  }}
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid var(--bd)",
                  background: "var(--bg2)",
                  color: "var(--tx)",
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">À traiter (En attente)</option>
                <option value="CONTACTED">Contactés</option>
                <option value="ENROLLED">Inscrits</option>
                <option value="ARCHIVED">Archivés</option>
              </select>

              {/* Export CSV */}
              <button
                type="button"
                onClick={exportLeadsToCSV}
                className="btn btn-l btn-sm"
                title="Exporter toutes les candidatures en fichier CSV Excel"
                style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Download size={15} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "var(--mu)",
              }}
            >
              <Users
                size={40}
                style={{ margin: "0 auto 12px", opacity: 0.5 }}
              />
              <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>
                Aucune inscription trouvée
              </p>
              <small>
                Les candidatures soumises depuis le formulaire du site
                s&apos;afficheront automatiquement ici.
              </small>
            </div>
          ) : (
            <>
              {/* Desktop Table View (>= 769px) */}
              <div className="dash-desktop-table">
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--bd)",
                        textAlign: "left",
                        color: "var(--mu)",
                        fontSize: 12.5,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      <th style={{ padding: "12px 14px" }}>Candidat</th>
                      <th style={{ padding: "12px 14px" }}>Contact</th>
                      <th style={{ padding: "12px 14px" }}>Formation &amp; Format</th>
                      <th style={{ padding: "12px 14px" }}>Statut</th>
                      <th style={{ padding: "12px 14px" }}>Date</th>
                      <th style={{ padding: "12px 14px", textAlign: "right" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => {
                      const badge = getStatusBadge(lead.status);
                      return (
                        <tr
                          key={lead.id}
                          style={{
                            borderBottom: "1px solid var(--bd)",
                            transition: "background 0.15s ease",
                          }}
                        >
                          <td style={{ padding: "14px" }}>
                            <strong style={{ display: "block", color: "var(--tx)" }}>
                              {lead.fullName}
                            </strong>
                            {lead.message && (
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 12.5,
                                  color: "var(--mu)",
                                  maxWidth: 260,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                title={lead.message}
                              >
                                💬 {lead.message}
                              </span>
                            )}
                          </td>

                          <td style={{ padding: "14px" }}>
                            {lead.phone ? (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  color: "#10b981",
                                  fontWeight: 700,
                                }}
                              >
                                <Phone size={14} />
                                <span>{lead.phone}</span>
                              </a>
                            ) : (
                              <span style={{ color: "var(--mu)" }}>—</span>
                            )}
                            {lead.email && (
                              <span
                                style={{
                                  display: "block",
                                  fontSize: 12.5,
                                  color: "var(--mu)",
                                }}
                              >
                                {lead.email}
                              </span>
                            )}
                          </td>

                          <td style={{ padding: "14px" }}>
                            <strong style={{ display: "block", color: "var(--tx)" }}>
                              {lead.formation}
                            </strong>
                            <span style={{ fontSize: 12.5, color: "var(--mu)" }}>
                              {lead.format}
                            </span>
                          </td>

                          <td style={{ padding: "14px" }}>
                            <select
                              disabled={updatingId === lead.id}
                              value={lead.status}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value)
                              }
                              style={{
                                padding: "4px 8px",
                                borderRadius: 8,
                                fontSize: 12.5,
                                fontWeight: 750,
                                background: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`,
                                cursor: "pointer",
                              }}
                            >
                              <option value="PENDING">En attente</option>
                              <option value="CONTACTED">Contacté</option>
                              <option value="ENROLLED">Inscrit</option>
                              <option value="ARCHIVED">Archivé</option>
                            </select>
                          </td>

                          <td
                            style={{
                              padding: "14px",
                              fontSize: 13,
                              color: "var(--mu)",
                            }}
                          >
                            {new Date(lead.createdAt).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          <td style={{ padding: "14px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                padding: 6,
                                borderRadius: 6,
                              }}
                              title="Supprimer la candidature"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (< 769px) */}
              <div className="dash-mobile-leads">
                {filteredLeads.map((lead) => {
                  const badge = getStatusBadge(lead.status);
                  return (
                    <div key={lead.id} className="dash-lead-card">
                      <div className="dash-lead-card-top">
                        <div>
                          <strong className="dash-lead-name">{lead.fullName}</strong>
                          <span className="dash-lead-formation-badge">
                            {lead.formation} • {lead.format}
                          </span>
                        </div>
                        <select
                          disabled={updatingId === lead.id}
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                          style={{
                            padding: "4px 8px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 750,
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            cursor: "pointer",
                          }}
                        >
                          <option value="PENDING">En attente</option>
                          <option value="CONTACTED">Contacté</option>
                          <option value="ENROLLED">Inscrit</option>
                          <option value="ARCHIVED">Archivé</option>
                        </select>
                      </div>

                      {lead.message && (
                        <p className="dash-lead-message">💬 {lead.message}</p>
                      )}

                      <div className="dash-lead-contacts">
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="dash-contact-pill wa"
                          >
                            <Phone size={13} />
                            <span>WhatsApp ({lead.phone})</span>
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="dash-contact-pill email"
                          >
                            <Mail size={13} />
                            <span>{lead.email}</span>
                          </a>
                        )}
                      </div>

                      <div className="dash-lead-footer">
                        <span className="dash-lead-date">
                          {new Date(lead.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteLead(lead.id)}
                          className="dash-delete-btn"
                          title="Supprimer la candidature"
                        >
                          <Trash2 size={14} />
                          <span>Supprimer</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: FORMATIONS MANAGEMENT */}
      {activeTab === "formations" && (
        <div>
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">
                Catalogue des formations ({formations.length})
              </h2>
              <p className="dash-section-desc">
                Ces formations s&apos;affichent directement sur la page d&apos;accueil et dans le modal de détails.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddFormation}
              className="btn btn-p dash-add-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Plus size={18} />
              <span>Ajouter une formation</span>
            </button>
          </div>

          <div className="dash-formations-grid">
            {formations.map((f) => (
              <div
                key={f.id}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--bd)",
                  borderRadius: 18,
                  padding: 22,
                  boxShadow: "var(--sh)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "var(--bg2)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 22,
                        border: "1px solid var(--bd)",
                      }}
                    >
                      {f.icon}
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                      {f.popular && (
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(255, 169, 10, 0.15)",
                            color: "var(--orange)",
                            border: "1px solid rgba(255, 169, 10, 0.35)",
                          }}
                        >
                          Populaire
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "var(--bg2)",
                          color: "var(--mu)",
                          border: "1px solid var(--bd)",
                        }}
                      >
                        Ordre {f.order}
                      </span>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      margin: "0 0 6px",
                      color: "var(--tx)",
                    }}
                  >
                    {f.title}
                  </h3>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--mu)",
                      lineHeight: 1.5,
                      margin: "0 0 12px",
                    }}
                  >
                    {f.tagline}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      fontSize: 12.5,
                      color: "var(--mu)",
                    }}
                  >
                    <span>⏱ {f.duration || "4 à 6 sem."}</span>
                    <span>💰 {f.price || "Sur demande"}</span>
                    <span>🎯 {f.level || "Tous niveaux"}</span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: "1px solid var(--bd)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => openEditFormation(f)}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "var(--bg2)",
                      border: "1px solid var(--bd)",
                      color: "var(--tx)",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Edit2 size={14} />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFormation(f.id, f.title)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 12px",
                      borderRadius: 10,
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#ef4444",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & COORDINATES */}
      {activeTab === "settings" && (
        <div className="dash-card dash-settings-card">
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>
              Coordonnées de l&apos;Académie &amp; Paramètres
            </h2>
            <p style={{ margin: 0, color: "var(--mu)", fontSize: 14 }}>
              Ces coordonnées sont automatiquement répercutées sur la page d&apos;accueil, la section contact, le footer et le référencement SEO Google.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} style={{ display: "grid", gap: 18 }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 750,
                  marginBottom: 6,
                  color: "var(--tx)",
                }}
              >
                Nom du Campus / Siège
              </label>
              <input
                type="text"
                required
                value={settings.campusName}
                onChange={(e) =>
                  setSettings({ ...settings, campusName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid var(--input-bd)",
                  background: "var(--input-bg)",
                  color: "var(--input-tx)",
                  fontSize: 14.5,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 750,
                  marginBottom: 6,
                  color: "var(--tx)",
                }}
              >
                Adresse complète du Siège
              </label>
              <input
                type="text"
                required
                value={settings.campusAddress}
                onChange={(e) =>
                  setSettings({ ...settings, campusAddress: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid var(--input-bd)",
                  background: "var(--input-bg)",
                  color: "var(--input-tx)",
                  fontSize: 14.5,
                }}
              />
              <small style={{ color: "var(--mu)", display: "block", marginTop: 4 }}>
                Exemple : Moroni Hadoudja (ancien Campus France), Grande Comore
              </small>
            </div>

            <div className="dash-form-row-2">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 750,
                    marginBottom: 6,
                    color: "var(--tx)",
                  }}
                >
                  Numéro WhatsApp officiel
                </label>
                <input
                  type="text"
                  required
                  value={settings.whatsappNumber}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsappNumber: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1.5px solid var(--input-bd)",
                    background: "var(--input-bg)",
                    color: "var(--input-tx)",
                    fontSize: 14.5,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 750,
                    marginBottom: 6,
                    color: "var(--tx)",
                  }}
                >
                  Email de contact officiel
                </label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: "1.5px solid var(--input-bd)",
                    background: "var(--input-bg)",
                    color: "var(--input-tx)",
                    fontSize: 14.5,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 750,
                  marginBottom: 6,
                  color: "var(--tx)",
                }}
              >
                Horaires d&apos;accueil physique
              </label>
              <input
                type="text"
                value={settings.openingHours}
                onChange={(e) =>
                  setSettings({ ...settings, openingHours: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid var(--input-bd)",
                  background: "var(--input-bg)",
                  color: "var(--input-tx)",
                  fontSize: 14.5,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 750,
                  marginBottom: 6,
                  color: "var(--tx)",
                }}
              >
                Bandeau d&apos;annonce / Badge d&apos;ouverture
              </label>
              <input
                type="text"
                value={settings.announcement || ""}
                onChange={(e) =>
                  setSettings({ ...settings, announcement: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1.5px solid var(--input-bd)",
                  background: "var(--input-bg)",
                  color: "var(--input-tx)",
                  fontSize: 14.5,
                }}
              />
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                type="submit"
                disabled={settingsLoading}
                className="btn btn-p"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                  maxWidth: 280,
                }}
              >
                {settingsLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span>Enregistrer les coordonnées</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: FAQ MANAGEMENT */}
      {activeTab === "faqs" && (
        <div>
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">
                Questions fréquentes ({faqs.length})
              </h2>
              <p className="dash-section-desc">
                Ces réponses s&apos;affichent dans la section accordéon FAQ sur le site.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddFaq}
              className="btn btn-p dash-add-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Plus size={18} />
              <span>Ajouter une question</span>
            </button>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {faqs.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--bd)",
                  borderRadius: 16,
                  padding: "18px 22px",
                  boxShadow: "var(--sh)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: 11.5,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(83, 98, 255, 0.15)",
                        color: "var(--blue)",
                      }}
                    >
                      {item.category}
                    </span>
                    <strong style={{ fontSize: 16, color: "var(--tx)" }}>
                      {item.question}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--mu)", lineHeight: 1.6 }}>
                    {item.answer}
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => openEditFaq(item)}
                    style={{
                      background: "var(--bg2)",
                      border: "1px solid var(--bd)",
                      color: "var(--tx)",
                      cursor: "pointer",
                      padding: "8px 10px",
                      borderRadius: 8,
                    }}
                    title="Modifier"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(item.id)}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#ef4444",
                      cursor: "pointer",
                      padding: "8px 10px",
                      borderRadius: 8,
                    }}
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: FORMATION (ADD / EDIT) */}
      {isFormationModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--bd)",
              borderRadius: 24,
              padding: 30,
              width: "100%",
              maxWidth: 640,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "var(--sh-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>
                {editingFormation ? "Modifier la formation" : "Ajouter une formation"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormationModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--mu)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFormation} style={{ display: "grid", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    Titre de la formation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Intelligence Artificielle & Automatisation"
                    value={formationForm.title}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, title: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid var(--bd)",
                      background: "var(--bg2)",
                      color: "var(--tx)",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                    Icône (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formationForm.icon}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, icon: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid var(--bd)",
                      background: "var(--bg2)",
                      color: "var(--tx)",
                      textAlign: "center",
                      fontSize: 18,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Phrase d&apos;accroche (Sous-titre) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Automatisez votre entreprise et gagnez 10h par semaine."
                  value={formationForm.tagline}
                  onChange={(e) =>
                    setFormationForm({ ...formationForm, tagline: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Description complète *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Présentation détaillée des compétences acquises..."
                  value={formationForm.description}
                  onChange={(e) =>
                    setFormationForm({ ...formationForm, description: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                    Durée
                  </label>
                  <input
                    type="text"
                    placeholder="4 semaines (24h)"
                    value={formationForm.duration || ""}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, duration: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid var(--bd)",
                      background: "var(--bg2)",
                      color: "var(--tx)",
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                    Tarif
                  </label>
                  <input
                    type="text"
                    placeholder="Sur demande"
                    value={formationForm.price || ""}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, price: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid var(--bd)",
                      background: "var(--bg2)",
                      color: "var(--tx)",
                      fontSize: 13,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>
                    Niveau
                  </label>
                  <input
                    type="text"
                    placeholder="Tous niveaux"
                    value={formationForm.level || ""}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, level: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid var(--bd)",
                      background: "var(--bg2)",
                      color: "var(--tx)",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={formationForm.popular}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, popular: e.target.checked })
                    }
                  />
                  <span>Mettre en avant (Badge Populaire)</span>
                </label>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Couleur :</span>
                  <select
                    value={formationForm.accentColor}
                    onChange={(e) =>
                      setFormationForm({ ...formationForm, accentColor: e.target.value })
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      border: "1px solid var(--bd)",
                      background: "var(--bg2)",
                      color: "var(--tx)",
                    }}
                  >
                    <option value="blue">Bleu</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Modules au programme (1 par ligne)
                </label>
                <textarea
                  rows={3}
                  placeholder={"Module 1 : Les bases\nModule 2 : Outils pratiques\nModule 3 : Projet final"}
                  value={modulesInput}
                  onChange={(e) => setModulesInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                    fontSize: 13,
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Points clés / Puces (1 par ligne)
                </label>
                <textarea
                  rows={3}
                  placeholder={"Point clé 1\nPoint clé 2\nPoint clé 3"}
                  value={bulletsInput}
                  onChange={(e) => setBulletsInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                    fontSize: 13,
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 10, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsFormationModalOpen(false)}
                  className="btn btn-l btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={formationLoading}
                  className="btn btn-p btn-sm"
                >
                  {formationLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Enregistrer la formation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FAQ (ADD / EDIT) */}
      {isFaqModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--bd)",
              borderRadius: 24,
              padding: 28,
              width: "100%",
              maxWidth: 540,
              boxShadow: "var(--sh-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                {editingFaq ? "Modifier la question" : "Ajouter une question FAQ"}
              </h3>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--mu)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Catégorie
                </label>
                <select
                  value={faqForm.category}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, category: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                  }}
                >
                  <option value="Admission">Admission &amp; Prérequis</option>
                  <option value="Modalités">Modalités &amp; Formats</option>
                  <option value="Certification">Certification &amp; Attestation</option>
                  <option value="Tarifs & Inscription">Tarifs &amp; Inscription</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Faut-il apporter son propre ordinateur ?"
                  value={faqForm.question}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, question: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  Réponse *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explication détaillée..."
                  value={faqForm.answer}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, answer: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid var(--bd)",
                    background: "var(--bg2)",
                    color: "var(--tx)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="btn btn-l btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={faqLoading}
                  className="btn btn-p btn-sm"
                >
                  {faqLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Enregistrer la FAQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
