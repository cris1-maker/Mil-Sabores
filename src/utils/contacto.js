import { useState } from "react";

export function useContactoForm(options = {}) {
  const { onSuccess } = options;
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const nombre = form.nombre.trim();
    const correo = form.correo.trim();
    const mensaje = form.mensaje.trim();

    if (!nombre || !correo || !mensaje) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!emailRegex.test(correo)) {
      alert("Ingresa un correo válido.");
      return;
    }
    setEnviando(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      alert("¡Mensaje enviado con éxito!");
      setForm({ nombre: "", correo: "", mensaje: "" });
      onSuccess && onSuccess();
    } finally {
      setEnviando(false);
    }
  };

  return { form, enviando, onChange, onSubmit };
}
