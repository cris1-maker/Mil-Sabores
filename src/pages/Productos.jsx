// src/pages/Productos.jsx
import { defaultProductos } from "../utils/producto";
import ProductoCard from "../components/ProductoCard.jsx";

export default function Productos() { // ⬅️ YA NO NECESITA PROPS
  return (
    <div className="container section">
      <h5 className="center-align">Nuestros productos</h5>
      <div className="row">
        {defaultProductos.map((producto) => (
          <ProductoCard 
            key={producto.id} 
            producto={producto} 
          />
        ))}
      </div>
    </div>
  );
}