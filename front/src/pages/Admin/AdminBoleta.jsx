// src/pages/Admin/AdminBoleta.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ORDERS_URL } from "../../config/api";


export const AdminBoleta = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMsg("");

        const res = await fetch(`${ORDERS_URL}/api/orders/${id}`);
        if (!res.ok) {
          const txt = await res.text();
          console.error("Error HTTP boleta:", res.status, txt);
          setMsg("No se pudo cargar la boleta.");
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (e) {
        console.error(e);
        setMsg("Error de conexión al cargar la boleta.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  const items = order?.items || [];
  const total = order?.total ?? 0;
  const subtotal = order?.subtotal ?? 0;
  const descuento = order?.discountTotal ?? 0;
  const envio = order?.shippingCost ?? 0;

  return (
    <div className="admin-boleta">
      <h3 className="admin-boleta-title">
        <i className="fa-solid fa-receipt" style={{ marginRight: 8 }} />
        Boleta
      </h3>

      <div className="card1 admin-boleta-card">
        {loading ? (
          <p className="admin-boleta-msg">Cargando boleta...</p>
        ) : msg ? (
          <p className="admin-boleta-msg error">{msg}</p>
        ) : !order ? (
          <p className="admin-boleta-msg">No se encontró la boleta solicitada.</p>
        ) : (
          <>
            {/* Encabezado */}
            <div className="admin-boleta-header">
              <div>
                <h5 className="admin-boleta-logo">Mil Sabores</h5>
                <p className="admin-boleta-text">
                  RUT: 76.123.456-7<br />
                  Dirección: Calle Dulce 123, Viña del Mar
                </p>
              </div>
              <div className="admin-boleta-header-right">
                <p className="admin-boleta-text">
                  <strong>Boleta Nº</strong> {order.id}
                </p>
                <p className="admin-boleta-text">
                  <strong>Fecha:</strong>{" "}
                  {order.createdAt
                    ? String(order.createdAt).replace("T", " ")
                    : "—"}
                </p>
              </div>
            </div>

            <hr className="admin-boleta-divider" />

            {/* Datos cliente */}
            <div className="admin-boleta-section">
              <p className="admin-boleta-text">
                <strong>Cliente:</strong> {order.fullName || order.customerName}
              </p>
              <p className="admin-boleta-text">
                <strong>Correo:</strong> {order.email}
              </p>
              {order.phone && (
                <p className="admin-boleta-text">
                  <strong>Teléfono:</strong> {order.phone}
                </p>
              )}
            </div>

            {/* Tabla de ítems */}
            <div className="table-responsive admin-boleta-table-wrapper">
              <table className="highlight admin-boleta-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="align-right">Cantidad</th>
                    <th className="align-right">Precio unitario</th>
                    <th className="align-right">Total línea</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.productNameSnapshot || it.productName}</td>
                      <td className="align-right">{it.quantity}</td>
                      <td className="align-right">
                        ${it.unitPrice?.toLocaleString("es-CL") ?? 0}
                      </td>
                      <td className="align-right">
                        ${it.lineTotal?.toLocaleString("es-CL") ?? 0}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        Esta orden no tiene ítems registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="admin-boleta-totales">
              <table>
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="align-right">
                      ${subtotal.toLocaleString("es-CL")}
                    </td>
                  </tr>
                  <tr>
                    <td>Descuento</td>
                    <td className="align-right">
                      -${descuento.toLocaleString("es-CL")}
                    </td>
                  </tr>
                  <tr>
                    <td>Envío</td>
                    <td className="align-right">
                      ${envio.toLocaleString("es-CL")}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td className="align-right">
                      <strong>${total.toLocaleString("es-CL")}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="admin-boleta-footer">
              Gracias por tu compra en <strong>Mil Sabores</strong>.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
