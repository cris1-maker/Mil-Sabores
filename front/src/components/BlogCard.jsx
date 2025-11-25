// src/components/BlogPromoCard.jsx
import { Link } from "react-router-dom";

export default function BlogCard({
  title = "Blog",
  subtitle = "Recetas, tips y detrás de cámaras",
  img = "/img/blog.png", // pon una imagen representativa
}) {
  return (
    <div className="card hoverable z-depth-3 blog-promo-card">
      <div className="card-image">
        <img src={img} alt="Blog Mil Sabores" />
        <span className="card-title">{title}</span>
      </div>
      <div className="card-content">
        <p style={{ color: "#000" }}>{subtitle}</p>
      </div>
      <div className="card-action">
        <Link to="/blog" className="btn orange waves-effect waves-light" style={{ width: "100%" }}>
          Ir al Blog
        </Link>
      </div>
    </div>
  );
}
