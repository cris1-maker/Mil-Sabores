import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const readLS = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const slugify = (s) =>
    (s || "")
        .toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

export const AdminCategoriaEditar = () => {
    const { id } = useParams();
    const nav = useNavigate();
    const [cats, setCats] = useState(() => readLS("categorias", []));
    const cat = cats.find(c => c.id === id);

    const [nombre, setNombre] = useState(cat?.nombre || "");
    const [descripcion, setDescripcion] = useState(cat?.descripcion || "");
    const [activo, setActivo] = useState(cat?.activo ?? true);
    const slug = useMemo(() => slugify(nombre), [nombre]);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (!cat) nav("/admin/categorias", { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const existsOther = useMemo(
        () => cats.some(c => c.slug === slug && c.id !== id),
        [cats, slug, id]
    );

    const save = (e) => {
        e.preventDefault();
        setTouched(true);
        if (!nombre.trim() || existsOther) return;
        const next = cats.map(c =>
            c.id === id ? { ...c, nombre: nombre.trim(), slug, descripcion: descripcion.trim(), activo } : c
        );
        setCats(next);
        writeLS("categorias", next);
        nav("/admin/categorias", { replace: true });
    };

    if (!cat) return null;

    return (
        <div className="container py-3">
            <h2 className="mb-3"><i className="fa fa-edit me-2"></i>Editar categoría</h2>
            <div className="card">
                <div className="card-body">
                    <form onSubmit={save} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input
                                className={`form-control ${touched && (!nombre.trim() || existsOther) ? "is-invalid" : ""}`}
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                onBlur={() => setTouched(true)}
                                required
                            />
                            {touched && !nombre.trim() && <div className="invalid-feedback">Ingresa un nombre.</div>}
                            {touched && existsOther && <div className="invalid-feedback">Ya existe otra categoría con ese slug.</div>}
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
                            <button type="submit" className="btn btn-primary" disabled={!nombre.trim() || existsOther}>
                                Guardar cambios
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
