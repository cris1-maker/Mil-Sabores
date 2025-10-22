// src/tests/setup.js
import "@testing-library/jest-dom";
import { vi } from "vitest";   // ✅ necesario para usar vi.fn()

// Mock Materialize (por si tu app lo usa en el DOM)
global.window ??= {};
global.window.M = {
  Sidenav: { init: () => {} },
  toast: () => {},
};

// Mock alert usado por AuthModal (Forgot password?)
global.alert = vi.fn();        // ✅ evita que truene por alert

// Mock crypto.randomUUID para IDs del AuthContext
if (!global.crypto) global.crypto = {};
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => `uuid-${Math.random().toString(16).slice(2)}`;
}

// Limpieza entre pruebas
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});
