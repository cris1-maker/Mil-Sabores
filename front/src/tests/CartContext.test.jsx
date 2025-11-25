// src/tests/CartContext.test.jsx

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../components/CartContext';

// --- Mock de Productos ---
const producto1 = { id: 1, nombre: 'Torta de Chocolate', precio: 100 };
const producto2 = { id: 2, nombre: 'Pie de Limón', precio: 200 };

// --- Helper de Renderizado del Hook ---
// Esta función nos permite "montar" nuestro hook dentro del proveedor de contexto.
const renderCartHook = () => {
  // El 'wrapper' le dice a React Testing Library que renderice nuestro hook dentro de CartProvider.
  const { result } = renderHook(() => useCart(), {
    wrapper: CartProvider,
  });
  return result;
};


// --- Suite de Tests para la lógica del CartContext ---
describe('Lógica del CartContext', () => {

  it('debe inicializar con un carrito vacío', () => {
    const result = renderCartHook();
    expect(result.current.carrito).toEqual([]);
  });

  it('debe agregar un nuevo producto al carrito', () => {
    const result = renderCartHook();

    // 'act' es necesario porque esta acción causa una actualización de estado en React.
    act(() => {
      result.current.agregarAlCarrito(producto1, 2);
    });

    // Verificamos que el carrito ahora contenga el producto agregado.
    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0]).toEqual({ ...producto1, cantidad: 2 });
  });

  it('debe incrementar la cantidad si se agrega un producto existente', () => {
    const result = renderCartHook();

    // Agregamos el producto1 una vez
    act(() => {
      result.current.agregarAlCarrito(producto1, 1);
    });
    // Agregamos el mismo producto1 otra vez
    act(() => {
      result.current.agregarAlCarrito(producto1, 2);
    });

    // Verificamos que solo hay un item en el carrito, pero su cantidad es 3.
    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].cantidad).toBe(3);
  });
  
  it('debe eliminar un producto del carrito', () => {
    const result = renderCartHook();

    // Agregamos dos productos
    act(() => {
      result.current.agregarAlCarrito(producto1, 1);
      result.current.agregarAlCarrito(producto2, 1);
    });
    
    // Eliminamos el producto1
    act(() => {
      result.current.eliminarDelCarrito(producto1.id);
    });

    // Verificamos que solo queda el producto2 en el carrito.
    expect(result.current.carrito).toHaveLength(1);
    expect(result.current.carrito[0].id).toBe(producto2.id);
  });
  
  it('debe actualizar la cantidad de un producto', () => {
    const result = renderCartHook();
    
    act(() => {
      result.current.agregarAlCarrito(producto1, 1);
    });

    // Actualizamos la cantidad a 5
    act(() => {
      result.current.actualizarCantidad(producto1.id, 5);
    });

    expect(result.current.carrito[0].cantidad).toBe(5);
  });

  it('debe vaciar el carrito por completo', () => {
    const result = renderCartHook();
    
    act(() => {
      result.current.agregarAlCarrito(producto1, 1);
      result.current.agregarAlCarrito(producto2, 1);
    });

    // Verificamos que el carrito tiene 2 items.
    expect(result.current.carrito).toHaveLength(2);

    // Vaciamos el carrito.
    act(() => {
      result.current.vaciarCarrito();
    });

    // Verificamos que el carrito ahora está vacío.
    expect(result.current.carrito).toHaveLength(0);
  });
});