import { useEffect } from "react";
import M from "materialize-css";

export function useMaterializeInit(options = {}) {
  useEffect(() => {
    const cleanups = [];

    if (options.dropdown) {
      const elems = document.querySelectorAll(".dropdown-trigger");
      const instances = M.Dropdown.init(elems, { coverTrigger: false, constrainWidth: false });
      cleanups.push(() => instances.forEach(i => i.destroy()));
    }
    if (options.sidenav) {
      const elems = document.querySelectorAll(".sidenav");
      const instances = M.Sidenav.init(elems);
      cleanups.push(() => instances.forEach(i => i.destroy()));
    }
    if (options.modal) {
      const elems = document.querySelectorAll(".modal");
      const instances = M.Modal.init(elems);
      cleanups.push(() => instances.forEach(i => i.destroy()));
    }
    if (options.select) {
      const elems = document.querySelectorAll("select");
      const instances = M.FormSelect.init(elems);
      cleanups.push(() => instances.forEach(i => i.destroy()));
    }
    if (options.tooltip) {
      const elems = document.querySelectorAll(".tooltipped");
      const instances = M.Tooltip.init(elems);
      cleanups.push(() => instances.forEach(i => i.destroy()));
    }
    if (options.carousel) {
      const elems = document.querySelectorAll(".carousel");
      const instances = M.Carousel.init(elems, { fullWidth: true });
      cleanups.push(() => instances.forEach(i => i.destroy()));
    }
    return () => cleanups.forEach(fn => fn());
  }, [options]);
}
