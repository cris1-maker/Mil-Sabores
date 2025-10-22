// src/tests/NavBar.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../components/AuthContext.jsx";
import { vi } from "vitest";
import NavBar from "../components/NavBar.jsx";

beforeEach(() => {
  global.window.M = global.window.M || {};
  window.M.Sidenav = window.M.Sidenav || {};
  window.M.Sidenav.init = vi.fn();
  window.M.Sidenav.getInstance = vi.fn(() => ({ close: vi.fn() }));
});

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe("NavBar", () => {
  it("renderiza enlaces básicos (Inicio, Productos, Admin)", () => {
    renderWithProviders(<NavBar />);
    expect(screen.getAllByRole("link", { name: /inicio/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /productos/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /admin/i })[0]).toBeInTheDocument();
  });

  it("inicializa el sidenav de Materialize al montar", () => {
    renderWithProviders(<NavBar />);
    expect(window.M.Sidenav.init).toHaveBeenCalled();
  });

  it("cierra el sidenav móvil cuando se hace click dentro", () => {
  renderWithProviders(<NavBar />)

  const getInstance = window.M.Sidenav.getInstance
  // ⚠️ hay dos <ul role="list">; tomamos el móvil por id:
  const mobile = document.getElementById("mobile-nav")
  expect(mobile).toBeTruthy()

  // Simulamos un click dentro del menú móvil
  fireEvent.click(mobile)

  expect(getInstance).toHaveBeenCalled()
  const instance = getInstance.mock.results[0].value
  expect(instance.close).toHaveBeenCalled()
  });
});
