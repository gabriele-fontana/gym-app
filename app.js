let currentGroup = localStorage.getItem("activeGroup") || "Petto";

// Migrazione dal vecchio formato singolo
const _oldData = localStorage.getItem("schedaGym");
if (_oldData && !localStorage.getItem("schedaGym_Petto")) {
    localStorage.setItem("schedaGym_Petto", _oldData);
    localStorage.removeItem("schedaGym");
}

function escHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function aggiungiEsercizio(nome = "", serie = "", ripetizioni = "", recupero = "", carico = "") {
    const container = document.getElementById("exerciseList");

    const card = document.createElement("div");
    card.className = "card bg-secondary text-light mb-3 p-3";

    card.innerHTML = `
        <div class="row">
            <div class="col-md-2 py-2">
                <input class="form-control" placeholder="Nome esercizio" value="${escHtml(nome)}">
            </div>
            <div class="col-md-2 py-2">
                <input class="form-control" type="number" placeholder="Serie" value="${escHtml(serie)}">
            </div>
            <div class="col-md-2 py-2">
                <input class="form-control" type="number"  placeholder="Ripetizioni" value="${escHtml(ripetizioni)}">
            </div>
            <div class="col-md-2 py-2">
                <input class="form-control" type="number" placeholder="Recupero (sec)" value="${escHtml(recupero)}">
            </div>
            <div class="col-md-2 py-2">
                <input class="form-control" type="number" placeholder="Carico (kg)" value="${escHtml(carico)}">
            </div>
            <div class="col-md-2 py-2">
                <button class="btn btn-danger w-100 removeBtn">Rimuovi</button>
            </div>
        </div>
    `;

    container.appendChild(card);

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
            carico: inputs[4].value
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
        aggiungiEsercizio(ex.nome, ex.serie, ex.ripetizioni, ex.recupero, ex.carico);
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