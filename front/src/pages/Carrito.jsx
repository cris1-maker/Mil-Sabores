// src/pages/Carrito.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";

export default function Carrito() {
  const { carrito, vaciarCarrito, eliminarDelCarrito, actualizarCantidad } = useCart();
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acumulador, producto) => acumulador + producto.precio * producto.cantidad,
    0
  );

  const handleCheckout = () => {
    if (carrito.length > 0) {
      navigate("/checkout");
    }
  };

  return (
    <div className="carrito-page">
      <div className="carrito-inner container">
        <h3 className="center-align">Carrito de Compras</h3>

        {carrito.length === 0 ? (
          <p className="center-align" style={{ marginTop: "40px" }}>
            Tu carrito está vacío.
          </p>
        ) : (
          <>
            <table className="highlight centered white z-depth-2">
              <thead className="orange lighten-4">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th style={{ width: "150px" }}>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <img
                        src={producto.imagen}
                        width="40"
                        alt={producto.nombre}
                        style={{
                          verticalAlign: "middle",
                          marginRight: "10px",
                          borderRadius: "6px",
                        }}
                      />
                      {producto.nombre}
                    </td>
                    <td>${Number(producto.precio).toLocaleString("es-CL")}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <button
                          className="btn-floating btn-small waves-effect waves-light red lighten-2"
                          onClick={() =>
                            actualizarCantidad(
                              producto.id,
                              Math.max(1, producto.cantidad - 1)
                            )
                          }
                        >
                          <i className="material-icons">remove</i>
                        </button>

                        <span style={{ margin: "0 15px", fontSize: "1.2em" }}>
                          {producto.cantidad}
                        </span>

                        <button
                          className="btn-floating btn-small waves-effect waves-light green lighten-2"
                          onClick={() =>
                            actualizarCantidad(
                              producto.id,
                              producto.cantidad + 1
                            )
                          }
                        >
                          <i className="material-icons">add</i>
                        </button>
                      </div>
                    </td>

                    <td>
                      {(producto.precio * producto.cantidad).toLocaleString("es-CL", {
                        style: "currency",
                        currency: "CLP",
                        maximumFractionDigits: 0,
                      })}
                    </td>

                    <td>
                      <button
                        className="btn-floating waves-effect waves-light red"
                        onClick={() => eliminarDelCarrito(producto.id)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section center-align">
              <h5 className="orange-text">
                Total: ${total.toLocaleString("es-CL")}
              </h5>
            </div>
          </>
        )}

        {/* Botones inferiores dentro del mismo contenedor */}
        <div
          className="center-align carrito-actions"
        >
          <button
            className="btn red waves-effect waves-light"
            onClick={vaciarCarrito}
            disabled={carrito.length === 0}
          >
            Vaciar Carrito
          </button>

          <Link
            to="/productos"
            className="btn orange waves-effect waves-light"
            style={{ margin: "0 10px" }}
          >
            ← Seguir comprando
          </Link>

          <button
            className="btn green waves-effect waves-light"
            disabled={carrito.length === 0}
            onClick={handleCheckout}
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}
