import { render, screen } from "@testing-library/react"
import React from "react"
import Footer from "../components/Footer.jsx"

describe("Footer", () => {
  it("muestra el texto de derechos reservados y el año 2025", () => {
    render(<Footer />)
    expect(screen.getByText(/mil sabores/i)).toBeInTheDocument()
    expect(screen.getByText(/2025/i)).toBeInTheDocument()
    expect(screen.getByText(/todos los derechos reservados/i)).toBeInTheDocument()
  })
})