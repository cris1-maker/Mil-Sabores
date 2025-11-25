// src/components/ProductoCard.jsx
import React, { useState } from "react";
import { useCart } from "./CartContext";

export default function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(0);
  const { agregarAlCarrito } = useCart();

  // Soportar distintas formas de venir del backend / front
  const name =
    producto.name ||
    producto.nombre ||
    "Producto";

  const price =
    producto.price != null
      ? producto.price
      : producto.precio != null
      ? producto.precio
      : 0;

  const image =
    producto.imageUrl ||
    producto.imagen ||
    "";

  const description =
    producto.description ||
    producto.descripcion ||
    "";

  const handleAgregarClick = () => {
    if (cantidad === 0) return;
    agregarAlCarrito(producto, cantidad);
    setCantidad(0);
  };

  return (
    <div className="col s12 m6 l4">
      <div
        className="card card-producto glass z-depth-3 hoverable"
        style={{ position: "relative" }}
      >
        {/* Imagen con tooltip de descripción */}
        <div className="card-image">
          {image && (
            <img
              src={image}
              alt={name}
              title={description || name} // 👈 tooltip al pasar el mouse
              style={{ objectFit: "cover", height: "220px" }}
            />
          )}
        </div>

        <div className="card-content center-align">
          <h6>{name}</h6>
          <p>${Number(price || 0).toLocaleString("es-CL")}</p>

          {/* Controles de cantidad */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <button
              className="btn-floating btn-small waves-effect waves-light red lighten-2"
              onClick={() => setCantidad((c) => Math.max(0, c - 1))}
            >
              <i className="material-icons">remove</i>
            </button>

            <span style={{ margin: "0 15px", fontSize: "1.3em" }}>
              {cantidad}
            </span>

            <button
              className="btn-floating btn-small waves-effect waves-light green lighten-2"
              onClick={() => setCantidad((c) => c + 1)}
            >
              <i className="material-icons">add</i>
            </button>
          </div>

          {/* Botón agregar */}
          <button
            className="btn waves-effect"
            style={{ backgroundColor: "#561411", marginTop: "10px" }}
            disabled={cantidad === 0}
            onClick={handleAgregarClick}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
