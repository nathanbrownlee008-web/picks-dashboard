
const $ = (id)=>document.getElementById(id);

const state={
  datasets:[],
  raw:[],
  columns:["Date","Match","Markets","Odds"],
  active:null
};

function buildTabs(){
  const tabs=$("tabs");
  tabs.innerHTML="";
  state.datasets.forEach(d=>{
    const btn=document.createElement("button");
    btn.className="tab";
    btn.textContent=d.name;
    btn.onclick=()=>loadDataset(d.slug);
    btn.id="tab-"+d.slug;
    tabs.appendChild(btn);
  });
}

function setActiveTab(slug){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  const el=document.getElementById("tab-"+slug);
  if(el) el.classList.add("active");
}

function buildHead(){
  const thead=$("tbl").querySelector("thead");
  thead.innerHTML="";
  const tr=document.createElement("tr");
  state.columns.forEach(c=>{
    const th=document.createElement("th");
    th.textContent=c;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
}

function buildBody(){
  const tbody=$("tbl").querySelector("tbody");
  tbody.innerHTML="";
  state.raw.forEach(r=>{
    const tr=document.createElement("tr");
    state.columns.forEach(k=>{
      const td=document.createElement("td");
      td.textContent=r[k]||"";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function buildCards(){
  const list=$("cardList");
  list.innerHTML="";
  state.raw.forEach(r=>{
    const card=document.createElement("div");
    card.className="cardItem";
    card.innerHTML=`
      <div class="cardTitle">${r.Match}</div>
      <div class="cardSub">${r.Date}</div>
      <div class="cardGrid">
        <div><div class="k">Market</div><div class="v">${r.Markets}</div></div>
        <div><div class="k">Odds</div><div class="v">${r.Odds}</div></div>
      </div>`;
    list.appendChild(card);
  });
}

async function loadDataset(slug){
  const ds=state.datasets.find(d=>d.slug===slug);
  if(!ds) return;

  const res=await fetch(ds.file,{cache:"no-store"});
  const json=await res.json();

  state.raw=json.rows||[];
  state.active=slug;

  setActiveTab(slug);
  render();
}

function render(){
  buildHead();
  buildBody();
  buildCards();
}

async function init(){
  const res=await fetch("datasets.json");
  state.datasets=await res.json();

  buildTabs();

  // AUTO LOAD FIRST TAB (FIX)
  if(state.datasets.length){
    loadDataset(state.datasets[0].slug);
  }
}

init();
