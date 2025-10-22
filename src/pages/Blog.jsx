// src/pages/Blog.jsx
import { useEffect } from "react";
import M from "materialize-css";

const POSTS_FAKE = [
  {
    id: 1,
    titulo: "El secreto detrás del Cheesecake Doble Capa",
    resumen:
      "Descubre cómo logramos la textura perfecta con dos capas de queso crema artesanal y base de galletas horneadas.",
    cover: "/img/cheese.png",
    fecha: "2025-10-01",
  },
  {
    id: 2,
    titulo: "Tortas de boda con flores naturales: arte comestible",
    resumen:
      "Explora la tendencia de decorar tortas nupciales con flores frescas y cómo seleccionarlas para cada temporada.",
    cover: "/img/Boda.png",
    fecha: "2025-09-15",
  },
  {
    id: 3,
    titulo: "Brownies sin culpa: sabor intenso, cero remordimiento",
    resumen:
      "Aprende a preparar brownies saludables utilizando ingredientes nutritivos sin sacrificar el sabor.",
    cover: "/img/browni.png",
    fecha: "2025-08-20",
  },
];

export default function Blog() {
  useEffect(() => {
    const elems = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(elems);
  }, []);

  return (
    <main className="blog-wrap container section">
      <h4 className="blog-title center-align">BLOG DE RECETAS Y RECOMENDACIONES</h4>

      {POSTS_FAKE.map((p, idx) => (
        <section
          key={p.id}
          className={`blog-caso z-depth-1 ${idx % 2 === 1 ? "reverse" : ""}`}
        >
          <div className="caso-texto">
            <h5 className="caso-titulo">RECOMENDACIONES Y NOTICIAS </h5>
            <p className="caso-resumen">{p.resumen}</p>
            <p className="caso-fecha">
              {new Date(p.fecha).toLocaleDateString()}
            </p>

            <div className="caso-acciones">
              <button className="btn btn-small amber darken-2 waves-effect">
                VER CASO
              </button>
            </div>
          </div>

          <div className="caso-media">
            <img src={p.cover} alt={p.titulo} />
          </div>
        </section>
      ))}
    </main>
  );
}
