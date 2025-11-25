// Claves que se usan en localStorage
export const LS = {
  USERS: "ms:users",
  SESSION: "ms:session",
};

// Leer un valor del localStorage y parsearlo como JSON
export const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

// Guardar un valor en localStorage
export const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Eliminar una clave del localStorage
export const del = (key) => {
  localStorage.removeItem(key);
};
