(() => {
  'use strict';

  // Cloud sync is optional. No network connection or login occurs when unconfigured.
  const config = window.LANGUAGE_DNA_SUPABASE_CONFIG || {};
  const configured = Boolean(config.url && config.publishableKey);
  const META = 'ldna-cloud-v2-';
  let client = null, session = null, loadingSdk = null, syncTimer = null;
  let syncTask = null, pending = null, recovering = false, suppressTracking = false;
  let lastStatus = configured ? 'Stored on this device · optional cloud backup' : 'Stored on this device';

  function metadata(key, value) {
    const full = META + key;
    if (value === undefined) return localStorage.getItem(full);
    localStorage.setItem(full, String(value));
  }
  function userMeta(uid, key, value) { return metadata('user-' + uid + '-' + key, value); }
  function isLearnerKey(key) { return typeof key === 'string' && key.startsWith('ldna-') && !key.startsWith('ldna-cloud-'); }
  function currentCounter() { return Number(metadata('change-counter')) || 0; }
  function emit() { window.dispatchEvent(new CustomEvent('ldna-cloud-change', {detail: status()})); }
  function setStatus(text) { lastStatus = text; emit(); }
  function status() {
    return {configured, signedIn: Boolean(session && session.user), email: session && session.user && session.user.email || '', message: lastStatus, needsChoice: Boolean(pending)};
  }
  function escapeText(value) {
    return String(value || '').replace(/[&<>"']/g, ch => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[ch]));
  }
  function snapshot() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (isLearnerKey(key)) data[key] = localStorage.getItem(key);
    }
    return {app: 'LanguageDNA', schemaVersion: 1, exportedAt: new Date().toISOString(), data};
  }
  function validSnapshot(s) {
    return s && s.app === 'LanguageDNA' && Number(s.schemaVersion) === 1 &&
      s.data && typeof s.data === 'object' && !Array.isArray(s.data);
  }
  function saveSafetyCopy(label, copy) {
    if (!validSnapshot(copy)) return;
    // Backups are intentionally outside the learner snapshot, preventing account-to-account leakage.
    const key = 'backup-' + Date.now() + '-' + label;
    metadata(key, JSON.stringify(copy));
  }
  function replaceLocal(copy) {
    if (!validSnapshot(copy)) throw new Error('Invalid BluXabi cloud backup.');
    saveSafetyCopy('before-cloud-restore', snapshot());
    suppressTracking = true;
    try {
      const remove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (isLearnerKey(key)) remove.push(key);
      }
      remove.forEach(key => localStorage.removeItem(key));
      Object.keys(copy.data).filter(isLearnerKey).forEach(key => {
        if (typeof copy.data[key] === 'string') localStorage.setItem(key, copy.data[key]);
      });
    } finally { suppressTracking = false; }
  }
  function changedKey(key) {
    if (!configured || suppressTracking || !isLearnerKey(key)) return;
    metadata('change-counter', currentCounter() + 1);
    if (session && session.user && !recovering) scheduleSync();
  }
  if (configured) {
    const oldSet = Storage.prototype.setItem;
    const oldRemove = Storage.prototype.removeItem;
    Storage.prototype.setItem = function(key, value) {
      oldSet.call(this, key, value);
      if (this === localStorage) changedKey(String(key));
    };
    Storage.prototype.removeItem = function(key) {
      oldRemove.call(this, key);
      if (this === localStorage) changedKey(String(key));
    };
  }
  function baseline(uid, row, counter) {
    metadata('owner', uid);
    userMeta(uid, 'revision', Number(row.revision));
    userMeta(uid, 'local-counter', counter);
  }
  function scheduleSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { if (navigator.onLine) sync(); }, 2500);
  }
  function loadSdk() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase);
    if (loadingSdk) return loadingSdk;
    loadingSdk = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.110.8/dist/umd/supabase.js';
      script.async = true;
      script.onload = () => resolve(window.supabase);
      script.onerror = () => reject(new Error('Cloud service could not load.'));
      document.head.appendChild(script);
    });
    return loadingSdk;
  }
  async function ensureClient() {
    if (!configured) return null;
    if (client) return client;
    const sdk = await loadSdk();
    if (!sdk || !sdk.createClient) throw new Error('Cloud service unavailable.');
    client = sdk.createClient(config.url, config.publishableKey, {
      auth: {persistSession: true, autoRefreshToken: true, detectSessionInUrl: true}
    });
    const result = await client.auth.getSession();
    session = result.data && result.data.session || null;
    client.auth.onAuthStateChange((event, next) => {
      const before = session && session.user && session.user.id;
      session = next || null;
      if (event === 'PASSWORD_RECOVERY') { recovering = true; openAccount('recovery'); return; }
      if (event === 'SIGNED_OUT') { pending = null; recovering = false; setStatus('Signed out · progress stays on this device'); return; }
      if (event === 'SIGNED_IN' && session && session.user) {
        if (before !== session.user.id) pending = null;
        setStatus('Signed in · checking saved progress');
        setTimeout(() => { if (!recovering) sync(); }, 0);
      } else emit();
    });
    emit();
    return client;
  }
  async function readRemote(c, uid) {
    const {data, error} = await c.from('learner_progress')
      .select('snapshot,revision,schema_version').eq('user_id', uid).maybeSingle();
    if (error) throw error;
    return data;
  }
  function requestChoice(uid, row, reason) {
    pending = {uid, row, reason};
    setStatus('Choose which progress to keep · nothing has been overwritten');
    openAccount('choice');
    return false;
  }
  async function saveWithRevision(c, uid, row) {
    const snap = snapshot();
    const counter = currentCounter();
    const payload = {schema_version: 1, snapshot: snap, client_updated_at: new Date().toISOString()};
    let result;
    if (row) {
      // CAS: an out-of-date tab/device cannot overwrite a newer cloud revision.
      result = await c.from('learner_progress').update(payload)
        .eq('user_id', uid).eq('revision', Number(row.revision))
        .select('revision').maybeSingle();
    } else {
      result = await c.from('learner_progress').insert({user_id: uid, ...payload})
        .select('revision').maybeSingle();
    }
    if (result.error && result.error.code !== '23505') throw result.error;
    if (result.error || !result.data) return false; // concurrent update/insert detected
    if (!session || session.user.id !== uid) return false;
    baseline(uid, result.data, counter);
    pending = null;
    setStatus('✓ Progress synced safely');
    return true;
  }
  async function syncOnce() {
    if (!configured || !navigator.onLine || recovering) return false;
    const c = await ensureClient();
    if (!session || !session.user) return false;
    const uid = session.user.id;
    if (pending && pending.uid === uid) return false;
    const row = await readRemote(c, uid);
    if (!session || !session.user || session.user.id !== uid) return false;
    const previousRevision = userMeta(uid, 'revision');
    const owner = metadata('owner');
    // A different account on the same device, or an initial sync, always needs a human decision.
    if (owner !== uid || previousRevision === null) {
      return requestChoice(uid, row, owner && owner !== uid ?
        'This device has progress from another account.' :
        'Choose whether to keep this device or cloud progress.');
    }
    if (!row) return requestChoice(uid, row, 'Cloud progress is missing. Nothing will be overwritten automatically.');
    const cloudChanged = String(row.revision) !== previousRevision;
    const localChanged = currentCounter() !== Number(userMeta(uid, 'local-counter'));
    if (cloudChanged && localChanged) return requestChoice(uid, row, 'Both devices changed since the last sync.');
    if (cloudChanged) {
      replaceLocal(row.snapshot);
      baseline(uid, row, currentCounter());
      setStatus('✓ Newer cloud progress restored · local backup kept');
      setTimeout(() => location.reload(), 500);
      return true;
    }
    if (localChanged) {
      const ok = await saveWithRevision(c, uid, row);
      if (!ok) return requestChoice(uid, await readRemote(c, uid), 'Another device updated progress during this sync.');
      return true;
    }
    setStatus('✓ Progress synced safely');
    return true;
  }
  function sync() {
    if (syncTask) return syncTask;
    syncTask = syncOnce().catch(() => {
      setStatus('Sync paused · your progress remains on this device');
      return false;
    }).finally(() => { syncTask = null; });
    return syncTask;
  }
  async function resolveChoice(action) {
    if (!pending || !session || session.user.id !== pending.uid) return;
    const uid = pending.uid;
    if (action === 'later') {
      pending = null;
      await signOut();
      return;
    }
    const c = await ensureClient();
    const fresh = await readRemote(c, uid);
    const expected = pending.row;
    if ((fresh && String(fresh.revision)) !== (expected && String(expected.revision))) {
      requestChoice(uid, fresh, 'Cloud progress changed again. Please choose with the latest version.');
      return;
    }
    if (action === 'cloud') {
      if (!fresh) return;
      replaceLocal(fresh.snapshot);
      baseline(uid, fresh, currentCounter());
      pending = null;
      setStatus('✓ Cloud progress restored · previous device backup kept');
      const d = dialog(); if (d && d.open) d.close();
      setTimeout(() => location.reload(), 500);
      return;
    }
    if (action === 'device') {
      if (fresh && validSnapshot(fresh.snapshot)) saveSafetyCopy('before-cloud-replace', fresh.snapshot);
      const ok = await saveWithRevision(c, uid, fresh);
      if (!ok) { requestChoice(uid, await readRemote(c, uid), 'Cloud progress changed during save. Review again.'); return; }
      renderDialog();
    }
  }

  async function signUp(email, password) {
    const c = await ensureClient();
    if (!c) throw new Error('Cloud sync is not configured.');
    const result = await c.auth.signUp({
      email, password, options: {emailRedirectTo: location.origin + location.pathname}
    });
    if (result.error) throw result.error;
    setStatus(result.data && result.data.session ? 'Signed in · choose how to sync' : 'Check your email to finish creating your free account.');
    return result;
  }
  async function signIn(email, password) {
    const c = await ensureClient();
    const result = await c.auth.signInWithPassword({email, password});
    if (result.error) throw result.error;
    session = result.data.session;
    await sync();
    return result;
  }
  async function resetPassword(email) {
    const c = await ensureClient();
    const result = await c.auth.resetPasswordForEmail(email, {
      redirectTo: location.origin + location.pathname + '?password-recovery=1'
    });
    if (result.error) throw result.error;
    setStatus('Password reset email requested. Check your inbox.');
  }
  async function updatePassword(password) {
    const c = await ensureClient();
    const result = await c.auth.updateUser({password});
    if (result.error) throw result.error;
    recovering = false;
    setStatus('Password updated.');
  }
  async function signOut() {
    const c = await ensureClient();
    clearTimeout(syncTimer);
    if (c) { const result = await c.auth.signOut(); if (result.error) throw result.error; }
    pending = null; session = null; recovering = false;
    setStatus('Signed out · device progress remains here');
  }
  async function deleteAccount(password) {
    const c = await ensureClient();
    if (!session || !session.user) throw new Error('Sign in first.');
    const result = await c.functions.invoke('delete-account', {body: {confirm: 'DELETE', password}});
    if (result.error) throw result.error;
    if (!result.data || !result.data.deleted) throw new Error('Account deletion could not be verified.');
    await c.auth.signOut({scope: 'local'});
    session = null; pending = null;
    setStatus('Cloud account deleted. Device progress remains on this device.');
  }
  function dialog() { return document.getElementById('accountDialog'); }
  function renderDialog(mode) {
    const root = document.getElementById('accountDialogContent');
    if (!root) return;
    const st = status();
    if (mode === 'recovery' || recovering) {
      root.innerHTML = '<div class="account-dialog-head"><h2>Choose a new password</h2><p>Enter at least 8 characters.</p></div><form id="cloudRecoveryForm" class="account-form"><label>New password<input type="password" id="cloudRecoveryPassword" minlength="8" autocomplete="new-password" required></label><button class="primary-btn" type="submit">Update password</button></form><p class="account-message" id="cloudAccountMessage" role="status"></p>';
      return;
    }
    if (mode === 'delete' && st.signedIn) {
      root.innerHTML = '<div class="account-dialog-head"><h2>Delete cloud account?</h2><p>This permanently deletes your cloud profile and progress. Your current device progress remains here. You can download a backup from My Spanish first.</p></div><form class="account-form" id="cloudDeleteForm"><label>Confirm by typing DELETE<input id="cloudDeleteConfirm" required autocomplete="off" spellcheck="false"></label><label>Your account password<input id="cloudDeletePassword" type="password" required autocomplete="current-password"></label><button class="primary-btn" type="submit">Permanently delete account</button><button class="secondary-btn" type="button" data-cloud-cancel-delete>Cancel</button></form><p id="cloudAccountMessage" class="account-message" role="status"></p>';
      return;
    }
    if (st.signedIn && pending) {
      const hasCloud = Boolean(pending.row);
      root.innerHTML = '<div class="account-dialog-head"><span class="eyebrow">PROGRESS SAFETY</span><h2>Choose your progress</h2><p>' + escapeText(pending.reason) + ' Nothing has been replaced.</p></div><div class="account-status-card"><strong>Both copies stay backed up when you choose.</strong><small>Use this device to save its current progress online. Choose cloud to restore the online copy here.</small></div><div class="account-actions"><button class="primary-btn" type="button" data-cloud-choose="device">Use this device</button>' +
        (hasCloud ? '<button class="secondary-btn" type="button" data-cloud-choose="cloud">Use cloud progress</button>' : '') +
        '<button class="text-btn" type="button" data-cloud-choose="later">Not now · keep learning offline</button></div><p class="account-message" id="cloudAccountMessage" role="status"></p>';
      return;
    }
    if (st.signedIn) {
      root.innerHTML = '<div class="account-dialog-head"><span class="eyebrow">OPTIONAL CLOUD SYNC</span><h2>Your learning, your choice</h2><p>' + escapeText(st.email) + '</p></div><div class="account-status-card"><strong>' + escapeText(st.message) + '</strong><small>Learning works without an account. Progress syncs when online.</small></div><div class="account-actions"><button class="primary-btn" type="button" data-cloud-sync>Sync now</button><button class="secondary-btn" type="button" data-cloud-signout>Sign out</button><button class="text-btn danger" type="button" data-cloud-delete>Delete cloud account</button></div>';
      return;
    }
    root.innerHTML = '<div class="account-dialog-head"><span class="eyebrow">FREE OPTIONAL ACCOUNT</span><h2>Back up progress across devices</h2><p>You can learn for free without signing in.</p></div><div class="account-tabs"><button type="button" class="' + (mode === 'signup' ? '' : 'active') + '" data-cloud-mode="signin">Sign in</button><button type="button" class="' + (mode === 'signup' ? 'active' : '') + '" data-cloud-mode="signup">Create free account</button></div><form id="cloudAuthForm" class="account-form" data-mode="' + (mode === 'signup' ? 'signup' : 'signin') + '"><label>Email<input id="cloudEmail" type="email" autocomplete="email" required></label><label>Password<input id="cloudPassword" type="password" minlength="8" autocomplete="' + (mode === 'signup' ? 'new-password' : 'current-password') + '" required></label><button class="primary-btn" type="submit">' + (mode === 'signup' ? 'Create free account' : 'Sign in') + '</button></form><button class="text-btn" type="button" data-cloud-reset>Forgot password?</button><p class="account-message" id="cloudAccountMessage" role="status"></p>';
  }
  function openAccount(mode) {
    if (!configured) return;
    renderDialog(mode);
    const d = dialog();
    if (d && !d.open) d.showModal();
  }
  function message(value) {
    const el = document.getElementById('cloudAccountMessage');
    if (el) el.textContent = value;
  }
  document.addEventListener('click', async e => {
    if (e.target.closest('[data-cloud-open]')) { openAccount(); return; }
    const mode = e.target.closest('[data-cloud-mode]');
    if (mode) { renderDialog(mode.dataset.cloudMode); return; }
    const choice = e.target.closest('[data-cloud-choose]');
    if (choice) {
      try { await resolveChoice(choice.dataset.cloudChoose); }
      catch (_) { message('Could not apply choice. Device progress is unchanged.'); }
      return;
    }
    if (e.target.closest('[data-cloud-sync]')) { await sync(); renderDialog(); return; }
    if (e.target.closest('[data-cloud-signout]')) {
      try { await signOut(); const d = dialog(); if (d) d.close(); }
      catch (_) { message('Sign-out failed. Please try again.'); }
      return;
    }
    if (e.target.closest('[data-cloud-delete]')) { renderDialog('delete'); return; }
    if (e.target.closest('[data-cloud-cancel-delete]')) { renderDialog(); return; }
    if (e.target.closest('[data-cloud-reset]')) {
      const email = document.getElementById('cloudEmail');
      if (!email || !email.value) { message('Enter your email first.'); return; }
      try { await resetPassword(email.value); message('Password reset requested. Check your inbox.'); }
      catch (_) { message('Could not request reset. Check your email and try again.'); }
      return;
    }
    if (e.target.closest('[data-account-close]')) { const d = dialog(); if (d) d.close(); }
  });
  document.addEventListener('submit', async e => {
    if (e.target.id === 'cloudAuthForm') {
      e.preventDefault();
      const email = document.getElementById('cloudEmail').value.trim();
      const password = document.getElementById('cloudPassword').value;
      const mode = e.target.dataset.mode;
      message(mode === 'signup' ? 'Creating account…' : 'Signing in…');
      try {
        if (mode === 'signup') await signUp(email, password);
        else await signIn(email, password);
        if (pending) renderDialog('choice');
        else message(lastStatus);
      } catch (err) { message(err.message || 'Could not sign in.'); }
      return;
    }
    if (e.target.id === 'cloudRecoveryForm') {
      e.preventDefault();
      try { await updatePassword(document.getElementById('cloudRecoveryPassword').value); renderDialog(); }
      catch (_) { message('Could not update password. Please try again.'); }
      return;
    }
    if (e.target.id === 'cloudDeleteForm') {
      e.preventDefault();
      if (document.getElementById('cloudDeleteConfirm').value !== 'DELETE') {
        message('Type DELETE exactly to confirm.'); return;
      }
      try {
        await deleteAccount(document.getElementById('cloudDeletePassword').value);
        const d = dialog(); if (d) d.close();
      } catch (_) { message('Deletion could not be completed. The account remains available.'); }
    }
  });
  window.addEventListener('online', () => { if (session) sync(); });
  window.addEventListener('focus', () => { if (session && navigator.onLine) sync(); });
  window.LanguageDNACloud = {configured, status, open: openAccount, sync, signOut};
  if (configured) ensureClient().then(() => { if (session && navigator.onLine) sync(); }).catch(() => setStatus('Cloud unavailable · progress remains on device'));
})();