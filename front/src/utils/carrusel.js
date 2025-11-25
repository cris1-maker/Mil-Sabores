// src/utils/carrusel.js
import { useEffect } from "react";
import M from "materialize-css";
// ⬇️ nuevo
import { useNavigate } from "react-router-dom";

// --- tu hook original (igual) ---
export function useCarrusel({
  carouselOptions = { fullWidth: true, indicators: false },
  frases = ["Repostería","Reserva para bodas","Para compartir","Croissants rellenos","Galletas artesanales"],
  onImageClick,
  intervalMs = 3000,
} = {}) {
  useEffect(() => {
    const carouselElems = document.querySelectorAll(".carousel");
    const carouselInstances = M.Carousel.init(carouselElems, carouselOptions);

    const ddElems = document.querySelectorAll(".dropdown-trigger");
    const ddInstances = M.Dropdown.init(ddElems, { coverTrigger: false, constrainWidth: false });

    const sidenavElems = document.querySelectorAll(".sidenav");
    const sidenavInstances = M.Sidenav.init(sidenavElems);

    const textBanner = document.getElementById("textBanner");
    let index = 0;
    const tick = () => {
      carouselInstances.forEach((inst) => inst.next());
      if (textBanner && frases.length) {
        index = (index + 1) % frases.length;
        textBanner.textContent = frases[index];
        textBanner.classList.remove("fadeIn");
        void textBanner.offsetWidth;
        textBanner.classList.add("fadeIn");
      }
    };
    const timer = setInterval(tick, intervalMs);

    const imgs = Array.from(document.querySelectorAll("#myCarousel .carousel-item img"));
    const imgHandlers = [];
    if (onImageClick) {
      imgs.forEach((img, i) => {
        const fn = () => onImageClick(i, img);
        img.addEventListener("click", fn);
        imgHandlers.push([img, fn]);
      });
    }

    return () => {
      clearInterval(timer);
      carouselInstances.forEach((i) => i.destroy());
      ddInstances.forEach((i) => i.destroy());
      sidenavInstances.forEach((i) => i.destroy());
      imgHandlers.forEach(([img, fn]) => img.removeEventListener("click", fn));
    };
  }, [carouselOptions, frases, onImageClick, intervalMs]);
}

// --- NUEVO: hook que ya incluye navigate ---
export function useCarruselWithNavigate({
  to = "/productos",
  carouselOptions,
  frases,
  intervalMs,
} = {}) {
  const navigate = useNavigate();
  useCarrusel({
    carouselOptions,
    frases,
    intervalMs,
    onImageClick: () => navigate(to),
  });
}

// --- NUEVO: componente inicializador “cero código en Home” ---
export function CarruselInit(props) {
  // props: { to, carouselOptions, frases, intervalMs }
  useCarruselWithNavigate(props);
  return null; // no renderiza nada, solo inicializa comportamientos
}
