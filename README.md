# Lumen — application de prière catholique

Application web statique (HTML/CSS/JS, aucune dépendance de build).

## Structure
- `index.html` — page principale
- `css/styles.css` — tous les styles
- `js/app.js` — toute la logique de l'application
- `images/` — illustrations locales (SVG)

## Déploiement sur GitHub Pages
1. Copiez tout le contenu de ce dossier à la racine de votre dépôt (ou dans le dossier configuré pour Pages).
2. Activez GitHub Pages (Settings → Pages), branche `main`, dossier `/ (root)`.
3. Patientez quelques minutes après chaque mise à jour (mise en cache possible).

## Nouveautés de cette version
- Affichage des neuvaines façon Hozana (cartes « communauté », frise des 9 jours, page « podcast » par jour).
- De vraies images (œuvres du domaine public) pour Jésus, Marie, Joseph et une trentaine de saints sont maintenant affichées automatiquement quand une correspondance fiable est trouvée — sinon l'emoji du saint reste affiché (jamais d'image au hasard).

### Limites connues, en toute transparence
- Les images de saints/Jésus/Marie proviennent de Wikimedia Commons (œuvres anciennes du domaine public), chargées directement depuis leurs serveurs — il n'est pas possible de récupérer les images propriétaires d'Hozana.
- Si une URL Wikimedia venait à changer, l'image se replie automatiquement sur l'emoji correspondant (aucune image cassée).
- Quatre saints (Padre Pio, Maximilien Kolbe, Mère Teresa, Jean-Paul II) utilisent une illustration symbolique Lumen plutôt qu'une photo, pour éviter tout problème de droits sur des photographies du XXe siècle.
- L'écoute « podcast » des neuvaines utilise la synthèse vocale du navigateur, pas un enregistrement audio réel.
