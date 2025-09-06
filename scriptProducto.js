document.addEventListener("DOMContentLoaded", function () {
  const productos = [
    { nombre: "Brownie", precio: 8900, imagen: "img/browni.png" },
    { nombre: "Macarons", precio: 4900, imagen: "img/macarons.png" },
    { nombre: "Croissant", precio: 3200, imagen: "img/croasan.png" },
    { nombre: "Red Velvet", precio: 8200, imagen: "img/redvelvet.png" },
    { nombre: "Pavlova", precio: 8700, imagen: "img/pavlova.png" },
    { nombre: "NY Cookie", precio: 2500, imagen: "img/galleta.png" },
    { nombre: "Cheesecake", precio: 4300, imagen: "img/cheese.png" },
    { nombre: "Carrot Cake", precio: 7900, imagen: "img/carrot.png" },
    { nombre: "Cinnamon Roll", precio: 4600, imagen: "img/cinnamon.png" },
    { nombre: "Blueberry Scone", precio: 3800, imagen: "img/scon_blu.png" },
    { nombre: "Blondie", precio: 4000, imagen: "img/blondi.png" },
    { nombre: "Bagel Azul", precio: 5200, imagen: "img/bluebagel.png" }
  ];

  const container = document.getElementById("productos-container");

  productos.forEach(producto => {
    const col = document.createElement("div");
    col.className = "col s12 m6 l4";

    col.innerHTML = `
      <div class="card card-producto glass z-depth-3 hoverable">
        <div class="card-image">
          <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <div class="card-content center-align">
          <h6>${producto.nombre}</h6>
          <p>$${producto.precio.toLocaleString('es-CL')}</p>
          <a class="btn waves-effect" style="background-color:#561411">Agregar</a>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
});
