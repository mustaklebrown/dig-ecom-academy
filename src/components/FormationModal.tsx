"use client";

import { X, Clock, Award, BookOpen, Check, ArrowRight } from "lucide-react";

export interface FormationData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  accentColor: string;
  modules: string[];
  bullets: string[];
  order: number;
  popular: boolean;
  duration?: string | null;
  price?: string | null;
  level?: string | null;
}

interface FormationModalProps {
  formation: FormationData | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectFormation: (title: string) => void;
}

export default function FormationModal({
  formation,
  isOpen,
  onClose,
  onSelectFormation,
}: FormationModalProps) {
  if (!isOpen || !formation) return null;

  function handleEnroll() {
    if (formation) {
      onSelectFormation(formation.title);
      onClose();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div className="ic" style={{ margin: 0, width: 50, height: 50, fontSize: 24 }}>
            {formation.icon}
          </div>
          <div>
            {formation.popular && (
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(255, 169, 10, 0.18)",
                  color: "var(--orange-d)",
                  border: "1px solid var(--orange)",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "2px 8px",
                  marginBottom: 4,
                }}
              >
                POPULAIRE
              </span>
            )}
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              {formation.title}
            </h2>
          </div>
        </div>

        <p style={{ color: "var(--mu)", fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
          {formation.description || formation.tagline}
        </p>

        {/* Quick specs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            background: "var(--bg2)",
            borderRadius: 16,
            padding: "14px 16px",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <div>
            <Clock size={16} color="var(--blue)" style={{ margin: "0 auto 4px" }} />
            <span style={{ display: "block", fontSize: 11, color: "var(--mu)", fontWeight: 600 }}>DURÉE</span>
            <strong style={{ fontSize: 13 }}>{formation.duration || "4 semaines"}</strong>
          </div>
          <div>
            <Award size={16} color="var(--orange)" style={{ margin: "0 auto 4px" }} />
            <span style={{ display: "block", fontSize: 11, color: "var(--mu)", fontWeight: 600 }}>NIVEAU</span>
            <strong style={{ fontSize: 13 }}>{formation.level || "Tous niveaux"}</strong>
          </div>
          <div>
            <BookOpen size={16} color="var(--blue)" style={{ margin: "0 auto 4px" }} />
            <span style={{ display: "block", fontSize: 11, color: "var(--mu)", fontWeight: 600 }}>PÉDAGOGIE</span>
            <strong style={{ fontSize: 13 }}>100% Pratique</strong>
          </div>
        </div>

        {/* Modules Program */}
        {formation.modules && formation.modules.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--tx)" }}>
              Modules du programme
            </h4>
            <div style={{ display: "grid", gap: 8 }}>
              {formation.modules.map((mod, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "var(--card)",
                    border: "1px solid var(--bd)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "var(--blue)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 800,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{mod}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bullets */}
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--tx)" }}>
            Points clés d&apos;apprentissage
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 }}>
            {formation.bullets.map((b, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14.5 }}>
                <Check size={16} color="var(--orange)" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={handleEnroll}
          className="btn btn-o"
          style={{ width: "100%", padding: "14px", fontSize: 16 }}
        >
          <span>S&apos;inscrire à cette formation</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
