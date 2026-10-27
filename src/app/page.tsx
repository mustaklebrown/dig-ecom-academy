import { prisma } from "@/lib/prisma";
import ShowcaseApp from "@/components/ShowcaseApp";
import { FormationData } from "@/components/FormationModal";
import { FaqItemData } from "@/components/FaqSection";

export const revalidate = 60; // ISR: refresh every 60 seconds

export default async function HomePage() {
  let formations: FormationData[] = [];
  let faqs: FaqItemData[] = [];

  try {
    const dbFormations = await prisma.formation.findMany({
      orderBy: { order: "asc" },
    });

    formations = dbFormations.map((f) => ({
      id: f.id,
      title: f.title,
      slug: f.slug,
      tagline: f.tagline,
      description: f.description,
      icon: f.icon,
      accentColor: f.accentColor,
      modules: f.modules,
      bullets: f.bullets,
      order: f.order,
      popular: f.popular,
      duration: f.duration,
      price: f.price,
      level: f.level,
    }));

    const dbFaqs = await prisma.faqItem.findMany({
      orderBy: { order: "asc" },
    });

    faqs = dbFaqs.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      category: item.category,
    }));
  } catch (error) {
    console.error("Database fetch error, using defaults:", error);
  }

  // Fallback defaults if DB was empty
  if (formations.length === 0) {
    formations = [
      {
        id: "1",
        title: "Marketing digital",
        slug: "marketing-digital",
        tagline: "Attirez et fidélisez des clients grâce aux réseaux sociaux et à la publicité en ligne.",
        description: "Maîtrisez les réseaux sociaux, la création de contenu percutant et la publicité Meta Ads ciblée pour les Comores.",
        icon: "📣",
        accentColor: "blue",
        order: 1,
        popular: true,
        duration: "5 semaines",
        price: "Sur demande",
        level: "Tous niveaux",
        modules: ["Création de contenu", "Meta Ads", "Stratégie de croissance"],
        bullets: [
          "Facebook & Instagram, création de contenu",
          "Publicité en ligne (Meta Ads)",
          "Stratégie et analyse des résultats",
        ],
      },
      {
        id: "2",
        title: "E-commerce",
        slug: "e-commerce",
        tagline: "Lancez et développez votre boutique en ligne, du produit à la livraison.",
        description: "Apprenez à sourcer vos produits, créer vos tunnels de vente WhatsApp et livrer partout aux Comores.",
        icon: "🛒",
        accentColor: "orange",
        order: 2,
        popular: true,
        duration: "6 semaines",
        price: "Sur demande",
        level: "Tous niveaux",
        modules: ["Sourcing produits", "Vente WhatsApp", "Logistique & Expédition"],
        bullets: [
          "Choix des produits et fournisseurs",
          "Boutique en ligne et vente via WhatsApp",
          "Gestion des commandes et du service client",
        ],
      },
      {
        id: "3",
        title: "Entrepreneuriat",
        slug: "entrepreneuriat",
        tagline: "Transformez une idée en entreprise solide et rentable.",
        description: "Construisez votre business model, sécurisez votre trésorerie et lancez votre projet avec méthode.",
        icon: "🚀",
        accentColor: "blue",
        order: 3,
        popular: false,
        duration: "4 semaines",
        price: "Sur demande",
        level: "Porteurs de projet",
        modules: ["Étude de marché", "Business Model", "Gestion financière"],
        bullets: [
          "Étude de marché et business model",
          "Gestion financière de base",
          "Lancement et croissance",
        ],
      },
      {
        id: "4",
        title: "Art oratoire",
        slug: "art-oratoire",
        tagline: "Parlez avec assurance, convainquez et captivez votre auditoire.",
        description: "Surmontez le trac, développez votre impact vocal et réussissez vos prises de parole en public.",
        icon: "🎤",
        accentColor: "orange",
        order: 4,
        popular: false,
        duration: "3 semaines",
        price: "Sur demande",
        level: "Tous niveaux",
        modules: ["Gestion du trac", "Voix & Présence", "Discours & Pitch"],
        bullets: [
          "Structurer et délivrer un discours",
          "Gestion du trac et de la voix",
          "Prise de parole en public et en entretien",
        ],
      },
      {
        id: "5",
        title: "Développement personnel",
        slug: "developpement-personnel",
        tagline: "Développez votre confiance, votre discipline et votre leadership.",
        description: "Adoptez un état d'esprit gagnant, organisez votre temps et développez un leadership naturel.",
        icon: "🌱",
        accentColor: "blue",
        order: 5,
        popular: false,
        duration: "3 semaines",
        price: "Sur demande",
        level: "Tous niveaux",
        modules: ["Confiance en soi", "Gestion du temps", "Leadership"],
        bullets: [
          "Confiance en soi et mindset",
          "Gestion du temps et des objectifs",
          "Communication et leadership",
        ],
      },
      {
        id: "6",
        title: "Et bien d’autres",
        slug: "sur-mesure",
        tagline: "Nous élargissons régulièrement notre catalogue selon les besoins du marché.",
        description: "Formations intra-entreprises et ateliers sur mesure adaptés à vos équipes.",
        icon: "💡",
        accentColor: "orange",
        order: 6,
        popular: false,
        duration: "Sur mesure",
        price: "Devis entreprise",
        level: "Sur mesure",
        modules: ["Audit de compétences", "Atelier pratique", "Coaching"],
        bullets: [
          "Formations sur mesure pour entreprises",
          "Ateliers et séminaires",
          "Dites-nous ce dont vous avez besoin",
        ],
      },
    ];
  }

  if (faqs.length === 0) {
    faqs = [
      {
        id: "f1",
        question: "Faut-il un diplôme pour s’inscrire ?",
        answer: "Non. Nos formations sont ouvertes à tous les débutants motivés, quel que soit le niveau d’études.",
        category: "Admission",
      },
      {
        id: "f2",
        question: "Les formations sont-elles en ligne ou en présentiel ?",
        answer: "Les deux formats existent. Contactez-nous pour connaître les prochaines sessions disponibles.",
        category: "Modalités",
      },
      {
        id: "f3",
        question: "Reçoit-on une attestation ?",
        answer: "Oui, une attestation de fin de formation est remise à chaque participant.",
        category: "Certification",
      },
      {
        id: "f4",
        question: "Comment s’inscrire et payer ?",
        answer: "Envoyez-nous un message via le formulaire ou WhatsApp. Nous vous expliquons les tarifs et les modalités de paiement.",
        category: "Tarifs",
      },
    ];
  }

  return <ShowcaseApp formations={formations} faqs={faqs} />;
}
