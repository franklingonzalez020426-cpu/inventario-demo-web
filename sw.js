'use strict';
const CACHE='inventario-demo-gh-pages-v3';
const BASE=new URL('./',self.registration.scope);
const asset=path=>new URL(path,BASE).href;
const SHELL=['','index.html','manifest.webmanifest','icon.svg'].map(asset);
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('inventario-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;if(event.request.mode==='navigate'){event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(asset('index.html'));if(cached)return cached;try{const response=await fetch(event.request);if(response.ok)return response}catch{}return new Response('La aplicación no está disponible sin conexión. Ábrala al menos una vez con internet para guardar su interfaz.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}})})());return}if(SHELL.includes(url.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(url.href)||fetch(event.request)})())});

