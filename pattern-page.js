(() => {
'use strict';
const PAGE_SIZE=50;
const params=new URLSearchParams(location.search);
const id=params.get('id')||'tion-cion';
const db=window.LANGUAGE_DNA_PATTERN_DICTIONARIES||{};
const pattern=db[id]||db['tion-cion'];
const els={title:document.getElementById('patternTitle'),explanation:document.getElementById('patternExplanation'),count:document.getElementById('patternCount'),search:document.getElementById('wordSearch'),alphabet:document.getElementById('alphabet'),summary:document.getElementById('resultSummary'),rows:document.getElementById('wordRows'),pagination:document.getElementById('pagination'),clear:document.getElementById('clearFilters'),toast:document.getElementById('toast')};
let letter=(params.get('letter')||'ALL').toUpperCase();
let page=Math.max(1,Number(params.get('page'))||1);
let query=(params.get('q')||'').trim();

function normalize(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function toast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>els.toast.classList.remove('show'),1600)}
function availableLetters(){return new Set(pattern.words.map(pair=>pair[0].charAt(0).toUpperCase()))}
function filtered(){const q=normalize(query);return pattern.words.filter(pair=>{const english=pair[0],spanish=pair[1];return(letter==='ALL'||english.charAt(0).toUpperCase()===letter)&&(!q||normalize(english).includes(q)||normalize(spanish).includes(q))})}
function syncUrl(replace){const p=new URLSearchParams();p.set('id',pattern.id);if(letter!=='ALL')p.set('letter',letter);if(page>1)p.set('page',String(page));if(query)p.set('q',query);history[replace?'replaceState':'pushState']({},'','pattern.html?'+p.toString())}
function renderAlphabet(){const letters=availableLetters();const buttons=['ALL',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];els.alphabet.innerHTML=buttons.map(l=>{const disabled=l!=='ALL'&&!letters.has(l);return'<button type="button" class="letter-button '+(l==='ALL'?'all ':'')+(letter===l?'active':'')+'" data-letter="'+l+'" '+(disabled?'disabled':'')+'>'+(l==='ALL'?'All':l)+'</button>'}).join('')}
function pageButtons(totalPages){if(totalPages<=1)return'';const out=[];out.push('<button type="button" class="page-button nav" data-page="'+Math.max(1,page-1)+'" '+(page===1?'disabled':'')+'>← Previous</button>');let start=Math.max(1,page-2),end=Math.min(totalPages,start+4);start=Math.max(1,end-4);for(let n=start;n<=end;n++)out.push('<button type="button" class="page-button '+(n===page?'active':'')+'" data-page="'+n+'">'+n+'</button>');out.push('<button type="button" class="page-button nav" data-page="'+Math.min(totalPages,page+1)+'" '+(page===totalPages?'disabled':'')+'>Next →</button>');return out.join('')}
function render(){const all=filtered();const totalPages=Math.max(1,Math.ceil(all.length/PAGE_SIZE));if(page>totalPages)page=totalPages;const start=(page-1)*PAGE_SIZE;const current=all.slice(start,start+PAGE_SIZE);els.rows.innerHTML=current.length?current.map(pair=>'<tr><td>'+escapeHtml(pair[0])+'</td><td>'+escapeHtml(pair[1])+'</td><td><button type="button" class="listen-button" data-listen="'+escapeHtml(pair[1])+'">🔊 Listen</button></td></tr>').join(''):'<tr class="empty-row"><td colspan="3">No words found. Try another search or letter.</td></tr>';const shownStart=all.length?start+1:0;const shownEnd=Math.min(start+PAGE_SIZE,all.length);els.summary.textContent=all.length?(shownStart+'–'+shownEnd+' of '+all.length+' words'):'0 words';els.pagination.innerHTML=pageButtons(totalPages);renderAlphabet()}
function speak(word,button){if(!('speechSynthesis'in window)){toast('Audio is not supported in this browser.');return}window.speechSynthesis.cancel();document.querySelectorAll('.listen-button.playing').forEach(b=>b.classList.remove('playing'));const u=new SpeechSynthesisUtterance(word);u.lang=pattern.listenLanguage||'es-ES';u.rate=.82;const voices=window.speechSynthesis.getVoices();const voice=voices.find(v=>/^es(-|_)/i.test(v.lang));if(voice)u.voice=voice;if(button)button.classList.add('playing');u.onend=()=>{if(button)button.classList.remove('playing')};u.onerror=()=>{if(button)button.classList.remove('playing')};window.speechSynthesis.speak(u)}

els.title.textContent=pattern.title;
els.explanation.textContent=pattern.explanation;
els.count.textContent=pattern.words.length+' English ↔ Spanish word pairs';
document.title=pattern.title+' — LanguageDNA Pattern Dictionary';
els.search.value=query;
els.search.addEventListener('input',()=>{query=els.search.value.trim();letter='ALL';page=1;syncUrl(true);render()});
els.alphabet.addEventListener('click',e=>{const b=e.target.closest('[data-letter]');if(!b||b.disabled)return;letter=b.dataset.letter;query='';els.search.value='';page=1;syncUrl(false);render();document.querySelector('.dictionary-table-wrap').scrollIntoView({behavior:'smooth',block:'start'})});
els.pagination.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b||b.disabled)return;page=Math.max(1,Number(b.dataset.page)||1);syncUrl(false);render();document.querySelector('.dictionary-table-wrap').scrollIntoView({behavior:'smooth',block:'start'})});
els.rows.addEventListener('click',e=>{const b=e.target.closest('[data-listen]');if(b)speak(b.dataset.listen,b)});
els.clear.addEventListener('click',()=>{query='';letter='ALL';page=1;els.search.value='';syncUrl(false);render()});
window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);letter=(p.get('letter')||'ALL').toUpperCase();page=Math.max(1,Number(p.get('page'))||1);query=(p.get('q')||'').trim();els.search.value=query;render()});
renderAlphabet();render();
})();