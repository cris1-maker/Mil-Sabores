// src/tests/ProductoCard.test.jsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import ProductoCard from '../components/ProductoCard.jsx';
import { CartContext } from '../components/CartContext.jsx';

const mockProducto = {
  id: 1,
  nombre: 'Torta de Mil Hojas',
  precio: 25000,
  imagen: 'ruta/a/torta.jpg',
};

const renderWithContext = (mockFunction) => {
  return render(
    <CartContext.Provider value={{ agregarAlCarrito: mockFunction }}>
      <ProductoCard producto={mockProducto} />
    </CartContext.Provider>
  );
};

describe('Componente: ProductoCard', () => {

  it('debe llamar a agregarAlCarrito con la cantidad seleccionada por el usuario', () => {
    const agregarAlCarritoMock = vi.fn();
    renderWithContext(agregarAlCarritoMock);

    // 1. Buscamos el input de cantidad
    const inputCantidad = screen.getByRole('spinbutton');
    // 2. Buscamos el botón, que al inicio está deshabilitado
    const botonAgregar = screen.getByRole('button', { name: /agregar/i });
    expect(botonAgregar).toBeDisabled();

    // 3. SIMULAMOS AL USUARIO: Cambiamos la cantidad a 2
    fireEvent.change(inputCantidad, { target: { value: '2' } });

    // 4. Ahora el botón debería estar habilitado
    expect(botonAgregar).toBeEnabled();

    // 5. Hacemos clic en el botón
    fireEvent.click(botonAgregar);

    // 6. Verificamos que la función fue llamada con la cantidad correcta (2)
    expect(agregarAlCarritoMock).toHaveBeenCalledWith(mockProducto, 2);
  });
});