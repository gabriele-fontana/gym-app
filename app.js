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

// --- CARDS ---
function htmlDisplaySingolo(dati) {
    return `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0 fw-bold text-uppercase">${escHtml(dati.nome || '—')}</h5>
            <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm toggleBtn">Nascondi</button>
            <button class="btn btn-danger btn-sm removeBtn">Rimuovi</button>
            <button class="btn btn-sm editBtn">✏️</button>
            </div>
        </div>
        <div class="row text-center">
            <div class="col-3">
                <div class="small text-muted">Serie</div>
                <div class="fw-bold">${escHtml(dati.serie || '0')}</div>
            </div>
            <div class="col-3">
                <div class="small text-muted">Reps</div>
                <div class="fw-bold">${escHtml(dati.ripetizioni || '0')}</div>
            </div>
            <div class="col-3">
                <div class="small text-muted">Carico</div>
                <div class="fw-bold">${escHtml(dati.carico || '0')} kg</div>
            </div>
            <div class="col-3">
                <div class="small text-muted">Recupero</div>
                <div class="fw-bold">${escHtml(dati.recupero || '0')} s</div>
            </div>
        </div>
    `;
}

function htmlEditSingolo(dati) {
    return `
        <div class="row">
            <div class="col-12 mb-2">
                <label class="form-label small fw-bold">Nome Esercizio</label>
                <input class="form-control bg-dark text-light border-secondary text-uppercase edit-nome" value="${escHtml(dati.nome || '')}">
            </div>
            <div class="col-6 col-md-3 mb-2">
                <label class="form-label small fw-bold">Serie</label>
                <input class="form-control bg-dark text-light border-secondary edit-serie" type="number" min="0" value="${escHtml(dati.serie || '')}">
            </div>
            <div class="col-6 col-md-3 mb-2">
                <label class="form-label small fw-bold">Ripetizioni</label>
                <input class="form-control bg-dark text-light border-secondary edit-ripetizioni" type="number" min="0" value="${escHtml(dati.ripetizioni || '')}">
            </div>
            <div class="col-6 col-md-3 mb-2">
                <label class="form-label small fw-bold">Carico (kg)</label>
                <input class="form-control bg-dark text-light border-secondary edit-carico" type="number" step="0.5" min="0" value="${escHtml(dati.carico || '')}">
            </div>
            <div class="col-6 col-md-3 mb-2">
                <label class="form-label small fw-bold">Recupero (s)</label>
                <input class="form-control bg-dark text-light border-secondary edit-recupero" type="number" min="0" value="${escHtml(dati.recupero || '')}">
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <button class="btn btn-primary btn-sm saveEditBtn">Salva</button>
            <button class="btn btn-outline-secondary btn-sm cancelEditBtn">Annulla</button>
        </div>
    `;
}

function htmlDisplaySuperset(dati) {
    return `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-primary text-light fw-bold fs-6">SUPERSET</span>
            <div class="d-flex gap-2">
            <button class="btn btn-outline-light btn-sm toggleBtn">Nascondi</button>
            <button class="btn btn-danger btn-sm removeBtn">Rimuovi</button>
            <button class="btn btn-sm editBtn">✏️</button>
            </div>
        </div>
        <div class="mb-2">
            <div class="fw-bold text-uppercase">${escHtml(dati.es1.nome || '—')}</div>
            <div class="row text-center mt-1">
                <div class="col-4">
                    <div class="small text-muted">Serie</div>
                    <div class="fw-bold">${escHtml(dati.es1.serie || '0')}</div>
                </div>
                <div class="col-4">
                    <div class="small text-muted">Reps</div>
                    <div class="fw-bold">${escHtml(dati.es1.ripetizioni || '0')}</div>
                </div>
                <div class="col-4">
                    <div class="small text-muted">Carico</div>
                    <div class="fw-bold">${escHtml(dati.es1.carico || '0')} kg</div>
                </div>
            </div>
        </div>
        <hr class="border-secondary my-2">
        <div class="mb-2">
            <div class="fw-bold text-uppercase">${escHtml(dati.es2.nome || '—')}</div>
            <div class="row text-center mt-1">
                <div class="col-4">
                    <div class="small text-muted">Serie</div>
                    <div class="fw-bold">${escHtml(dati.es2.serie || '0')}</div>
                </div>
                <div class="col-4">
                    <div class="small text-muted">Reps</div>
                    <div class="fw-bold">${escHtml(dati.es2.ripetizioni || '0')}</div>
                </div>
                <div class="col-4">
                    <div class="small text-muted">Carico</div>
                    <div class="fw-bold">${escHtml(dati.es2.carico || '0')} kg</div>
                </div>
            </div>
        </div>
        <hr class="border-secondary my-2">
        <div class="text-center">
            <span class="small text-muted">Recupero: </span>
            <span class="fw-bold">${escHtml(dati.recupero || '0')} s</span>
        </div>
    `;
}

