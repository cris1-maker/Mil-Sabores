// src/tests/carrusel.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

// ✅ HOIST: define spies antes del mock
const { initCarouselSpy, initDropdownSpy, initSidenavSpy } = vi.hoisted(() => ({
  initCarouselSpy: vi.fn(() => [{ next: vi.fn(), destroy: vi.fn() }]),
  initDropdownSpy: vi.fn(() => []),
  initSidenavSpy: vi.fn(() => []),
}));

// ✅ Mock de materialize-css con TODOS los init que usa tu hook
vi.mock("materialize-css", () => ({
  default: {
    Carousel: { init: initCarouselSpy },
    Dropdown: { init: initDropdownSpy },
    Sidenav:  { init: initSidenavSpy },
  }
}));

// 👇 IMPORTA el hook real
import { useCarrusel } from "../utils/carrusel.js";

function CarruselHarness({ onImageClick }) {
  useCarrusel({
    carouselOptions: { fullWidth: true, indicators: false },
    frases: ["Uno", "Dos"],
    onImageClick,
    intervalMs: 1000
  });
  return (
    <div>
      <div id="carrusel-frase" data-testid="frase"></div>
      <div id="myCarousel" className="carousel">
        <div className="carousel-item"><img alt="img1" /></div>
        <div className="carousel-item"><img alt="img2" /></div>
      </div>
    </div>
  );
}

describe("useCarrusel", () => {
  it("inicializa Materialize (Carousel/Dropdown/Sidenav)", () => {
    render(<CarruselHarness />);
    expect(initCarouselSpy).toHaveBeenCalled();
    expect(initDropdownSpy).toHaveBeenCalled();
    expect(initSidenavSpy).toHaveBeenCalled();
  });

  it("dispara onImageClick al clickear una imagen", () => {
    const onImageClick = vi.fn();
    render(<CarruselHarness onImageClick={onImageClick} />);
    const img = screen.getAllByRole("img")[0];
    fireEvent.click(img);
    expect(onImageClick).toHaveBeenCalled();
  });
});
