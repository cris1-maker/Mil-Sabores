// src/components/CartContext.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto, cantidad) => {
    if (cantidad < 1) return;
    setCarrito(currentCarrito => {
      const productoExistente = currentCarrito.find(item => item.id === producto.id);
      if (productoExistente) {
        return currentCarrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      } else {
        return [...currentCarrito, { ...producto, cantidad }];
      }
    });
    toast.success(`"${producto.nombre}" agregado al carrito!`, { position: "bottom-right", autoClose: 2000 });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(currentCarrito => currentCarrito.filter(item => item.id !== productoId));
    toast.error("Producto eliminado.", { position: "bottom-right", autoClose: 2000 });
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      setCarrito(currentCarrito =>
        currentCarrito.map(item => item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item)
      );
    }
  };

  const vaciarCarrito = () => setCarrito([]);
   // 👇 total de ítems en el carrito
  const totalItems = useMemo(
    () => carrito.reduce((sum, item) => sum + (item.cantidad || 0), 0),
    [carrito]
  );

  // 👇 ASEGÚRATE DE QUE TODAS LAS FUNCIONES ESTÉN INCLUIDAS AQUÍ
  const value = useMemo(() => ({
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    totalItems
  }), [carrito]); // La dependencia solo necesita ser 'carrito'

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider');
  return context;
}