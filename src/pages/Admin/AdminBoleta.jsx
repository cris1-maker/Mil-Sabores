import React from "react";

export const AdminBoleta = () => {
  // Datos falsos estilo pastelería
  const boletas = [
    { id: "P-1001", fecha: "2025-10-20", cliente: "María López", total: 45000, items: [{name:"Torta Selva Negra", qty:1, price:30000},{name:"Caja de macarons", qty:1, price:15000}] },
    { id: "P-1002", fecha: "2025-10-20", cliente: "Panadería El Molino", total: 23000, items: [{name:"Pan artesano x10", qty:1, price:23000}] },
    { id: "P-1003", fecha: "2025-10-19", cliente: "Carlos Sánchez", total: 18000, items: [{name:"Pie limón", qty:2, price:9000}] },
    { id: "P-1004", fecha: "2025-10-18", cliente: "Ana Torres", total: 76000, items: [{name:"Torta Cumpleaños grande", qty:1, price:76000}] }
  ];

  return (
    <div className="container-fluid">
      <h2 className="mb-3">Boletas de Ventas - Pastelería</h2>
      <p className="text-muted">Listado de boletas (datos de ejemplo)</p>

      <div className="row g-3">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>Boleta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total (CLP)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {boletas.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.fecha}</td>
                    <td>{b.cliente}</td>
                    <td>{b.total.toLocaleString('es-CL')}</td>
                    <td>
                      <button className="btn btn-sm btn-light me-2" onClick={() => alert(JSON.stringify(b.items, null, 2))}>
                        Ver items
                      </button>
                      <button className="btn btn-sm btn-success" onClick={() => alert('Imprimir boleta ' + b.id)}>
                        Imprimir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBoleta;
