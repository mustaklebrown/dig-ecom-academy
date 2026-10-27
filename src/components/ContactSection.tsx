"use client";

import { useState, useEffect } from "react";
import { createLeadAction } from "@/app/actions/lead";
import {
  Send,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  Sparkles,
  Clock,
  ShieldCheck,
  GraduationCap,
  Star,
  ArrowRight,
  User,
  Building2,
  Laptop,
  ExternalLink,
} from "lucide-react";

interface ContactSectionProps {
  selectedFormation: string;
  formationTitles: string[];
  settings?: {
    campusAddress?: string;
    whatsappNumber?: string;
    email?: string;
    openingHours?: string;
    announcement?: string;
  } | null;
}

export default function ContactSection({
  selectedFormation,
  formationTitles,
  settings,
}: ContactSectionProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formation, setFormation] = useState(
    selectedFormation || formationTitles[0] || "Marketing digital"
  );
  const [format, setFormat] = useState("Présentiel");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<{
    name: string;
    formation: string;
    format: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync formation if parent prop changes
  useEffect(() => {
    if (selectedFormation) {
      setFormation(selectedFormation);
    }
  }, [selectedFormation]);

  const waNumber =
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "2693330000";
  const address =
    settings?.campusAddress ||
    "Moroni Hadoudja (ancien Campus France), Grande Comore";
  const contactEmail = settings?.email || "contact@dig-ecom.academy";
  const hours = settings?.openingHours || "Lun - Sam : 08h30 - 18h00";
  const badgeText = settings?.announcement || "ADMISSIONS OUVERTES • SESSION 2026";

  // Real-time generated WhatsApp message
  const previewMessage = `Bonjour Dig e-com Academy, je m'appelle ${
    fullName.trim() || "..."
  }${
    phone.trim() ? ` (Tél: ${phone.trim()})` : ""
  }. Je souhaite m'inscrire à la formation « ${formation} » en format « ${format} ». Pourriez-vous me transmettre le programme complet et les modalités ?`;

  async function handleSaveAndSend(openWhatsApp: boolean) {
    if (!fullName.trim()) {
      alert("Veuillez renseigner votre nom complet.");
      return;
    }

    setLoading(true);

    try {
      // 1. Save lead to database
      const res = await createLeadAction({
        fullName,
        phone,
        email,
        formation,
        format,
        message,
      });

      if (res.success) {
        setSubmittedLead({
          name: fullName.trim(),
          formation,
          format,
        });
        setIsSubmitted(true);
        setToastMessage("🎉 Inscription enregistrée avec succès !");
        setTimeout(() => setToastMessage(null), 5000);
      }

      // 2. Open WhatsApp if requested
      if (openWhatsApp) {
        const msg = previewMessage;
        window.open(
          `https://wa.me/${waNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }

      // Reset form fields
      setFullName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (e) {
      console.error(e);
      setToastMessage("Une erreur s'est produite lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  }

  function handleResetForm() {
    setIsSubmitted(false);
    setSubmittedLead(null);
  }

  return (
    <section className="contact-section" id="contact">
      <div className="w">
        <div className="contact-layout">
          {/* Left Column: Direct Contact & Social Proof */}
          <div className="contact-info-hub">
            <div>
              <div className="contact-badge-pill">
                <span className="pulse-dot" />
                <span>{badgeText}</span>
              </div>

              <h2 className="contact-main-title" style={{ marginTop: 14 }}>
                Donnez un coup d&apos;accélérateur à <span>votre projet</span>.
              </h2>

              <p className="contact-subtitle" style={{ marginTop: 12 }}>
                Remplissez le formulaire en 30 secondes chrono. Notre équipe pédagogique
                analyse vos objectifs et vous transmet immédiatement le programme détaillé,
                les dates de session et les modalités sur WhatsApp.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="contact-channels-grid">
              <a
                href={`https://wa.me/${waNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  "Bonjour Dig e-com Academy, j'aimerais échanger directement avec un conseiller sur vos formations."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="contact-channel-card highlight"
                title="Discuter directement sur WhatsApp"
              >
                <div className="channel-icon-wrap wa">
                  <MessageCircle size={22} />
                </div>
                <div className="channel-body">
                  <small className="channel-tag-wa">Chat direct WhatsApp</small>
                  <strong>{waNumber}</strong>
                  <span>Réponse rapide en moins de 2 heures</span>
                </div>
                <ExternalLink size={18} color="var(--mu)" />
              </a>

              <div className="contact-channel-card">
                <div className="channel-icon-wrap loc">
                  <MapPin size={22} />
                </div>
                <div className="channel-body">
                  <small>Campus physique &amp; Siège</small>
                  <strong>{address}</strong>
                  <span>Accueil &amp; cours : {hours}</span>
                </div>
              </div>

              <a
                href={`mailto:${contactEmail}`}
                className="contact-channel-card"
                title="Nous envoyer un email"
              >
                <div className="channel-icon-wrap mail">
                  <Mail size={22} />
                </div>
                <div className="channel-body">
                  <small>Email académique &amp; B2B</small>
                  <strong>{contactEmail}</strong>
                  <span>Pour les demandes institutionnelles et devis entreprises</span>
                </div>
              </a>
            </div>

            {/* Trust Proof Card */}
            <div className="contact-trust-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ShieldCheck size={20} color="var(--blue)" />
                <strong style={{ fontSize: 14, fontWeight: 800 }}>
                  Pourquoi nous faire confiance ?
                </strong>
              </div>

              <div className="trust-badges-row">
                <div className="trust-pill">
                  <Clock size={16} color="var(--orange)" />
                  <span>Réponse en &lt; 2h</span>
                </div>
                <div className="trust-pill">
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Cas 100% pratiques</span>
                </div>
                <div className="trust-pill">
                  <GraduationCap size={16} color="var(--blue)" />
                  <span>Attestation certifiée</span>
                </div>
                <div className="trust-pill">
                  <Sparkles size={16} color="var(--orange)" />
                  <span>Coaching post-formation</span>
                </div>
              </div>

              <div className="trust-rating-line">
                <div style={{ display: "flex", gap: 3, color: "#f59e0b" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>
                <span>
                  <strong>4.9 / 5</strong> satisfaction • +250 apprenants déjà formés
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Glassmorphic Form Card */}
          <div className="contact-form-glass">
            {isSubmitted && submittedLead ? (
              <div className="contact-success-state">
                <div className="success-icon-badge">
                  <CheckCircle2 size={36} />
                </div>

                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: 22, fontWeight: 850, margin: "0 0 6px" }}>
                    Félicitations {submittedLead.name} !
                  </h3>
                  <p style={{ color: "var(--mu)", fontSize: 14.5, margin: 0, maxWidth: 380 }}>
                    Votre candidature pour la formation{" "}
                    <strong style={{ color: "var(--tx)" }}>
                      « {submittedLead.formation} »
                    </strong>{" "}
                    ({submittedLead.format}) a bien été enregistrée.
                  </p>
                </div>

                <div className="contact-success-info">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#10b981" }}>
                    <CheckCircle2 size={16} />
                    <span>Dossier ajouté à notre académie</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--mu)" }}>
                    <Clock size={16} />
                    <span>Un conseiller vous répond sous 2h ouvrées</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
                  <button
                    type="button"
                    onClick={() => {
                      const msg = `Bonjour Dig e-com Academy, je suis ${submittedLead.name}. Je confirme ma demande pour la formation « ${submittedLead.formation} » (${submittedLead.format}).`;
                      window.open(
                        `https://wa.me/${waNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          msg
                        )}`,
                        "_blank"
                      );
                    }}
                    className="btn-whatsapp-primary"
                  >
                    <MessageCircle size={20} />
                    <span>Ouvrir la conversation WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="btn-secondary-submit"
                  >
                    <span>Nouvelle inscription</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="contact-form-header">
                  <h3>Formulaire d&apos;inscription rapide</h3>
                  <p>
                    Sélectionnez votre format préféré et vos coordonnées pour être contacté.
                  </p>
                </div>

                {/* Interactive Format Selector Pills */}
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12.5,
                      fontWeight: 750,
                      color: "var(--tx)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Format d&apos;apprentissage :
                  </label>
                  <div className="format-toggle-container">
                    <button
                      type="button"
                      className={`format-btn ${format === "Présentiel" ? "active" : ""}`}
                      onClick={() => setFormat("Présentiel")}
                    >
                      <Building2 size={18} />
                      <strong>Présentiel</strong>
                      <small>Moroni (en salle)</small>
                    </button>

                    <button
                      type="button"
                      className={`format-btn ${format === "En ligne" ? "active" : ""}`}
                      onClick={() => setFormat("En ligne")}
                    >
                      <Laptop size={18} />
                      <strong>En ligne</strong>
                      <small>Comores &amp; Diaspora</small>
                    </button>

                    <button
                      type="button"
                      className={`format-btn ${format === "Sur mesure" ? "active" : ""}`}
                      onClick={() => setFormat("Sur mesure")}
                    >
                      <Sparkles size={18} />
                      <strong>Sur mesure</strong>
                      <small>Entreprise / Pro</small>
                    </button>
                  </div>
                </div>

                <div className="form-grid-fields">
                  {/* Full Name */}
                  <div className="input-field-group">
                    <label>
                      <span>Nom complet *</span>
                    </label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input
                        type="text"
                        required
                        placeholder="Ex : Fatouma Ali"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Phone & Email (2 columns) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <div className="input-field-group">
                      <label>
                        <span>WhatsApp / Tél *</span>
                      </label>
                      <div className="input-with-icon">
                        <Phone size={18} />
                        <input
                          type="tel"
                          placeholder="+269 333 00 00"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-field-group">
                      <label>
                        <span>Email (optionnel)</span>
                      </label>
                      <div className="input-with-icon">
                        <Mail size={18} />
                        <input
                          type="email"
                          placeholder="nom@exemple.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Formation Selector */}
                  <div className="input-field-group">
                    <label>
                      <span>Formation souhaitée *</span>
                    </label>
                    <div className="input-with-icon">
                      <GraduationCap size={18} />
                      <select
                        value={formation}
                        onChange={(e) => setFormation(e.target.value)}
                      >
                        {formationTitles.length > 0 ? (
                          formationTitles.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))
                        ) : (
                          <>
                            <option>Marketing digital</option>
                            <option>E-commerce</option>
                            <option>Entrepreneuriat</option>
                            <option>Art oratoire</option>
                            <option>Développement personnel</option>
                            <option>Et bien d’autres (sur mesure)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="input-field-group">
                    <label>
                      <span>Votre projet ou objectifs (optionnel)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Parlez-nous brièvement de votre secteur ou de vos attentes..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {/* Dynamic WhatsApp Preview Box */}
                  <div className="wa-preview-card">
                    <MessageCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>Aperçu du message WhatsApp :</strong>
                      <p style={{ margin: "2px 0 0", fontStyle: "italic", opacity: 0.9 }}>
                        &ldquo;{previewMessage}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="form-action-buttons">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSaveAndSend(true)}
                      className="btn-whatsapp-primary"
                    >
                      {loading ? (
                        <Loader2 size={19} className="animate-spin" />
                      ) : (
                        <MessageCircle size={19} />
                      )}
                      <span>Valider &amp; Envoyer sur WhatsApp</span>
                      <ArrowRight size={17} style={{ marginLeft: 4 }} />
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => handleSaveAndSend(false)}
                      className="btn-secondary-submit"
                      title="Enregistrer directement dans la base de données sans ouvrir WhatsApp"
                    >
                      <Send size={15} />
                      <span>Enregistrer sans ouvrir WhatsApp</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
