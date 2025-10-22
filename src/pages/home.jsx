// src/pages/Home.jsx
import { CarruselInit } from "../utils/carrusel";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      {/* Inicializa carrusel + banner + dropdown/sidenav + click a /productos */}
      <CarruselInit
        to="/productos"
        carouselOptions={{ fullWidth: true, indicators: false }}
        frases={[
          "Repostería",
          "Reserva para bodas",
          "Para compartir",
          "Croissants rellenos",
          "Galletas artesanales",
        ]}
        intervalMs={3000}
      />

      <div className="container section">
        {/* Grid controlado por CSS (no absolute). Izquierda: contenido. Derecha: sidebar compacta */}
        <div className="home-grid">
          {/* === IZQUIERDA: bienvenida + carrusel (ocupa todo el espacio disponible) === */}
          <div className="home-left">
            <div className="center-align" style={{ marginTop: 60 }}>
              <img
                src="/img/logo.png"
                alt="Logo"
                className="circle responsive-img"
                style={{ width: 150, height: "auto" }}
              />
              <h3>Bienvenidos a Mil Sabores</h3>
              <p>Tu destino dulce para pasteles y postres excepcionales</p>
            </div>

            {/* Productos / Carrusel */}
            <div className="productos-container">
              <div className="badge-destacados">Destacados</div>
              <div className="carousel-container">
                <div className="carousel-text-banner" id="textBanner">Repostería</div>
                <div className="carousel carousel-slider center" id="myCarousel">
                  <div className="carousel-item"><img src="/img/torta.png"   alt="Imagen 1" /></div>
                  <div className="carousel-item"><img src="/img/Boda.png"    alt="Imagen 2" /></div>
                  <div className="carousel-item"><img src="/img/cheese.png"  alt="Imagen 3" /></div>
                  <div className="carousel-item"><img src="/img/croasan.png" alt="Imagen 4" /></div>
                  <div className="carousel-item"><img src="/img/galleta.png" alt="Imagen 5" /></div>
                </div>
              </div>
            </div>
          </div>

          <Link to="/blog" className="blog-fab">
            <img src="/img/blog.png" alt="Blog Mil Sabores" className="blog-fab-img" />
            <div className="blog-fab-body">
              <h6 className="blog-fab-title">Blog</h6>
              <p className="blog-fab-desc">Recetas, tips y novedades.</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
