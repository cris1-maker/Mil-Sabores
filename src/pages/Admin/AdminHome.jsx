import React from "react";

export const AdminHome = () => {
  return (
    <div className="container-fluid py-4">
      <h2 className="mb-3">Dashboard</h2>
      <p className="text-muted mb-4">Resumen de las actividades diarias</p>

      {/* === Tarjetas superiores === */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fa fa-shopping-cart me-2"></i>Compras
              </h5>
              <h3 className="fw-bold">1,234</h3>
              <p className="mb-0">
                Probabilidad de aumento: <b>20%</b>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fa fa-box me-2"></i>Productos
              </h5>
              <h3 className="fw-bold">400</h3>
              <p className="mb-0">
                Inventario actual: <b>500</b>
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-warning h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fa fa-users me-2"></i>Usuarios
              </h5>
              <h3 className="fw-bold">890</h3>
              <p className="mb-0">
                Nuevos usuarios este mes: <b>120</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