function htmlEditSuperset(dati) {
    return `
        <h6 class="fw-bold mb-2">Esercizio A</h6>
        <div class="row">
            <div class="col-12 mb-2">
                <label class="form-label small fw-bold">Nome</label>
                <input class="form-control bg-dark text-light border-secondary text-uppercase edit-es1-nome" value="${escHtml(dati.es1.nome || '')}">
            </div>
            <div class="col-4 mb-2">
                <label class="form-label small fw-bold">Serie</label>
                <input class="form-control bg-dark text-light border-secondary edit-es1-serie" type="number" min="0" value="${escHtml(dati.es1.serie || '')}">
            </div>
            <div class="col-4 mb-2">
                <label class="form-label small fw-bold">Ripetizioni</label>
                <input class="form-control bg-dark text-light border-secondary edit-es1-ripetizioni" type="number" min="0" value="${escHtml(dati.es1.ripetizioni || '')}">
            </div>
            <div class="col-4 mb-2">
                <label class="form-label small fw-bold">Carico (kg)</label>
                <input class="form-control bg-dark text-light border-secondary edit-es1-carico" type="number" step="0.5" min="0" value="${escHtml(dati.es1.carico || '')}">
            </div>
        </div>
        <h6 class="fw-bold mb-2 mt-2">Esercizio B</h6>
        <div class="row">
            <div class="col-12 mb-2">
                <label class="form-label small fw-bold">Nome</label>
                <input class="form-control bg-dark text-light border-secondary text-uppercase edit-es2-nome" value="${escHtml(dati.es2.nome || '')}">
            </div>
            <div class="col-4 mb-2">
                <label class="form-label small fw-bold">Serie</label>
                <input class="form-control bg-dark text-light border-secondary edit-es2-serie" type="number" min="0" value="${escHtml(dati.es2.serie || '')}">
            </div>
            <div class="col-4 mb-2">
                <label class="form-label small fw-bold">Ripetizioni</label>
                <input class="form-control bg-dark text-light border-secondary edit-es2-ripetizioni" type="number" min="0" value="${escHtml(dati.es2.ripetizioni || '')}">
            </div>
            <div class="col-4 mb-2">
                <label class="form-label small fw-bold">Carico (kg)</label>
                <input class="form-control bg-dark text-light border-secondary edit-es2-carico" type="number" step="0.5" min="0" value="${escHtml(dati.es2.carico || '')}">
            </div>
        </div>
        <div class="row">
            <div class="col-6 col-md-3 mb-2">
                <label class="form-label small fw-bold">Recupero (s)</label>
                <input class="form-control bg-dark text-light border-secondary edit-recupero" type="number" min="0" value="${escHtml(dati.recupero || '')}">
            </div>
        </div>
        <div class="d-flex gap-2 mt-2">
            <button class="btn btn-primary btn-sm saveEditBtn">Salva</button>
            <button class="btn btn-outline-secondary btn-sm cancelEditBtn">Annulla</button>
        </div>
    `;
}

