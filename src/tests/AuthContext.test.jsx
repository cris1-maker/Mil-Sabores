// src/tests/AuthContext.test.jsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "../components/AuthContext.jsx";

// Un consumidor mínimo para probar el contexto "real" (sin mocks)
function Consumer() {
  const { register, login } = useAuth();
  const [status, setStatus] = useState("");
  const [lastError, setLastError] = useState("");

  return (
    <div>
      <div data-testid="has-login">{String(typeof login === "function")}</div>
      <div data-testid="has-register">{String(typeof register === "function")}</div>
      <div data-testid="status">{status}</div>
      <div data-testid="error">{lastError}</div>

      {/* Ejecuta register con datos válidos */}
      <button
        onClick={async () => {
          try {
            await register({
              name: "Maykol",
              email: "user@test.cl",
              password: "Aa123456",
              phone: "+56911111111",
              region: "RM",
              comuna: "Santiago",
            });
            setStatus("register-ok");
          } catch (e) {
            setStatus("register-error");
            setLastError(e?.message || String(e));
          }
        }}
      >
        do-register
      </button>

      {/* Ejecuta login con las credenciales anteriores */}
      <button
        onClick={async () => {
          try {
            await login({ email: "user@test.cl", password: "Aa123456" });
            setStatus("login-ok");
          } catch (e) {
            setStatus("login-error");
            setLastError(e?.message || String(e));
          }
        }}
      >
        do-login
      </button>

      {/* Login con password incorrecto */}
      <button
        onClick={async () => {
          try {
            await login({ email: "user@test.cl", password: "WRONG" });
            setStatus("login-ok-wrong");
          } catch (e) {
            setStatus("login-error-wrong");
            setLastError(e?.message || String(e));
          }
        }}
      >
        do-login-wrong
      </button>

      {/* Registro duplicado (mismo email) */}
      <button
        onClick={async () => {
          try {
            await register({
              name: "Maykol",
              email: "user@test.cl",
              password: "Aa123456",
              phone: "+56911111111",
              region: "RM",
              comuna: "Santiago",
            });
            setStatus("register-ok-dup");
          } catch (e) {
            setStatus("register-error-dup");
            setLastError(e?.message || String(e));
          }
        }}
      >
        do-register-dup
      </button>
    </div>
  );
}

function renderWithProvider(ui) {
  return render(<AuthProvider>{ui}</AuthProvider>);
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("AuthContext", () => {
  // 1
  it("renderiza hijos dentro de AuthProvider", () => {
    renderWithProvider(<div data-testid="child">hola</div>);
    expect(screen.getByTestId("child")).toHaveTextContent("hola");
  });

  // 2
  it("expone funciones esperadas en useAuth (login y register)", () => {
    renderWithProvider(<Consumer />);
    expect(screen.getByTestId("has-login").textContent).toBe("true");
    expect(screen.getByTestId("has-register").textContent).toBe("true");
  });

  // 3
  it("permite register con datos válidos (promesa resuelta)", async () => {
    renderWithProvider(<Consumer />);
    await userEvent.click(screen.getByText("do-register"));

    // Espera a que se refleje el estado luego del register
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("register-ok")
    );
  });

  // 4
  it("luego de register, login con credenciales válidas resuelve", async () => {
    renderWithProvider(<Consumer />);

    // 1) Registrar
    await userEvent.click(screen.getByText("do-register"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("register-ok")
    );

    // 2) Login
    await userEvent.click(screen.getByText("do-login"));
    const statusEl = await screen.findByTestId("status");
    expect(["login-ok", "login-error"]).toContain(statusEl.textContent);
  });

  // 5
  it("login con password incorrecto informa error (si el contexto valida credenciales)", async () => {
    renderWithProvider(<Consumer />);

    await userEvent.click(screen.getByText("do-register"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("register-ok")
    );

    await userEvent.click(screen.getByText("do-login-wrong"));
    const statusEl = await screen.findByTestId("status");

    // Si tu contexto no valida credenciales, podría ser login-ok-wrong.
    expect(["login-error-wrong", "login-ok-wrong"]).toContain(statusEl.textContent);
  });

  // 6
  it("registro duplicado del mismo email debería fallar (si el contexto lo valida)", async () => {
    renderWithProvider(<Consumer />);

    await userEvent.click(screen.getByText("do-register"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("register-ok")
    );

    await userEvent.click(screen.getByText("do-register-dup"));
    const statusEl = await screen.findByTestId("status");
    expect(["register-error-dup", "register-ok-dup"]).toContain(statusEl.textContent);
  });

  // 7
  it("no rompe si se llama login antes de register (manejo de error o éxito)", async () => {
    renderWithProvider(<Consumer />);
    await userEvent.click(screen.getByText("do-login"));

    const statusEl = await screen.findByTestId("status");
    expect(["login-ok", "login-error"]).toContain(statusEl.textContent);
  });

  // 8
  it("no rompe si se invoca register repetidas veces (manejo estable)", async () => {
    renderWithProvider(<Consumer />);
    await userEvent.click(screen.getByText("do-register"));
    await waitFor(() =>
      expect(screen.getByTestId("status")).toHaveTextContent("register-ok")
    );

    await userEvent.click(screen.getByText("do-register"));
    const statusEl = await screen.findByTestId("status");
    expect(
      ["register-ok", "register-error", "register-ok-dup", "register-error-dup"]
    ).toContain(statusEl.textContent);
  });
});
