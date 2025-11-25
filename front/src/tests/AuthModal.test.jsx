// src/tests/AuthModal.test.jsx
import React from "react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

/**
 * Mocks con rutas LITERALES que coinciden EXACTO con lo que importa AuthModal.jsx
 * (fíjate en las extensiones):
 *   "./AuthContext.jsx"        -> desde el test es "../components/AuthContext.jsx"
 *   "../utils/regiones.js"     -> "../utils/regiones.js"
 *   "../utils/validators.js"   -> "../utils/validators.js"
 */

// Mock AuthContext
vi.mock("../components/AuthContext.jsx", () => {
  const rememberState = { current: false };
  return {
    useAuth: () => ({
      login: vi.fn().mockResolvedValue({ ok: true }),
      register: vi.fn().mockResolvedValue({ ok: true }),
      remember: rememberState.current,
      setRemember: (v) => (rememberState.current = v),
    }),
    AuthProvider: ({ children }) => <>{children}</>,
  };
});

// Mock regiones
vi.mock("../utils/regiones.js", () => ({
  REGIONES: [{ nombre: "Región Metropolitana", comunas: ["Santiago", "Providencia"] }],
}));

// Mock validators
vi.mock("../utils/validators.js", () => ({
  isEmail: (s) => /\S+@\S+\.\S+/.test(s),
  isPhoneCL: () => true,
  isStrongPassword: () => true,
}));

/**
 * Import DINÁMICO del SUT DESPUÉS de definir los mocks.
 * Esto evita problemas de hoisting/TDZ con Vitest.
 */
let AuthModal;
beforeAll(async () => {
  const mod = await import("../components/AuthModal.jsx");
  AuthModal = mod?.default;
});

it("sanidad: AuthModal es una función (export default correcto)", () => {
  expect(typeof AuthModal).toBe("function");
});

describe("AuthModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("no renderiza nada cuando open=false", () => {
    render(<AuthModal open={false} onClose={() => {}} startOn="login" />);
    expect(screen.queryByRole("heading", { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /register/i })).not.toBeInTheDocument();
  });

  it("muestra Login por defecto y valida mensajes de error básicos", async () => {
    render(<AuthModal open={true} onClose={() => {}} startOn="login" />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();

    const btnLogin = screen.getByRole("button", { name: /^login$/i });

    await fireEvent.click(btnLogin);
    expect(screen.getByText(/ingresa un correo válido\./i)).toBeInTheDocument();

    await fireEvent.change(screen.getByPlaceholderText(/tucorreo@dominio\.cl/i), {
      target: { value: "a@b.cl" },
    });
    await fireEvent.click(btnLogin);
    expect(screen.getByText(/ingresa tu contraseña\./i)).toBeInTheDocument();

    await fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "Abcdefg1" },
    });
    await fireEvent.click(btnLogin);
    expect(await screen.findByText(/✅ sesión iniciada\./i)).toBeInTheDocument();
  });

  it("permite cambiar de Login a Register", async () => {
    render(<AuthModal open={true} onClose={() => {}} startOn="login" />);
    await fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();
  });

  it("con registro válido, muestra mensaje de éxito", async () => {
    render(<AuthModal open={true} onClose={() => {}} startOn="register" />);

    await fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: "Maykol Vargas" } });
    await fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "maykol@test.cl" } });
    await fireEvent.change(screen.getByLabelText(/confirmar email/i), { target: { value: "maykol@test.cl" } });
    await fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "+56912345678" } });
    await fireEvent.change(screen.getByLabelText(/seleccionar región/i), { target: { value: "Región Metropolitana" } });
    await fireEvent.change(screen.getByLabelText(/seleccionar comuna/i), { target: { value: "Santiago" } });
    await fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "Fuerte123" } });
    await fireEvent.change(screen.getByLabelText(/confirmar password/i), { target: { value: "Fuerte123" } });
    await fireEvent.click(screen.getByLabelText(/acepto los términos y condiciones/i));
    await fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(await screen.findByText(/✅ cuenta creada y sesión iniciada\./i)).toBeInTheDocument();
  });
});
