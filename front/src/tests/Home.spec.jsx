// src/tests/Home.spec.jsx
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App.jsx";
import { AuthProvider } from "../components/AuthContext.jsx";

describe("Home/App", () => {
  test("renderiza la marca Mil Sabores en el navbar", () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <App />
        </MemoryRouter>
      </AuthProvider>
    );

    const nav = screen.getByRole("navigation");
    expect(
      within(nav).getByRole("link", { name: /^Mil Sabores$/i })
    ).toBeInTheDocument();
  });
});
