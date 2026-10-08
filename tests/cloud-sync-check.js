// No-dependency integration checks for optional cloud sync.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class FakeStorage {
  constructor(seed = {}) { this.items = new Map(Object.entries(seed)); }
  get length() { return this.items.size; }
  key(i) { return [...this.items.keys()][i] || null; }
  getItem(k) { return this.items.has(String(k)) ? this.items.get(String(k)) : null; }
  setItem(k, v) { this.items.set(String(k), String(v)); }
  removeItem(k) { this.items.delete(String(k)); }
}
const makeSnapshot = progress => ({app:'LanguageDNA',schemaVersion:1,exportedAt:'2026-10-08T00:00:00Z',data:{'ldna-progress':progress}});
function makeHarness(configured) {
  const localStorage = new FakeStorage({'ldna-progress':'my-device'});
  const rows = {
    u1:{revision:1,schema_version:1,snapshot:makeSnapshot('cloud-u1')},
    u2:{revision:8,schema_version:1,snapshot:makeSnapshot('cloud-u2')}
  };
  let authListener, dbWrites = 0, sdkLoads = 0;
  let activeSession = {user:{id:'u1',email:'user1@example.test'}};
  const client = {
    auth:{
      async getSession(){return {data:{session:activeSession},error:null}},
      onAuthStateChange(fn){authListener=fn;return {data:{subscription:{unsubscribe(){}}}}},
      async signInWithPassword(){return {data:{session:activeSession},error:null}},
      async signOut(){activeSession=null;authListener && authListener('SIGNED_OUT',null);return {error:null}},
      async updateUser(){return {error:null}},
      async resetPasswordForEmail(){return {error:null}},
      async signUp(){return {data:{session:null},error:null}}
    },
    functions:{async invoke(){return {data:{deleted:true},error:null}}},
    from(table) {
      assert.equal(table, 'learner_progress');
      let op='read',payload={},filters={};
      const query={
        select(){return query},
        eq(k,v){filters[k]=v;return query},
        update(v){op='update';payload=v;return query},
        insert(v){op='insert';payload=v;return query},
        async maybeSingle(){
          const existing=rows[filters.user_id || payload.user_id];
          if(op==='read')return {data:existing?structuredClone(existing):null,error:null};
          if(op==='update'){
            if(!existing || existing.revision!==filters.revision)return {data:null,error:null};
            Object.assign(existing,payload);
            existing.revision++;
            dbWrites++;
            return {data:{revision:existing.revision},error:null};
          }
          if(existing)return {data:null,error:{code:'23505'}};
          rows[payload.user_id]={...payload,revision:1};
          dbWrites++;
          return {data:{revision:1},error:null};
        }
      };
      return query;
    }
  };
  const dialog={open:false,showModal(){this.open=true},close(){this.open=false}};
  const root={innerHTML:''};
  const listeners = {};
  const document = {
    addEventListener(name,fn){listeners[name]=fn},
    getElementById(name){return name==='accountDialog'?dialog:name==='accountDialogContent'?root:null},
    createElement(){return {set src(v){this._src=v},set async(v){this._async=v}} },
    head:{appendChild(){throw Error('SDK should already be supplied in harness')}}
  };
  const window = {
    LANGUAGE_DNA_SUPABASE_CONFIG:configured?{url:'https://example.supabase.co',publishableKey:'sb_publishable_example'}:{},
    supabase:{createClient(){sdkLoads++;return client}},
    dispatchEvent(){},addEventListener(){}
  };
  const location={origin:'https://example.com',pathname:'/index.html',reload(){}};
  const context={window,document,localStorage,Storage:FakeStorage,navigator:{onLine:true},
    location,CustomEvent:class{constructor(name,options){this.type=name;this.detail=options.detail}},
    setTimeout,clearTimeout,Date,JSON,Promise,console};
  vm.runInNewContext(fs.readFileSync('cloud-sync.js','utf8'), context, {filename:'cloud-sync.js'});
  async function click(selector,value) {
    assert(listeners.click,'click handler registered');
    const node={dataset:{cloudChoose:value}};
    await listeners.click({target:{closest(name){return name===selector?node:null}}});
  }
  return {localStorage,rows,client,window,root,dialog,click,
    emit(event,next){activeSession=next;authListener(event,next)},
    writes(){return dbWrites},sdkLoads(){return sdkLoads}};
}
const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
async function run(){
  {
    const noCloud=makeHarness(false);
    assert.equal(noCloud.window.LanguageDNACloud.status().configured,false);
    assert.equal(noCloud.sdkLoads(),0);
    assert.equal(noCloud.localStorage.getItem('ldna-progress'),'my-device');
  }
  const h=makeHarness(true);
  await delay(35);
  assert.equal(h.window.LanguageDNACloud.status().needsChoice,true, 'first sign-in must request progress decision');
  assert.equal(h.localStorage.getItem('ldna-progress'),'my-device', 'first sign-in must not discard local state');
  assert.equal(h.rows.u1.revision,1, 'first sign-in must not overwrite cloud state');
  await h.click('[data-cloud-choose]','cloud');
  assert.equal(h.localStorage.getItem('ldna-progress'),'cloud-u1');
  assert.equal(h.window.LanguageDNACloud.status().needsChoice,false);
  const backupKeys=[...h.localStorage.items.keys()].filter(x=>x.startsWith('ldna-cloud-v2-backup-'));
  assert(backupKeys.length>=1, 'restore keeps a local backup');
  h.localStorage.setItem('ldna-progress','edited-on-device');
  assert.equal(await h.window.LanguageDNACloud.sync(),true);
  assert.equal(h.rows.u1.revision,2);
  assert.equal(h.rows.u1.snapshot.data['ldna-progress'],'edited-on-device');
  // Both copies changed: never select a winner without an explicit choice.
  h.rows.u1.revision=3;
  h.rows.u1.snapshot=makeSnapshot('remote-device');
  h.localStorage.setItem('ldna-progress','new-unsynced-work');
  await h.window.LanguageDNACloud.sync();
  assert.equal(h.window.LanguageDNACloud.status().needsChoice,true);
  assert.equal(h.rows.u1.snapshot.data['ldna-progress'],'remote-device');
  assert.equal(h.localStorage.getItem('ldna-progress'),'new-unsynced-work');
  await h.click('[data-cloud-choose]','device');
  assert.equal(h.rows.u1.revision,4);
  assert.equal(h.rows.u1.snapshot.data['ldna-progress'],'new-unsynced-work');
  // Signing into another account on the same browser must never push another person's progress.
  const before=h.writes();
  h.emit('SIGNED_IN',{user:{id:'u2',email:'user2@example.test'}});
  await delay(35);
  assert.equal(h.window.LanguageDNACloud.status().needsChoice,true);
  assert.equal(h.localStorage.getItem('ldna-progress'),'new-unsynced-work');
  assert.equal(h.rows.u2.snapshot.data['ldna-progress'],'cloud-u2');
  assert.equal(h.writes(),before,'account switching should not write data');
  await h.click('[data-cloud-choose]','later');
  assert.equal(h.window.LanguageDNACloud.status().signedIn,false);
  assert.equal(h.localStorage.getItem('ldna-progress'),'new-unsynced-work');
  console.log('Cloud sync safety tests passed: optional-off, first sign-in, backups, CAS update, dual-edit conflict, account switch, sign-out.');
}
run().catch(err=>{console.error(err);process.exitCode=1});
