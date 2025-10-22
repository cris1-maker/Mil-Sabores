// src/components/ProductoCard.jsx
import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function ProductoCard({ producto }) {
  // 1. Cambiamos el estado inicial de la cantidad a 0
  const [cantidad, setCantidad] = useState(0);
  const { agregarAlCarrito } = useCart();

  const handleAgregarClick = () => {
    // 2. Agregamos una validación: no hacer nada si la cantidad es 0
    if (cantidad === 0) {
      // Opcional: puedes mostrar una alerta aquí si quieres
      // toast.warn("Debes seleccionar una cantidad mayor a 0");
      return;
    }
    
    agregarAlCarrito(producto, cantidad);
    // 3. Reseteamos la cantidad a 0 después de agregar
    setCantidad(0);
  };

  return (
    <div className="col s12 m6 l4">
      <div className="card card-producto glass z-depth-3 hoverable">
        <div className="card-image">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="card-content center-align">
          <h6>{producto.nombre}</h6>
          <p>${Number(producto.precio).toLocaleString('es-CL')}</p>
          <div className="input-field" style={{maxWidth: '100px', margin: '15px auto 0'}}>
            <input 
              type="number" 
              // 4. Cambiamos el mínimo del input a 0
              min="0" 
              value={cantidad} 
              onChange={(e) => setCantidad(Number(e.target.value))} 
              className="center-align" 
            />
          </div>
          <button 
            className="btn waves-effect" 
            style={{ backgroundColor: "#561411", marginTop: '10px' }} 
            onClick={handleAgregarClick}
            // 5. Deshabilitamos el botón si la cantidad es 0
            disabled={cantidad === 0}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}