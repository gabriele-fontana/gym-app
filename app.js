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
}

function creaCardSingolo(dati, nascosto = false) {
    const container = document.getElementById("exerciseList");
    const card = document.createElement("div");
    card.className = "card bg-secondary text-light mb-3 p-3";
    card.dataset.tipo = "single";
    card.dataset.esercizio = JSON.stringify(dati);
    if (nascosto) card.classList.add("nascosta");

    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0 fw-bold text-uppercase">${escHtml(dati.nome || '—')}</h5>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-light btn-sm toggleBtn">Nascondi</button>
                <button class="btn btn-danger btn-sm removeBtn">Rimuovi</button>
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

    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="badge bg-primary text-light fw-bold fs-6">SUPERSET</span>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-light btn-sm toggleBtn">Nascondi</button>
                <button class="btn btn-danger btn-sm removeBtn">Rimuovi</button>
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

// --- AUTENTICAZIONE ---
const AUTH_KEY = 'gymAppAuth';

async function hashPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(salt + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getAuthData() {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
}

function saveAuthData(username, passwordHash, salt) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username, passwordHash, salt }));
}

function showApp() {
    document.getElementById('loginOverlay').style.display = 'none';
    sessionStorage.setItem('gymLoggedIn', '1');
    selezionaGruppo(currentGroup);
}

// Setup primo accesso
document.getElementById('setupBtn').addEventListener('click', async () => {
    const username = document.getElementById('setupUsername').value.trim();
    const password = document.getElementById('setupPassword').value;
    const confirm = document.getElementById('setupPasswordConfirm').value;
    const errorEl = document.getElementById('setupError');
    errorEl.textContent = '';

    if (!username || !password) { errorEl.textContent = 'Compila tutti i campi.'; return; }
    if (password !== confirm) { errorEl.textContent = 'Le password non corrispondono.'; return; }
    if (password.length < 6) { errorEl.textContent = 'Password troppo corta (min. 6 caratteri).'; return; }

    const salt = generateSalt();
    const hash = await hashPassword(password, salt);
    saveAuthData(username, hash, salt);
    showApp();
});

document.getElementById('setupPasswordConfirm').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('setupBtn').click();
});

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';

    const auth = getAuthData();
    if (!auth) { errorEl.textContent = 'Nessun account configurato.'; return; }

    const hash = await hashPassword(password, auth.salt);
    if (username === auth.username && hash === auth.passwordHash) {
        showApp();
    } else {
        errorEl.textContent = 'Username o password errati.';
    }
});

document.getElementById('loginPassword').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('loginBtn').click();
});

// Cambio credenziali
document.getElementById('changeCredsBtn').addEventListener('click', () => {
    document.getElementById('changeCredsModal').style.display = 'flex';
    chiudiSidebar();
});

document.getElementById('cancelCredsBtn').addEventListener('click', () => {
    document.getElementById('changeCredsModal').style.display = 'none';
    document.getElementById('changeCredsError').textContent = '';
});

document.getElementById('saveCredsBtn').addEventListener('click', async () => {
    const currentPwd = document.getElementById('currentPassword').value;
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPwd = document.getElementById('newPassword').value;
    const newPwdConfirm = document.getElementById('newPasswordConfirm').value;
    const errorEl = document.getElementById('changeCredsError');
    errorEl.textContent = '';

    const auth = getAuthData();
    const currentHash = await hashPassword(currentPwd, auth.salt);
    if (currentHash !== auth.passwordHash) { errorEl.textContent = 'Password attuale errata.'; return; }
    if (!newUsername || !newPwd) { errorEl.textContent = 'Compila tutti i campi.'; return; }
    if (newPwd !== newPwdConfirm) { errorEl.textContent = 'Le nuove password non corrispondono.'; return; }
    if (newPwd.length < 6) { errorEl.textContent = 'Password troppo corta (min. 6 caratteri).'; return; }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPwd, newSalt);
    saveAuthData(newUsername, newHash, newSalt);
    document.getElementById('changeCredsModal').style.display = 'none';
    ['currentPassword', 'newUsername', 'newPassword', 'newPasswordConfirm'].forEach(id => {
        document.getElementById(id).value = '';
    });
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('gymLoggedIn');
    location.reload();
});

function initAuth() {
    const auth = getAuthData();
    if (sessionStorage.getItem('gymLoggedIn') === '1' && auth) {
        showApp();
    } else if (!auth) {
        document.getElementById('setupSection').style.display = 'block';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('loginOverlay').style.display = 'flex';
    } else {
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('loginOverlay').style.display = 'flex';
    }
}

initAuth();