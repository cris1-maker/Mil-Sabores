// src/pages/Admin/AdminLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";

export const AdminLogin = () => {
  const { isAuth, session, login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const isAdmin = isAuth && session?.role === "ADMIN";

  // 👉 Si ya está logeado y es admin, no tiene sentido mostrar el login otra vez
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const ok = await login(form.email, form.password);
      if (!ok) {
        setMsg("Credenciales incorrectas o sin permisos de administrador.");
        return;
      }
      nav("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setMsg("No se pudo iniciar sesión. Intenta nuevamente.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Acceso Administrador</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Correo administrador</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@milsabores.cl"
              required
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {msg && <div className="msg">{msg}</div>}

          <button type="submit" className="primary">
            Ingresar
          </button>
        </form>

        <p className="swap">
          Esta sección es exclusiva para el rol <strong>Administrador</strong>.
        </p>
      </div>
    </div>
  );
};
