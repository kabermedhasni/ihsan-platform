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

- **Frontend** : Next.js 15 (React), TailwindCSS, Framer Motion (UI Mobile-First fluide).
- **Backend** : Next.js API Routes (Serverless).
- **Base de Données & Auth** : Supabase (PostgreSQL + RLS Policies + JWT).
- **Stockage** : Supabase Storage (Pour les preuves photos).
- **Transparence** : Algorithme SHA-256 intégré via `crypto` de Node.js pour simuler l'ancrage Blockchain des transactions validées.

## 🚀 Installation & Déploiement Local

### Prérequis

- Node.js 18+
- Un compte Supabase

### 1. Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com/).
2. Copiez le contenu du fichier `schema.sql` et exécutez-le dans le **SQL Editor** de Supabase. Cela va initialiser les tables, les RLS, et les buckets de stockage.

### 2. Configuration Environnement Locale

```bash
git clone https://github.com/kabermedhasni/ihsan-platform
cd ihsan-platform
npm install
```

Créez un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 3. Démarrage

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Vous pouvez vous inscrire via l'interface `/auth` en choisissant différents rôles (Donor, Validator, Partner).

## 🎥 Démo & Présentation

- **Lien Déployé** : [Ici le lien de votre déploiement Vercel]
- **Vidéo de Démo** : [Ici le lien de votre vidéo de 3 minutes]

---

_Ce projet a été réalisé dans le cadre du Hackathon IHSAN._
