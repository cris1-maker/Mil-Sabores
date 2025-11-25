import React from "react";
import { useParams, Link } from "react-router-dom";

export const AdminHistorialCompras = () => {
    const { id } = useParams();

    const compras = [
        { id: 101, fecha: "2025-10-15", total: 29990, estado: "Pagada" },
        { id: 102, fecha: "2025-09-30", total: 15990, estado: "Pagada" },
        { id: 103, fecha: "2025-09-10", total: 49990, estado: "Cancelada" },
    ];

    const clp = (n) =>
        new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(n);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="fa fa-history me-2"></i>Historial de compras del usuario #{id}
                </h2>
                <Link to="/admin/usuarios" className="btn btn-outline-secondary">
                    <i className="fa fa-arrow-left me-1"></i> Volver
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table align-middle table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID Compra</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compras.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.id}</td>
                                        <td>{c.fecha}</td>
                                        <td>{clp(c.total)}</td>
                                        <td>
                                            <span
                                                className={`badge ${c.estado === "Pagada"
                                                        ? "bg-success"
                                                        : c.estado === "Cancelada"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                    }`}
                                            >
                                                {c.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/ordenes/${c.id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                <i className="fa fa-eye me-1"></i> Ver boleta
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
