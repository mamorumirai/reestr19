/* ============================================================
 * Калькулятор сроков хранения архивных документов
 * ============================================================ */

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const formatDate = (d) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
};
const yearsLabel = (n) => {
  if (n === 0) return "До минования надобности";
  if (n === "permanent") return "Постоянно";
  if (n === "until_obsolete") return "До минования надобности";
  if (n === "50_75") return "50 / 75 лет";
  const last = n % 10;
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 14) return `${n} лет`;
  if (last === 1) return `${n} год`;
  if (last >= 2 && last <= 4) return `${n} года`;
  return `${n} лет`;
};

// ---------- numeric value for comparison ----------
function numericTerm(years) {
  if (years === "permanent") return Infinity;
  if (years === "50_75") return 50;
  if (years === "until_obsolete") return 1;
  return Number(years) || 0;
}

// ---------- populate select ----------
function populateSelect() {
  const sel = $("doc-select");
  const grouped = {};
  DOCUMENTS.forEach(d => {
    if (!grouped[d.category]) grouped[d.category] = [];
    grouped[d.category].push(d);
  });
  Object.keys(grouped).sort().forEach(cat => {
    const og = document.createElement("optgroup");
    og.label = cat;
    grouped[cat]
      .sort((a, b) => a.name.localeCompare(b.name, "ru"))
      .forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.name;
        og.appendChild(opt);
      });
    sel.appendChild(og);
  });
}

// ---------- autocomplete ----------
const searchInput = $("search");
const suggBox = $("suggestions");
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) { suggBox.hidden = true; return; }
  const matches = DOCUMENTS
    .filter(d => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
    .slice(0, 8);
  if (!matches.length) { suggBox.hidden = true; return; }
  suggBox.innerHTML = matches.map(d =>
    `<div class="suggestion-item" data-id="${d.id}">
       <span>${d.name}</span>
       <small>${d.category}</small>
     </div>`
  ).join("");
  suggBox.hidden = false;
});
suggBox.addEventListener("click", (e) => {
  const item = e.target.closest(".suggestion-item");
  if (!item) return;
  const doc = DOCUMENTS.find(d => d.id === item.dataset.id);
  if (doc) {
    searchInput.value = doc.name;
    $("doc-select").value = doc.id;
    suggBox.hidden = true;
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".field")) suggBox.hidden = true;
});

// keep select & search in sync
$("doc-select").addEventListener("change", () => {
  const doc = DOCUMENTS.find(d => d.id === $("doc-select").value);
  if (doc) searchInput.value = doc.name;
});

// ---------- default date = today ----------
(function setDefaultDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  $("end-date").value = `${yyyy}-${mm}-${dd}`;
})();

// ---------- main calc ----------
$("calc-btn").addEventListener("click", () => {
  const id = $("doc-select").value;
  const dateStr = $("end-date").value;

  if (!id) {
    alert("Пожалуйста, выберите вид документа из списка.");
    return;
  }
  if (!dateStr) {
    alert("Пожалуйста, укажите дату окончания делопроизводства.");
    return;
  }

  const doc = DOCUMENTS.find(d => d.id === id);
  if (!doc) return;

  const endDate = new Date(dateStr);
  renderResult(doc, endDate);
});

