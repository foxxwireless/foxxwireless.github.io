// Supabase-powered Foxx Wireless Manager with CSV import/export
const { createClient } = supabase;
const db = createClient(
  "https://cqhdgoysdpzlznikwpbu.supabase.co",
  "sb_publishable_ELqf182fNZkNVjyTLwPupg_2r4-ZpPQ"
);

const state = { rows: [], sort: {key:"name", dir:"asc"}, filter:"" };

// Helpers
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
function uid(){ return Math.random().toString(36).slice(2,9); }
function escape(s){ return (s??"").toString().replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function loadLocations(){
  const { data, error } = await db.from("locations").select("*");
  if(error){ console.error(error); return; }
  state.rows = data; render();
}
async function saveLocation(loc){
  if(loc.id){
    const { error } = await db.from("locations").update(loc).eq("id", loc.id);
    if(error) console.error(error);
  }else{
    loc.id = uid();
    const { error } = await db.from("locations").insert([loc]);
    if(error) console.error(error);
  }
  await loadLocations();
}
async function deleteLocation(id){
  const { error } = await db.from("locations").delete().eq("id", id);
  if(error) console.error(error);
  await loadLocations();
}

// CSV helpers
function asCSV(rows){
  const headers = ["id","name","type","address","city","state","contact","phone_number","email","permission","last_setup_date","times","notes"];
  const lines = [headers.join(",")];
  for(const r of rows){
    const vals = headers.map(h => `"${(r[h]??"").toString().replace(/"/g,'""')}"`);
    lines.push(vals.join(","));
  }
  return lines.join("\\n");
}
function parseCSV(text){
  const rows=[];
  const lines=text.replace(/\\r/g,"").split("\\n").filter(Boolean);
  const headers=lines.shift().split(",").map(h=>h.replace(/^"|"$/g,""));
  for(const line of lines){
    const cells=[]; 
    line.replace(/(?:^|,)("(?:[^"]|"")*"|[^,\\n]*)(?=,|\\n|$)/g,(m,g1)=>{
      let v=g1;
      if(v.startsWith('"')&&v.endsWith('"')) v=v.slice(1,-1).replace(/""/g,'"');
      cells.push(v);
    });
    const obj={}; headers.forEach((h,i)=>obj[h]=cells[i]||"");
    rows.push(obj);
  }
  return rows;
}

// Render table
function render(){
  const tbody = $("#tbody");
  tbody.innerHTML = "";
  const rows = filteredAndSorted();
  if(rows.length===0) $("#emptyState").classList.remove("hidden"); else $("#emptyState").classList.add("hidden");
  for(const r of rows){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escape(r.name)}</td>
      <td>${escape(r.type)}</td>
      <td>${escape(r.address)}</td>
      <td>${escape(r.city)}</td>
      <td>${escape(r.state)}</td>
      <td>${escape(r.contact)}</td>
      <td>${escape(r.phone_number)}</td>
      <td>${escape(r.email)}</td>
      <td>${escape(r.permission)}</td>
      <td>${escape(r.last_setup_date)}</td>
      <td>${escape(r.times)}</td>
      <td>${escape(r.notes)}</td>
      <td>
        <button class="btn secondary" data-edit="${r.id}">Edit</button>
        <button class="btn danger" data-del="${r.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  }
}
function filteredAndSorted(){
  const f=state.filter.toLowerCase();
  let rows=state.rows.filter(r=>!f||Object.values(r).some(v=>(v||"").toString().toLowerCase().includes(f)));
  const {key,dir}=state.sort;
  rows.sort((a,b)=>{
    const av=(a[key]||"").toString().toLowerCase();
    const bv=(b[key]||"").toString().toLowerCase();
    if(av<bv)return dir==="asc"?-1:1;
    if(av>bv)return dir==="asc"?1:-1;
    return 0;
  });
  return rows;
}

// Drawer handling
const drawer=$("#drawer"), form=$("#locationForm"), cancelBtn=$("#cancelBtn");
function openDrawer(editRow){
  drawer.classList.remove("hidden"); drawer.setAttribute("aria-hidden","false");
  form.reset();
  if(editRow){
    $("#formTitle").textContent="Edit Location";
    for(const [k,v] of Object.entries(editRow)){ if(form.elements[k]) form.elements[k].value=v??""; }
  } else {
    $("#formTitle").textContent="Add Location";
  }
  form.elements["name"].focus();
}
function closeDrawer(){
  drawer.classList.add("hidden"); drawer.setAttribute("aria-hidden","true");
}

// Events
$("#addRowBtn").addEventListener("click",()=>openDrawer());
cancelBtn.addEventListener("click",closeDrawer);
$("#search").addEventListener("input",e=>{ state.filter=e.target.value; render(); });
$$("th[data-key]").forEach(th=> th.addEventListener("click",()=>{
  const key=th.dataset.key;
  if(state.sort.key===key){ state.sort.dir=state.sort.dir==="asc"?"desc":"asc"; }
  else{ state.sort.key=key; state.sort.dir="asc"; }
  render();
}));
$("#tbody").addEventListener("click",e=>{
  const t=e.target;
  if(t.matches("[data-del]")) deleteLocation(t.dataset.del);
  if(t.matches("[data-edit]")){
    const row=state.rows.find(r=>r.id==t.dataset.edit);
    if(row) openDrawer(row);
  }
});
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(form).entries());
  await saveLocation(data); closeDrawer();
});

// CSV Export/Import buttons
const headerActions=document.querySelector(".header-actions");
const exportBtn=document.createElement("button");
exportBtn.textContent="Export CSV"; exportBtn.className="btn secondary";
headerActions.appendChild(exportBtn);
exportBtn.addEventListener("click",()=>{
  const csv=asCSV(state.rows);
  const blob=new Blob([csv],{type:"text/csv"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob); a.download="foxx_locations.csv"; a.click();
});

const importBtn=document.createElement("button");
importBtn.textContent="Import CSV"; importBtn.className="btn secondary";
headerActions.appendChild(importBtn);
const csvInput=document.createElement("input");
csvInput.type="file"; csvInput.accept=".csv"; csvInput.style.display="none";
document.body.appendChild(csvInput);
importBtn.addEventListener("click",()=>csvInput.click());
csvInput.addEventListener("change",async e=>{
  const file=e.target.files[0]; if(!file) return;
  const text=await file.text();
  const rows=parseCSV(text);
  for(const r of rows){
    if(!r.id) r.id=uid();
    await saveLocation(r);
  }
  csvInput.value="";
});

// Init
loadLocations();
