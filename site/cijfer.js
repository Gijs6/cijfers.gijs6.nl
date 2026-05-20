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

function fmtNterm(n) {
    return "N=" + n.toFixed(1).replace(".", ",");
}

function buildResult(score, maxScore) {
    const gradeN0 = Math.round(calcGrade(score, maxScore, 0) * 10) / 10;
    const gradeN2 = Math.round(calcGrade(score, maxScore, 2) * 10) / 10;

    const container = document.createElement("div");
    container.className = "grade-result";

    const label = document.createElement("p");
    label.className = "grade-label";
    label.textContent = "Je hebt tussen de";
    container.appendChild(label);

    const range = document.createElement("p");
    range.className = "grade-range";
    range.textContent = `${fmtGrade(gradeN0)} – ${fmtGrade(gradeN2)}`;
    container.appendChild(range);

    const list = document.createElement("dl");
    list.className = "grade-list";
    for (let n = 0; n <= 2 + 1e-9; n = Math.round((n + 0.1) * 10) / 10) {
        const grade = Math.round(calcGrade(score, maxScore, n) * 10) / 10;
        const dt = document.createElement("dt");
        dt.textContent = fmtNterm(n);
        const dd = document.createElement("dd");
        dd.textContent = fmtGrade(grade);
        list.appendChild(dt);
        list.appendChild(dd);
    }
    container.appendChild(list);

    return container;
}

const form = document.getElementById("form");
const result = document.getElementById("result");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const score = parseInt(document.getElementById("score").value);
    const maxScore = parseInt(document.getElementById("max").value);

    history.replaceState(null, "", "?" + new URLSearchParams({ score, max: maxScore }));
    result.replaceChildren(buildResult(score, maxScore));
});

const params = new URLSearchParams(location.search);
if (params.has("score")) document.getElementById("score").value = params.get("score");
if (params.has("max")) document.getElementById("max").value = params.get("max");
if (params.has("score") && params.has("max")) form.requestSubmit();
