// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import { useCart } from "../components/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { ORDERS_URL } from "../config/api";

const Checkout = () => {
  const { isAuth, session } = useAuth();
  const { carrito, vaciarCarrito } = useCart();
  const nav = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("DEBITO");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💡 Helper para sacar nombre "bonito" desde el email
  const nameFromEmail = (email) => {
    if (!email) return "";
    const base = email.split("@")[0]; // ejemplo: "cliente.prueba"
    if (!base) return "";
    // Capitalizar un poquito (simple)
    return base.charAt(0).toUpperCase() + base.slice(1);
  };

  // 💡 Siempre intentamos usar datos de sesión, y si falta algo, usamos form o defaults
  const buildCustomerData = () => {
    const email = (session?.email || form.email || "").trim();

    const fullName =
      (session?.name ||
        session?.fullName ||
        nameFromEmail(email) ||      // 👈 usamos el "nombre" derivado del correo
        form.fullName ||
        "Cliente MilSabores"
      ).trim();

    const phoneBase =
      (session?.phone ||
        form.phone ||
        "").trim();

    // 👇 IMPORTANTE: si queda vacío, mandamos un texto por defecto
    const phone = phoneBase || "SIN_TELEFONO";

    return { fullName, email, phone };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!carrito.length) {
      setMsg("Tu carrito está vacío.");
      return;
    }

    // Si no está logueado, exigimos nombre + correo
    if (!isAuth) {
      if (!form.fullName || !form.email) {
        setMsg("Completa nombre y correo para continuar.");
        return;
      }
    }

    setLoading(true);

    try {
      const { fullName, email, phone } = buildCustomerData();

      if (!email) {
        setMsg("Falta el correo electrónico para continuar.");
        setLoading(false);
        return;
      }

      // 1) Crear carrito en el backend
      const resCart = await fetch(`${ORDERS_URL}/api/cart`, {
        method: "POST",
      });

      if (!resCart.ok) {
        const txt = await resCart.text();
        console.error("Error al crear carrito:", resCart.status, txt);
        setMsg("Ocurrió un problema al crear el carrito.");
        setLoading(false);
        return;
      }

      const cart = await resCart.json();
      const cartId = cart.id;

      // 2) Agregar items al carrito
      for (const item of carrito) {
        const resItem = await fetch(`${ORDERS_URL}/api/cart/${cartId}/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.cantidad,
          }),
        });

        if (!resItem.ok) {
          const txt = await resItem.text();
          console.error(
            "Error al agregar item al carrito:",
            resItem.status,
            txt
          );
          setMsg("Ocurrió un problema al agregar productos al carrito.");
          setLoading(false);
          return;
        }
      }

      // 3) Checkout con cartId
      const resOrder = await fetch(`${ORDERS_URL}/api/orders/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          fullName,
          email,
          phone,          // 👈 ahora NUNCA va vacío
          // paymentMethod, // si más adelante lo usas en el back, lo agregas aquí
        }),
      });

      if (!resOrder.ok) {
        const txt = await resOrder.text();
        console.error("Error al crear orden:", resOrder.status, txt);
        setMsg("Ocurrió un problema al procesar tu compra.");
        setLoading(false);
        return;
      }

      const order = await resOrder.json();

      vaciarCarrito();
      nav(`/pago-exitoso?orderId=${order.id}`, { replace: true });
    } catch (err) {
      console.error("Error en checkout:", err);
      setMsg("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Lo que mostramos en pantalla cuando estás logueado
  const displayEmail = session?.email || form.email || "";
  const displayName =
    session?.name ||
    session?.fullName ||
    nameFromEmail(displayEmail) ||   // 👈 se ve algo como "Cliente" desde "cliente@gmail.com"
    form.fullName ||
    "";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Checkout</h2>

        {!carrito.length && (
          <p className="msg">Tu carrito está vacío, agrega productos primero.</p>
        )}

        {!isAuth ? (
          // 👉 USUARIO NO LOGEADO
          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label>Nombre completo</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Ej: Cristian Rodríguez"
                required
              />
            </div>
            <div>
              <label>Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>
            <div>
              <label>Teléfono (opcional)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+56 9 ..."
              />
            </div>

            <div>
              <label>Forma de pago</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="browser-default"
              >
                <option value="DEBITO">Tarjeta de débito</option>
                <option value="CREDITO">Tarjeta de crédito</option>
                <option value="TRANSFERENCIA">Transferencia bancaria</option>
              </select>
            </div>

            {msg && <div className="msg">{msg}</div>}

            <button
              type="submit"
              className="primary"
              disabled={!carrito.length || loading}
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </button>
          </form>
        ) : (
          // 👉 USUARIO LOGEADO
          <>
            <div className="auth-form" style={{ marginBottom: "16px" }}>
              <div>
                <label>Nombre</label>
                <input
                  value={displayName}
                  readOnly
                />
              </div>
              <div>
                <label>Correo</label>
                <input
                  value={displayEmail}
                  readOnly
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div>
                <label>Forma de pago</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="browser-default"
                >
                  <option value="DEBITO">Tarjeta de débito</option>
                  <option value="CREDITO">Tarjeta de crédito</option>
                  <option value="TRANSFERENCIA">Transferencia bancaria</option>
                </select>
              </div>

              {msg && <div className="msg">{msg}</div>}

              <button
                type="submit"
                className="primary"
                disabled={!carrito.length || loading}
              >
                {loading ? "Procesando..." : "Confirmar compra"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
