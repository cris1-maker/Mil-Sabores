// src/pages/Admin/AdminNuevoUsuario.jsx
import React, { useState } from "react";
import { AUTH_URL } from "../../config/api";

export const AdminNuevoUsuario = () => {
  const regiones = {
    Metropolitana: ["Santiago", "Puente Alto", "Maipú"],
    Valparaíso: ["Valparaíso", "Viña del Mar", "Quilpué"],
    Biobío: ["Concepción", "Talcahuano", "Los Ángeles"],
  };

  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [mensaje, setMensaje] = useState("");
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Validaciones básicas (las mismas que tú tenías)
    const runRegex = /^[0-9]{7,8}[0-9kK]$/;
    if (!runRegex.test(form.run))
      return setMensaje("RUN inválido. Ej: 19011022K");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(form.password))
      return setMensaje(
        "Contraseña inválida: mínimo 6 caracteres, 1 mayúscula y 1 número."
      );

    if (form.password !== form.confirmPassword)
      return setMensaje("Las contraseñas no coinciden.");

    const correoRegex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    if (!correoRegex.test(form.correo))
      return setMensaje(
        "Correo inválido. Solo se permiten @duoc.cl, @profesor.duoc.cl y @gmail.com"
      );

    const fullName = `${form.nombre} ${form.apellidos}`.trim();

    const payload = {
      fullName,
      email: form.correo,
      password: form.password,
      // El backend puede asignar rol USER por defecto
    };

    try {
      const res = await fetch(`${AUTH_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Error backend:", txt);
        setMensaje("Error al registrar el usuario en el servidor.");
        return;
      }

      setMensaje("✅ Usuario registrado exitosamente.");

      // limpiar formulario
      setForm({
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
      setRegion("");
      setComuna("");
    } catch (err) {
      console.error(err);
      setMensaje("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: "100%", margin: "0 auto" }}>
      <h3 className="auth-title" style={{ color: "#111", textShadow: "none" }}>
        Nuevo Usuario
      </h3>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="row2">
          <div>
            <label htmlFor="run">RUN</label>
            <input
              id="run"
              value={form.run}
              onChange={handleChange}
              placeholder="19011022K"
              required
            />
          </div>
          <div>
            <label htmlFor="fechaNacimiento">Fecha nacimiento</label>
            <input
              id="fechaNacimiento"
              type="date"
              value={form.fechaNacimiento}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row2">
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="apellidos">Apellidos</label>
            <input
              id="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            placeholder="usuario@duoc.cl"
            required
          />
        </div>

        <div className="row2">
          <div>
            <label htmlFor="tipoUsuario">Tipo de Usuario</label>
            <select
              id="tipoUsuario"
              className="browser-default"
              value={form.tipoUsuario}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              <option>Cliente</option>
              <option>Vendedor</option>
            </select>
          </div>
          <div>
            <label>Dirección</label>
            <input
              id="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle, número, depto..."
              required
            />
          </div>
        </div>

        <div className="row2">
          <div>
            <label>Región</label>
            <select
              className="browser-default"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setComuna("");
              }}
              required
            >
              <option value="">Seleccione región</option>
              {Object.keys(regiones).map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Comuna</label>
            <select
              className="browser-default"
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              required
            >
              <option value="">Seleccione comuna</option>
              {region &&
                regiones[region].map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="row2">
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {mensaje && <div className="msg">{mensaje}</div>}

        <button type="submit" className="primary">
          Registrar usuario
        </button>
      </form>
    </div>
  );
};
