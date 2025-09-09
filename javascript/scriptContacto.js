document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".wrapper1 form");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener valores
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const mensaje = form.mensaje.value.trim();

    // Validaciones simples
    if(nombre === "" || correo === "" || mensaje === "") {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    // Validación de email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(correo)) {
      alert("Ingresa un correo válido.");
      return;
    }
    // Si todo es correcto
    alert("¡Mensaje enviado con éxito!");
    // Redirige al home
    window.location.href = "/pages/index.html";
  });
});

