// src/utils/auth.js
// UTILIDAD “PLAIN JS” (sin React hooks) para manejar Login/Registro como en tu HTML original.

let cleanupFns = [];

// Helpers DOM
function $(sel, scope = document) { return scope.querySelector(sel); }
function $all(sel, scope = document) { return [...scope.querySelectorAll(sel)]; }

// Abrir popup y cambiar pestaña
export function openAuth(tab = "login") {
  const wrapperEl = $("#authWrapper") || $(".wrapper");
  if (!wrapperEl) return;

  wrapperEl.classList.add("active-popup");

  const tabLogin = $("#tab-login");
  const tabRegister = $("#tab-register");
  const isLogin = tab === "login";
  if (tabLogin && tabRegister) {
    tabLogin.setAttribute("aria-hidden", String(!isLogin));
    tabRegister.setAttribute("aria-hidden", String(isLogin));
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Inicializa listeners del popup / selects / validaciones
 * @param {{ onSuccess?: () => void }} options
 * @returns {() => void} cleanup
 */
export function initAuth(options = {}) {
  const onSuccess = typeof options.onSuccess === "function" ? options.onSuccess : null;

  // ======= Cache de elementos
  const wrapperEl  = $("#authWrapper") || $(".wrapper");
  const btnLoginSup = $("#btnLoginSup");
  const iconClose   = $(".icon-close");
  const tabLogin    = $("#tab-login");
  const tabRegister = $("#tab-register");

  const selRegion = $("#regRegion");
  const selComuna = $("#regComuna");
  const listaCiudades = $("#listaCiudades");

  // ======= DATA
  const regiones = {
    RM: ["Santiago","Puente Alto","Maipú","La Florida","Las Condes"],
    V: ["Valparaíso","Viña del Mar","Quilpué","San Antonio","La Calera"],
    VIII: ["Concepción","Talcahuano","Chillán","Los Ángeles","Coronel"],
    X: ["Puerto Montt","Osorno","Castro","Ancud","Puerto Varas"],
    II: ["Antofagasta","Calama","Tocopilla","Mejillones","María Elena"],
  };

  // ======= UI helpers
  function initSelects(scope = document) {
    if (window.M?.FormSelect) {
      const elems = scope.querySelectorAll("select");
      window.M.FormSelect.init(elems);
    }
  }

  function llenarComunas(region) {
    if (!selComuna) return;
    selComuna.innerHTML = '<option value="" disabled selected>Seleccionar comuna</option>';
    (regiones[region] || []).forEach((c) => {
      const op = document.createElement("option");
      op.value = c;
      op.textContent = c;
      selComuna.appendChild(op);
    });
    initSelects(document);
    if (listaCiudades) {
      const arr = regiones[region] || [];
      listaCiudades.innerHTML = arr.length
        ? `<div style="margin-top:6px;">
             <strong>Comunas disponibles:</strong>
             <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px;">
               ${arr.map(c => `<span style="padding:6px 10px;border-radius:16px;border:1px solid rgba(255,255,255,.3);display:inline-block;">${c}</span>`).join("")}
             </div>
           </div>`
        : "";
    }
  }

  // ======= Validadores
  function phoneOk(value) {
    const clean = value.replace(/\D/g, "");
    return /^9\d{8}$/.test(clean) || /^569\d{8}$/.test(clean);
  }
  function passwordOk(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
  }

  // ======= Storage
  function saveUserLocal(user) {
    localStorage.setItem("milSaboresUser", JSON.stringify(user));
  }
  function getUserLocal() {
    try { return JSON.parse(localStorage.getItem("milSaboresUser") || "null"); }
    catch { return null; }
  }

  // ======= Listeners básicos
  if (iconClose) {
    const fn = () => wrapperEl?.classList.remove("active-popup");
    iconClose.addEventListener("click", fn);
    cleanupFns.push(() => iconClose.removeEventListener("click", fn));
  }

  if (btnLoginSup) {
    const fn = (e) => { e.preventDefault(); openAuth("login"); };
    btnLoginSup.addEventListener("click", fn);
    cleanupFns.push(() => btnLoginSup.removeEventListener("click", fn));
  }

  // Links dentro del popup: .register-link / .login-link con data-target
  const delegateFn = (e) => {
    const link = e.target.closest(".register-link, .login-link");
    if (!link) return;
    e.preventDefault();
    const target = link.dataset.target; // "tab-login" | "tab-register"
    openAuth(target === "tab-register" ? "register" : "login");
  };
  document.addEventListener("click", delegateFn);
  cleanupFns.push(() => document.removeEventListener("click", delegateFn));

  // Region/Comuna
  if (selRegion) {
    const fn = () => llenarComunas(selRegion.value);
    selRegion.addEventListener("change", fn);
    cleanupFns.push(() => selRegion.removeEventListener("change", fn));
  }

  // ======= Registro
  const regForm = $("#form-register");
  if (regForm) {
    const regNombre = $("#regNombre");
    const regEmail  = $("#regEmail");
    const regEmail2 = $("#regEmail2");
    const regTel    = $("#regTelefono");
    const regPass   = $("#regPassword");
    const regPass2  = $("#regPassword2");
    const regTerms  = $("#regTerms");

    const submitReg = (e) => {
      if (!regForm.checkValidity()) { e.preventDefault(); regForm.reportValidity(); return; }

      if (!phoneOk(regTel.value)) { e.preventDefault(); alert("Ingresa un teléfono válido en Chile (ej: +56 9 12345678 o 912345678)."); regTel.focus(); return; }
      if (!passwordOk(regPass.value)) { e.preventDefault(); alert("La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número."); regPass.focus(); return; }
      if (regEmail.value.trim().toLowerCase() !== regEmail2.value.trim().toLowerCase()) { e.preventDefault(); alert("Los correos no coinciden."); regEmail2.focus(); return; }
      if (regPass.value !== regPass2.value) { e.preventDefault(); alert("Las contraseñas no coinciden."); regPass2.focus(); return; }
      if (!selRegion?.value) { e.preventDefault(); alert("Selecciona una región."); selRegion.focus(); return; }
      if (!selComuna?.value) { e.preventDefault(); alert("Selecciona una comuna."); selComuna.focus(); return; }
      if (!regTerms?.checked) { e.preventDefault(); alert("Debes aceptar los términos."); regTerms.focus(); return; }

      e.preventDefault();
      const user = {
        nombre: regNombre.value.trim(),
        email:  regEmail.value.trim().toLowerCase(),
        telefono: regTel.value.trim(),
        region: selRegion.value,
        comuna: selComuna.value,
        password: regPass.value
      };
      saveUserLocal(user);
      alert("¡Registro correcto! Ahora inicia sesión.");
      openAuth("login");
    };

    regForm.addEventListener("submit", submitReg);
    cleanupFns.push(() => regForm.removeEventListener("submit", submitReg));
  }

  // ======= Login
  const loginForm = $("#form-login");
  if (loginForm) {
    const loginEmail = $("#loginEmail");
    const loginPass  = $("#loginPassword");

    const submitLogin = (e) => {
      if (!loginForm.checkValidity()) { e.preventDefault(); loginForm.reportValidity(); return; }
      e.preventDefault();

      const u = getUserLocal();
      const email = loginEmail.value.trim().toLowerCase();
      const pass  = loginPass.value;

      if (!u) { alert("Correo no registrado. Por favor, crea una cuenta."); openAuth("register"); return; }
      if (email !== u.email) { alert("Correo no registrado."); return; }
      if (pass !== u.password) { alert("Contraseña incorrecta."); return; }

      if (onSuccess) onSuccess();
    };

    loginForm.addEventListener("submit", submitLogin);
    cleanupFns.push(() => loginForm.removeEventListener("submit", submitLogin));
  }

  // ======= Inicializaciones suaves
  initSelects(document);
  if (selRegion?.value) llenarComunas(selRegion.value);
  if (window.M?.Sidenav) window.M.Sidenav.init($all(".sidenav"));

  // No abrimos popup por defecto (opcional): // openAuth("login");

  // devolver cleanup
  return function cleanup() {
    cleanupFns.forEach((fn) => { try { fn(); } catch {} });
    cleanupFns = [];
  };
}
