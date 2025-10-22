import { useEffect } from "react";
import M from "materialize-css";
import SocialButton from "../components/SocialButton";

export default function Nosotros() {
  // Inicializa correctamente los componentes de Materialize
  useEffect(() => {
    const dropdowns = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdowns, { coverTrigger: false, constrainWidth: false });

    const sidenavs = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenavs);
  }, []);

  return (
    <>
      <div className="container section">
        <h3 className="center-align">Conócenos</h3>
        <p className="flow-text center-align">
          En <strong>Mil Sabores</strong> llevamos la pasión por la repostería al
          siguiente nivel. Desde nuestros inicios, nos hemos dedicado a crear
          experiencias dulces que encantan a cada cliente.
        </p>

        {/* === TARJETAS: HISTORIA / MISIÓN / VISIÓN === */}
        <div className="row">
          <div className="col s12 m4">
            <div className="card z-depth-3">
              <div className="card-content center">
                <i className="fas fa-book-open fa-2x brown-text"></i>
                <h5>Nuestra Historia</h5>
                <p style={{ color: "black" }}>
                  Pastelería <strong>1000 Sabores</strong> celebra su{" "}
                  <strong>50 aniversario</strong> como un referente en la
                  repostería chilena. Reconocida por su participación en un{" "}
                  <em>Récord Guinness</em> en 1995, cuando colaboró en la creación
                  de la <strong>torta más grande del mundo</strong>. Hoy buscamos
                  renovar nuestro sistema de ventas online para entregar una
                  experiencia de compra moderna, cercana y accesible para todos
                  nuestros clientes.
                </p>
              </div>
            </div>
          </div>

          <div className="col s12 m4">
            <div className="card z-depth-3">
              <div className="card-content center">
                <i className="fas fa-bullseye fa-2x red-text"></i>
                <h5>Misión</h5>
                <p style={{ color: "black" }}>
                  Nuestra misión es ofrecer una experiencia dulce y memorable a
                  nuestros clientes, proporcionando tortas y productos de
                  repostería de alta calidad para todas las ocasiones, mientras
                  celebramos nuestras raíces históricas y fomentamos la
                  creatividad en la repostería.
                </p>
              </div>
            </div>
          </div>

          <div className="col s12 m4">
            <div className="card z-depth-3">
              <div className="card-content center">
                <i className="fas fa-eye fa-2x teal-text"></i>
                <h5>Visión</h5>
                <p style={{ color: "black" }}>
                  Convertirnos en la tienda online líder de productos de
                  repostería en Chile, conocida por nuestra innovación, calidad y
                  el impacto positivo en la comunidad, especialmente en la
                  formación de nuevos talentos en gastronomía.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === SECCIÓN EQUIPO === */}
        <div className="section team-section">
          <div className="container team-container">
            <h4 style={{ color: "black" }} className="center-align">
              Conoce a nuestro equipo
            </h4>
            <div className="row center-align team-row">
              <div className="col s12 m3 team-member">
                <img
                  src="/img/Maria.jpeg"
                  alt="Chef 1"
                  className="circle responsive-img"
                />
                <h6>María González</h6>
                <p style={{ color: "black" }}>Fundadora & Chef Repostera</p>
              </div>
              <div className="col s12 m3 team-member">
                <img
                  src="/img/Carlos.jpeg"
                  alt="Chef 2"
                  className="circle responsive-img"
                />
                <h6>Carlos Pérez</h6>
                <p style={{ color: "black" }}>Maestro Pastelero</p>
              </div>
              <div className="col s12 m3 team-member">
                <img
                  src="/img/Lucia.jpeg"
                  alt="Chef 3"
                  className="circle responsive-img"
                />
                <h6>Lucía Martínez</h6>
                <p style={{ color: "black" }}>Decoradora Creativa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
