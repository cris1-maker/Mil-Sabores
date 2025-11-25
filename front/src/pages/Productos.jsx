// src/pages/Productos.jsx
import React, { useEffect, useState, useMemo } from "react";
import { CATALOG_URL } from "../config/api";

import ProductoCard from "../components/ProductoCard";

// Botones fijos de categorías
const DEFAULT_CATEGORIES = [
  { id: "todas",      label: "Todas" },
  { id: "tortas",     label: "Tortas" },
  { id: "cheesecake", label: "Cheesecakes" },
  { id: "postres",    label: "Postres" },
  { id: "desayuno",   label: "Desayuno" },
  { id: "galletas",   label: "Galletas" },
];

// Normaliza la respuesta de la API (paginada o no)
function normalizeApiProducts(data) {
  if (!data) return [];
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data)) return data;

  const arrayInside = Object.values(data).find((v) => Array.isArray(v));
  return Array.isArray(arrayInside) ? arrayInside : [];
}

// Helper para normalizar categorías (para comparar)
function normalizeCategory(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // tildes fuera
    .trim();
}

// Mapea formato API → formato que usa ProductoCard
function mapApiProductToFront(p) {
  // Intentar sacar la categoría desde distintos lugares posibles
  let categoria =
    p.categoryName ||
    (p.category && (p.category.name || p.category.nombre)) ||
    p.categoria ||
    (typeof p.category === "string" ? p.category : "") ||
    "";

  const productoFront = {
    id: p.id,
    nombre: p.name || p.nombre || "Producto",
    precio: p.price,
    imagen: p.imageUrl,
    categoria,
  };

  return productoFront;
}

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todas");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMsg("");

        const res = await fetch(`${CATALOG_URL}/api/products?page=0&size=50`);
        if (!res.ok) {
          const txt = await res.text();
          console.error("Error cargando productos:", res.status, txt);
          setMsg("No se pudieron cargar los productos.");
          return;
        }

        const data = await res.json();
        console.log("📦 Respuesta productos API cruda:", data);

        const apiProducts = normalizeApiProducts(data);
        console.log("📦 Array normalizado de productos API:", apiProducts);

        const frontProducts = apiProducts.map(mapApiProductToFront);
        console.log("🧁 Productos mapeados para el front:", frontProducts);

        setProductos(frontProducts);
      } catch (e) {
        console.error("Error de conexión:", e);
        setMsg("Error conectando con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // FILTRO por categoría usando los IDs fijos (tortas, postres, etc.)
  const listaVisible = useMemo(() => {
    if (categoriaActiva === "todas") return productos;

    const filtroNorm = normalizeCategory(categoriaActiva);

    return productos.filter((p) => {
      const catNorm = normalizeCategory(p.categoria);
      return catNorm === filtroNorm;
    });
  }, [productos, categoriaActiva]);

  return (
    <div className="productos-page">
      <h3 className="section-title">Nuestros Productos</h3>
      <p className="section-subtitle">
        Elige tus favoritos y endulza tu día 🍰✨
      </p>

      {/* FILTROS DE CATEGORÍA (botones fijos) */}
      <div className="categorias-container">
        <div className="categorias-chips">
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={
                "categoria-chip" +
                (categoriaActiva === cat.id ? " chip-activa" : "")
              }
              onClick={() => setCategoriaActiva(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="msg">Cargando...</p>}
      {msg && !loading && <p className="msg">{msg}</p>}

      {!loading && !listaVisible.length && !msg && (
        <p className="msg">No hay productos en esta categoría.</p>
      )}

      <div className="row">
        {listaVisible.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}
