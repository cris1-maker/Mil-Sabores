import React from "react";
import { Link } from "react-router-dom";

export const AdminUsuarios = () => {
    const usuarios = [
        {
            run: "19011022K",
            nombre: "Juan Pérez",
            correo: "juan@gmail.com",
            rol: "Cliente",
            region: "Metropolitana",
            comuna: "Santiago",
            direccion: "Av. Siempre Viva 123",
        },
        {
            run: "17888999-3",
            nombre: "Ana Torres",
            correo: "ana@duoc.cl",
            rol: "Administrador",
            region: "Valparaíso",
            comuna: "Viña del Mar",
            direccion: "Calle 2 #45",
        },
    ];

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fa fa-users me-2"></i>Usuarios
                </h2>
                <Link to="/admin/nuevo-usuario" className="btn btn-success">
                    <i className="fa fa-plus me-2"></i>Nuevo Usuario
                </Link>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-success">
                                <tr>
                                    <th>Run</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Región</th>
                                    <th>Comuna</th>
                                    <th>Dirección</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((u, i) => (
                                    <tr key={i}>
                                        <td>{u.run}</td>
                                        <td>{u.nombre}</td>
                                        <td>{u.correo}</td>
                                        <td>{u.rol}</td>
                                        <td>{u.region}</td>
                                        <td>{u.comuna}</td>
                                        <td>{u.direccion}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-primary">
                                                    <i className="fa fa-edit"></i>
                                                </button>
                                                <button className="btn btn-sm btn-danger">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                                {/*  nuevo botón para historial */}
                                                <Link
                                                    to={`/admin/usuarios/${u.run}/historial`}
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    <i className="fa fa-history"></i>
                                                </Link>
                                            </div>
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
