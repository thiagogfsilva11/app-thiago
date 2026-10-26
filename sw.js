// Deixa o app abrir mesmo sem internet (ex.: academia com sinal ruim).
// Sempre tenta a versão mais nova pela rede; se não der, usa a última guardada.
const CACHE = 'app-thiago-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.webmanifest']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.url.includes('.supabase.co')) return;   // dados sempre direto da nuvem
  e.respondWith(fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
    return res;
  }).catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
});
