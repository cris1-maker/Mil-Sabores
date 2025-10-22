// src/components/NavBar.jsx
import { NavLink, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";

export default function NavBar() {
  const { isAuth, session, logout } = useAuth();

  useEffect(() => {
    const M = window.M;
    if (M?.Sidenav) {
      const elems = document.querySelectorAll(".sidenav");
      M.Sidenav.init(elems);
    }
  }, []);

  const closeSidenav = () => {
    const M = window.M;
    const elem = document.getElementById("mobile-nav");
    const instance = M?.Sidenav?.getInstance?.(elem);
    instance?.close?.();
  };
  
  // Nota: Si el logout usaba navigate, tendrás que ajustarlo
  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Recarga la página para ir al home
  };
  
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <>
      <nav className="transparent z-depth-0">
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Mil Sabores</Link>
          <a href="#!" data-target="mobile-nav" className="sidenav-trigger right">
            <i className="fas fa-bars"></i>
          </a>
          <ul className="right hide-on-med-and-down">
            <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
            <li><NavLink to="/productos" className={linkClass}>Productos</NavLink></li>
            <li><NavLink to="/nosotros" className={linkClass}>Nosotros</NavLink></li>
            <li><NavLink to="/contacto" className={linkClass}>Contacto</NavLink></li>
            <li><NavLink to="/carrito" className={linkClass}><i className="fas fa-shopping-cart"></i></NavLink></li>
            {isAuth ? (
              <>
                <li>Hola, {session.name || session.email}</li>
                <li><button onClick={handleLogout}>Cerrar sesión</button></li>
              </>
            ) : (
              <li><NavLink to="/registro" className={linkClass}><i className="fas fa-user"></i></NavLink></li>
            )}
            <li><NavLink to="/admin" className={linkClass}><i className="fa-solid fa-gauge me-1"></i>Panel Admin</NavLink></li>
</ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-nav" onClick={closeSidenav}>
        <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
        <li><NavLink to="/productos" className={linkClass}>Productos</NavLink></li>
        {/* ... etc */}
        <li><NavLink to="/admin" className={linkClass}><i className="fa-solid fa-gauge me-1"></i>Panel Admin</NavLink></li>
</ul>
    </>
  );
}