// ---------- render ----------
function renderResult(doc, endDate) {
  $("result-empty").hidden = true;
  $("result-content").hidden = false;

  // basic info
  $("r-doc-name").textContent = doc.name;
  $("r-doc-cat").textContent = doc.category + " · " + (doc.perechen.article || "");

  // start of counting: 1 января следующего года
  const startYear = endDate.getFullYear() + 1;
  const startDate = new Date(startYear, 0, 1);
  $("r-start-date").textContent = formatDate(startDate);

  // pick the longest of three sources as the effective minimum
  const candidates = [
    { name: "Перечень 2019", val: doc.perechen.years, num: numericTerm(doc.perechen.years) },
    { name: "НК РФ ст. 23", val: doc.nk.years, num: doc.nk.applicable ? numericTerm(doc.nk.years) : -1 },
    { name: "402-ФЗ ст. 29", val: doc.fz402.years, num: doc.fz402.applicable ? numericTerm(doc.fz402.years) : -1 },
  ];
  const longest = candidates.reduce((a, b) => (b.num > a.num ? b : a));
  $("r-final-term").textContent = yearsLabel(longest.val);

  // destroy date
  let destroyLabel;
  if (longest.val === "permanent") {
    destroyLabel = "Не уничтожается";
  } else if (longest.val === "until_obsolete" || longest.val === 0) {
    destroyLabel = "По решению ЭК";
  } else if (longest.val === "50_75") {
    const d50 = new Date(startYear + 50, 0, 1);
    const d75 = new Date(startYear + 75, 0, 1);
    destroyLabel = `${formatDate(d50)} (50 л.) / ${formatDate(d75)} (75 л.)`;
  } else {
    const dDestroy = new Date(startYear + Number(longest.val), 0, 1);
    destroyLabel = formatDate(dDestroy);
  }
  $("r-destroy-date").textContent = destroyLabel;

  // ---- Перечень ----
  $("r-perechen-term").textContent = yearsLabel(doc.perechen.years);
  $("r-perechen-note").textContent = doc.perechen.note || "—";

  // ---- НК ----
  if (doc.nk.applicable) {
    $("r-nk-term").textContent = yearsLabel(doc.nk.years);
    $("r-nk-note").textContent = doc.nk.basis;
  } else {
    $("r-nk-term").textContent = "Не применимо";
    $("r-nk-note").textContent = "Документ не относится к налоговому учёту";
  }

  // ---- 402-ФЗ ----
  if (doc.fz402.applicable) {
    $("r-fz-term").textContent = yearsLabel(doc.fz402.years);
    $("r-fz-note").textContent = doc.fz402.basis;
  } else {
    $("r-fz-term").textContent = "Не применимо";
    $("r-fz-note").textContent = "Документ не относится к бухгалтерскому учёту";
  }

  // ---- Flag ----
  const flagEl = $("r-flag");
  flagEl.className = "flag";
  flagEl.hidden = true;
  flagEl.textContent = "";
  if (doc.perechen.check_required) {
    flagEl.classList.add("check");
    flagEl.textContent = "Требуется проверка";
    flagEl.hidden = false;
  } else if (doc.perechen.epk) {
    flagEl.classList.add("epk");
    flagEl.textContent = "ЭПК — решение комиссии";
    flagEl.hidden = false;
  } else if (doc.perechen.years === "permanent") {
    flagEl.classList.add("ok");
    flagEl.textContent = "Постоянное хранение";
    flagEl.hidden = false;
  }

  // ---- Alerts (детальные) ----
  const alertsHost = $("r-flags-area");
  alertsHost.innerHTML = "";

  if (doc.perechen.check_required) {
    alertsHost.innerHTML += `
      <div class="alert alert-check">
        <div>
          <strong>Требуется проведение проверки</strong>
          Срок хранения отсчитывается «при условии проведения проверки». Если налоговая или ведомственная проверка
          за соответствующий период не проводилась — срок продлевается до её проведения. При наличии разногласий
          или судебных споров документ хранится <strong>до принятия решения по делу</strong>.
        </div>
      </div>`;
  }
  if (doc.perechen.epk) {
    alertsHost.innerHTML += `
      <div class="alert alert-epk">
        <div>
          <strong>Отметка «ЭПК» — решение экспертно-проверочной комиссии</strong>
          По истечении срока документ не подлежит автоматическому уничтожению. Экспертно-проверочная комиссия
          архивного учреждения должна <strong>принять решение</strong> о продлении срока хранения, передаче
          на постоянное хранение в государственный/муниципальный архив или о выделении к уничтожению.
        </div>
      </div>`;
  }
  if (doc.perechen.years === "50_75") {
    alertsHost.innerHTML += `
      <div class="alert alert-info">
        <div>
          <strong>Срок 50/75 лет — по дате создания</strong>
          Для документов, созданных <strong>с 1 января 2003 г.</strong>, применяется срок <strong>50 лет</strong>.
          Для документов <strong>до 2003 г.</strong> — <strong>75 лет</strong> (ст. 22.1 Закона № 125-ФЗ).
        </div>
      </div>`;
  }
  if (longest.name === "Перечень 2019" && doc.nk.applicable && longest.num > numericTerm(doc.nk.years)) {
    alertsHost.innerHTML += `
      <div class="alert alert-info">
        <div>
          <strong>Перечень строже НК РФ</strong>
          Срок по Перечню 2019 г. превышает требование НК РФ (${yearsLabel(doc.nk.years)}).
          Применяется <strong>более длительный срок</strong>.
        </div>
      </div>`;
  }

  // ---- Legal block ----
  let legal = doc.legalText || "";
  legal += `<p style="margin-top:14px"><strong>Применяемый итоговый срок:</strong> ${yearsLabel(longest.val)} (источник — ${longest.name}).
            Срок начинает течь с 1 января ${startYear} года.</p>`;
  $("r-legal-basis").innerHTML = legal;

  // scroll into view on mobile
  if (window.innerWidth < 900) {
    $("result-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// ============================================================
// SPRAVOCHNIK
// ============================================================
let currentCat = "all";
let currentFilter = "";

function renderDirectory() {
  const body = $("dir-body");
  const filtered = DOCUMENTS.filter(d => {
    if (currentCat !== "all" && d.category !== currentCat) return false;
    if (currentFilter) {
      const q = currentFilter.toLowerCase();
      if (!d.name.toLowerCase().includes(q) &&
          !d.category.toLowerCase().includes(q) &&
          !(d.perechen.article || "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (!filtered.length) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--muted)">Ничего не найдено</td></tr>`;
    return;
  }

  body.innerHTML = filtered.map(d => {
    const nkText = d.nk.applicable ? yearsLabel(d.nk.years) : "—";
    const fzText = d.fz402.applicable ? yearsLabel(d.fz402.years) : "—";
    const nkFz = d.nk.applicable || d.fz402.applicable
      ? `НК: ${nkText}<br><span style="font-size:11px;color:var(--muted)">402-ФЗ: ${fzText}</span>`
      : "—";

    let tagHtml = "";
    if (d.perechen.years === "permanent") tagHtml = `<span class="tag tag-permanent">Постоянно</span>`;
    else if (d.perechen.check_required) tagHtml = `<span class="tag tag-check">Проверка</span>`;
    else if (d.perechen.epk) tagHtml = `<span class="tag tag-epk">ЭПК</span>`;
    else tagHtml = `<span class="tag">—</span>`;

    return `
      <tr data-id="${d.id}">
        <td><strong>${d.name}</strong></td>
        <td>${d.category}</td>
        <td>${yearsLabel(d.perechen.years)}</td>
        <td>${nkFz}</td>
        <td>${tagHtml}</td>
        <td><span style="font-family:var(--font-mono);font-size:12px;color:var(--accent-2)">${d.perechen.article}</span></td>
      </tr>`;
  }).join("");
}

// directory interactions
document.querySelectorAll(".dir-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".dir-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCat = btn.dataset.cat;
    renderDirectory();
  });
});
$("dir-search").addEventListener("input", (e) => {
  currentFilter = e.target.value.trim();
  renderDirectory();
});

// click row → load into calculator
$("dir-body").addEventListener("click", (e) => {
  const tr = e.target.closest("tr");
  if (!tr || !tr.dataset.id) return;
  const doc = DOCUMENTS.find(d => d.id === tr.dataset.id);
  if (!doc) return;
  $("doc-select").value = doc.id;
  searchInput.value = doc.name;
  window.scrollTo({ top: 0, behavior: "smooth" });
  if ($("end-date").value) {
    renderResult(doc, new Date($("end-date").value));
  }
});

// ---------- init ----------
populateSelect();
renderDirectory();
