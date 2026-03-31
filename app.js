let currentGroup = localStorage.getItem("activeGroup") || "Giorno 1";

// Migrazione dal vecchio formato singolo
const _oldData = localStorage.getItem("schedaGym");
if (_oldData && !localStorage.getItem("schedaGym_Giorno 1")) {
    localStorage.setItem("schedaGym_Giorno 1", _oldData);
    localStorage.removeItem("schedaGym");
}

function escHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function aggiungiEsercizio(nome = "", serie = "", ripetizioni = "", recupero = "", carico = "", nascosto = false) {
    const container = document.getElementById("exerciseList");

    const card = document.createElement("div");
    card.className = "card bg-secondary text-light mb-3 p-3";

    card.innerHTML = `
        <div class="d-flex align-items-center gap-2 mb-2 card-header-row">
            <input class="form-control" placeholder="Nome esercizio" value="${escHtml(nome)}">
            <button class="btn btn-outline-light btn-sm text-nowrap toggleBtn">Nascondi</button>
            <button class="btn btn-danger btn-sm text-nowrap removeBtn">Rimuovi</button>
        </div>
        <div class="row card-body-row">
            <div class="col-6 col-md-3 py-2">
                <input class="form-control" type="number" placeholder="Serie" value="${escHtml(serie)}">
            </div>
            <div class="col-6 col-md-3 py-2">
                <input class="form-control" type="number" placeholder="Ripetizioni" value="${escHtml(ripetizioni)}">
            </div>
            <div class="col-6 col-md-3 py-2">
                <input class="form-control" type="number" placeholder="Recupero (sec)" value="${escHtml(recupero)}">
            </div>
            <div class="col-6 col-md-3 py-2">
                <input class="form-control" type="number" placeholder="Carico (kg)" value="${escHtml(carico)}">
            </div>
        </div>
    `;

    if (nascosto) {
        card.classList.add("nascosta");
        card.querySelector(".toggleBtn").textContent = "Mostra";
    }

    container.appendChild(card);

    // Nascondi / Mostra
    card.querySelector(".toggleBtn").addEventListener("click", () => {
        const isNascosta = card.classList.toggle("nascosta");
        card.querySelector(".toggleBtn").textContent = isNascosta ? "Mostra" : "Nascondi";
        salvaScheda();
    });

    // Rimozione
    card.querySelector(".removeBtn").addEventListener("click", () => {
        card.remove();
        salvaScheda();
    });

    // Salvataggio automatico quando si scrive
    card.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", salvaScheda);
    });
}

document.getElementById("addExerciseBtn").addEventListener("click", () => {
    aggiungiEsercizio();
    salvaScheda();
});
// --- SALVATAGGIO ---
function salvaScheda() {
    const cards = document.querySelectorAll("#exerciseList .card");
    const esercizi = [];

    cards.forEach(card => {
        const inputs = card.querySelectorAll("input");
        esercizi.push({
            nome: inputs[0].value,
            serie: inputs[1].value,
            ripetizioni: inputs[2].value,
            recupero: inputs[3].value,
            carico: inputs[4].value,
            nascosto: card.classList.contains("nascosta")
        });
    });

    localStorage.setItem(`schedaGym_${currentGroup}`, JSON.stringify({ esercizi }));
    console.log("Scheda salvata!");
}

// --- CARICAMENTO ---
function caricaScheda() {
    const data = localStorage.getItem(`schedaGym_${currentGroup}`);
    if (!data) return;

    const { esercizi } = JSON.parse(data);

    esercizi.forEach(ex => {
        aggiungiEsercizio(ex.nome, ex.serie, ex.ripetizioni, ex.recupero, ex.carico, ex.nascosto || false);
    });
}
function selezionaGruppo(nome) {
    currentGroup = nome;
    localStorage.setItem("activeGroup", nome);

    document.querySelectorAll(".list-group-item[data-group]").forEach(item => {
        item.classList.toggle("selected", item.dataset.group === nome);
    });

    const title = document.getElementById("currentGroupTitle");
    if (title) title.textContent = nome;

    document.getElementById("exerciseList").innerHTML = "";
    caricaScheda();
    chiudiSidebar();
}

function apriSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarOverlay").classList.add("show");
}

function chiudiSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("show");
}

document.getElementById("menuToggleBtn").addEventListener("click", apriSidebar);
document.getElementById("sidebarOverlay").addEventListener("click", chiudiSidebar);

document.querySelectorAll(".list-group-item[data-group]").forEach(item => {
    item.addEventListener("click", () => selezionaGruppo(item.dataset.group));
});

selezionaGruppo(currentGroup);