// src/utils/contacto.js
import { useState } from "react";
import { isEmail } from "./validators"; // ya lo usas en Registro

export function useContactoForm({ onSuccess } = {}) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // limpiar error del campo mientras escribe
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validar = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }

    if (!form.correo.trim()) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!isEmail(form.correo)) {
      newErrors.correo = "Ingresa un correo electrónico válido.";
    }

    if (!form.mensaje.trim()) {
      newErrors.mensaje = "El mensaje no puede estar vacío.";
    }

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // ✅ evitamos que el navegador haga submit y valide por HTML5

    const newErrors = validar();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setEnviando(true);

      // Aquí iría la llamada real a tu backend / API de contacto
      // Por ahora solo simulamos:
      console.log("Enviando formulario de contacto...", form);
      await new Promise((res) => setTimeout(res, 800));

      // limpiar formulario
      setForm({ nombre: "", correo: "", mensaje: "" });

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error enviando formulario de contacto:", err);
      // Podrías setear un error general si quieres
    } finally {
      setEnviando(false);
    }
  };

  return {
    form,
    errors,
    enviando,
    onChange,
    onSubmit,
  };
}
