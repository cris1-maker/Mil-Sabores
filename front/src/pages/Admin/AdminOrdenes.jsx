// src/pages/Admin/AdminOrdenes.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORDERS_URL } from "../../config/api";


export const AdminOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMsg("");

        const res = await fetch(`${ORDERS_URL}/api/orders`);
        if (!res.ok) {
          const txt = await res.text();
          console.error("Error HTTP órdenes:", res.status, txt);
          setMsg("No se pudieron cargar las órdenes.");
          return;
        }

        const data = await res.json();
        setOrdenes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setMsg("Error de conexión al cargar órdenes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h3 style={{ color: "#fff", textShadow: "2px 2px 5px rgba(0,0,0,0.7)" }}>
        Órdenes recientes
      </h3>

      <div
        className="card1"
        style={{
          marginTop: "16px",
          padding: "16px",
          backgroundColor: "rgba(255,255,255,0.95)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <p style={{ color: "#111" }}>Cargando órdenes...</p>
        ) : msg ? (
          <p style={{ color: "#b00020" }}>{msg}</p>
        ) : (
          <div
            className="table-responsive"
            style={{ width: "100%", overflowX: "auto" }}
          >
            <table className="highlight responsive-table">
              <thead>
                <tr>
                  <th>N° Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Correo</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Método pago</th>
                  <th>Boleta</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      {o.createdAt
                        ? String(o.createdAt).replace("T", " ").slice(0, 16)
                        : "-"}
                    </td>
                    <td>{o.fullName || o.customerName}</td>
                    <td>{o.email}</td>
                    <td>${(o.total ?? 0).toLocaleString("es-CL")}</td>
                    <td>
                      <span
                        className={
                          "new badge " +
                          (o.status === "PAID" || o.status === "PAGADO"
                            ? "green"
                            : "orange")
                        }
                        data-badge-caption={o.status}
                      />
                    </td>
                    <td>{o.paymentMethod || "N/A"}</td>
                    <td>
                      <Link
                        to={`/admin/boleta/${o.id}`}
                        className="btn-small"
                      >
                        Ver boleta
                      </Link>
                    </td>
                  </tr>
                ))}

                {ordenes.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No hay órdenes registradas.
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
