(() => {
  'use strict';

  const SCHEMA_VERSION=1;
  let deferredInstall=null;

  function safeParse(v,f){try{return JSON.parse(v)}catch(e){return f}}
  function todayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function isStandalone(){return window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true}
  function dailyDone(){const all=safeParse(localStorage.getItem('ldna-daily5-v1')||'{}',{}),r=all[todayKey()];return!!(r&&r.completedAt)}
  function collectData(){
    const data={};
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.indexOf('ldna-')===0&&key.indexOf('ldna-cloud-')!==0)data[key]=localStorage.getItem(key)}
    return{app:'LanguageDNA',schemaVersion:SCHEMA_VERSION,exportedAt:new Date().toISOString(),data:data}
  }
  function validateSnapshot(snapshot){
    return snapshot&&snapshot.app==='LanguageDNA'&&Number(snapshot.schemaVersion)>=1&&snapshot.data&&typeof snapshot.data==='object'
  }
  function restoreData(snapshot){
    if(!validateSnapshot(snapshot))throw new Error('This is not a valid BluXabi backup.');
    const keys=Object.keys(snapshot.data).filter(function(k){return k.indexOf('ldna-')===0&&k.indexOf('ldna-cloud-')!==0});
    if(!keys.length)throw new Error('No BluXabi progress was found in this backup.');
    keys.forEach(function(k){localStorage.setItem(k,String(snapshot.data[k]))});
    return keys.length
  }
  function exportBackup(){
    const blob=new Blob([JSON.stringify(collectData(),null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='BluXabi-progress-'+todayKey()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1000);
    status('Backup saved. Keep the file somewhere safe.')
  }
  function status(message){
    const el=document.getElementById('profileToolsStatus');if(el)el.textContent=message
  }
  function installHelp(){
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
    return ios?'On iPhone/iPad: use Share → Add to Home Screen.':'You can install BluXabi from your browser menu when installation is available.'
  }
  async function installApp(){
    if(!deferredInstall){status(installHelp());return}
    deferredInstall.prompt();const choice=await deferredInstall.userChoice;deferredInstall=null;render();status(choice&&choice.outcome==='accepted'?'BluXabi installation started.':'Installation cancelled — you can keep using the website normally.')
  }
  function render(){
    const root=document.getElementById('appProgressTools');if(!root)return;
    const done=dailyDone(),standalone=isStandalone(),cloud=window.LanguageDNACloud&&window.LanguageDNACloud.status?window.LanguageDNACloud.status():{configured:false,signedIn:false,email:'',message:''};
    root.innerHTML='<div class="profile-tools-copy"><span class="eyebrow">APP & PROGRESS</span><h2>'+(done?'✓ Daily goal complete':'One small goal today')+'</h2><p>'+(done?'You completed today’s Daily 5. You can stop here or keep learning.':'Complete one Daily 5. That is enough for a useful learning day.')+'</p><div class="daily-goal-line"><span class="'+(done?'done':'')+'"></span><strong>'+(done?'1 / 1 complete':'0 / 1 complete')+'</strong></div></div>'+
      '<div class="profile-tool-actions">'+
      (!done?'<button type="button" class="primary-btn" data-profile-start>Start Daily 5</button>':'')+
      (cloud.configured?'<button type="button" class="'+(cloud.signedIn?'secondary-btn':'primary-btn')+'" data-cloud-open>'+(cloud.signedIn?'✓ Cloud sync':'Protect & sync progress')+'</button>':'')+
      (!standalone?'<button type="button" class="secondary-btn" data-profile-install>'+(deferredInstall?'Install app':'Install / add to home screen')+'</button>':'<span class="installed-note">✓ Installed app mode</span>')+
      '<button type="button" class="secondary-btn" data-profile-export>Backup progress</button>'+
      '<button type="button" class="text-btn" data-profile-import>Restore backup</button>'+
      '<input id="profileImportInput" type="file" accept="application/json,.json" hidden>'+
      '<small id="profileToolsStatus">'+(cloud.configured?(cloud.signedIn?(cloud.message||'Cloud sync is on for '+cloud.email+'.'):'Optional free account: protect progress across devices. Learning never requires sign-in.'):'Progress is stored on this device. Backup lets you move it safely to another device.')+'</small></div>'
  }
  function handleImport(file){
    if(!file)return;const reader=new FileReader();
    reader.onload=function(){
      try{
        const snapshot=JSON.parse(String(reader.result||''));if(!validateSnapshot(snapshot))throw new Error('This file is not a BluXabi backup.');
        if(!window.confirm('Restore this BluXabi backup? Current saved progress with the same keys will be replaced.'))return;
        const count=restoreData(snapshot);status('Restored '+count+' saved progress items. Reloading…');setTimeout(function(){location.reload()},700)
      }catch(err){status(err&&err.message?err.message:'Could not restore that backup.')}
    };
    reader.onerror=function(){status('Could not read that backup file.')};reader.readAsText(file)
  }

  window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();deferredInstall=e;render()});
  window.addEventListener('appinstalled',function(){deferredInstall=null;render();status('BluXabi is installed.')});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)render()});
  window.addEventListener('storage',render);
  window.addEventListener('ldna-cloud-change',render);
  document.addEventListener('click',function(e){
    const start=e.target.closest('[data-profile-start]');if(start){const learn=document.querySelector('[data-view="tutor"]');if(learn)learn.click();setTimeout(function(){const daily=document.querySelector('[data-tutor-tab="daily"]');if(daily)daily.click()},80);return}
    if(e.target.closest('[data-profile-install]')){installApp();return}
    if(e.target.closest('[data-profile-export]')){exportBackup();return}
    if(e.target.closest('[data-profile-import]')){const input=document.getElementById('profileImportInput');if(input)input.click();return}
  });
  document.addEventListener('change',function(e){if(e.target&&e.target.id==='profileImportInput')handleImport(e.target.files&&e.target.files[0])});

  window.LanguageDNAProfile={schemaVersion:SCHEMA_VERSION,getSnapshot:collectData,restoreSnapshot:restoreData,refresh:render};
  render();
})();