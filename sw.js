'use strict';
const CACHE='inventario-demo-gh-pages-v28';
const BASE=new URL('./',self.registration.scope);
const asset=path=>new URL(path,BASE).href;
const SHELL=['','index.html','manifest.webmanifest','icon.svg','logo-cgp-formal.svg','mari-logo.svg','mari-logo.svg','mari-club-photo.jpg'].map(asset);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL.map(url => new Request(url, { cache: 'reload' })))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('inventario-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;if (event.request.mode === 'navigate') {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const index = new URL('index.html', BASE);
    const isAppEntry = url.pathname === BASE.pathname || url.pathname === index.pathname;
    if (isAppEntry) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      try {
        const response = await fetch(event.request, { cache: 'no-cache', signal: controller.signal });
        if (response.ok) {
          clearTimeout(timeout);
          await cache.put(index.href, response.clone()).catch(() => {});
          return response;
        }
      } catch {} finally {
        clearTimeout(timeout);
      }
    }
    const cached = await cache.match(index.href);
    if (cached) return cached;
    if (!isAppEntry) {
      try {
        const response = await fetch(event.request);
        if (response.ok) return response;
      } catch {}
    }
    return new Response('La aplicación no está disponible sin conexión. Ábrala al menos una vez con internet para guardar su interfaz.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}})})());return}if(SHELL.includes(url.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(url.href)||fetch(event.request)})())});