function attachCardEvents(card) {
    card.querySelector(".toggleBtn").addEventListener("click", () => {
        card.classList.add("nascosta");
        salvaScheda();
        aggiornaBottoneMostra();
    });
    card.querySelector(".removeBtn").addEventListener("click", () => {
        card.remove();
        salvaScheda();
        aggiornaBottoneMostra();
    });
    card.querySelector(".editBtn").addEventListener("click", () => {
        const tipo = card.dataset.tipo;
        const dati = JSON.parse(card.dataset.esercizio);
        if (tipo === "single") {
            card.innerHTML = htmlEditSingolo(dati);
            card.querySelector(".saveEditBtn").addEventListener("click", () => {
                const nuovi = {
                    nome: card.querySelector(".edit-nome").value.trim(),
                    serie: card.querySelector(".edit-serie").value,
                    ripetizioni: card.querySelector(".edit-ripetizioni").value,
                    carico: card.querySelector(".edit-carico").value,
                    recupero: card.querySelector(".edit-recupero").value,
                };
                card.dataset.esercizio = JSON.stringify(nuovi);
                card.innerHTML = htmlDisplaySingolo(nuovi);
                attachCardEvents(card);
                salvaScheda();
            });
            card.querySelector(".cancelEditBtn").addEventListener("click", () => {
                card.innerHTML = htmlDisplaySingolo(dati);
                attachCardEvents(card);
            });
        } else {
            card.innerHTML = htmlEditSuperset(dati);
            card.querySelector(".saveEditBtn").addEventListener("click", () => {
                const nuovi = {
                    es1: {
                        nome: card.querySelector(".edit-es1-nome").value.trim(),
                        serie: card.querySelector(".edit-es1-serie").value,
                        ripetizioni: card.querySelector(".edit-es1-ripetizioni").value,
                        carico: card.querySelector(".edit-es1-carico").value,
                    },
                    es2: {
                        nome: card.querySelector(".edit-es2-nome").value.trim(),
                        serie: card.querySelector(".edit-es2-serie").value,
                        ripetizioni: card.querySelector(".edit-es2-ripetizioni").value,
                        carico: card.querySelector(".edit-es2-carico").value,
                    },
                    recupero: card.querySelector(".edit-recupero").value,
                };
                card.dataset.esercizio = JSON.stringify(nuovi);
                card.innerHTML = htmlDisplaySuperset(nuovi);
                attachCardEvents(card);
                salvaScheda();
            });
            card.querySelector(".cancelEditBtn").addEventListener("click", () => {
                card.innerHTML = htmlDisplaySuperset(dati);
                attachCardEvents(card);
            });
        }
    });
}

function creaCardSingolo(dati, nascosto = false) {
    const container = document.getElementById("exerciseList");
    const card = document.createElement("div");
    card.className = "card bg-secondary text-light mb-3 p-3";
    card.dataset.tipo = "single";
    card.dataset.esercizio = JSON.stringify(dati);
    if (nascosto) card.classList.add("nascosta");

    card.innerHTML = htmlDisplaySingolo(dati);

    attachCardEvents(card);
    container.appendChild(card);
    aggiornaBottoneMostra();
}

function creaCardSuperset(dati, nascosto = false) {
    const container = document.getElementById("exerciseList");
    const card = document.createElement("div");
    card.className = "card bg-secondary text-light mb-3 p-3";
    card.dataset.tipo = "superset";
    card.dataset.esercizio = JSON.stringify(dati);
    if (nascosto) card.classList.add("nascosta");

    card.innerHTML = htmlDisplaySuperset(dati);

    attachCardEvents(card);
    container.appendChild(card);
    aggiornaBottoneMostra();
}

// --- FORM HANDLING ---
document.getElementById("addExerciseBtn").addEventListener("click", () => {
    const form = document.getElementById("addExerciseForm");
    const isVisible = form.style.display !== "none";
    form.style.display = isVisible ? "none" : "block";
    if (isVisible) resetForm();
});

