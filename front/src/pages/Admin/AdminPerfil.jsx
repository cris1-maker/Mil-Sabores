// src/pages/Admin/AdminPerfil.jsx
import React, { useEffect, useState } from "react";
import { AUTH_URL } from "../../config/api";
import { useAuth } from "../../components/AuthContext.jsx";

export const AdminPerfil = () => {
  const { session } = useAuth();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${AUTH_URL}/api/users/me`, {
          headers: {
            "Content-Type": "application/json",
            ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
          },
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Error perfil:", txt);
          return;
        }

        const data = await res.json(); // ProfileDto
        setPerfil(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session]);

  if (loading) {
    return (
      <p style={{ color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.7)" }}>
        Cargando perfil...
      </p>
    );
  }

  if (!perfil) {
    return (
      <p style={{ color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.7)" }}>
        No se pudo cargar el perfil.
      </p>
    );
  }

  return (
    <div
      className="card1"
      style={{
        padding: "20px",
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
    >
      <h4 style={{ color: "#111", textShadow: "none", marginBottom: "12px" }}>
        Perfil del administrador
      </h4>
      <p style={{ color: "#111", textShadow: "none" }}>
        <strong>Nombre:</strong> {perfil.fullName}
      </p>
      <p style={{ color: "#111", textShadow: "none" }}>
        <strong>Correo:</strong> {perfil.email}
      </p>
      <p style={{ color: "#111", textShadow: "none" }}>
        <strong>Rol:</strong> {perfil.role}
      </p>
    </div>
  );
};
