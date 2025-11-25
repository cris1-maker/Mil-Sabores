import React, { useEffect, useMemo, useState } from "react";

const readLS = (k, fb) => { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; } };
const clp = n => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);

export const AdminReportes = () => {
    const [productos, setProductos] = useState(() => readLS("productos", []));
    const [ordenes, setOrdenes] = useState(() => readLS("ordenes", []));

    // cargar productos desde /public/data/productos.json si LS viene vacío
    useEffect(() => {
        if (!productos.length) {
            fetch("/data/productos.json")
                .then(r => r.json())
                .then(d => {
                    setProductos(d);
                    localStorage.setItem("productos", JSON.stringify(d));
                })
                .catch(() => { });
        }
    }, [productos.length]);

    // ventas por categoría (suma subtotales)
    const ventasPorCategoria = useMemo(() => {
        const map = {};
        for (const o of ordenes) {
            for (const it of o.productos || []) {
                const p = productos.find(pp => pp.codigo === it.codigo);
                const cat = p?.categoria || "Sin categoría";
                const subtotal = (p?.precio || it.precio || 0) * (it.cantidad || 0);
                map[cat] = (map[cat] || 0) + subtotal;
            }
        }
        return Object.entries(map).map(([categoria, total]) => ({ categoria, total })).sort((a, b) => b.total - a.total);
    }, [ordenes, productos]);

    // top productos por cantidad
    const topProductos = useMemo(() => {
        const map = {};
        for (const o of ordenes) {
            for (const it of o.productos || []) {
                map[it.codigo] = (map[it.codigo] || 0) + (it.cantidad || 0);
            }
        }
        const rows = Object.entries(map).map(([codigo, cant]) => {
            const p = productos.find(pp => pp.codigo === codigo);
            return { codigo, nombre: p?.nombre || codigo, cantidad: cant, categoria: p?.categoria || "" };
        });
        return rows.sort((a, b) => b.cantidad - a.cantidad).slice(0, 8);
    }, [ordenes, productos]);

    // stock crítico
    const criticos = useMemo(() => productos.filter(p => p.stock <= p.stockCritico), [productos]);

    return (
        <div className="container-fluid py-3">
            <h2 className="mb-4"><i className="fa fa-chart-bar me-2"></i>Reportes</h2>

            {/* Ventas por categoría */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">Ventas por categoría (total CLP)</div>
                <div className="card-body">
                    {!ventasPorCategoria.length ? (
                        <p className="text-muted mb-0">Aún no hay órdenes registradas.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle">
                                <thead>
                                    <tr><th>Categoría</th><th className="text-end">Total</th></tr>
                                </thead>
                                <tbody>
                                    {ventasPorCategoria.map(r => (
                                        <tr key={r.categoria}>
                                            <td>{r.categoria}</td>
                                            <td className="text-end">{clp(r.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Top productos */}
            <div className="card mb-4">
                <div className="card-header bg-dark text-white">Top productos por cantidad</div>
                <div className="card-body">
                    {!topProductos.length ? (
                        <p className="text-muted mb-0">Sin datos todavía.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead><tr><th>Producto</th><th>Categoría</th><th className="text-end">Cantidad</th></tr></thead>
                                <tbody>
                                    {topProductos.map(r => (
                                        <tr key={r.codigo}>
                                            <td>{r.nombre}</td>
                                            <td>{r.categoria}</td>
                                            <td className="text-end">{r.cantidad}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Stock crítico */}
            <div className="card">
                <div className="card-header bg-danger text-white">Productos en stock crítico</div>
                <div className="card-body">
                    {!criticos.length ? (
                        <p className="text-muted mb-0"> No hay productos en estado crítico.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead><tr><th>Producto</th><th>Categoría</th><th className="text-center">Stock</th><th className="text-center">Crítico</th></tr></thead>
                                <tbody>
                                    {criticos.map(p => (
                                        <tr key={p.codigo}>
                                            <td>{p.nombre}</td>
                                            <td>{p.categoria}</td>
                                            <td className="text-center text-danger fw-semibold">{p.stock}</td>
                                            <td className="text-center">{p.stockCritico}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
