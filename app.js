// === إعدادات عامة ===
const state = {
  data: null,
  termIndex: new Map(), // termId -> order
  filters: { termId: "", deptId: "", branch: "", nat: "", rank: "", q: "" },
};

// === أدوات مساعدة ===
const el = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString("ar-SA") : "");
const download = (filename, text) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
};

function buildTermIndex(order) {
  state.termIndex.clear();
  order.forEach((id, i) => state.termIndex.set(id, i));
}

function termLTE(a, b) { // a <= b ?
  return state.termIndex.get(a) <= state.termIndex.get(b);
}
function termGTE(a, b) { // a >= b ?
  return state.termIndex.get(a) >= state.termIndex.get(b);
}

function appointmentAtTerm(member, termId) {
  // يختار التعيين (القسم/الفرع/الرتبة) الساري في الفصل المحدد
  if (!member.appointments || !member.appointments.length) return null;
  // ابحث عن تعيين يبدأ قبل أو في termId وينتهي بعده (أو بلا نهاية)
  const list = member.appointments.filter((a) => {
    const startsOk = termLTE(a.termStart, termId);
    const endsOk = !a.termEnd || termGTE(a.termEnd, termId);
    return startsOk && endsOk;
  });
  // آخر واحد هو الأقرب
  if (!list.length) return null;
  // رتبهم حسب termStart
  list.sort((x, y) => state.termIndex.get(y.termStart) - state.termIndex.get(x.termStart));
  return list[0];
}

function memberMatchesFilters(m, termId, filters, deps) {
  const ap = appointmentAtTerm(m, termId);
  if (filters.rank && (!ap || ap.rank !== filters.rank)) return false;
  if (filters.deptId && (!ap || ap.departmentId !== filters.deptId)) return false;
  if (filters.branch && (!ap || ap.branch !== filters.branch)) return false;
  if (filters.nat && m.nationality !== filters.nat) return false;
  if (filters.q && !m.name.includes(filters.q)) return false;
  return true;
}

function uniq(arr) { return Array.from(new Set(arr)); }

// === تحميل البيانات ===
async function loadData() {
  // حاول قراءة نسخة محلية من التخزين (لو سبق الاستيراد)
  const fromLS = localStorage.getItem("faculty_data");
  let data;
  if (fromLS) {
    data = JSON.parse(fromLS);
  } else {
    const res = await fetch("./data.json", { cache: "no-store" });
    data = await res.json();
  }
  state.data = data;
  buildTermIndex(data.meta.termOrder);
  // اختر آخر فصل كافتراضي
  state.filters.termId = data.meta.termOrder.at(-1);
  hydrateFilters();
  renderAll();
}

function saveData() {
  localStorage.setItem("faculty_data", JSON.stringify(state.data));
}

// === ربط الواجهات ===
function hydrateFilters() {
  const { terms, departments } = state.data;

  // الفصول
  const termSel = byId("termSelect");
  termSel.innerHTML = terms
    .map((t) => `<option value="${t.id}">${t.name}</option>`)
    .join("");
  termSel.value = state.filters.termId;
  termSel.onchange = () => { state.filters.termId = termSel.value; renderAll(); };

  // الأقسام
  const deptSel = byId("deptSelect");
  const deptOpts = [`<option value="">الكل</option>`]
    .concat(state.data.departments.map(d => `<option value="${d.id}">${d.name}</option>`));
  deptSel.innerHTML = deptOpts.join("");
  deptSel.onchange = () => { state.filters.deptId = deptSel.value; renderAll(); };

  // الفروع
  const branches = uniq(state.data.departments.map(d => d.branch)).filter(Boolean);
  const brSel = byId("branchSelect");
  brSel.innerHTML = [`<option value="">الكل</option>`]
    .concat(branches.map(b => `<option>${b}</option>`)).join("");
  brSel.onchange = () => { state.filters.branch = brSel.value; renderAll(); };

  // الجنسية/الرتبة
  byId("natSelect").onchange = (e)=>{ state.filters.nat = e.target.value; renderAll(); };
  byId("rankSelect").onchange = (e)=>{ state.filters.rank = e.target.value; renderAll(); };
  byId("searchInput").oninput = (e)=>{ state.filters.q = e.target.value.trim(); renderAll(); };

  // أزرار
  byId("printBtn").onclick = ()=> window.print();
  byId("exportBtn").onclick = ()=> {
    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
    download(`faculty-data-${stamp}.json`, JSON.stringify(state.data, null, 2));
  };
  byId("importFile").addEventListener("change", async (e)=>{
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const incoming = JSON.parse(text);
      // تحقق بسيط: وجود الحقول الرئيسية
      if (!incoming.members || !incoming.departments || !incoming.terms) throw new Error("صيغة غير صحيحة");
      state.data = incoming;
      buildTermIndex(incoming.meta?.termOrder || incoming.terms.map(t=>t.id));
      state.filters.termId = incoming.meta?.termOrder?.at(-1) || incoming.terms.at(-1).id;
      saveData();
      hydrateFilters();
      renderAll();
      alert("تم الاستيراد بنجاح.");
    } catch (err) {
      alert("تعذّر الاستيراد: " + err.message);
    } finally {
      e.target.value = "";
    }
  });

  // تبويبات
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.onclick = ()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tabpane").forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      byId(btn.dataset.tab).classList.add("active");
    };
  });
}

