# NidoSync — Contexte projet pour Claude Code

## Description
NidoSync est une plateforme de conciergerie post-déménagement B2B2C.
Distribué via des déménageurs partenaires qui envoient un lien à leurs clients.

## Stack technique
- **Frontend** : HTML/CSS/JS vanilla (pas de framework — déployé sur GitHub Pages)
- **Backend IA** : Netlify Functions → Mistral Pixtral-12b (inventaire IA)
- **Temps réel** : Firebase Realtime Database (GPS tracking)
- **Routing GPS** : OSRM (open-source, gratuit)
- **Géocodage** : Nominatim / OpenStreetMap
- **Formulaires** : Formspree
- **PDF** : jsPDF (client-side)

## Pages du site
- `index.html` — Landing page + formulaire de contact (Formspree)
- `inventaire.html` — Inventaire IA meubles + devis PDF (Mistral Vision via Netlify Function)
- `suivi.html` — Suivi GPS temps réel client + vue flotte déménageur (Firebase)
- `chauffeur.html` — App chauffeur : partage position GPS + lien client unique
- `stockage.html` — Gestion cartons QR + entrepôt (démo, à brancher Firebase)
- `admin.html` — 14 démarches administratives guidées post-déménagement

## Variables d'environnement (Netlify)
- `MISTRAL_API_KEY` — clé API Mistral (déjà configurée sur Netlify)

## Firebase
- Projet : `nodosync-pro`
- DB URL : `https://nodosync-pro-default-rtdb.europe-west1.firebasedatabase.app`
- Clé Firebase intégrée directement dans les fichiers HTML (publique, sécurisation à faire)
- Structure DB : `trucks/{orderId}` → `{ lat, lng, speed, accuracy, driver, truckId, destLat, destLng, destAddr, updatedAt, online }`

## Ce qui reste à faire
- [ ] Sécuriser les règles Firebase (actuellement en mode test ouvert)
- [ ] Brancher stockage.html sur Firebase (actuellement en démo)
- [ ] Résoudre le problème de crédit Netlify pour activer l'inventaire IA réel
- [ ] Acheter le domaine nidosync.fr
- [ ] PWA — rendre le site installable sur mobile
- [ ] Intégrations affiliation (Papernest, LesFurets, Orange...)

## Style CSS
- Palette : `--black:#111110` `--white:#FAFAF8` `--orange:#E05A1A` `--teal:#17907A`
- Typo : Instrument Serif (titres) + DM Sans (corps)
- Design desktop-first, max-width 1100-1160px centré

## Partenaires business
- Contact déménageur : à démarcher (script dans `/docs/script-demarchage.md`)
- Modèle : commissions sur box internet, énergie, assurance, artisans
- Commission moyenne par client : ~170€ dont ~68€ pour le déménageur partenaire
