
const $ = (id) => document.getElementById(id);

const state = {
  datasets: [],
  current: null,
  raw: [],
  filtered: [],
  columns: ["Date", "Match", "Markets", "Odds"]
};

function buildTabs(){
  const tabs = $("tabs");
  tabs.innerHTML = "";
  state.datasets.forEach(d=>{
    const b = document.createElement("button");
    b.className = "tab";
    b.textContent = d.name;
    b.onclick = ()=>loadDataset(d.slug);
    tabs.appendChild(b);
  });
}

function buildHead(){
  const thead = $("tbl").querySelector("thead");
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
    const div=document.createElement("div");
    div.className="cardItem";
    div.innerHTML=`
      <div class="cardTitle">${r.Match}</div>
      <div class="cardSub">${r.Date}</div>
      <div class="cardGrid">
        <div><div class="k">Market</div><div class="v">${r.Markets}</div></div>
        <div><div class="k">Odds</div><div class="v">${r.Odds}</div></div>
      </div>
    `;
    list.appendChild(div);
  });
}

async function loadDataset(slug){
  const ds=state.datasets.find(d=>d.slug===slug);
  const res=await fetch(ds.file,{cache:"no-store"});
  const json=await res.json();
  state.raw=json.rows;
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
  loadDataset(state.datasets[0].slug);
}

init();
