// src/tests/Carrito.test.jsx

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import Carrito from '../pages/Carrito.jsx';
import { CartContext } from '../components/CartContext.jsx';

const mockCarritoConItems = [
  { id: 1, nombre: 'Pastel de Chocolate', precio: 10000, cantidad: 2, imagen: 'img1.jpg' },
  { id: 2, nombre: 'Kuchen de Manzana', precio: 8000, cantidad: 1, imagen: 'img2.jpg' },
];

const renderCarrito = (carritoItems) => {
  const mockCartContext = { carrito: carritoItems, /* ...otras funciones mockeadas... */ };
  return render(
    <BrowserRouter>
      <CartContext.Provider value={mockCartContext}>
        <Carrito />
      </CartContext.Provider>
    </BrowserRouter>
  );
};

describe('Página: Carrito', () => {
  it('debe mostrar un mensaje si el carrito está vacío', () => {
    renderCarrito([]);
    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it('debe mostrar los productos y el total correcto si el carrito tiene items', () => {
    renderCarrito(mockCarritoConItems);

    expect(screen.getByText('Pastel de Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Kuchen de Manzana')).toBeInTheDocument();
    
    // Verificamos el subtotal del pastel
    expect(screen.getByText('$20.000')).toBeInTheDocument();

    // 👇 ESTA ES LA CORRECCIÓN CLAVE
    // En la fila del Kuchen, el precio y el subtotal son iguales ($8.000).
    // Usamos getAllByText y verificamos que existan 2 instancias de ese precio.
    const preciosKuchen = screen.getAllByText('$8.000');
    expect(preciosKuchen).toHaveLength(2);

    // Verificamos el total final
    const totalElement = screen.getByText(/Total:/i);
    expect(totalElement).toHaveTextContent('Total: $28.000');
  });
});