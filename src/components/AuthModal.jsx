// src/components/AuthModal.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { REGIONES } from "../utils/regiones";
import { isEmail, isPhoneCL, isStrongPassword } from "../utils/validators";

export default function AuthModal({ open, onClose, startOn = "login" }) {
  const { register, login, remember, setRemember } = useAuth();
  const [mode, setMode] = useState(startOn); // "login" | "register"
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form
  const [L, setL] = useState({ email: "", password: "" });

  // Register form
  const [R, setR] = useState({
    name: "", email: "", email2: "", phone: "", region: "", comuna: "",
    password: "", password2: "", terms: false
  });

  useEffect(() => { if (open) { setMsg(""); setLoading(false); } }, [open]);

  // comunas dinámicas
  const comunas = useMemo(() => {
    const r = REGIONES.find(x => x.nombre === R.region);
    return r ? r.comunas : [];
  }, [R.region]);

  function close() { if (!loading) onClose?.(); }

  async function onSubmitLogin(e) {
    e.preventDefault(); setMsg("");
    if (!isEmail(L.email)) return setMsg("Ingresa un correo válido.");
    if (!L.password) return setMsg("Ingresa tu contraseña.");
    try {
      setLoading(true);
      await Promise.resolve(login(L));
      setMsg("✅ Sesión iniciada.");
      close();
    } catch (err) { setMsg(err.message || "Error al iniciar sesión."); }
    finally { setLoading(false); }
  }

  async function onSubmitRegister(e) {
    e.preventDefault(); setMsg("");
    if (!R.name.trim()) return setMsg("Ingresa tu nombre completo.");
    if (!isEmail(R.email)) return setMsg("Correo inválido.");
    if (R.email !== R.email2) return setMsg("El correo y su confirmación no coinciden.");
    if (!isPhoneCL(R.phone)) return setMsg("Teléfono chileno inválido. Ej: +56912345678 o 9XXXXXXXX");
    if (!R.region) return setMsg("Selecciona una región.");
    if (!R.comuna) return setMsg("Selecciona una comuna.");
    if (!isStrongPassword(R.password))
      return setMsg("La contraseña debe tener 8+ car., 1 mayús., 1 minús. y 1 número.");
    if (R.password !== R.password2) return setMsg("Las contraseñas no coinciden.");
    if (!R.terms) return setMsg("Debes aceptar los términos y condiciones.");

    try {
      setLoading(true);
      await Promise.resolve(register({
        name: R.name, email: R.email, password: R.password,
        phone: R.phone, region: R.region, comuna: R.comuna,
      }));
      setMsg("✅ Cuenta creada y sesión iniciada.");
      close();
    } catch (err) { setMsg(err.message || "Error al registrar."); }
    finally { setLoading(false); }
  }

  if (!open) return null;

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-card" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={close}>✕</button>

        {mode === "login" ? (
          <>
            <h2 className="auth-title">Login</h2>
            <form className="auth-form" onSubmit={onSubmitLogin}>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                value={L.email}
                onChange={e => setL(p => ({ ...p, email: e.target.value }))}
                placeholder="tucorreo@dominio.cl"
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={L.password}
                onChange={e => setL(p => ({ ...p, password: e.target.value }))}
                placeholder="********"
              />

              <div className="auth-row">
                <div className="remember">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
                <button
                  type="button"
                  className="link"
                  onClick={() => alert("Simulación: restablecer por correo")}
                >
                  Forgot password?
                </button>
              </div>

              <button className="primary" disabled={loading}>
                {loading ? "Procesando..." : "Login"}
              </button>

              {msg && <p className="msg">{msg}</p>}

              <p className="swap">
                Don't have an account?
                <button type="button" className="link" onClick={() => setMode("register")}> Register</button>
              </p>
            </form>
          </>
        ) : (
          <>
            <h2 className="auth-title">Register</h2>
            <form className="auth-form" onSubmit={onSubmitRegister}>
              <label htmlFor="reg-name">Nombre completo</label>
              <input id="reg-name" value={R.name} onChange={e => setR({ ...R, name: e.target.value })} />

              <label htmlFor="reg-email">Email</label>
              <input id="reg-email" value={R.email} onChange={e => setR({ ...R, email: e.target.value })} placeholder="tucorreo@dominio.cl" />
              <label htmlFor="reg-email2">Confirmar Email</label>
              <input id="reg-email2" value={R.email2} onChange={e => setR({ ...R, email2: e.target.value })} />

              <label htmlFor="reg-phone">Teléfono</label>
              <input id="reg-phone" value={R.phone} onChange={e => setR({ ...R, phone: e.target.value })} placeholder="+569XXXXXXXX" />

              <div className="row2">
                <div>
                  <label htmlFor="reg-region">Seleccionar región</label>
                  <select id="reg-region" value={R.region} onChange={e => setR({ ...R, region: e.target.value, comuna: "" })}>
                    <option value="">—</option>
                    {REGIONES.map(r => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="reg-comuna">Seleccionar comuna</label>
                  <select id="reg-comuna" value={R.comuna} onChange={e => setR({ ...R, comuna: e.target.value })} disabled={!comunas.length}>
                    <option value="">—</option>
                    {comunas.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" value={R.password} onChange={e => setR({ ...R, password: e.target.value })} />
              <label htmlFor="reg-password2">Confirmar Password</label>
              <input id="reg-password2" type="password" value={R.password2} onChange={e => setR({ ...R, password2: e.target.value })} />

              <div className="terms">
                <input id="reg-terms" type="checkbox" checked={R.terms} onChange={e => setR({ ...R, terms: e.target.checked })} />
                <label htmlFor="reg-terms"><span>Acepto los términos y condiciones</span></label>
              </div>

              <button className="primary" disabled={loading}>
                {loading ? "Procesando..." : "Registrar"}
              </button>

              {msg && <p className="msg">{msg}</p>}

              <p className="swap">
                ¿Ya tienes cuenta?
                <button type="button" className="link" onClick={() => setMode("login")}> Inicia sesión</button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
