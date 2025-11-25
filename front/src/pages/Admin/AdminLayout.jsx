// src/pages/Admin/AdminLayout.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../components/AuthContext.jsx";
import "./AdminLayout.css"; // tu CSS actual

export const AdminLayout = () => {
  const { session } = useAuth();

  // Si no está logueado como admin → redirigir al login de admin
  if (!session?.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-container fullheight">
      {/* Aquí tu sidebar / header del admin */}
      {/* ... */}
      {/* Contenido de cada subruta del admin */}
      <Outlet />
    </div>
  );
};
