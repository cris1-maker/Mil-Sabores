import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const readLS = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const slugify = (s) =>
    (s || "")
        .toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

export const AdminCategoriaNueva = () => {
    const nav = useNavigate();
    const [cats, setCats] = useState(() => readLS("categorias", []));
    const [nombre, setNombre] = useState("");
    const slug = useMemo(() => slugify(nombre), [nombre]);
    const [descripcion, setDescripcion] = useState("");
    const [activo, setActivo] = useState(true);
    const [touched, setTouched] = useState(false);

    const exists = useMemo(
        () => cats.some(c => c.slug === slug),
        [cats, slug]
    );

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!nombre.trim() || !slug || exists) return;
        const nueva = { id: crypto.randomUUID(), nombre: nombre.trim(), slug, descripcion: descripcion.trim(), activo };
        const next = [...cats, nueva];
        setCats(next);
        writeLS("categorias", next);
        nav("/admin/categorias", { replace: true });
    };

    return (
        <div className="container py-3">
            <h2 className="mb-3"><i className="fa fa-plus me-2"></i>Nueva categoría</h2>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={submit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                className={`form-control ${touched && (!nombre.trim() || exists) ? "is-invalid" : ""}`}
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                onBlur={() => setTouched(true)}
                                placeholder="Ej: Plantas de interior"
                                required
                            />
                            {touched && !nombre.trim() && <div className="invalid-feedback">Ingresa un nombre.</div>}
                            {touched && exists && <div className="invalid-feedback">Ya existe una categoría con este nombre/slug.</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Slug</label>
                            <input className="form-control" value={slug} disabled />
                        </div>

                        <div className="col-12">
                            <label className="form-label">Descripción (opcional)</label>
                            <textarea className="form-control" rows="3" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
                        </div>

                        <div className="col-12 form-check">
                            <input id="chk" type="checkbox" className="form-check-input" checked={activo} onChange={e => setActivo(e.target.checked)} />
                            <label htmlFor="chk" className="form-check-label">Activa</label>
                        </div>

                        <div className="col-12 d-flex gap-2">
                            <button type="submit" className="btn btn-success" disabled={!nombre.trim() || !slug || exists}>
                                Guardar
                            </button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => nav("/admin/categorias")}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
