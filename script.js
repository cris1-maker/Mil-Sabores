// ===================== POPUP básico (abrir/cerrar) =====================
const wrapperEl = document.getElementById('authWrapper') || document.querySelector('.wrapper');
const btnLoginSup = document.querySelector('#btnLoginSup');
const iconClose = document.querySelector('.icon-close');

if (iconClose) iconClose.addEventListener('click', () => wrapperEl?.classList.remove('active-popup'));
if (btnLoginSup) btnLoginSup.addEventListener('click', () => {
  wrapperEl?.classList.add('active-popup');
  showTab('tab-login');
});

// ============================ APP ============================
(function () {
  const MAIN_URL = 'index.html';

  // ---------- Helpers ----------
  function phoneOk(value) {
    // acepta: +56 9 12345678 / +56912345678 / 9 1234 5678 / 912345678
    const clean = value.replace(/\D/g, '');
    return /^9\d{8}$/.test(clean) || /^569\d{8}$/.test(clean);
  }

  function passwordOk(value) {
    // 8+, 1 minúscula, 1 mayúscula, 1 dígito
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
  }

  function saveUserLocal(user) {
    localStorage.setItem('milSaboresUser', JSON.stringify(user));
  }
  function getUserLocal() {
    try { return JSON.parse(localStorage.getItem('milSaboresUser') || 'null'); }
    catch { return null; }
  }

  function initSelects(scope = document) {
    if (window.M && M.FormSelect) {
      const elems = scope.querySelectorAll('select');
      M.FormSelect.init(elems);
    }
  }

  // ---------- Tabs: Login / Register (una visible) ----------
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');

  function showTab(tabId) {
    const isLogin = tabId === 'tab-login';
    if (tabLogin && tabRegister) {
      tabLogin.setAttribute('aria-hidden', String(!isLogin));
      tabRegister.setAttribute('aria-hidden', String(isLogin));
    }
    if (wrapperEl) wrapperEl.classList.toggle('active', !isLogin); // por si tu CSS usa .active para “registro”
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delegación: links que cambian de pestaña
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.register-link, .login-link');
    if (!link) return;
    e.preventDefault();
    const target = link.dataset.target; // "tab-login" | "tab-register"
    if (target) showTab(target);
  });

  // ---------- Región → Comuna ----------
  const regiones = {
    'RM': ['Santiago', 'Puente Alto', 'Maipú', 'La Florida', 'Las Condes'],
    'V' : ['Valparaíso', 'Viña del Mar', 'Quilpué', 'San Antonio', 'La Calera'],
    'VIII': ['Concepción', 'Talcahuano', 'Chillán', 'Los Ángeles', 'Coronel'],
    'X' : ['Puerto Montt', 'Osorno', 'Castro', 'Ancud', 'Puerto Varas'],
    'II': ['Antofagasta', 'Calama', 'Tocopilla', 'Mejillones', 'María Elena']
  };

  const selRegion = document.getElementById('regRegion');
  const selComuna = document.getElementById('regComuna');
  const listaCiudades = document.getElementById('listaCiudades');

  function llenarComunas(region) {
    if (!selComuna) return;
    selComuna.innerHTML = '<option value="" disabled selected>Seleccionar comuna</option>';
    (regiones[region] || []).forEach(c => {
      const op = document.createElement('option');
      op.value = c;
      op.textContent = c;
      selComuna.appendChild(op);
    });
    // Re-inicializar el select de Comuna tras cambiar options
    initSelects(document);
  }

  if (selRegion) {
    selRegion.addEventListener('change', () => {
      const r = selRegion.value;
      llenarComunas(r);
      const arr = regiones[r] || [];
      if (listaCiudades) {
        listaCiudades.innerHTML = arr.length
          ? `<div style="margin-top:6px;">
               <strong>Comunas disponibles:</strong>
               <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
                 ${arr.map(c => `<span style="padding:6px 10px;border-radius:16px;border:1px solid rgba(255,255,255,.3);display:inline-block;">${c}</span>`).join('')}
               </div>
             </div>`
          : '';
      }
    });
  }

  // ---------- Registro ----------
  const regForm = document.getElementById('form-register');
  if (regForm) {
    const regNombre = document.getElementById('regNombre');
    const regEmail  = document.getElementById('regEmail');
    const regEmail2 = document.getElementById('regEmail2');
    const regTel    = document.getElementById('regTelefono');
    const regPass   = document.getElementById('regPassword');
    const regPass2  = document.getElementById('regPassword2');
    const regTerms  = document.getElementById('regTerms');

    regForm.addEventListener('submit', (e) => {
      if (!regForm.checkValidity()) { e.preventDefault(); regForm.reportValidity(); return; }

      // Teléfono robusto
      if (!phoneOk(regTel.value)) {
        e.preventDefault(); alert('Ingresa un teléfono válido en Chile (ej: +56 9 12345678 o 912345678).');
        regTel.focus(); return;
      }
      // Contraseña robusta
      if (!passwordOk(regPass.value)) {
        e.preventDefault(); alert('La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.');
        regPass.focus(); return;
      }
      // Confirmaciones
      if (regEmail.value.trim().toLowerCase() !== regEmail2.value.trim().toLowerCase()) {
        e.preventDefault(); alert('Los correos no coinciden.'); regEmail2.focus(); return;
      }
      if (regPass.value !== regPass2.value) {
        e.preventDefault(); alert('Las contraseñas no coinciden.'); regPass2.focus(); return;
      }
      // Región/Comuna/Términos
      if (!selRegion?.value) { e.preventDefault(); alert('Selecciona una región.'); selRegion.focus(); return; }
      if (!selComuna?.value) { e.preventDefault(); alert('Selecciona una comuna.'); selComuna.focus(); return; }
      if (!regTerms?.checked) { e.preventDefault(); alert('Debes aceptar los términos.'); regTerms.focus(); return; }

      // Guardar y volver a Login
      e.preventDefault();
      const user = {
        nombre: regNombre.value.trim(),
        email:  regEmail.value.trim().toLowerCase(),
        telefono: regTel.value.trim(),
        region: selRegion.value,
        comuna: selComuna.value,
        // DEMO: no guardes así en producción
        password: regPass.value
      };
      saveUserLocal(user);
      alert('¡Registro correcto! Ahora inicia sesión.');
      showTab('tab-login');
    });
  }

  // ---------- Login ----------
  const loginForm = document.getElementById('form-login');
  if (loginForm) {
    const loginEmail = document.getElementById('loginEmail');
    const loginPass  = document.getElementById('loginPassword');

    loginForm.addEventListener('submit', (e) => {
      // Sólo required + email; sin patrones extra en password
      if (!loginForm.checkValidity()) { e.preventDefault(); loginForm.reportValidity(); return; }
      e.preventDefault();

      const u = getUserLocal();
      const email = loginEmail.value.trim().toLowerCase();
      const pass  = loginPass.value;

      if (!u) { alert('Correo no registrado. Por favor, crea una cuenta.'); showTab('tab-register'); return; }
      if (email !== u.email) { alert('Correo no registrado.'); return; }
      if (pass !== u.password) { alert('Contraseña incorrecta.'); return; }

      window.location.href = MAIN_URL; // redirigir al main
    });
  }

  // ---------- Inicio ----------
  document.addEventListener('DOMContentLoaded', () => {
    initSelects(document);           
    if (selRegion && selRegion.value) llenarComunas(selRegion.value); // por si hay preselección
    showTab('tab-login');               
  });
})();
