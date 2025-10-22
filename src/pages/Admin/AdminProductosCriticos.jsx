import React, { useEffect, useState } from "react";

export const AdminProductosCriticos = () => {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch("/data/productos.json")
            .then((res) => res.json())
            .then((data) => setProductos(data))
            .catch((err) => console.error("Error al cargar productos:", err));
    }, []);

    const productosCriticos = productos.filter((p) => p.stock <= p.stockCritico);

    const clp = (n) =>
        new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(n);

    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fa fa-leaf me-2 text-danger"></i>
                    Productos en stock crítico
                </h2>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <p className="text-muted">
                        Los siguientes productos tienen un stock igual o inferior al nivel
                        crítico definido.
                    </p>

                    <div className="table-responsive">
                        <table className="table align-middle table-hover">
                            <thead className="table-danger">
                                <tr>
                                    <th>Código</th>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock actual</th>
                                    <th>Stock crítico</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosCriticos.map((p) => {
                                    // Cambiamos './../' → './../../' para que coincida con la profundidad real
                                    const fixedImgPath = p.img.replace("./../", "./../../");
                                    const imageUrl = new URL(fixedImgPath, import.meta.url).href;

                                    return (
                                        <tr key={p.codigo}>
                                            <td>{p.codigo}</td>
                                            <td>
                                                <img
                                                    src={imageUrl}
                                                    alt={p.nombre}
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                />
                                            </td>
                                            <td>{p.nombre}</td>
                                            <td>{p.categoria}</td>
                                            <td>{clp(p.precio)}</td>
                                            <td className="text-danger fw-bold">{p.stock}</td>
                                            <td>{p.stockCritico}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary">
                                                    <i className="fa fa-plus me-1"></i> Reponer stock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {productosCriticos.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="text-center text-muted py-4">
                                            Todos los productos tienen stock suficiente.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
