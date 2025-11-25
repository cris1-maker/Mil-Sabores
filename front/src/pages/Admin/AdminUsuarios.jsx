// src/pages/Admin/AdminUsuarios.jsx
import React, { useEffect, useState } from "react";
import { AUTH_URL } from "../../config/api";
import { useAuth } from "../../components/AuthContext.jsx";

export const AdminUsuarios = () => {
  const { session } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${AUTH_URL}/api/users`, {
          headers: session?.token
            ? { Authorization: `Bearer ${session.token}` }
            : {},
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Error al cargar usuarios:", txt);
          alert("No se pudieron cargar los usuarios.");
          return;
        }

        const data = await res.json(); // List<ProfileDto>
        setUsuarios(data);
      } catch (e) {
        console.error(e);
        alert("Error de conexión al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session]);

  return (
    <div>
      <h3 style={{ color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.7)" }}>
        Usuarios registrados
      </h3>

      <div
        className="card1"
        style={{
          marginTop: "16px",
          padding: "16px",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        {loading ? (
          <p style={{ color: "#111", textShadow: "none" }}>
            Cargando usuarios...
          </p>
        ) : (
          <div className="table-responsive">
            <table className="highlight responsive-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Correo</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={
                          u.role === "ADMIN"
                            ? "new badge red"
                            : "new badge blue"
                        }
                        data-badge-caption={u.role}
                      />
                    </td>
                  </tr>
                ))}

                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No hay usuarios registrados.
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
