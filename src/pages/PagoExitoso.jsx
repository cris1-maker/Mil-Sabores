// src/pages/PagoExitoso.jsx
import { Link, useLocation } from "react-router-dom";

export default function PagoExitoso() {
  const location = useLocation();
  const datosCliente = location.state?.formData || {};
  const carritoCompra = location.state?.carrito || [];

  const total = carritoCompra.reduce(
    (acum, producto) => acum + producto.precio * producto.cantidad,
    0
  );

  return (
    <div className="container" style={{ marginTop: "80px", maxWidth: "700px" }}>
      <div className="card white z-depth-3" style={{ padding: "30px", borderRadius: "12px" }}>
        <h3 className="center-align green-text">✅ Pago realizado con éxito</h3>
        <p className="center-align grey-text">Gracias por tu compra, {datosCliente.nombre || "cliente"}!</p>

        {/* Resumen de productos */}
        <div className="card grey lighten-4" style={{ padding: "15px", marginTop: "30px", borderRadius: "10px" }}>
          <h5>Resumen de tu compra:</h5>
          {carritoCompra.map((producto) => (
            <div key={producto.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>{producto.nombre} x {producto.cantidad}</span>
              <span>${(producto.precio * producto.cantidad).toLocaleString("es-CL")}</span>
            </div>
          ))}
          <hr />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <span>Total:</span>
            <span>${total.toLocaleString("es-CL")}</span>
          </div>
        </div>

        {/* Datos del cliente */}
        <div className="card grey lighten-4" style={{ padding: "15px", marginTop: "20px", borderRadius: "10px" }}>
          <h5>Datos del comprador:</h5>
          <p><strong>Nombre:</strong> {datosCliente.nombre}</p>
          <p><strong>Correo:</strong> {datosCliente.correo}</p>
          <p><strong>Dirección:</strong> {datosCliente.direccion}</p>
          <p><strong>Ciudad:</strong> {datosCliente.ciudad}</p>
          <p><strong>Teléfono:</strong> {datosCliente.telefono}</p>
          <p><strong>Método de pago:</strong> {datosCliente.metodoPago}</p>
        </div>

        <div className="center-align" style={{ marginTop: "30px" }}>
          <Link to="/productos" className="btn orange waves-effect waves-light">
            Volver a comprar
          </Link>
        </div>
      </div>
    </div>
  );
}
