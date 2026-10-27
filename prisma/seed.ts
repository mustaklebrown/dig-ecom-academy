import { prisma } from '../src/lib/prisma';
import { auth } from '../src/lib/auth';

async function main() {
  console.log('🌱 Seeding Dig e-com Academy database on Neon Cloud PostgreSQL...\n');

  // 1. Formations data
  const formations = [
    {
      title: 'Marketing digital',
      slug: 'marketing-digital',
      tagline: 'Attirez et fidélisez des clients grâce aux réseaux sociaux et à la publicité en ligne.',
      description: 'Maîtrisez les leviers du web marketing comorien et international : acquisition de prospects ciblés, création de contenu visuel percutant, gestion des algorithmes Meta et campagnes publicitaires rentables.',
      icon: '📣',
      accentColor: 'blue',
      order: 1,
      popular: true,
      duration: '5 semaines (30h)',
      price: 'Accessible avec facilités',
      level: 'Débutant à Intermédiaire',
      modules: ['Création de contenu & Canva', 'Gestion de communauté Facebook & Instagram', 'Meta Ads Manager & Ciblage Comores/Diaspora', 'Copywriting & Vente'],
      bullets: [
        'Facebook & Instagram, création de contenu',
        'Publicité en ligne (Meta Ads)',
        'Stratégie et analyse des résultats',
      ],
    },
    {
      title: 'E-commerce',
      slug: 'e-commerce',
      tagline: 'Lancez et développez votre boutique en ligne, du produit à la livraison.',
      description: 'Créez votre écosystème commercial rentable : sourcing produits fiables, catalogue numérique, tunnels de commande WhatsApp et logistique adaptée aux spécificités des îles Comores.',
      icon: '🛒',
      accentColor: 'orange',
      order: 2,
      popular: true,
      duration: '6 semaines (36h)',
      price: 'Accessible avec facilités',
      level: 'Tous niveaux',
      modules: ['Sourcing & Choix du catalogue gagnant', 'Boutique en ligne & Tunnels WhatsApp', 'Paiement, Expédition & Livraison Moroni/Provinces', 'Fidélisation & Service Client'],
      bullets: [
        'Choix des produits et fournisseurs',
        'Boutique en ligne et vente via WhatsApp',
        'Gestion des commandes et du service client',
      ],
    },
    {
      title: 'Entrepreneuriat',
      slug: 'entrepreneuriat',
      tagline: 'Transformez une idée en entreprise solide et rentable.',
      description: 'Passez de l’idée au business structuré : étude de faisabilité, business model canvas, gestion de trésorerie, démarches administratives et stratégies de rentabilité immédiate.',
      icon: '🚀',
      accentColor: 'blue',
      order: 3,
      popular: false,
      duration: '4 semaines (24h)',
      price: 'Sur devis / Inscription',
      level: 'Porteurs de projets & Entrepreneurs',
      modules: ['Étude de marché locale', 'Modèle économique & Pricing', 'Gestion financière & Trésorerie', 'Pitch & Stratégie de lancement'],
      bullets: [
        'Étude de marché et business model',
        'Gestion financière de base',
        'Lancement et croissance',
      ],
    },
    {
      title: 'Art oratoire',
      slug: 'art-oratoire',
      tagline: 'Parlez avec assurance, convainquez et captivez votre auditoire.',
      description: 'Développez un charisme vocal et corporel : vaincre le trac, structurer un message mémorable, maîtriser la voix et le regard pour réussir vos entretiens, pitchs et conférences.',
      icon: '🎤',
      accentColor: 'orange',
      order: 4,
      popular: false,
      duration: '3 semaines (18h)',
      price: 'Sur devis / Inscription',
      level: 'Tous profils',
      modules: ['Désamorcer le stress & Posture', 'Technique vocale & Rythme', 'Storytelling & Conviction', 'Pratique intensive devant public'],
      bullets: [
        'Structurer et délivrer un discours',
        'Gestion du trac et de la voix',
        'Prise de parole en public et en entretien',
      ],
    },
    {
      title: 'Développement personnel',
      slug: 'developpement-personnel',
      tagline: 'Développez votre confiance, votre discipline et votre leadership.',
      description: 'Renforcez vos piliers internes pour atteindre vos objectifs : discipline quotidienne, gestion des priorités, intelligence émotionnelle et communication assertive.',
      icon: '🌱',
      accentColor: 'blue',
      order: 5,
      popular: false,
      duration: '3 semaines (18h)',
      price: 'Sur devis / Inscription',
      level: 'Tous niveaux',
      modules: ['Mindset de croissance', 'Gestion du temps & Habitudes', 'Intelligence relationnelle', 'Plan d’action personnel'],
      bullets: [
        'Confiance en soi et mindset',
        'Gestion du temps et des objectifs',
        'Communication et leadership',
      ],
    },
    {
      title: 'Et bien d’autres',
      slug: 'sur-mesure',
      tagline: 'Nous élargissons régulièrement notre catalogue selon les besoins du marché.',
      description: 'Formations intra-entreprise, séminaires de renforcement de capacités pour équipes commerciales, coaching individuel sur mesure.',
      icon: '💡',
      accentColor: 'orange',
      order: 6,
      popular: false,
      duration: 'Sur mesure',
      price: 'Sur devis entreprise',
      level: 'Sur mesure',
      modules: ['Audit de besoins', 'Programme personnalisé', 'Formation en vos locaux ou en ligne', 'Suivi post-formation'],
      bullets: [
        'Formations sur mesure pour entreprises',
        'Ateliers et séminaires',
        'Dites-nous ce dont vous avez besoin',
      ],
    },
  ];

  console.log('📚 Synchronizing formations...');
  for (const f of formations) {
    await prisma.formation.upsert({
      where: { slug: f.slug },
      update: f,
      create: f,
    });
  }
  console.log(`   ✓ ${formations.length} formations synchronisées avec succès.`);

  // 2. FAQ Items data
  const faqs = [
    {
      question: 'Faut-il un diplôme pour s’inscrire ?',
      answer: 'Non. Nos formations sont ouvertes à tous les débutants motivés, quel que soit le niveau d’études. Notre méthode 100% pratique permet à chacun d’apprendre pas à pas.',
      category: 'Admission',
      order: 1,
    },
    {
      question: 'Les formations sont-elles en ligne ou en présentiel ?',
      answer: 'Les deux formats existent ! Nous organisons des sessions en salle à Moroni (Grande Comore) ainsi que des sessions interactives en ligne pour les résidents des autres îles ou de la diaspora.',
      category: 'Modalités',
      order: 2,
    },
    {
      question: 'Reçoit-on une attestation ?',
      answer: 'Oui, une attestation officielle de fin de formation Dig e-com Academy certifiant vos compétences pratiques est remise à chaque participant ayant complété les ateliers.',
      category: 'Certification',
      order: 3,
    },
    {
      question: 'Comment s’inscrire et payer ?',
      answer: 'Envoyez-nous simplement un message via le formulaire ou directement sur WhatsApp (+269 333 00 00). Nous vous orientons vers la bonne session et vous présentons les modalités de paiement flexibles.',
      category: 'Tarifs & Inscription',
      order: 4,
    },
  ];

  console.log('\n❓ Synchronizing FAQ items...');
  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({
      where: { question: faq.question },
    });
    if (!existing) {
      await prisma.faqItem.create({ data: faq });
    }
  }
  console.log(`   ✓ ${faqs.length} questions fréquentes enregistrées.`);

  // 3. Admin User Creation
  console.log('\n👑 Checking & creating Admin User...');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dig-ecom.academy';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin2026!Comores';
  const adminName = 'Administrateur Dig e-com';

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    try {
      await auth.api.signUpEmail({
        body: {
          name: adminName,
          email: adminEmail,
          password: adminPassword,
        },
      });

      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          role: 'admin',
          emailVerified: true,
        },
      });

      console.log(`   ✓ Utilisateur Administrateur créé avec succès !`);
      console.log(`     - Email    : ${adminEmail}`);
      console.log(`     - Mot de passe : ${adminPassword}`);
      console.log(`     - Rôle     : admin`);
    } catch (authError: any) {
      console.error('   ❌ Erreur création admin via Better Auth:', authError.message || authError);
    }
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'admin' },
    });
    console.log(`   ✓ L'utilisateur ${adminEmail} existe déjà et son rôle admin a été confirmé.`);
  }

  // 4. Initial Sample Leads (if none exist)
  const leadCount = await prisma.lead.count();
  if (leadCount === 0) {
    console.log('\n📋 Ajout de candidatures d’exemple pour le tableau de bord...');
    const mkt = await prisma.formation.findUnique({ where: { slug: 'marketing-digital' } });
    const ecom = await prisma.formation.findUnique({ where: { slug: 'e-commerce' } });
    const ent = await prisma.formation.findUnique({ where: { slug: 'entrepreneuriat' } });

    await prisma.lead.createMany({
      data: [
        {
          fullName: 'Fatouma Ali',
          phone: '+269 333 12 34',
          email: 'fatouma.ali@gmail.com',
          formation: 'Marketing digital',
          format: 'Présentiel',
          status: 'CONTACTED',
          message: 'Je souhaite développer la visibilité de ma boutique de vêtements à Volovolo.',
          formationId: mkt?.id || null,
        },
        {
          fullName: 'Ahmed Said Mohamed',
          phone: '+269 345 67 89',
          email: 'ahmed.said@outlook.com',
          formation: 'E-commerce',
          format: 'En ligne',
          status: 'PENDING',
          message: 'Je réside en France et je prépare un business de livraison aux Comores.',
          formationId: ecom?.id || null,
        },
        {
          fullName: 'Mariama Bacar',
          phone: '+269 321 00 11',
          email: 'mariama.bacar@gmail.com',
          formation: 'Entrepreneuriat',
          format: 'Présentiel',
          status: 'ENROLLED',
          message: 'Inscription confirmée pour la session de samedi prochain.',
          formationId: ent?.id || null,
        },
      ],
    });
    console.log('   ✓ 3 candidatures de démonstration enregistrées.');
  }

  console.log('\n✨ Database seeding complete on Neon Cloud PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('Seed execution error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
