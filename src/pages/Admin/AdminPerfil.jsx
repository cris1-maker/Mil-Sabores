import React, { useState } from "react";

export const AdminPerfil = () => {
    const [perfil, setPerfil] = useState({
        nombre: "Cristian Rodriguez",
        correo: "cristian@duocuc.cl",
        rol: "Administrador",
        region: "Valparaíso",
        comuna: "Viña del Mar",
    });

    const onChange = (e) =>
        setPerfil((p) => ({ ...p, [e.target.name]: e.target.value }));

    const guardar = (e) => {
        e.preventDefault();
        alert("Cambios guardados correctamente");
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4">
                <i className="fa fa-user-circle me-2"></i>Perfil del administrador
            </h2>

            <div className="card shadow-sm p-4">
                <form onSubmit={guardar} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Nombre completo</label>
                        <input
                            className="form-control"
                            name="nombre"
                            value={perfil.nombre}
                            onChange={onChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            name="correo"
                            value={perfil.correo}
                            onChange={onChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Rol</label>
                        <input
                            className="form-control"
                            name="rol"
                            value={perfil.rol}
                            disabled
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Región</label>
                        <input
                            className="form-control"
                            name="region"
                            value={perfil.region}
                            onChange={onChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Comuna</label>
                        <input
                            className="form-control"
                            name="comuna"
                            value={perfil.comuna}
                            onChange={onChange}
                        />
                    </div>

                    <div className="col-12 mt-3 text-end">
                        <button className="btn btn-success">
                            <i className="fa fa-save me-2"></i>Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
