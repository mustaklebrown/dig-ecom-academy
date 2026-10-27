"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FaqSectionProps {
  faqs: FaqItemData[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [search, setSearch] = useState("");

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="faq">
      <div className="w">
        <div className="sh">
          <small>FAQ</small>
          <h2>Vos questions fréquentes</h2>
          <p>Tout ce que vous devez savoir pour démarrer sereinement votre formation.</p>

          {/* Quick search */}
          <div
            style={{
              maxWidth: 420,
              margin: "24px auto 0",
              position: "relative",
            }}
          >
            <Search
              size={17}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--mu)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                borderRadius: 999,
                border: "1.5px solid var(--bd)",
                background: "var(--card)",
                color: "var(--tx)",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div className="faq">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <details key={item.id}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "var(--mu)" }}>
              Aucune question trouvée pour « {search} ». Contactez-nous directement !
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
