import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// helpers LS
const readLS = (k, fb) => {
    try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; }
};
const writeLS = (k, v) => localStorage.setItem(k, JSON.stringify(v));

// slug
const slugify = (s) =>
    (s || "")
        .toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

export const AdminCategorias = () => {
    const nav = useNavigate();
    const [cats, setCats] = useState(() => readLS("categorias", []));
    const productos = readLS("productos", []); // por si existe

    // si no hay categorías, las inferimos de productos.json (en /public/data) una sola vez
    useEffect(() => {
        if (!cats.length) {
            fetch("/data/productos.json")
                .then(r => r.json())
                .then(data => {
                    const set = new Set();
                    data.forEach(p => p?.categoria && set.add(p.categoria));
                    const inferidas = Array.from(set).map((nombre) => ({
                        id: crypto.randomUUID(),
                        nombre,
                        slug: slugify(nombre),
                        descripcion: "",
                        activo: true,
                    }));
                    if (inferidas.length) {
                        setCats(inferidas);
                        writeLS("categorias", inferidas);
                    }
                })
                .catch(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalPorCategoria = useMemo(() => {
        const map = {};
        productos.forEach(p => {
            if (!p?.categoria) return;
            map[p.categoria] = (map[p.categoria] || 0) + 1;
        });
        return map;
    }, [productos]);

    const toggleActiva = (id) => {
        const next = cats.map(c => c.id === id ? { ...c, activo: !c.activo } : c);
        setCats(next);
        writeLS("categorias", next);
    };

    const eliminar = (id) => {
        if (!confirm("¿Eliminar esta categoría?")) return;
        const next = cats.filter(c => c.id !== id);
        setCats(next);
        writeLS("categorias", next);
    };

    return (
        <div className="container-fluid py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0"><i className="fa fa-tags me-2"></i>Categorías</h2>
                <div>
                    <Link to="/admin/categorias/nueva" className="btn btn-success">
                        <i className="fa fa-plus me-2"></i>Nueva categoría
                    </Link>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {!cats.length ? (
                        <p className="text-muted mb-0">Sin categorías aún.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Slug</th>
                                        <th className="text-center">Activa</th>
                                        <th className="text-center"># Productos</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cats.map(c => (
                                        <tr key={c.id}>
                                            <td>{c.nombre}</td>
                                            <td><span className="badge text-bg-secondary">{c.slug}</span></td>
                                            <td className="text-center">
                                                <span className={`badge ${c.activo ? "text-bg-success" : "text-bg-secondary"}`}>
                                                    {c.activo ? "Sí" : "No"}
                                                </span>
                                            </td>
                                            <td className="text-center">{totalPorCategoria[c.nombre] || 0}</td>
                                            <td className="text-end">
                                                <button onClick={() => toggleActiva(c.id)} className="btn btn-sm btn-outline-warning me-2">
                                                    {c.activo ? "Desactivar" : "Activar"}
                                                </button>
                                                <Link to={`/admin/categorias/editar/${c.id}`} className="btn btn-sm btn-primary me-2">
                                                    <i className="fa fa-edit"></i>
                                                </Link>
                                                <button onClick={() => eliminar(c.id)} className="btn btn-sm btn-danger">
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button className="btn btn-outline-secondary mt-3" onClick={() => nav(-1)}>
                        <i className="fa fa-arrow-left me-2"></i>Volver
                    </button>
                </div>
            </div>
        </div>
    );
};
