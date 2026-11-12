/* Service worker Lumen — mode hors ligne (PWA).
   Stratégie : « app shell » en cache-first (HTML/CSS/JS/images locales),
   pour que l'application s'ouvre et se navigue même sans réseau. Tout le
   reste (API AELF, Firestore, polices Google, YouTube, CDN Firebase...)
   part toujours directement au réseau — on ne met jamais en cache du
   contenu dynamique ou qui ne nous appartient pas.
   Changez CACHE_VERSION pour forcer les navigateurs à rafraîchir le cache
   après une mise à jour du shell. */
const CACHE_VERSION = 'lumen-shell-v42';

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/app.js',
  './favicon-16.png',
  './favicon-32.png',
  './images/icons/icon-192.png',
  './images/icons/icon-512.png',
  './images/icons/apple-touch-icon.png',
  './images/author-welcome.jpg',
  './audio/bienvenue.m4a',
  './videos/demo.mp4',
  './images/annunciation.svg',
  './images/assumption.svg',
  './images/bible.svg',
  './images/church-floorplan.svg',
  './images/church.svg',
  './images/family.svg',
  './images/gospel.svg',
  './images/history-aura.svg',
  './images/history-crown.svg',
  './images/history-fish.svg',
  './images/history-flame.svg',
  './images/history-sword.svg',
  './images/history-tablets.svg',
  './images/intentions.svg',
  './images/journal.svg',
  './images/journey.svg',
  './images/mercy.svg',
  './images/music.svg',
  './images/mystery-agonie.svg',
  './images/mystery-annonce-royaume.svg',
  './images/mystery-ascension.svg',
  './images/mystery-assomption.svg',
  './images/mystery-cana.svg',
  './images/mystery-couronne-epines.svg',
  './images/mystery-couronnement-marie.svg',
  './images/mystery-eucharistie.svg',
  './images/mystery-flagellation.svg',
  './images/mystery-pentecote.svg',
  './images/mystery-portement-croix.svg',
  './images/mystery-presentation.svg',
  './images/mystery-recouvrement.svg',
  './images/mystery-transfiguration.svg',
  './images/mystery-visitation.svg',
  './images/nativity.svg',
  './images/novena-anthony.svg',
  './images/novena-holy-spirit.svg',
  './images/novena-joseph-family.svg',
  './images/novena-joseph.svg',
  './images/novena-mary-trust.svg',
  './images/novena-mary.svg',
  './images/novena-michael.svg',
  './images/novena-rita.svg',
  './images/novena-sacred-heart.svg',
  './images/novena-star.svg',
  './images/novena-step-ave.svg',
  './images/novena-step-final.svg',
  './images/novena-step-gloria.svg',
  './images/novena-step-meditation.svg',
  './images/novena-step-paternoster.svg',
  './images/novena-step-prayer.svg',
  './images/novena-therese.svg',
  './images/oratory.svg',
  './images/pardon-quote-1.svg',
  './images/pardon-quote-2.svg',
  './images/pardon-quote-3.svg',
  './images/pardon-quote-4.svg',
  './images/pardon-quote-5.svg',
  './images/pardon-quote-6.svg',
  './images/prayer.svg',
  './images/profile.svg',
  './images/psalms.svg',
  './images/rosary.svg',
  './images/saint-generic-cross.svg',
  './images/saint-jean-paul-ii.svg',
  './images/saint-maximilien-kolbe.svg',
  './images/saint-padre-pio.svg',
  './images/sainte-mere-teresa.svg',
  './images/saints.svg',
  './images/search.svg',
  './images/themes.svg',
  './images/walking-to-light.svg',
  './images/wisdom.svg'
];

self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache)=>
      // On force cache:'reload' pour ignorer le cache HTTP du navigateur :
      // sans ça, un bump de CACHE_VERSION peut quand même recopier une
      // ancienne version d'un fichier (CSS/JS) déjà servie plus tôt dans
      // la session depuis le cache HTTP normal.
      Promise.all(SHELL_ASSETS.map((url)=>
        fetch(url, {cache:'reload'}).then((resp)=> cache.put(url, resp)).catch(()=>{})
      ))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event)=>{
  event.waitUntil(
    caches.keys().then((names)=> Promise.all(
      names.filter((n)=> n !== CACHE_VERSION).map((n)=> caches.delete(n))
    )).then(()=> self.clients.claim())
  );
});

function isShellRequest(url){
  // Uniquement nos propres fichiers (même origine), jamais les API externes
  // (AELF, Firestore/Firebase, polices Google, YouTube...).
  return url.origin === self.location.origin;
}

self.addEventListener('fetch', (event)=>{
  const req = event.request;
  if(req.method !== 'GET') return; // on ne touche jamais aux écritures (Firestore, etc.)
  const url = new URL(req.url);
  if(!isShellRequest(url)) return; // laisse passer tout le reste tel quel

  // Navigation (ouverture/rafraîchissement de l'app) : réseau d'abord pour
  // avoir la dernière version quand il y en a une, repli sur le cache hors ligne.
  if(req.mode === 'navigate'){
    event.respondWith(
      fetch(req).catch(()=> caches.match('./index.html'))
    );
    return;
  }

  // Fichiers du shell : cache d'abord (rapide, fonctionne hors ligne), puis
  // on rafraîchit silencieusement le cache en arrière-plan.
  event.respondWith(
    caches.match(req).then((cached)=>{
      const network = fetch(req).then((res)=>{
        if(res && res.ok){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache)=> cache.put(req, copy));
        }
        return res;
      }).catch(()=> cached);
      return cached || network;
    })
  );
});
