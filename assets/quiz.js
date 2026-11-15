// محرك الامتحان: يقرأ window.QUIZ من ملف questions.js الخاص بكل امتحان
(function(){
const Q = window.QUIZ.questions;
document.title = window.QUIZ.title;
document.getElementById("qtitle").textContent = window.QUIZ.title;
document.getElementById("qsub").textContent = window.QUIZ.subtitle || "";
const $ = id => document.getElementById(id);
let i=0, score=0, answers=[], order=[], person="";
$("qcount").textContent = Q.length;

function shuffle(a){a=a.slice();for(let k=a.length-1;k>0;k--){const j=Math.floor(Math.random()*(k+1));[a[k],a[j]]=[a[j],a[k]]}return a}

$("name").addEventListener("input",e=>{$("go").disabled = !e.target.value.trim()});
$("name").addEventListener("keydown",e=>{if(e.key==="Enter" && e.target.value.trim()) start()});
$("go").onclick = start;

function start(){
  person = $("name").value.trim();
  i=0; score=0; answers=[];
  $("start").classList.add("hidden"); $("result").classList.add("hidden");
  $("quiz").classList.remove("hidden");
  show();
}

function show(){
  const q = Q[i];
  $("pos").textContent = `السؤال ${i+1} من ${Q.length}`;
  $("live").textContent = `الصحيح: ${score}`;
  $("barfill").style.width = (i/Q.length*100)+"%";
  $("tag").textContent = q.t;
  $("qtext").innerHTML = q.q.replace(/﴿([^﴾]*)﴾/g,'<span class="ayah">﴿$1﴾</span>');
  $("fb").className="fb hidden"; $("next").classList.add("hidden");
  $("hint").classList.add("hidden");
  $("hintbtn").classList.toggle("hidden", !q.h);
  if(q.h) $("hint").textContent = q.h;
  order = shuffle(q.o.map((txt,idx)=>({txt,idx})));
  const box=$("opts"); box.innerHTML="";
  order.forEach(o=>{
    const b=document.createElement("button");
    b.className="opt"+(q.plain?" plain":""); b.textContent=o.txt;
    b.onclick=()=>pick(o,b);
    box.appendChild(b);
  });
  window.scrollTo({top:0,behavior:"smooth"});
}
$("hintbtn").onclick=()=>{$("hint").classList.remove("hidden");$("hintbtn").classList.add("hidden")};

function pick(o,btn){
  const q=Q[i], ok=o.idx===0;
  [...$("opts").children].forEach((b,k)=>{b.disabled=true; if(order[k].idx===0) b.classList.add("ok")});
  if(!ok) btn.classList.add("bad");
  if(ok) score++;
  answers.push({q:q.q,ok,you:o.txt,right:q.o[0],t:q.t});
  const fb=$("fb");
  fb.className="fb "+(ok?"ok":"bad");
  fb.innerHTML=`<b>${ok?"إجابة صحيحة":"إجابة خاطئة"}</b>${q.e}`;
  $("live").textContent = `الصحيح: ${score}`;
  $("hintbtn").classList.add("hidden");
  const nx=$("next"); nx.textContent = i===Q.length-1?"عرض النتيجة":"السؤال التالي"; nx.classList.remove("hidden");
}
$("next").onclick=()=>{ i++; if(i<Q.length) show(); else finish(); };

function grade(p){ if(p>=90) return "ضبط ممتاز"; if(p>=75) return "ضبط جيد جداً"; if(p>=60) return "جيد، محتاج مراجعة المتشابهات"; return "محتاج مراجعة الجزء من تاني"; }

function finish(){
  $("quiz").classList.add("hidden"); $("result").classList.remove("hidden");
  const pct=Math.round(score/Q.length*100);
  $("rname").textContent = person;
  $("rscore").textContent = `${score} / ${Q.length}`;
  $("rgrade").textContent = `${grade(pct)} (${pct}٪)`;
  const cats={};
  answers.forEach(a=>{cats[a.t]=cats[a.t]||[0,0];cats[a.t][1]++;if(a.ok)cats[a.t][0]++});
  $("rsplit").innerHTML = Object.entries(cats).map(([k,[c,n]])=>`<span>${k}: <b>${c}/${n}</b></span>`).join("");
  const wrong=answers.filter(a=>!a.ok);
  const rv=$("review");
  if(!wrong.length){ rv.innerHTML='<h3>ما شاء الله، مفيش ولا غلطة!</h3>'; }
  else{
    rv.innerHTML='<h3>الأسئلة اللي محتاج تراجعها</h3>'+wrong.map(a=>`
      <div class="rv"><div class="rq">${a.q}</div>
      <div class="ra you">إجابتك: ${a.you}</div>
      <div class="ra right">الصحيح: ${a.right}</div></div>`).join("");
  }
  $("summary").value =
`نتيجة ${window.QUIZ.title}
الاسم: ${person}
الدرجة: ${score} من ${Q.length} (${pct}٪) — ${grade(pct)}
${Object.entries(cats).map(([k,[c,n]])=>`${k}: ${c}/${n}`).join(" | ")}`+
(wrong.length?`\n\nالأخطاء:\n`+wrong.map((a,k)=>`${k+1}. ${a.q}\n   الصحيح: ${a.right}`).join("\n"):"");
  $("barfill").style.width="100%";
  window.scrollTo({top:0,behavior:"smooth"});
}

$("copy").onclick=async()=>{
  const t=$("summary").value, msg=$("copied");
  try{ await navigator.clipboard.writeText(t); msg.textContent="تم نسخ النتيجة، ابعتها في أي رسالة."; }
  catch(e){ $("summary").classList.remove("hidden"); $("summary").select(); msg.textContent="انسخ النتيجة من المربع اللي فوق."; }
  msg.classList.remove("hidden");
};
$("again").onclick=()=>{ $("result").classList.add("hidden"); $("start").classList.remove("hidden"); $("name").focus(); };

})();
