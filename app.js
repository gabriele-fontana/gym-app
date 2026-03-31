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