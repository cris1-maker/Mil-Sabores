// src/pages/PagoRechazado.jsx
import { Link, useLocation } from "react-router-dom";

export default function PagoRechazado() {
  const location = useLocation();
  const datosCliente = location.state || {};

  return (
    <div className="container center-align" style={{ marginTop: "80px", maxWidth: "600px" }}>
      <div className="card white z-depth-3" style={{ padding: "30px", borderRadius: "12px" }}>
        <h3 className="red-text">❌ Pago rechazado</h3>
        <p className="grey-text">Lo sentimos, {datosCliente.nombre || "tu compra"} no se pudo procesar.</p>

        {/* Opcional: mostrar un resumen mínimo */}
        {datosCliente.nombre && (
          <div className="card grey lighten-4" style={{ padding: "15px", marginTop: "20px", borderRadius: "10px" }}>
            <h5>Datos ingresados:</h5>
            <p><strong>Nombre:</strong> {datosCliente.nombre}</p>
            <p><strong>Correo:</strong> {datosCliente.correo}</p>
            <p><strong>Dirección:</strong> {datosCliente.direccion}</p>
            <p><strong>Ciudad:</strong> {datosCliente.ciudad}</p>
            <p><strong>Teléfono:</strong> {datosCliente.telefono}</p>
            <p><strong>Método de pago:</strong> {datosCliente.metodoPago}</p>
          </div>
        )}

        <div className="center-align" style={{ marginTop: "30px" }}>
          <Link to="/checkout" className="btn orange waves-effect waves-light">
            Intentar de nuevo
          </Link>
        </div>
      </div>
    </div>
  );
}
