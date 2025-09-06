document.addEventListener('DOMContentLoaded', function () {
  const carouselElems = document.querySelectorAll('.carousel');
  const carouselInstances = M.Carousel.init(carouselElems, {
    fullWidth: true,
    indicators: false
  });

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
});

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, {
    coverTrigger: false, // hace que no tape el botón
    constrainWidth: false // ancho automático según el contenido
  });
});

