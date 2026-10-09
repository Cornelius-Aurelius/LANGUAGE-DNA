(() => {
  'use strict';
  // Everything here is computed from progress already stored on this device.
  // No accounts, streak penalties, external analytics or additional personal data.
  const safeParse = (raw, fallback) => { try { return JSON.parse(raw) } catch (_) { return fallback } };
  function progress() {
    const all=safeParse(localStorage.getItem('ldna-daily5-v1') || '{}',{});
    const records=all&&typeof all==='object'&&!Array.isArray(all)?all:{};
    const days=Object.keys(records).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&records[k]&&records[k].completedAt).sort();
    const today=new Date(), key=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
    const record=records[key]||{};
    return {days:days.length, todayDone:Boolean(record.completedAt), todaySteps:Array.isArray(record.done)?record.done.length:0, started:Boolean(record.startedAt)};
  }
  const rewards=[
    {count:1,symbol:'🌱',label:'First five',note:'Finish your first Daily 5'},
    {count:3,symbol:'✨',label:'Finding your flow',note:'Learn on three days'},
    {count:7,symbol:'🧬',label:'Pattern explorer',note:'Learn on seven days'},
    {count:14,symbol:'🌟',label:'Growing stronger',note:'Learn on fourteen days'}
  ];
  function render(){
    const p=progress(), home=document.getElementById('homeLearningJourney'), list=document.getElementById('journeyMilestones'), status=document.getElementById('journeyWinsStatus');
    const start=document.getElementById('startBeginner');
    if(start)start.textContent=p.todayDone?'Revisit today’s lesson →':p.started?'Continue your lesson →':p.days?'Start today’s lesson →':'Start your first lesson →';
    if(home){
      const show=p.started||p.days>0;
      home.hidden=!show;
      if(show){
        const next=p.todayDone?'Discover one more useful connection, or stop for today.':'Your five-minute lesson is ready whenever you are.';
        home.innerHTML='<div class="home-journey-copy"><span class="home-journey-star" aria-hidden="true">✦</span><div><strong>'+(p.todayDone?'Five small wins today!':p.todaySteps+' / 5 small wins')+'</strong><small>'+next+'</small></div></div>'+
          '<button type="button" class="secondary-btn" data-view="'+(p.todayDone?'library':'tutor')+'" '+(p.todayDone?'':'data-tutor-open="daily"')+'>'+(p.todayDone?'Explore patterns':'Continue Daily 5')+' →</button>';
      }
    }
    if(list){
      list.innerHTML=rewards.map(r=>'<article class="journey-milestone '+(p.days>=r.count?'earned':'upcoming')+'" aria-label="'+r.label+(p.days>=r.count?', achieved':', locked')+'"><span class="journey-milestone-icon" aria-hidden="true">'+(p.days>=r.count?r.symbol:'◇')+'</span><div><strong>'+r.label+'</strong><small>'+(p.days>=r.count?'✓ Earned':r.note)+'</small></div></article>').join('');
    }
    if(status)status.textContent=p.days===0?'Finish a Daily 5 to collect your first milestone.':p.days+' learning '+(p.days===1?'day':'days')+' completed. Days do not need to be consecutive.';
    return p;
  }
  window.LanguageDNAJourney={refresh:render, progress};
  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('storage', render);
  render();
})();