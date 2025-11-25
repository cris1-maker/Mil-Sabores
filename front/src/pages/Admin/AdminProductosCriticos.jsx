// src/pages/Admin/AdminProductosCriticos.jsx
import React, { useEffect, useState } from "react";
import { CATALOG_URL } from "../../config/api";

export const AdminProductosCriticos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMensaje("");

        const res = await fetch(`${CATALOG_URL}/api/products`);

        const contentType = res.headers.get("content-type") || "";

        if (!res.ok) {
          const txt = await res.text();
          console.error("Error HTTP productos:", res.status, txt);
          setMensaje(`No se pudieron cargar los productos (HTTP ${res.status}).`);
          return;
        }

        if (!contentType.includes("application/json")) {
          const txt = await res.text();
          console.error("Respuesta no JSON de /api/products:", txt);
          setMensaje("El servidor devolvió una respuesta no válida (no es JSON).");
          return;
        }

        const data = await res.json();
        console.log("Respuesta /api/products:", data);

        // Normalizamos a array:
        let lista = [];

        if (Array.isArray(data)) {
          lista = data;
        } else if (Array.isArray(data.content)) {
          // Caso típico Spring Data Page<Product>
          lista = data.content;
        } else {
          console.warn("Formato de respuesta inesperado en /api/products");
          setMensaje("El formato de datos de productos no es el esperado.");
          setProductos([]);
          return;
        }

        setProductos(lista);
      } catch (e) {
        console.error("Error al cargar productos:", e);
        setMensaje("Error de conexión al cargar productos.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const listaSegura = Array.isArray(productos) ? productos : [];

  return (
    <div>
      <h3 style={{ color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.7)" }}>
        Productos críticos / stock
      </h3>

      <div
        className="card1"
        style={{
          marginTop: "16px",
          padding: "16px",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        {loading ? (
          <p style={{ color: "#111", textShadow: "none" }}>
            Cargando productos...
          </p>
        ) : mensaje ? (
          <p style={{ color: "#b00020", textShadow: "none" }}>{mensaje}</p>
        ) : (
          <div className="table-responsive">
            <table className="highlight responsive-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {listaSegura.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name || p.nombre || p.titulo}</td>
                    <td>{p.description || p.descripcion}</td>
                    <td>{p.price || p.precio}</td>
                    <td>{p.stock ?? p.cantidad ?? "-"}</td>
                  </tr>
                ))}

                {listaSegura.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No hay productos cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
