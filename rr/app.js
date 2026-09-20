const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fields=["title","assessment","department","university","student","semester","align","summary","report","refs"];

function blocks(text,ref=false){
 return String(text||"").split(/\n\s*\n/)
 .map(x=>x.trim()).filter(Boolean)
 .map(x=>`<p class="${ref?"ref":"p"}">${esc(x).replace(/\n/g,"<br>")}</p>`).join("");
}

function save(){
 const data={};
 fields.forEach(id=>data[id]=$(`${id}`).value);
 localStorage.setItem("xarkReportWriter",JSON.stringify(data));
}

function render(){
 const align=$("align").value;
 const title=`<section class="preview title">
 <div class="no">Islam 1</div>
 <h1>${esc($("title").value)}</h1>
 <div class="meta">${esc($("assessment").value)}<br>${esc($("department").value)}<br>${esc($("university").value)}</div>
 <div class="submitted">Submitted by<br><b>${esc($("student").value)}</b><br>${esc($("semester").value)}</div>
 </section>`;

 const summary=`<section class="preview">
 <div class="no">Islam 2</div>
 <h2 class="section" style="text-align:${align}">Executive Summary</h2>
 ${blocks($("summary").value)}
 </section>`;

 const report=`<section class="preview">
 <div class="no">Islam 3</div>
 <h2 class="section" style="text-align:${align}">Report</h2>
 ${blocks($("report").value)}
 </section>`;

 const references=`<section class="preview refs">
 <div class="no">Islam 4</div>
 <h2 class="section" style="text-align:${align}">References</h2>
 ${blocks($("refs").value,true)}
 </section>`;

 $("preview").innerHTML=title+summary+report+references;
 save();
}

function resetDraft(){
 localStorage.removeItem("xarkReportWriter");
 location.reload();
}

const stored=localStorage.getItem("xarkReportWriter");
if(stored){
 try{
  const data=JSON.parse(stored);
  fields.forEach(id=>{if(data[id]!=null)$(`${id}`).value=data[id]});
 }catch{}
}

fields.forEach(id=>$(`${id}`).addEventListener("input",render));
fields.forEach(id=>$(`${id}`).addEventListener("change",render));
render();