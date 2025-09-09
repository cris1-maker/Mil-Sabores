document.addEventListener("DOMContentLoaded", function () {
  const productos = [
    { nombre: "Brownie", precio: 8900, imagen: "/img/browni.png", descripcion: "Brownie de chocolate intenso y húmedo." },
    { nombre: "Pastel de Bodas", precio: 100000, imagen: "/img/Boda.png", descripcion: "Pastel de boda personalisado." },
    { nombre: "Croissant", precio: 3200, imagen: "/img/croasan.png", descripcion: "Croissant de mantequilla hojaldrado y crujiente." },
    { nombre: "Red Velvet", precio: 8200, imagen: "/img/redvelvet.png", descripcion: "Torta Red Velvet con crema de queso." },
    { nombre: "Pavlova", precio: 8700, imagen: "/img/pavlova.png", descripcion: "Postre de merengue crocante con frutas frescas." },
    { nombre: "NY Cookie", precio: 2500, imagen: "/img/galleta.png", descripcion: "Galleta estilo New York, suave y chocolatosa." },
    { nombre: "Cheesecake", precio: 4300, imagen: "/img/cheese.png", descripcion: "Cheesecake cremoso con base de galleta." },
    { nombre: "Carrot Cake", precio: 7900, imagen: "/img/carrot.png", descripcion: "Bizcocho húmedo de zanahoria con especias." },
    { nombre: "Cinnamon Roll", precio: 4600, imagen: "/img/cinnamon.png", descripcion: "Roll de canela glaseado, esponjoso y dulce." },
    { nombre: "Blueberry Scone", precio: 3800, imagen: "/img/scon_blu.png", descripcion: "Scone de arándanos con textura suave." },
    { nombre: "Blondie", precio: 4000, imagen: "/img/blondi.png", descripcion: "Brownie rubio con trozos de chocolate blanco." },
    { nombre: "Bagel Azul", precio: 5200, imagen: "/img/bluebagel.png", descripcion: "Bagel artesanal de color azul, único." }
  ];

  const container = document.getElementById("productos-container");

  productos.forEach(producto => {
    const col = document.createElement("div");
    col.className = "col s12 m6 l4";

    col.innerHTML = `
      <div class="card card-producto glass z-depth-3 hoverable" 
           data-descripcion="${producto.descripcion}">
        <div class="card-image">
          <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <div class="card-content center-align">
          <h6>${producto.nombre}</h6>
          <p>$${producto.precio.toLocaleString('es-CL')}</p>
          <a href="/pages/detalle.html" class="btn waves-effect" style="background-color:#561411">Agregar</a>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  // --- Tooltip Global ---
  const tooltip = document.getElementById("tooltip-global");

  document.querySelectorAll(".card-producto").forEach(card => {
    card.addEventListener("mouseenter", () => {
      const rect = card.getBoundingClientRect();
      tooltip.textContent = card.dataset.descripcion;
      tooltip.style.top = `${window.scrollY + rect.bottom + 10}px`;
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.transform = "translateX(-50%)";
      tooltip.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
});
