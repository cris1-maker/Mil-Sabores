
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa el carrusel como slider (pantalla completa de cada ítem)
  const elems = document.querySelectorAll('.carousel');
  const instances = M.Carousel.init(elems, {
    fullWidth: true, // ocupa todo el ancho
    indicators: false // puntitos indicadores abajo
  });

  // Función autoplay
  setInterval(() => {
    instances.forEach(instance => {
      instance.next(); // pasa a la siguiente imagen
    });
  }, 3000); // cambia cada 3 segundos
});


document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.dropdown-trigger');
  var instances = M.Dropdown.init(elems, {
    coverTrigger: false, // hace que no tape el botón
    constrainWidth: false // ancho automático según el contenido
  });
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {coverTrigger: false});
    });