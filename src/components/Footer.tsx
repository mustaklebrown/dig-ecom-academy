import Image from "next/image";

interface FooterProps {
  settings?: {
    campusAddress?: string;
    whatsappNumber?: string;
    email?: string;
    openingHours?: string;
  } | null;
}

export default function Footer({ settings }: FooterProps) {
  const address =
    settings?.campusAddress ||
    "Moroni Hadoudja (ancien Campus France), Grande Comore";
  const phone = settings?.whatsappNumber || "+269 333 00 00";
  const email = settings?.email || "contact@dig-ecom.academy";
  const hours = settings?.openingHours || "Lun - Sam : 08h30 - 18h00";

  return (
    <footer>
      <div className="w">
        <div className="fg">
          <div style={{ maxWidth: 360 }}>
            <div className="logo-box" style={{ marginBottom: 16 }}>
              <Image
                src="/logo.png"
                alt="Dig e-com Academy"
                width={160}
                height={46}
                className="logo-img"
              />
            </div>
            <p style={{ lineHeight: 1.6, color: "#aab0dd", fontSize: 14 }}>
              Formations professionnelles 100% pratiques pour réussir dans le digital, le commerce en ligne et l’entrepreneuriat aux Comores.
            </p>
          </div>

          <div>
            <h4>Formations</h4>
            <ul>
              <li><a href="#formations">Marketing digital &amp; Meta Ads</a></li>
              <li><a href="#formations">E-commerce &amp; Vente WhatsApp</a></li>
              <li><a href="#formations">Entrepreneuriat &amp; Business Model</a></li>
              <li><a href="#formations">Art oratoire &amp; Pitch</a></li>
              <li><a href="#formations">Développement personnel &amp; Mindset</a></li>
            </ul>
          </div>

          <div>
            <h4>Navigation</h4>
            <ul>
              <li><a href="#accueil">Accueil</a></li>
              <li><a href="#methode">Méthode pédagogique</a></li>
              <li><a href="#pourquoi">Pourquoi nous</a></li>
              <li><a href="#formats">Présentiel &amp; En ligne</a></li>
              <li><a href="#faq">Questions fréquentes</a></li>
              <li><a href="#contact">Contact &amp; Inscription</a></li>
            </ul>
          </div>

          <div>
            <h4>Coordonnées</h4>
            <ul style={{ color: "#aab0dd" }}>
              <li>📍 {address}</li>
              <li>💬 WhatsApp : {phone}</li>
              <li>✉️ {email}</li>
              <li>🕒 {hours}</li>
            </ul>
          </div>
        </div>

        <div className="cp">
          © 2026 Dig e-com Academy. Tous droits réservés. Pédagogie de terrain aux Comores.
        </div>
      </div>
    </footer>
  );
}
