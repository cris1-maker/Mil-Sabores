import React, { useState } from "react";

export const AdminNuevoUsuario = () => {
    const regiones = {
        Metropolitana: ["Santiago", "Puente Alto", "Maipú"],
        Valparaíso: ["Valparaíso", "Viña del Mar", "Quilpué"],
        Biobío: ["Concepción", "Talcahuano", "Los Ángeles"],
    };

    const [region, setRegion] = useState("");
    const [comuna, setComuna] = useState("");
    const [form, setForm] = useState({
        run: "",
        nombre: "",
        apellidos: "",
        correo: "",
        fechaNacimiento: "",
        tipoUsuario: "",
        direccion: "",
        password: "",
        confirmPassword: "",
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        const runRegex = /^[0-9]{7,8}[0-9kK]$/;
        if (!runRegex.test(form.run)) return alert("RUN inválido. Ej: 19011022K");

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(form.password))
            return alert("Contraseña inválida: mínimo 6 caracteres, 1 mayúscula y 1 número.");

        if (form.password !== form.confirmPassword) return alert("Las contraseñas no coinciden.");

        const correoRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!correoRegex.test(form.correo))
            return alert("Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com");

        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    return (
        <div className="container my-4">
            <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">Nuevo Usuario (Administrador)</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">RUN</label>
                        <input id="run" value={form.run} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input id="nombre" value={form.nombre} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Apellidos</label>
                        <input id="apellidos" value={form.apellidos} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Correo electrónico</label>
                        <input id="correo" value={form.correo} onChange={handleChange} type="email" className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Tipo de Usuario</label>
                        <select id="tipoUsuario" value={form.tipoUsuario} onChange={handleChange} className="form-select" required>
                            <option value="">Seleccione un rol</option>
                            <option>Administrador</option>
                            <option>Cliente</option>
                            <option>Vendedor</option>
                        </select>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Región</label>
                            <select value={region} onChange={(e) => { setRegion(e.target.value); setComuna(""); }} className="form-select" required>
                                <option value="">Seleccione región</option>
                                {Object.keys(regiones).map((r) => (
                                    <option key={r}>{r}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Comuna</label>
                            <select value={comuna} onChange={(e) => setComuna(e.target.value)} className="form-select" required>
                                <option value="">Seleccione comuna</option>
                                {region && regiones[region].map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input id="direccion" value={form.direccion} onChange={handleChange} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input id="password" value={form.password} onChange={handleChange} type="password" className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirmar contraseña</label>
                        <input id="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" className="form-control" required />
                    </div>

                    <button className="btn btn-success w-100">Registrar</button>
                </form>

                {success && <div className="alert alert-success mt-3 text-center">Usuario registrado exitosamente</div>}
            </div>
        </div>
    );
};
