// src/components/NavBar.jsx
import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

export default function NavBar() {
  const { isAuth, session, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  useEffect(() => {
    const M = window.M;
    const elems = document.querySelectorAll(".sidenav");
    elems.forEach(elem => {
      if (!M.Sidenav.getInstance(elem)) {
        M.Sidenav.init(elem);
      }
    });
  }, [location]);

  const closeSidenav = () => {
    const M = window.M;
    const elem = document.getElementById("mobile-nav");
    const instance = M?.Sidenav?.getInstance?.(elem);
    instance?.close?.();

    const overlay = document.querySelector(".sidenav-overlay");
    if (overlay) overlay.click();
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <>
      <nav className="transparent z-depth-0">
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Mil Sabores</Link>
          <a href="#" data-target="mobile-nav" className="sidenav-trigger right">
            <i className="fas fa-bars"></i>
          </a>

          <ul className="right hide-on-med-and-down">
            <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
            <li><NavLink to="/productos" className={linkClass}>Productos</NavLink></li>
            <li><NavLink to="/nosotros" className={linkClass}>Nosotros</NavLink></li>
            <li><NavLink to="/contacto" className={linkClass}>Contacto</NavLink></li>

            <li>
              <NavLink to="/carrito" className={linkClass}>
                <span className="cart-icon-wrapper">
                  <i className="fas fa-shopping-cart"></i>
                  {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                </span>
              </NavLink>
            </li>

            {/* LOGIN / LOGOUT */}
            {isAuth ? (
              <li>
                <button
                  onClick={handleLogout}
                  style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
                >
                  Cerrar sesión
                </button>
              </li>
            ) : (
              <li>
                <NavLink to="/registro" className={linkClass}>
                  <i className="fas fa-user"></i>
                </NavLink>
              </li>
            )}

            {/* SOLO ADMIN VE ESTE BOTÓN */}
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={linkClass}>
                  <i className="fa-solid fa-gauge me-1"></i> Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <ul className="sidenav" id="mobile-nav">
        <li><NavLink to="/" end className={linkClass} onClick={closeSidenav}>Inicio</NavLink></li>
        <li><NavLink to="/productos" className={linkClass} onClick={closeSidenav}>Productos</NavLink></li>
        <li><NavLink to="/nosotros" className={linkClass} onClick={closeSidenav}>Nosotros</NavLink></li>
        <li><NavLink to="/contacto" className={linkClass} onClick={closeSidenav}>Contacto</NavLink></li>
        <li>
          <NavLink to="/carrito" className={linkClass} onClick={closeSidenav}>
            Carrito <i className="fas fa-shopping-cart" />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>
        </li>

        {isAuth ? (
          <>
            <li style={{ paddingLeft: "16px", paddingTop: "8px" }}>
              Hola, {session.name || session.email}
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{ background: "transparent", border: "none", color: "#111", padding: "10px 16px", textAlign: "left" }}
              >
                Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/registro" className={linkClass} onClick={closeSidenav}>
              <i className="fas fa-user"></i> Login
            </NavLink>
          </li>
        )}

        {/* SOLO ADMIN */}
        {isAdmin && (
          <li>
            <NavLink to="/admin" className={linkClass} onClick={closeSidenav}>
              <i className="fa-solid fa-gauge me-1"></i> Admin
            </NavLink>
          </li>
        )}
      </ul>
    </>
  );
}
