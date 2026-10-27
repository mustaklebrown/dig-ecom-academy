# Dig e-com Academy 🇰🇲

Plateforme moderne de l'académie de formation professionnelle aux Comores : Marketing digital, E-commerce, Entrepreneuriat, Art oratoire et Développement personnel.

---

## 🚀 Déploiement sur Vercel (Recommandé)

Le projet est entièrement optimisé pour **Vercel** (Next.js 15 App Router, Better Auth, PostgreSQL Neon Cloud via Prisma).

### 1. Variables d'environnement requises sur Vercel :

Ajoutez ces variables dans votre projet Vercel (**Settings > Environment Variables**) :

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL Neon (avec `-pooler`) | `postgresql://neondb_owner:...@ep-silent-boat-b4ppns91-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | Clé secrète de chiffrement des sessions | `une_cle_secrete_aleatoire_de_32_caracteres_min` |
| `BETTER_AUTH_URL` | URL de votre domaine de production Vercel | `https://votre-projet.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | URL publique de l'application | `https://votre-projet.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Numéro WhatsApp académique pour les leads | `2693330000` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email de contact officiel | `contact@dig-ecom.academy` |

---

## 🛠️ Stack Technique

- **Framework :** Next.js 15 (App Router, Turbopack, React 19)
- **Base de données :** PostgreSQL (Neon Serverless Cloud) avec Prisma ORM & pg-pooler
- **Authentification :** Better Auth (Email & Password, sessions sécurisées)
- **Design :** Vanilla CSS responsive haute performance avec mode sombre (Dark Theme) & micro-animations
- **Tableau de bord :** Gestion dynamique des candidatures et leads en temps réel

---

## 💻 Développement local

```bash
# Installation des dépendances
bun install # ou npm install

# Initialisation & synchronisation de la base Neon
bun run db:push
bun run db:seed

# Lancement du serveur de développement
bun run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 👑 Accès Administrateur par défaut

- **URL Dashboard :** `/dashboard`
- **Email :** `admin@dig-ecom.academy`
- **Mot de passe :** `Admin2026!Comores`
