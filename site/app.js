function calcGrade(score, maxScore, nterm) {
    const pointsPerGrade = 9 / maxScore;
    let grade = 9 * (score / maxScore) + nterm;

    // Grensrelaties
    grade = Math.min(grade, 1.0 + score * pointsPerGrade * 2);
    grade = Math.min(grade, 10.0 - (maxScore - score) * pointsPerGrade * 0.5);
    grade = Math.max(grade, 1.0 + score * pointsPerGrade * 0.5);
    grade = Math.max(grade, 10.0 - (maxScore - score) * pointsPerGrade * 2);

    return Math.min(10, Math.max(1, grade));
}

function fmtGrade(grade) {
    return grade.toFixed(1).replace(".", ",");
}

function buildSingleTable(maxScore, nterm) {
    const table = document.createElement("table");

    const headerRow = table.createTHead().insertRow();
    for (const text of ["Score", "Cijfer"]) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = text;
        headerRow.appendChild(th);
    }

    const tbody = table.createTBody();
    for (let score = 0; score <= maxScore; score++) {
        const grade = Math.round(calcGrade(score, maxScore, nterm) * 10) / 10;
        const row = tbody.insertRow();
        row.className = grade >= 5.5 ? "pass" : "fail";
        row.insertCell().textContent = score;
        row.insertCell().textContent = fmtGrade(grade);
    }

    return table;
}

function buildRangeTable(maxScore, nmin, nmax) {
    const nterms = [];
    for (let n = nmin; n <= nmax + 1e-9; n = Math.round((n + 0.1) * 10) / 10) {
        nterms.push(n);
    }

    const table = document.createElement("table");

    const headerRow = table.createTHead().insertRow();
    const scoreTh = document.createElement("th");
    scoreTh.scope = "col";
    scoreTh.textContent = "Score";
    headerRow.appendChild(scoreTh);
    for (const n of nterms) {
        const th = document.createElement("th");
        th.scope = "col";
        th.textContent = "N=" + n.toFixed(1).replace(".", ",");
        headerRow.appendChild(th);
    }

    const tbody = table.createTBody();
    for (let score = 0; score <= maxScore; score++) {
        const row = tbody.insertRow();
        row.insertCell().textContent = score;
        for (const n of nterms) {
            const grade = Math.round(calcGrade(score, maxScore, n) * 10) / 10;
            row.insertCell().textContent = fmtGrade(grade);
        }
    }

    return table;
}

// Tab switching
const tabSingle = document.getElementById("tab-single");
const tabRange = document.getElementById("tab-range");
const panelSingle = document.getElementById("panel-single");
const panelRange = document.getElementById("panel-range");
const form = document.getElementById("form");
const container = document.getElementById("table-container");

function activateTab(mode) {
    const isSingle = mode === "single";

    tabSingle.setAttribute("aria-selected", isSingle ? "true" : "false");
    tabRange.setAttribute("aria-selected", isSingle ? "false" : "true");

    panelSingle.hidden = !isSingle;
    panelRange.hidden = isSingle;

    form.reset();
    container.replaceChildren();
}

tabSingle.addEventListener("click", () => activateTab("single"));
tabRange.addEventListener("click", () => activateTab("range"));

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const maxScore = parseInt(document.getElementById("max").value);
    const isSingle = tabSingle.getAttribute("aria-selected") === "true";

    let table, params;
    if (isSingle) {
        const nterm = parseFloat(document.getElementById("nterm").value);
        table = buildSingleTable(maxScore, nterm);
        params = { mode: "single", max: maxScore, nterm };
    } else {
        const nmin = parseFloat(document.getElementById("nmin").value);
        const nmax = parseFloat(document.getElementById("nmax").value);
        table = buildRangeTable(maxScore, nmin, nmax);
        params = { mode: "range", max: maxScore, nmin, nmax };
    }

    history.replaceState(null, "", "?" + new URLSearchParams(params));
    container.replaceChildren(table);
});

// Restore from URL
const params = new URLSearchParams(location.search);
const mode = params.get("mode") === "range" ? "range" : "single";
activateTab(mode);

if (mode === "single") {
    if (params.has("max")) document.getElementById("max").value = params.get("max");
    if (params.has("nterm")) document.getElementById("nterm").value = params.get("nterm");
    if (params.has("max") && params.has("nterm")) form.requestSubmit();
} else {
    if (params.has("max")) document.getElementById("max").value = params.get("max");
    if (params.has("nmin")) document.getElementById("nmin").value = params.get("nmin");
    if (params.has("nmax")) document.getElementById("nmax").value = params.get("nmax");
    if (params.has("max") && params.has("nmin") && params.has("nmax")) form.requestSubmit();
}
