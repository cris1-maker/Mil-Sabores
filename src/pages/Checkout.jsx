// src/pages/Checkout.jsx
import { useState } from "react";
import { useCart } from "../components/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { carrito, vaciarCarrito } = useCart();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    metodoPago: "transferencia",
  });

  const navigate = useNavigate();

  const total = carrito.reduce(
    (acum, producto) => acum + producto.precio * producto.cantidad,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de resultado del pago
    const pagoExitoso = Math.random() > 0.5; // 50% éxito / 50% fallo

    if (pagoExitoso) {
      // Enviar los datos y el carrito antes de vaciarlo
      navigate("/pago-exitoso", { state: { formData, carrito } });
      vaciarCarrito(); // vaciar después de enviar los datos
    } else {
      navigate("/pago-rechazado", { state: { formData } });
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="container center-align" style={{ marginTop: "60px" }}>
        <h4>No hay productos en tu carrito.</h4>
        <Link
          to="/productos"
          className="btn orange waves-effect waves-light"
          style={{ marginTop: "20px" }}
        >
          Volver a comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "700px", marginTop: "50px" }}>
      <div className="card white z-depth-3" style={{ padding: "30px", borderRadius: "12px" }}>
        <h4 className="center-align orange-text text-darken-2">Finalizar Compra</h4>
        <p className="center-align grey-text">Revisa tus productos y completa tus datos</p>

        {/* Lista de productos */}
        <div className="card grey lighten-4" style={{ padding: "15px", marginBottom: "30px", borderRadius: "10px" }}>
          {carrito.map((producto) => (
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

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
            <label htmlFor="nombre">Nombre completo</label>
          </div>

          <div className="input-field">
            <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />
            <label htmlFor="correo">Correo electrónico</label>
          </div>

          <div className="input-field">
            <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required />
            <label htmlFor="direccion">Dirección</label>
          </div>

          <div className="input-field">
            <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
            <label htmlFor="ciudad">Ciudad</label>
          </div>

          <div className="input-field">
            <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required />
            <label htmlFor="telefono">Teléfono</label>
          </div>

          <p style={{ marginTop: "15px", fontWeight: "bold" }}>Método de pago</p>
          <select name="metodoPago" value={formData.metodoPago} onChange={handleChange} className="browser-default">
            <option value="transferencia">Transferencia bancaria</option>
            <option value="debito">Tarjeta de débito</option>
            <option value="credito">Tarjeta de crédito</option>
          </select>

          <div className="center-align" style={{ marginTop: "30px" }}>
            <button type="submit" className="btn green waves-effect waves-light" style={{ marginTop: "20px" }}>
              Pagar ahora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
