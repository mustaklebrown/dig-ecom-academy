"use client";

import { useState } from "react";
import FormationModal, { FormationData } from "./FormationModal";
import { ArrowRight, Sparkles } from "lucide-react";

interface FormationsSectionProps {
  formations: FormationData[];
  onSelectFormation: (title: string) => void;
}

export default function FormationsSection({
  formations,
  onSelectFormation,
}: FormationsSectionProps) {
  const [selectedFormation, setSelectedFormation] = useState<FormationData | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = formations.filter((f) => {
    if (filter === "POPULAR") return f.popular;
    if (filter === "MARKETING") return f.slug.includes("marketing") || f.slug.includes("e-commerce");
    if (filter === "ENTREPRENEUR") return f.slug.includes("entrepreneuriat") || f.slug.includes("sur-mesure");
    if (filter === "SOFT_SKILLS") return f.slug.includes("oratoire") || f.slug.includes("personnel");
    return true;
  });

  return (
    <section id="formations">
      <div className="w">
        <div className="sh">
          <small>Nos formations</small>
          <h2>Choisissez la compétence qui vous correspond</h2>
          <p>Chaque programme est conçu pour être clair, progressif et immédiatement applicable.</p>
        </div>

        {/* Filter Pills */}
        <div className="formations-filter-container">
          {[
            { id: "ALL", label: "Tous les programmes" },
            { id: "POPULAR", label: "🔥 Plus demandées" },
            { id: "MARKETING", label: "Marketing & E-commerce" },
            { id: "ENTREPRENEUR", label: "Entrepreneuriat" },
            { id: "SOFT_SKILLS", label: "Art Oratoire & Leadership" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`formations-filter-btn ${filter === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Formations Grid */}
        <div className="grid">
          {filtered.map((item) => (
            <article key={item.id} className="card">
              {item.popular && <span className="card-badge">POPULAIRE</span>}

              <div className="ic" role="img" aria-label={item.title}>
                {item.icon}
              </div>

              <h3>{item.title}</h3>
              <p>{item.tagline}</p>

              <ul>
                {item.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>

              <div className="actions">
                <button
                  type="button"
                  onClick={() => setSelectedFormation(item)}
                  className="more"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <span>Détails du programme</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectFormation(item.title);
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="btn btn-o btn-sm"
                >
                  S&apos;inscrire
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Details modal */}
      <FormationModal
        formation={selectedFormation}
        isOpen={Boolean(selectedFormation)}
        onClose={() => setSelectedFormation(null)}
        onSelectFormation={onSelectFormation}
      />
    </section>
  );
}
