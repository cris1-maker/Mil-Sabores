import { useEffect } from "react";
import M from "materialize-css";

export function useFormSelect() {
  useEffect(() => {
    const elems = document.querySelectorAll("select");
    const instances = M.FormSelect.init(elems);
    return () => instances.forEach((i) => i.destroy());
  }, []);
}
