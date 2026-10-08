(() => {
  'use strict';

  const config=window.LANGUAGE_DNA_SUPABASE_CONFIG||{};
  const configured=!!(config.url&&config.publishableKey);
  const META_PREFIX='ldna-cloud-';
  let client=null,session=null,syncTimer=null,loadingSdk=null,lastStatus='Stored on this device';

  function safeParse(v,f){try{return JSON.parse(v)}catch(e){return f}}
  function emit(){window.dispatchEvent(new CustomEvent('ldna-cloud-change',{detail:status()}))}
  function setStatus(message){lastStatus=message;emit()}
  function now(){return Date.now()}
  function cloudMeta(key,value){
    if(value===undefined)return localStorage.getItem(META_PREFIX+key);
    localStorage.setItem(META_PREFIX+key,String(value))
  }
  function learnerKeys(){
    const out=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(key&&key.indexOf('ldna-')===0&&key.indexOf(META_PREFIX)!==0)out.push(key)
    }
    return out.sort()
  }
  function snapshot(){
    if(window.LanguageDNAProfile&&typeof window.LanguageDNAProfile.getSnapshot==='function')return window.LanguageDNAProfile.getSnapshot();
    const data={};learnerKeys().forEach(function(key){data[key]=localStorage.getItem(key)});
    return{app:'LanguageDNA',schemaVersion:1,exportedAt:new Date().toISOString(),data:data}
  }
  function restore(snap){
    if(window.LanguageDNAProfile&&typeof window.LanguageDNAProfile.restoreSnapshot==='function')return window.LanguageDNAProfile.restoreSnapshot(snap);
    if(!snap||snap.app!=='LanguageDNA'||!snap.data)throw new Error('Invalid LanguageDNA cloud snapshot.');
    Object.keys(snap.data).filter(function(k){return k.indexOf('ldna-')===0&&k.indexOf(META_PREFIX)!==0}).forEach(function(k){localStorage.setItem(k,String(snap.data[k]))})
  }
  function markLocalChange(key){
    if(!key||key.indexOf('ldna-')!==0||key.indexOf(META_PREFIX)===0)return;
    cloudMeta('local-updated-v1',now());
    if(session)scheduleSync()
  }

  const nativeSetItem=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    nativeSetItem.call(this,key,value);
    if(this===localStorage)markLocalChange(String(key))
  };

  function loadSdk(){
    if(!configured)return Promise.resolve(null);
    if(window.supabase&&window.supabase.createClient)return Promise.resolve(window.supabase);
    if(loadingSdk)return loadingSdk;
    loadingSdk=new Promise(function(resolve,reject){
      const script=document.createElement('script');
      script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async=true;
      script.onload=function(){resolve(window.supabase)};
      script.onerror=function(){reject(new Error('Could not load secure sync library.'))};
      document.head.appendChild(script)
    });
    return loadingSdk
  }
  async function ensureClient(){
    if(!configured)return null;if(client)return client;
    const sdk=await loadSdk();if(!sdk||!sdk.createClient)throw new Error('Sync library unavailable.');
    client=sdk.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
    const current=await client.auth.getSession();session=current.data&&current.data.session||null;
    client.auth.onAuthStateChange(function(event,newSession){
      session=newSession||null;
      if(event==='PASSWORD_RECOVERY')openAccount('recovery');
      if(event==='SIGNED_IN'){setStatus('Signed in · syncing progress…');setTimeout(sync,250)}
      else if(event==='SIGNED_OUT')setStatus('Signed out · progress stays on this device');
      else emit()
    });
    emit();return client
  }
  function status(){
    return{
      configured:configured,
      signedIn:!!(session&&session.user),
      email:session&&session.user&&session.user.email||'',
      message:lastStatus
    }
  }
  function remoteTime(row){return row&&row.updated_at?Date.parse(row.updated_at)||0:0}
  async function upload(c,userId){
    const snap=snapshot(),clientTime=new Date(Number(cloudMeta('local-updated-v1'))||now()).toISOString();
    const result=await c.from('learner_progress').upsert({user_id:userId,schema_version:Number(snap.schemaVersion)||1,snapshot:snap,client_updated_at:clientTime},{onConflict:'user_id'}).select('updated_at').single();
    if(result.error)throw result.error;
    const serverTime=remoteTime(result.data)||now();
    cloudMeta('last-sync-v1',serverTime);cloudMeta('last-remote-v1',serverTime);
    setStatus('✓ Progress synced');return result.data
  }
  async function sync(){
    if(!configured||!navigator.onLine)return false;
    try{
      const c=await ensureClient();if(!c||!session||!session.user)return false;
      setStatus('Syncing progress…');
      const userId=session.user.id,lastSync=Number(cloudMeta('last-sync-v1'))||0,localUpdated=Number(cloudMeta('local-updated-v1'))||0;
      const result=await c.from('learner_progress').select('snapshot,updated_at,client_updated_at,schema_version').eq('user_id',userId).maybeSingle();
      if(result.error)throw result.error;
      const row=result.data;
      if(!row){await upload(c,userId);return true}
      const remoteUpdated=remoteTime(row),remoteChanged=remoteUpdated>lastSync+1000,localChanged=localUpdated>lastSync+1000;
      if(remoteChanged&&!localChanged){
        restore(row.snapshot);cloudMeta('last-sync-v1',remoteUpdated);cloudMeta('last-remote-v1',remoteUpdated);cloudMeta('local-updated-v1',remoteUpdated);
        setStatus('✓ Progress restored from cloud');setTimeout(function(){location.reload()},450);return true
      }
      if(localChanged&&!remoteChanged){await upload(c,userId);return true}
      if(remoteChanged&&localChanged){
        nativeSetItem.call(localStorage,'ldna-cloud-conflict-backup-v1',JSON.stringify(snapshot()));
        const remoteClient=row.client_updated_at?Date.parse(row.client_updated_at)||0:0;
        if(remoteClient>localUpdated){
          restore(row.snapshot);cloudMeta('last-sync-v1',remoteUpdated);cloudMeta('last-remote-v1',remoteUpdated);cloudMeta('local-updated-v1',remoteUpdated);
          setStatus('Cloud progress was newer. A local safety copy was kept.');setTimeout(function(){location.reload()},650);return true
        }
        await upload(c,userId);setStatus('✓ Synced newer progress · safety copy kept');return true
      }
      cloudMeta('last-sync-v1',Math.max(lastSync,remoteUpdated));cloudMeta('last-remote-v1',remoteUpdated);setStatus('✓ Progress synced');return true
    }catch(err){
      setStatus('Sync paused · your progress is safe on this device');return false
    }
  }
  function scheduleSync(){
    clearTimeout(syncTimer);syncTimer=setTimeout(function(){if(navigator.onLine)sync()},2200)
  }

  async function signUp(email,password){
    const c=await ensureClient();if(!c)throw new Error('Cloud sync is not configured.');
    const result=await c.auth.signUp({email:email,password:password,options:{emailRedirectTo:location.origin+location.pathname}});
    if(result.error)throw result.error;setStatus(result.data&&result.data.session?'Signed in · syncing progress…':'Check your email to finish creating your free account.');return result
  }
  async function signIn(email,password){
    const c=await ensureClient();const result=await c.auth.signInWithPassword({email:email,password:password});if(result.error)throw result.error;session=result.data.session;await sync();return result
  }
  async function resetPassword(email){
    const c=await ensureClient();const result=await c.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname+'?password-recovery=1'});if(result.error)throw result.error;setStatus('Password reset email sent.');return result
  }
  async function updatePassword(password){
    const c=await ensureClient();const result=await c.auth.updateUser({password:password});if(result.error)throw result.error;setStatus('Password updated.');return result
  }
  async function signOut(){
    const c=await ensureClient();if(c)await c.auth.signOut();session=null;emit()
  }
  async function deleteAccount(){
    const c=await ensureClient();if(!c||!session)throw new Error('Sign in first.');
    const result=await c.functions.invoke('delete-account',{body:{confirm:true}});
    if(result.error)throw result.error;
    await c.auth.signOut();session=null;setStatus('Account deleted. Local progress remains on this device.');emit()
  }

  function dialog(){return document.getElementById('accountDialog')}
  function renderDialog(mode){
    const root=document.getElementById('accountDialogContent');if(!root)return;
    const st=status();
    if(st.signedIn){
      root.innerHTML='<div class="account-dialog-head"><span class="eyebrow">FREE CLOUD SYNC</span><h2>Your progress is protected.</h2><p>'+escapeText(st.email)+'</p></div><div class="account-status-card"><strong>'+escapeText(st.message)+'</strong><small>Learning still works offline. Changes sync when you are online.</small></div><div class="account-actions"><button type="button" class="primary-btn" data-cloud-sync>Sync now</button><button type="button" class="secondary-btn" data-cloud-signout>Sign out</button><button type="button" class="text-btn danger" data-cloud-delete>Delete account</button></div>';
      return
    }
    if(mode==='recovery'){
      root.innerHTML='<div class="account-dialog-head"><span class="eyebrow">PASSWORD RECOVERY</span><h2>Choose a new password.</h2></div><form class="account-form" id="cloudRecoveryForm"><label>New password<input type="password" id="cloudRecoveryPassword" minlength="8" required autocomplete="new-password"></label><button class="primary-btn" type="submit">Update password</button></form>';return
    }
    root.innerHTML='<div class="account-dialog-head"><span class="eyebrow">OPTIONAL FREE ACCOUNT</span><h2>Protect your progress across devices.</h2><p>You can keep learning without an account. Creating one is free and only adds cloud backup + sync.</p></div><div class="account-tabs"><button type="button" class="'+(mode!=='signup'?'active':'')+'" data-cloud-mode="signin">Sign in</button><button type="button" class="'+(mode==='signup'?'active':'')+'" data-cloud-mode="signup">Create free account</button></div><form class="account-form" id="cloudAuthForm" data-mode="'+(mode==='signup'?'signup':'signin')+'"><label>Email<input type="email" id="cloudEmail" required autocomplete="email"></label><label>Password<input type="password" id="cloudPassword" minlength="8" required autocomplete="'+(mode==='signup'?'new-password':'current-password')+'"></label><button class="primary-btn" type="submit">'+(mode==='signup'?'Create free account':'Sign in')+'</button></form><button type="button" class="text-btn" data-cloud-reset>Forgot password?</button><p class="account-message" id="cloudAccountMessage"></p>'
  }
  function escapeText(value){return String(value||'').replace(/[&<>"']/g,function(ch){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
  function openAccount(mode){
    if(!configured)return;
    renderDialog(mode||'signin');const d=dialog();if(d&&!d.open)d.showModal()
  }
  function message(text){const el=document.getElementById('cloudAccountMessage');if(el)el.textContent=text}

  document.addEventListener('click',async function(e){
    if(e.target.closest('[data-cloud-open]')){openAccount();return}
    const mode=e.target.closest('[data-cloud-mode]');if(mode){renderDialog(mode.dataset.cloudMode);return}
    if(e.target.closest('[data-cloud-sync]')){await sync();renderDialog();return}
    if(e.target.closest('[data-cloud-signout]')){await signOut();const d=dialog();if(d)d.close();return}
    if(e.target.closest('[data-cloud-reset]')){const email=document.getElementById('cloudEmail');if(!email||!email.value){message('Enter your email first.');return}try{await resetPassword(email.value);message('Password reset email sent.')}catch(err){message(err.message||'Could not send reset email.')}return}
    if(e.target.closest('[data-cloud-delete]')){if(!confirm('Delete your free LanguageDNA cloud account? Your local progress on this device will remain.'))return;try{await deleteAccount();const d=dialog();if(d)d.close()}catch(err){message(err.message||'Could not delete account.')}return}
    if(e.target.closest('[data-account-close]')){const d=dialog();if(d)d.close();return}
  });
  document.addEventListener('submit',async function(e){
    if(e.target.id==='cloudAuthForm'){
      e.preventDefault();const email=document.getElementById('cloudEmail').value.trim(),password=document.getElementById('cloudPassword').value,mode=e.target.dataset.mode;
      message(mode==='signup'?'Creating free account…':'Signing in…');
      try{if(mode==='signup')await signUp(email,password);else await signIn(email,password);message(lastStatus);if(session){setTimeout(function(){const d=dialog();if(d)d.close()},550)}}catch(err){message(err.message||'Account action failed.')}return
    }
    if(e.target.id==='cloudRecoveryForm'){
      e.preventDefault();try{await updatePassword(document.getElementById('cloudRecoveryPassword').value);const d=dialog();if(d)d.close()}catch(err){message(err.message||'Could not update password.')}
    }
  });
  window.addEventListener('online',function(){if(session)sync()});
  window.addEventListener('focus',function(){if(session&&navigator.onLine)sync()});

  window.LanguageDNACloud={configured:configured,status:status,open:openAccount,sync:sync,signOut:signOut};
  if(configured)ensureClient().then(function(){if(session&&navigator.onLine)sync();emit()}).catch(function(){setStatus('Cloud sync unavailable · local progress is safe')});
})();