// src/pages/Registro.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import {
  isEmail,
  isPhoneCL,
  isStrongPassword,
  isHouseNumber,
} from "../utils/validators.js";
import { REGIONES } from "../utils/regiones.js";

export default function Registro() {
  const { isAuth, register, login } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [L, setL] = useState({ email: "", password: "" });

  const [R, setR] = useState({
    name: "",
    email: "",
    email2: "",
    phone: "",
    region: "",
    comuna: "",
    street: "",
    number: "",
    password: "",
    password2: "",
    terms: false,
  });

  // 👉 Si ya hay sesión iniciada, no tiene sentido mostrar esta pantalla
  useEffect(() => {
    if (isAuth) navigate("/", { replace: true });
  }, [isAuth, navigate]);

  const comunas = useMemo(() => {
    const r = REGIONES.find((x) => x.nombre === R.region);
    return r ? r.comunas : [];
  }, [R.region]);

  function validarRegistro() {
    const obligatorios = [
      ["name"],
      ["email"],
      ["email2"],
      ["phone"],
      ["region"],
      ["comuna"],
      ["street"],
      ["number"],
      ["password"],
      ["password2"],
      ["terms"],
    ];
    const faltantes = obligatorios.filter(([key]) =>
      key === "terms" ? !R.terms : !String(R[key] ?? "").trim()
    );
    if (faltantes.length) {
      return { ok: false, msg: "Debes completar todos los campos obligatorios." };
    }

    const errores = [];
    if (!isEmail(R.email)) errores.push("Correo inválido.");
    if (R.email !== R.email2)
      errores.push("El correo y su confirmación no coinciden.");
    if (!isPhoneCL(R.phone))
      errores.push(
        "Teléfono chileno inválido. Ej: +56912345678 o 9XXXXXXXX"
      );
    if (!isHouseNumber(R.number))
      errores.push("Ingresa un número de casa válido.");
    if (!isStrongPassword(R.password))
      errores.push(
        "La contraseña debe tener 8+ car., 1 mayús., 1 minús. y 1 número."
      );
    if (R.password !== R.password2)
      errores.push("Las contraseñas no coinciden.");

    if (errores.length) return { ok: false, msg: errores[0] };
    return { ok: true };
  }

  function validarLogin() {
    if (!isEmail(L.email)) return "Ingresa un correo válido.";
    if (!L.password) return "Ingresa tu contraseña.";
    return null;
  }

  const submitLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    const error = validarLogin();
    if (error) return setMsg(error);

    try {
      setLoading(true);
      // 👇 usamos la firma login(email, password)
      const ok = await login(L.email, L.password);
      if (!ok) {
        setMsg("Correo o contraseña incorrectos.");
        return;
      }
      setMsg("✅ Sesión iniciada.");
      navigate("/", { replace: true });
    } catch (err) {
      setMsg(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = validarRegistro();
    if (!res.ok) return setMsg(res.msg);

    try {
      setLoading(true);
      await register(
        {
          name: R.name,
          email: R.email,
          password: R.password,
          phone: R.phone,
          region: R.region,
          comuna: R.comuna,
          street: R.street,
          number: R.number,
        },
        { autoLogin: false }
      );

      setMsg("✅ Cuenta creada. Inicia sesión con tu correo y contraseña.");
      setTab("login");
      setL({ email: R.email, password: "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setMsg(err.message || "Error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ===== Pestañas arriba ===== */}
        <div className="auth-tabs" role="tablist" aria-label="Selector de formulario">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "login"}
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "register"}
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => setTab("register")}
          >
            Registro
          </button>
        </div>

        {/* ===== Título ===== */}
        <h4 className="auth-title">
          {tab === "login" ? "INICIAR SESIÓN" : "CREAR CUENTA"}
        </h4>

        {/* ===== Formularios ===== */}
        {tab === "login" ? (
          <form className="auth-form" onSubmit={submitLogin} noValidate>
            <label>Correo</label>
            <input
              value={L.email}
              onChange={(e) => setL((p) => ({ ...p, email: e.target.value }))}
              placeholder="tu@correo.com"
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              value={L.password}
              onChange={(e) =>
                setL((p) => ({ ...p, password: e.target.value }))
              }
              placeholder="********"
              required
            />

            <div className="auth-row">
              <span className="remember">
                <input type="checkbox" disabled /> Recordarme
              </span>
              <button
                type="button"
                className="link"
                onClick={() =>
                  alert(
                    "Demo: te enviaríamos un correo para restablecer la contraseña."
                  )
                }
              >
                ¿Olvidaste la contraseña?
              </button>
            </div>

            <button className="primary" disabled={loading}>
              {loading ? "Procesando..." : "Login"}
            </button>

            {msg && <p className="msg">{msg}</p>}

            <p className="swap">
              ¿No tienes cuenta?
              <button
                type="button"
                className="link"
                onClick={() => setTab("register")}
              >
                Regístrate
              </button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitRegister} noValidate>
            <label>Nombre completo</label>
            <input
              value={R.name}
              onChange={(e) => setR({ ...R, name: e.target.value })}
              required
            />

            <label>Email</label>
            <input
              value={R.email}
              onChange={(e) => setR({ ...R, email: e.target.value })}
              placeholder="tucorreo@dominio.cl"
              required
            />

            <label>Confirmar Email</label>
            <input
              value={R.email2}
              onChange={(e) => setR({ ...R, email2: e.target.value })}
              required
            />

            <label>Teléfono</label>
            <input
              value={R.phone}
              onChange={(e) => setR({ ...R, phone: e.target.value })}
              placeholder="+569XXXXXXXX"
              required
            />

            <div className="row2">
              <div>
                <label>Seleccionar región</label>
                <select
                  className="browser-default"
                  value={R.region}
                  onChange={(e) =>
                    setR({ ...R, region: e.target.value, comuna: "" })
                  }
                  required
                >
                  <option value="">—</option>
                  {REGIONES.map((r) => (
                    <option key={r.nombre} value={r.nombre}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Seleccionar comuna</label>
                <select
                  className="browser-default"
                  value={R.comuna}
                  onChange={(e) =>
                    setR({ ...R, comuna: e.target.value })
                  }
                  disabled={!comunas.length}
                  required
                >
                  <option value="">—</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label>Calle</label>
            <input
              value={R.street}
              onChange={(e) => setR({ ...R, street: e.target.value })}
              placeholder="Av. Siempre Viva"
              required
            />

            <label>Número</label>
            <input
              value={R.number}
              onChange={(e) => setR({ ...R, number: e.target.value })}
              placeholder="742"
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              value={R.password}
              onChange={(e) =>
                setR({ ...R, password: e.target.value })
              }
              required
            />

            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={R.password2}
              onChange={(e) =>
                setR({ ...R, password2: e.target.value })
              }
              required
            />

            <label className="terms">
              <input
                type="checkbox"
                checked={R.terms}
                onChange={(e) =>
                  setR({ ...R, terms: e.target.checked })
                }
              />
              <span>Acepto los términos y condiciones</span>
            </label>

            <button className="primary" disabled={loading}>
              {loading ? "Procesando..." : "Registrar"}
            </button>

            {msg && <p className="msg">{msg}</p>}

            <p className="swap">
              ¿Ya tienes cuenta?
              <button
                type="button"
                className="link"
                onClick={() => {
                  setTab("login");
                  setL({ email: R.email, password: "" });
                }}
              >
                Inicia sesión
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
