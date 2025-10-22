import React, { useState } from "react";
import { Link } from "react-router-dom";

export const AdminOrdenes = () => {
    const [filtro, setFiltro] = useState("");

    const ordenes = [
        {
            id: 1,
            fecha: "2025-10-19",
            cliente: "Juan Pérez",
            total: 45990,
            estado: "Pagada",
        },
        {
            id: 2,
            fecha: "2025-10-18",
            cliente: "Ana Torres",
            total: 25990,
            estado: "Pendiente",
        },
        {
            id: 3,
            fecha: "2025-10-17",
            cliente: "Carlos López",
            total: 33990,
            estado: "Cancelada",
        },
    ];

    const clp = (n) =>
        new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(n);

    const filtradas = ordenes.filter((o) =>
        o.cliente.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="fa fa-file-invoice me-2"></i>Órdenes / Boletas
                </h2>
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="form-control w-auto"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table align-middle table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtradas.map((orden) => (
                                    <tr key={orden.id}>
                                        <td>{orden.id}</td>
                                        <td>{orden.fecha}</td>
                                        <td>{orden.cliente}</td>
                                        <td>{clp(orden.total)}</td>
                                        <td>
                                            <span
                                                className={`badge ${orden.estado === "Pagada"
                                                        ? "bg-success"
                                                        : orden.estado === "Pendiente"
                                                            ? "bg-warning text-dark"
                                                            : "bg-danger"
                                                    }`}
                                            >
                                                {orden.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/admin/ordenes/${orden.id}`}
                                                className="btn btn-sm btn-primary"
                                            >
                                                <i className="fa fa-eye me-1"></i> Ver boleta
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {filtradas.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            No se encontraron órdenes.
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
