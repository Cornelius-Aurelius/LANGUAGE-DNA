const CACHE='languagedna-v33';
const ASSETS=['./','./index.html','./styles.css?v=23','./app.js?v=24','./profile-tools.js?v=3','./learning-wins.js?v=1','./supabase-config.js?v=1','./cloud-sync.js?v=2','./app-icon.svg','./everyday-data.js?v=1','./everyday-expanded-data.js?v=2','./tutor-tools.js?v=8','./everyday-game.js?v=5','./manifest.webmanifest','./pattern.html','./pattern.css?v=6','./pattern-data.js?v=5','./pattern-teaching.js?v=1','./pattern-page.js?v=3'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))
});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});

async function navigationResponse(request){
  try{
    const response=await fetch(request);
    if(response&&response.ok){const cache=await caches.open(CACHE);cache.put('./index.html',response.clone())}
    return response
  }catch(err){
    return (await caches.match(request))||(await caches.match('./index.html'))||Response.error()
  }
}
async function assetResponse(request){
  const cached=await caches.match(request);
  if(cached)return cached;
  try{
    const response=await fetch(request);
    if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(request,response.clone())}
    return response
  }catch(err){
    return Response.error()
  }
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){event.respondWith(navigationResponse(event.request));return}
  event.respondWith(assetResponse(event.request))
});