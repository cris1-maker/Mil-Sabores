// src/utils/validators.js
// ========================================================
// Funciones de validación reutilizables para el registro/login
// ========================================================

// ✅ Verifica que el string tenga formato de correo válido
export function isEmail(s = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
}

// ✅ Verifica que la contraseña sea fuerte:
// - al menos 8 caracteres
// - una mayúscula
// - una minúscula
// - un número
export function isStrongPassword(p = "") {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(String(p));
}

// ✅ Verifica número telefónico chileno válido
// Formatos aceptados: +569XXXXXXXX o 9XXXXXXXX
export function isPhoneCL(t = "") {
  const s = String(t).replace(/\s+/g, "");
  return /^(\+?56)?9\d{8}$/.test(s) || /^9\d{8}$/.test(s);
}

// ✅ Verifica número de casa o departamento
// Acepta 1–6 dígitos y sufijos opcionales tipo A, B, -A, /B, etc.
export function isHouseNumber(n = "") {
  const s = String(n).trim();
  return /^[0-9]{1,6}([A-Za-z\-\/]{0,3})?$/.test(s);
}

// (Opcional extra) — puedes agregar más validadores según necesites
// Ejemplo: validar RUT chileno, fechas, direcciones, etc.
// ========================================================