document.getElementById("exerciseTypeSelect").addEventListener("change", function () {
    document.getElementById("singleExerciseForm").style.display = this.value === "single" ? "block" : "none";
    document.getElementById("supersetExerciseForm").style.display = this.value === "superset" ? "block" : "none";
});

function resetForm() {
    document.getElementById("exerciseTypeSelect").value = "";
    document.getElementById("singleExerciseForm").style.display = "none";
    document.getElementById("supersetExerciseForm").style.display = "none";
    ["singleNome", "singleSerie", "singleRipetizioni", "singleCarico", "singleRecupero",
        "ss1Nome", "ss1Serie", "ss1Ripetizioni", "ss1Carico",
        "ss2Nome", "ss2Serie", "ss2Ripetizioni", "ss2Carico", "ssRecupero"
    ].forEach(id => { document.getElementById(id).value = ""; });
}

function chiudiForm() {
    document.getElementById("addExerciseForm").style.display = "none";
    resetForm();
}

document.getElementById("cancelFormBtn").addEventListener("click", chiudiForm);
document.getElementById("cancelSupersetFormBtn").addEventListener("click", chiudiForm);

document.getElementById("submitSingleBtn").addEventListener("click", () => {
    const dati = {
        nome: document.getElementById("singleNome").value.trim(),
        serie: document.getElementById("singleSerie").value,
        ripetizioni: document.getElementById("singleRipetizioni").value,
        carico: document.getElementById("singleCarico").value,
        recupero: document.getElementById("singleRecupero").value,
    };
    creaCardSingolo(dati);
    salvaScheda();
    chiudiForm();
});

document.getElementById("submitSupersetBtn").addEventListener("click", () => {
    const dati = {
        es1: {
            nome: document.getElementById("ss1Nome").value.trim(),
            serie: document.getElementById("ss1Serie").value,
            ripetizioni: document.getElementById("ss1Ripetizioni").value,
            carico: document.getElementById("ss1Carico").value,
        },
        es2: {
            nome: document.getElementById("ss2Nome").value.trim(),
            serie: document.getElementById("ss2Serie").value,
            ripetizioni: document.getElementById("ss2Ripetizioni").value,
            carico: document.getElementById("ss2Carico").value,
        },
        recupero: document.getElementById("ssRecupero").value,
    };
    creaCardSuperset(dati);
    salvaScheda();
    chiudiForm();
});

document.getElementById("showHiddenBtn").addEventListener("click", () => {
    document.querySelectorAll("#exerciseList .card.nascosta").forEach(c => c.classList.remove("nascosta"));
    salvaScheda();
    aggiornaBottoneMostra();
});

function aggiornaBottoneMostra() {
    const hasHidden = document.querySelectorAll("#exerciseList .card.nascosta").length > 0;
    document.getElementById("showHiddenBtn").style.display = hasHidden ? "block" : "none";
}

// --- SALVATAGGIO ---
function salvaScheda() {
    const cards = document.querySelectorAll("#exerciseList .card");
    const esercizi = [];

    cards.forEach(card => {
        const dati = JSON.parse(card.dataset.esercizio);
        esercizi.push({
            tipo: card.dataset.tipo,
            ...dati,
            nascosto: card.classList.contains("nascosta")
        });
    });

    localStorage.setItem(`schedaGym_${currentGroup}`, JSON.stringify({ esercizi }));
}

// --- CARICAMENTO ---
function caricaScheda() {
    const data = localStorage.getItem(`schedaGym_${currentGroup}`);
    if (!data) return;

    const { esercizi } = JSON.parse(data);
    esercizi.forEach(ex => {
        const tipo = ex.tipo || "single";
        const nascosto = ex.nascosto || false;
        const { tipo: _t, nascosto: _n, ...dati } = ex;
        if (tipo === "superset") {
            creaCardSuperset(dati, nascosto);
        } else {
            creaCardSingolo(dati, nascosto);
        }
    });
    aggiornaBottoneMostra();
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
    chiudiForm();
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