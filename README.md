# IHSAN - Plateforme de Charité & Traçabilité 🕊️

> **Le Concept** : L'infrastructure de confiance entre donneurs et bénéficiaires avec la communauté comme garant.

Pendant le Ramadan et tout au long de l'année, IHSAN résout le problème de traçabilité des dons (Zakat/Sadaqa) tout en respectant l'anonymat asymétrique (le bénéficiaire ne demande rien publiquement).

---

## 🌟 Fonctionnalités Clés (Le Parcours d'un Don)

1. **Dons Fléchés** : Chaque don finance un besoin précis (pas de fonds opaque).
2. **Anonymat Asymétrique** : Le donneur voit l'impact, le bénéficiaire garde sa dignité.
3. **Preuve d'Impact** : Validation de la livraison avec photo anonymisée.
4. **Transparence Absolue** : Hachage (SHA-256) immutable de chaque confirmation de livraison.

## 🛠️ Choix Techniques & Architecture

Notre architecture a été conçue pour garantir la **performance**, la **sécurité**, et une **expérience utilisateur optimale** :

- **Frontend** : Next.js 15 (React), App Router pour la gestion côté serveur (SSR/RSC) et une navigation rapide.
- **Styling & UI** : Tailwind CSS pour un design system cohérent et sur-mesure (Mobile-First), et Framer Motion pour des micro-animations fluides offrant une sensation premium.
- **Backend & API** : Route Handlers Next.js (Serverless) pour gérer la logique métier de façon sécurisée et évolutive.
- **Base de Données & Auth** : Supabase (PostgreSQL), en utilisant le Row Level Security (RLS) pour sécuriser l'accès aux données, et une authentification robuste (JWT).
- **Stockage** : Supabase Storage pour héberger les preuves de livraison (photos) de manière sécurisée.
- **Transparence & Intégrité** : Algorithme SHA-256 (via le module `crypto` de Node.js) pour générer des empreintes uniques et immutables lors de la validation des dons, simulant un ancrage de type blockchain.
- **Internationalisation (i18n)** : Intégration de `next-intl` pour une plateforme multilingue (Français, Anglais, Arabe) gérant parfaitement le RTL (Right-to-Left).

## 🚀 Guide d'Installation & Déploiement Local

Suivez ces étapes pour exécuter le projet sur votre machine en quelques minutes.

### Prérequis

- **Node.js** (version 18 ou supérieure recommandée)
- **Git** installé sur votre machine
- Un compte gratuit sur [Supabase](https://supabase.com/)

### 1. Configuration de la Base de Données (Supabase)

1. Connectez-vous à Supabase et créez un nouveau projet.
2. Allez dans la section **SQL Editor**.
3. Copiez le code SQL d'initialisation (s'il est fourni dans `schema.sql` ou équivalent) et exécutez-le. Cela créera automatiquement les tables nécessaires (profils, besoins, dons, confirmations), les politiques de sécurité (RLS) et les buckets de stockage.

### 2. Récupération & Configuration du Projet

Clonez le dépôt Git et installez les dépendances :

```bash
git clone https://github.com/kabermedhasni/ihsan-platform
cd ihsan-platform
npm install
```

### 3. Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet et ajoutez vos clés Supabase (récupérables dans les paramètres d'API de votre projet Supabase) :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase_ici
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase_ici
```

### 4. Démarrage de l'Application

Lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez votre navigateur et accédez à [http://localhost:3000](http://localhost:3000). 
Vous pouvez vous inscrire via l'interface `/auth` en choisissant différents rôles pour tester l'application :
- **Donateur (Donor)** : Pour explorer les besoins et faire un don.
- **Partenaire** : Pour soumettre des cas et besoins.
- **Validateur de terrain** : Pour confirmer la livraison et générer la preuve d'impact.

## 🎥 Démo & Présentation

Découvrez IHSAN en action !

- 🌍 **Lien de la plateforme déployée** : https://ihsan-platform-lemon.vercel.app/

---

_Ce projet a été réalisé dans le cadre du Hackathon IHSAN._
