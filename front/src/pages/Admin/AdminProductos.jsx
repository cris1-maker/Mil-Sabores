// src/pages/Admin/AdminProductos.jsx
import React, { useEffect, useState } from "react";
import { CATALOG_URL } from "../../config/api";


export const AdminProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]); // siempre queremos un array

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("new");

  const [editData, setEditData] = useState({
    id: "",
    name: "",
    price: 0,
    stock: 0,
    description: "",
    categoryId: "",
    imageUrl: "",
  });

  // =============================
  // CARGAR PRODUCTOS
  // =============================
  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  const loadProductos = async () => {
    try {
      const res = await fetch(`${CATALOG_URL}/api/products?page=0&size=100`);
      if (!res.ok) {
        const txt = await res.text();
        console.error("Error cargando productos:", res.status, txt);
        setProductos([]);
        return;
      }

      const data = await res.json();
      const content = Array.isArray(data.content)
        ? data.content
        : Array.isArray(data)
        ? data
        : [];
      setProductos(content);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setProductos([]);
    }
  };

  const loadCategorias = async () => {
    try {
      const res = await fetch(`${CATALOG_URL}/api/categories`);
      if (!res.ok) {
        const txt = await res.text();
        console.error("Error cargando categorías:", res.status, txt);
        setCategorias([]);
        return;
      }

      const data = await res.json().catch(() => null);

      let cats = [];
      if (Array.isArray(data)) {
        cats = data;
      } else if (data && Array.isArray(data.content)) {
        cats = data.content;
      }

      setCategorias(cats);
    } catch (err) {
      console.error("Error cargando categorías:", err);
      setCategorias([]);
    }
  };

  // =============================
  // ABRIR MODAL EDITAR
  // =============================
  const openEditModal = (p) => {
    setModalMode("edit");
    setEditData({
      id: p.id,
      name: p.name || "",
      price: Number(p.price) || 0,
      stock: Number(p.stock) || 0,
      description: p.description || "",
      categoryId: p.category?.id || "",
      imageUrl: p.imageUrl || "",
    });
    setModalOpen(true);
  };

  // =============================
  // ABRIR MODAL NUEVO
  // =============================
  const openNewModal = () => {
    setModalMode("new");
    setEditData({
      id: "",
      name: "",
      price: 0,
      stock: 0,
      description: "",
      categoryId: "",
      imageUrl: "",
    });
    setModalOpen(true);
  };

  // =============================
  // GUARDAR (EDITAR O CREAR)
  // =============================
  const saveChanges = async () => {
    try {
      const payload = {
        name: editData.name || "",
        price: Number(editData.price) || 0,
        stock: Number(editData.stock) || 0,
        description: editData.description || "",
        imageUrl: editData.imageUrl || "",
        categoryId: editData.categoryId || null, // 👈 puede ir null si no hay categorías
        active: true,
      };

      let url = `${CATALOG_URL}/api/products`;
      let method = "POST";

      if (modalMode === "edit") {
        url = `${CATALOG_URL}/api/products/${editData.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ERROR GUARDANDO:", res.status, text);
        alert("Error al guardar el producto. Revisa la consola.");
        return;
      }

      setModalOpen(false);
      loadProductos();
    } catch (err) {
      console.error("Error en saveChanges:", err);
      alert("Ocurrió un error guardando el producto.");
    }
  };

  // =============================
  // ELIMINAR PRODUCTO (SIN CONFIRM DEL NAVEGADOR)
  // =============================
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${CATALOG_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error eliminando:", res.status, txt);
        alert("No se pudo eliminar el producto.");
        return;
      }

      // Actualizamos la lista en memoria sin recargar todo
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  };

  // nos aseguramos de que siempre sea un array
  const categoriasSafe = Array.isArray(categorias) ? categorias : [];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h4 className="white-text">Gestión de Productos</h4>

        <button className="btn pink darken-2" onClick={openNewModal}>
          <i className="material-icons left">add</i>
          Nuevo Producto
        </button>
      </div>

      <table className="highlight white">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    width="60"
                    style={{ borderRadius: 6 }}
                    alt={p.name}
                  />
                )}
              </td>
              <td>{p.name}</td>
              <td>${Number(p.price).toLocaleString("es-CL")}</td>
              <td>{p.stock}</td>
              <td>{p.category?.name || "—"}</td>
              <td>
                <button
                  className="btn-small yellow darken-2"
                  onClick={() => openEditModal(p)}
                >
                  <i className="material-icons">edit</i>
                </button>
                <button
                  className="btn-small red darken-2"
                  style={{ marginLeft: 6 }}
                  onClick={() => deleteProduct(p.id)}
                >
                  <i className="material-icons">delete</i>
                </button>
              </td>
            </tr>
          ))}

          {productos.length === 0 && (
            <tr>
              <td colSpan="6" className="center-align" style={{ padding: 16 }}>
                No hay productos aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: 500,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <h5>{modalMode === "new" ? "Nuevo Producto" : "Editar Producto"}</h5>

            <label>Nombre</label>
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <label>Precio</label>
            <input
              type="number"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
            />

            <label>Stock</label>
            <input
              type="number"
              value={editData.stock}
              onChange={(e) =>
                setEditData({ ...editData, stock: e.target.value })
              }
            />

            <label>Descripción</label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />

            <label>Imagen (URL)</label>
            <input
              value={editData.imageUrl}
              onChange={(e) =>
                setEditData({ ...editData, imageUrl: e.target.value })
              }
            />

            <label>Categoría</label>
            <select
              className="browser-default"
              value={editData.categoryId || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  categoryId: e.target.value,
                })
              }
            >
              <option value="">(Sin categoría)</option>
              {categoriasSafe.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {!categoriasSafe.length && (
              <p style={{ fontSize: ".85rem", marginTop: 6, color: "#b71c1c" }}>
                * No se pudieron cargar las categorías (500 en /api/categories).
                Puedes guardar productos sin categoría.
              </p>
            )}

            <div className="right-align" style={{ marginTop: 20 }}>
              <button className="btn grey" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button
                className="btn green"
                style={{ marginLeft: 10 }}
                onClick={saveChanges}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
