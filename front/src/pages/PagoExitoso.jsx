// src/pages/PagoExitoso.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ORDERS_URL } from "../config/api";


function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

const PagoExitoso = () => {
  const query = useQuery();
  const orderId = query.get("orderId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!orderId);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        setMsg("");

        const res = await fetch(`${ORDERS_URL}/api/orders/${orderId}`);
        if (!res.ok) {
          const txt = await res.text();
          console.error("Error HTTP pago-exitoso:", res.status, txt);
          setMsg(
            "Tu pago fue registrado, pero no pudimos cargar el detalle de la orden."
          );
          return;
        }

        const data = await res.json();
        setOrder(data);
      } catch (e) {
        console.error(e);
        setMsg(
          "Tu pago fue registrado, pero hubo un problema al conectar con el servidor."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  const items = order?.items || [];
  const total = order?.total ?? 0;

  return (
    <div className="pago-success-container">
      <div className="pago-card">
        <i className="fa-solid fa-circle-check pago-icon"></i>

        <h2 className="pago-title">¡Pago realizado con éxito! 🎉</h2>

        {/* Mensaje principal */}
        <p className="pago-text">
          Gracias por tu compra en <strong>Mil Sabores</strong>.
        </p>

        {/* Mensaje de boleta al correo */}
        {order ? (
          <p className="pago-note">
            Hemos enviado el detalle de tu boleta al correo{" "}
            <strong>{order.email}</strong>. Si no lo ves en tu bandeja de
            entrada, revisa también la carpeta de spam.
          </p>
        ) : (
          <p className="pago-note">
            Enviaremos el detalle de tu boleta al correo registrado en tu
            compra.
          </p>
        )}

        {/* Estado de carga / mensaje */}
        {loading && <p className="pago-msg">Cargando detalle de tu orden...</p>}
        {msg && !loading && <p className="pago-msg">{msg}</p>}

        {/* Resumen compacto de la orden */}
        {order && !loading && (
          <div className="pago-resumen">
            <p className="pago-resumen-row">
              <strong>N° Orden:</strong> {order.id}
            </p>
            <p className="pago-resumen-row">
              <strong>Cliente:</strong>{" "}
              {order.fullName || order.customerName}
            </p>
            <p className="pago-resumen-row">
              <strong>Total:</strong> ${total.toLocaleString("es-CL")}
            </p>

            {items.length > 0 && (
              <div className="pago-resumen-tabla-wrapper">
                <table className="pago-resumen-tabla">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="align-right">Cant.</th>
                      <th className="align-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, idx) => (
                      <tr key={idx}>
                        <td>
                          {it.productNameSnapshot || it.productName}
                        </td>
                        <td className="align-right">{it.quantity}</td>
                        <td className="align-right">
                          ${(it.lineTotal ?? 0).toLocaleString("es-CL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="pago-actions">
          <Link to="/productos" className="pago-btn primary">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PagoExitoso;
