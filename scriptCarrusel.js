document.addEventListener('DOMContentLoaded', function () {
  // Inicialización del carrusel
  const carouselElems = document.querySelectorAll('.carousel');
  const carouselInstances = M.Carousel.init(carouselElems, {
    fullWidth: true,
    indicators: false
  });

  // Banner de texto
  const frases = [
    "Repostería",
    "Reserva para bodas",
    "Para compartir",
    "Croissants rellenos",
    "Galletas artesanales"
  ];
  let index = 0;
  const textBanner = document.getElementById("textBanner");

  setInterval(() => {
    carouselInstances.forEach(instance => instance.next());

    index = (index + 1) % frases.length;
    textBanner.textContent = frases[index];
    textBanner.classList.remove("fadeIn");
    void textBanner.offsetWidth; // reinicia animación
    textBanner.classList.add("fadeIn");
  }, 3000);

  // Inicialización de dropdown
  var elems = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(elems, { coverTrigger: false, constrainWidth: false });

  // Click en cualquier imagen del carrusel va a productos.html
  const carouselImages = document.querySelectorAll('#myCarousel .carousel-item img');
  carouselImages.forEach(img => {
    img.addEventListener('click', () => {
      window.location.href = 'productos.html'; // redirige al HTML productos
    });
  });
});



document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, {
    coverTrigger: false, // hace que no tape el botón
    constrainWidth: false // ancho automático según el contenido
  });
});

