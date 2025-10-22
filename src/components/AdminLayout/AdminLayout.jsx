import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export const AdminLayout = () => {
  const { pathname } = useLocation();
  const isActive = (path) => (pathname === path ? "active" : "");
  const navigate = useNavigate();

  const handleLogout = () => {
    // placeholder: aquí puedes llamar a tu función de logout real
    navigate("/");
  };

  return (
    <div className="admin-container fullheight">
      {/* ==== Sidebar único ==== */}
      <nav className="sidebar-admin bg-dark text-white d-flex flex-column p-3">
        <h5 className="mb-4 text-center">
          <i className="fa-solid fa-gauge-high me-2"></i>Panel Admin
        </h5>

        <ul className="nav-admin flex-grow-1">
          <li>
            <Link
              to="/admin"
              className={`nav-link text-white ${isActive("/admin")}`}
            >
              <i className="fa-solid fa-house me-2"></i>Inicio
            </Link>
          </li>

          <li>
            <Link
              to="/admin/usuarios"
              className={`nav-link text-white ${isActive("/admin/usuarios")}`}
            >
              <i className="fa-solid fa-users me-2"></i>Usuarios
            </Link>
          </li>

          <li>
            <Link
              to="/admin/ordenes"
              className={`nav-link text-white ${isActive("/admin/ordenes")}`}
            >
              <i className="fa-solid fa-list-check me-2"></i>Órdenes
            </Link>
          </li>

          <li>
            <Link
              to="/admin/boleta"
              className={`nav-link text-white ${isActive("/admin/boleta")}`}
            >
              <i className="fa-solid fa-receipt me-2"></i>Boletas
            </Link>
          </li>

          <li>
            <Link
              to="/admin/productos"
              className={`nav-link text-white ${isActive("/admin/productos")}`}
            >
              <i className="fa-solid fa-cookie-bite me-2"></i>Productos críticos
            </Link>
          </li>

          <li>
            <Link
              to="/admin/perfil"
              className={`nav-link text-white ${isActive("/admin/perfil")}`}
            >
              <i className="fa-solid fa-user-gear me-2"></i>Perfil
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer mt-3">
          <Link to="/" className="nav-link text-white d-block mb-2">
            <i className="fa-solid fa-store me-2"></i>Volver a tienda
          </Link>

          <button onClick={handleLogout} className="btn btn-sm btn-danger w-100 text-start">
            <i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesión
          </button>
        </div>
      </nav>

      {/* ==== Contenido principal ==== */}
      <main className="main-admin">
        <div className="container-fluid px-4 py-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
