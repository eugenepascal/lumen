# Lumen — GitHub Pages

Ce dossier est prêt à être placé à la racine du dépôt GitHub Pages.

Fichiers à conserver ensemble :
- index.html
- manifest.webmanifest
- service-worker.js
- icons/icon-192.png
- icons/icon-512.png

GitHub Pages :
1. Envoyer ces fichiers à la racine du repository.
2. Dans Settings > Pages, sélectionner la branche publiée (souvent `main`) et `/ (root)`.
3. Attendre le déploiement puis ouvrir l'URL GitHub Pages.
4. Faire un rechargement forcé après une mise à jour si un ancien service worker est encore en cache.

Les chemins PWA sont relatifs afin de fonctionner aussi bien sur un site utilisateur
`https://utilisateur.github.io/` que sur un site de projet
`https://utilisateur.github.io/repository/`.

Pour Spotify/Firebase, le domaine/URL GitHub Pages doit aussi être autorisé dans leurs consoles respectives.
