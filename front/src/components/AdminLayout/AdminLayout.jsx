// src/components/AdminLayout/AdminLayout.jsx
import React from "react";
import { NavLink, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export const AdminLayout = () => {
  const { session } = useAuth();

  // ✅ Ahora validamos por role en vez de isAdmin
  if (!session || session.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  const linkClass = ({ isActive }) =>
    "btn-small waves-effect waves-light admin-menu-btn " +
    (isActive ? "pink darken-2" : "grey darken-3");

  return (
    <div
      className="container"
      style={{ marginTop: "40px", marginBottom: "40px" }}
    >
      <div className="row">
        {/* ==== SIDEBAR ==== */}
        <div className="col s12 m3">
          <div className="glass" style={{ padding: "16px" }}>
            <h5
              style={{
                color: "#fff",
                textShadow: "2px 2px 5px rgba(0,0,0,0.7)",
              }}
            >
              <i
                className="fa-solid fa-gauge"
                style={{ marginRight: "8px" }}
              />
              Panel Admin
            </h5>
            <p
              style={{
                color: "#fff",
                fontSize: "0.85rem",
                marginTop: "4px",
              }}
            >
              Gestión interna de Mil Sabores
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <NavLink to="/admin" end className={linkClass}>
                Inicio
              </NavLink>

              <NavLink to="/admin/usuarios" className={linkClass}>
                Usuarios
              </NavLink>

              <NavLink to="/admin/usuarios/nuevo" className={linkClass}>
                Nuevo Usuario
              </NavLink>

              <NavLink to="/admin/ordenes" className={linkClass}>
                Órdenes
              </NavLink>

              {/* Este link muestra la misma vista de órdenes pero con foco en boleta */}
              <NavLink to="/admin/ordenes" className={linkClass}>
                Boleta
              </NavLink>

              <NavLink to="/admin/productos" className={linkClass}>
                Productos
              </NavLink>

              <NavLink to="/admin/perfil" className={linkClass}>
                Perfil
              </NavLink>
            </div>
          </div>
        </div>

        {/* ==== CONTENIDO PRINCIPAL ==== */}
        <div className="col s12 m9">
          <div className="glass" style={{ padding: "20px", minHeight: "300px" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
