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

function buildTable(maxScore, nterm) {
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
        row.insertCell().textContent = grade.toFixed(1).replace(".", ",");
    }

    return table;
}

const form = document.getElementById("form");
const container = document.getElementById("table-container");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const maxScore = parseInt(document.getElementById("max").value);
    const nterm = parseFloat(document.getElementById("nterm").value);

    history.replaceState(null, "", "?" + new URLSearchParams({ max: maxScore, nterm }));
    container.replaceChildren(buildTable(maxScore, nterm));
});

const params = new URLSearchParams(location.search);
if (params.has("max")) document.getElementById("max").value = params.get("max");
if (params.has("nterm")) document.getElementById("nterm").value = params.get("nterm");
if (params.has("max") && params.has("nterm")) form.requestSubmit();