// === العرض ===
function renderAll() {
  renderUpdates();
  renderSummary();
  renderMembers();
  renderActivities();
  renderPublications();
  renderCourses();
}

function renderUpdates() {
  const ul = byId("updatesList");
  const items = [...state.data.members]
    .sort((a,b)=> new Date(b.updatedAt||0) - new Date(a.updatedAt||0))
    .slice(0, 9)
    .map(m => `<li><strong>${m.name}</strong><br><small>آخر تحديث: ${fmtDate(m.updatedAt)}</small></li>`);
  ul.innerHTML = items.join("") || `<li>لا توجد تحديثات مسجلة.</li>`;
}

function renderSummary() {
  const { data, filters } = state;
  const termId = filters.termId;

  const filtered = data.members.filter(m => memberMatchesFilters(m, termId, filters));
  const total = filtered.length;
  const saudis = filtered.filter(m=>m.nationality==="سعودي").length;
  const foreigners = filtered.filter(m=>m.nationality==="غير سعودي").length;

  const byRank = ["أستاذ","أستاذ مشارك","أستاذ مساعد","محاضر"].map(rk => ({
    rank: rk,
    count: filtered.filter(m=>{
      const ap = appointmentAtTerm(m, termId);
      return ap && ap.rank === rk;
    }).length
  }));

  const cards = [
    card("إجمالي الأعضاء", total),
    card("سعوديون", saudis),
    card("غير سعوديين", foreigners),
    ...byRank.map(x=>card(`عدد ${x.rank}`, x.count)),
  ];
  byId("summaryCards").innerHTML = cards.join("");

  function card(title, num){
    return `<div class="card"><h3>${title}</h3><div class="big">${num}</div></div>`;
  }
}

function renderMembers() {
  const { data, filters } = state;
  const termId = filters.termId;
  const tbody = byId("membersBody");
  const rows = data.members
    .filter(m => memberMatchesFilters(m, termId, filters))
    .sort((a,b)=> a.name.localeCompare(b.name, 'ar'))
    .map(m=>{
      const ap = appointmentAtTerm(m, termId);
      const deptName = ap ? (state.data.departments.find(d=>d.id===ap.departmentId)?.name || "") : "";
      const branch = ap?.branch || "";
      const rank = ap?.rank || "—";
      return `<tr>
        <td>${m.name}</td>
        <td>${deptName}</td>
        <td>${branch}</td>
        <td>${m.nationality||""}</td>
        <td>${rank}</td>
      </tr>`;
    });
  tbody.innerHTML = rows.join("") || `<tr><td colspan="5">لا توجد نتائج مطابقة للفلاتر.</td></tr>`;
}

function renderActivities() {
  const { data, filters } = state;
  const termId = filters.termId;
  const rows = [];
  data.members.forEach(m=>{
    if (!memberMatchesFilters(m, termId, filters)) return;
    (m.activities||[]).forEach(a=>{
      // إن كان المستخدم عيّن فصلًا، اعرض نشاط ذلك الفصل فقط
      if (a.termId && a.termId !== termId) return;
      rows.push(`<tr>
        <td>${m.name}</td>
        <td>${a.title||""}</td>
        <td>${a.type||""}</td>
        <td>${fmtDate(a.date)}</td>
        <td>${a.termId||""}</td>
      </tr>`);
    });
  });
  byId("activitiesBody").innerHTML = rows.join("") || `<tr><td colspan="5">لا توجد أنشطة للفصل المختار.</td></tr>`;
}

function renderPublications() {
  const { data, filters } = state;
  const termId = filters.termId; // لا يُستخدم مباشرة لكن نحافظ على الفكرة
  const rows = [];
  data.members.forEach(m=>{
    if (!memberMatchesFilters(m, termId, filters)) return;
    (m.publications||[]).forEach(p=>{
      rows.push(`<tr>
        <td>${m.name}</td>
        <td>${p.title||""}</td>
        <td>${p.type||""}</td>
        <td>${p.year||""}</td>
      </tr>`);
    });
  });
  byId("pubsBody").innerHTML = rows.join("") || `<tr><td colspan="4">لا توجد منشورات ضمن الفلاتر الحالية.</td></tr>`;
}

function renderCourses() {
  const { data, filters } = state;
  const termId = filters.termId;
  const rows = [];
  data.members.forEach(m=>{
    if (!memberMatchesFilters(m, termId, filters)) return;
    (m.courses||[]).forEach(c=>{
      if (c.termId && c.termId !== termId) return;
      rows.push(`<tr>
        <td>${m.name}</td>
        <td>${c.name||""}</td>
        <td>${c.code||""}</td>
        <td>${c.termId||""}</td>
      </tr>`);
    });
  });
  byId("coursesBody").innerHTML = rows.join("") || `<tr><td colspan="4">لا توجد مقررات في الفصل المختار.</td></tr>`;
}

// ابدأ
loadData();
