import { useNavigate } from "react-router-dom";
import { useContactoForm } from "../utils/contacto";

export default function Contacto() {
  const navigate = useNavigate();
  const { form, enviando, onChange, onSubmit } = useContactoForm({
    onSuccess: () => navigate("/"),
  });

  return (
    <div className="contact-page container section">
      <div className="contact-card">
        
        {/* Título */}
        <h4 className="contact-title">Contacto</h4>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="contact-form" noValidate>
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input
              name="nombre"
              id="nombre"
              value={form.nombre}
              onChange={onChange}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="correo">Correo</label>
            <input
              name="correo"
              id="correo"
              type="email"
              value={form.correo}
              onChange={onChange}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              name="mensaje"
              id="mensaje"
              value={form.mensaje}
              onChange={onChange}
              placeholder="Cuéntanos en qué te ayudamos…"
              rows={5}
            />
          </div>

          <div className="contact-actions">
            <button className="primary" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </div>

          <p className="contact-note">
            Respondemos dentro de 24–48 horas hábiles.
          </p>
        </form>

        {/* Mapa */}
        <div className="section">
          <h4 className="center-align" style={{color:"black"}} >Nuestras Ubicaciones</h4>

          <div
            style={{
              width: "100%",
              height: "400px",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              marginTop: "20px"
            }}
          >
            <iframe 
            src="https://www.google.com/maps/d/u/0/embed?mid=1goLO4e8Tx8cKU_4ktdw3_bK3F-qiGpk&ehbc=2E312F&noprof=1" 
            width="640" 
            height="480"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
