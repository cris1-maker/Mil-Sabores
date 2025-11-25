// src/pages/Admin/AdminHome.jsx
import { useEffect, useState } from "react";
import { ORDERS_URL } from "../../config/api";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    totalAmount: 0,
    loading: true,
    error: null,
  });

  const cargarStats = async () => {
    try {
      const token = localStorage.getItem("token"); // JWT del admin

      const res = await fetch(`${ORDERS_URL}/api/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} al cargar órdenes`);
      }

      const orders = await res.json();

      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === "PENDING").length;
      const paidOrders = orders.filter(o => o.status === "PAID").length;

      const totalAmount = orders.reduce((acc, o) => {
        const monto = o.totalAmount || o.total || 0;
        return acc + monto;
      }, 0);

      setStats({
        totalOrders,
        pendingOrders,
        paidOrders,
        totalAmount,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("[AdminHome] Error:", err);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="admin-dashboard loading-state">
        <div className="spinner" />
        <p>Cargando datos del panel...</p>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="admin-dashboard error-state">
        <h2>Panel de administración</h2>
        <p className="error-text">
          Error al cargar estadísticas: {stats.error}
        </p>
        <button className="btn-retry" onClick={cargarStats}>
          Reintentar
        </button>
      </div>
    );
  }

  const { totalOrders, pendingOrders, totalAmount } = stats;

  const completedOrders = totalOrders - pendingOrders;
  const completionRate =
    totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
  const pendingRate =
    totalOrders > 0 ? Math.round((pendingOrders / totalOrders) * 100) : 0;
  const avgTicket =
    totalOrders > 0 ? Math.round(totalAmount / totalOrders) : 0;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Panel de Administración</h2>
          <p className="dashboard-subtitle">
            Resumen en tiempo real de las ventas y órdenes de Mil Sabores.
          </p>
        </div>
        <div className="dashboard-badge">
          <span className="badge-dot" />
          <span>Datos en vivo</span>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Columna principal */}
        <section className="dashboard-main">
          {/* Tarjetas principales */}
          <div className="stats-grid">
            <StatCard
              title="Órdenes Totales"
              value={totalOrders}
              icon="📦"
              color="#4e73df"
              subtitle="Órdenes generadas en el sistema"
            />
            <StatCard
              title="Órdenes Pendientes"
              value={pendingOrders}
              icon="⏳"
              color="#f6c23e"
              subtitle="A la espera de gestión/pago"
            />
            <StatCard
              title="Ventas Totales"
              value={`$ ${totalAmount.toLocaleString("es-CL")}`}
              icon="💰"
              color="#1cc88a"
              subtitle="Monto acumulado de las órdenes"
            />
          </div>

          {/* Gráficos estilo analytics (simples pero vistosos) */}
          <div className="charts-grid">
            <ChartCard
              title="Estado de las órdenes"
              description="Distribución entre órdenes completadas vs pendientes."
            >
              <ProgressBar
                label="Órdenes completadas"
                percentage={completionRate}
                color="#1cc88a"
              />
              <ProgressBar
                label="Órdenes pendientes"
                percentage={pendingRate}
                color="#f6c23e"
              />
              <div className="chart-footer">
                <span>Total: {totalOrders}</span>
                <span>
                  Completadas: {completedOrders} ({completionRate}%)
                </span>
                <span>
                  Pendientes: {pendingOrders} ({pendingRate}%)
                </span>
              </div>
            </ChartCard>

            <ChartCard
              title="Ticket promedio"
              description="Monto promedio por orden generada."
            >
              <div className="kpi-main-value">
                {totalOrders > 0
                  ? `$ ${avgTicket.toLocaleString("es-CL")}`
                  : "Sin datos aún"}
              </div>
              <p className="kpi-helper">
                Se calcula como ventas totales dividido por la cantidad de
                órdenes.
              </p>
              <div className="kpi-row">
                <span>Ventas totales:</span>
                <strong>$ {totalAmount.toLocaleString("es-CL")}</strong>
              </div>
              <div className="kpi-row">
                <span>Órdenes:</span>
                <strong>{totalOrders}</strong>
              </div>
            </ChartCard>
          </div>
        </section>

        {/* Columna lateral derecha, tipo insights */}
        <aside className="dashboard-side">
          <InsightCard
            title="Resumen rápido"
            items={[
              {
                label: "Órdenes registradas",
                value: totalOrders,
              },
              {
                label: "Pendientes de gestionar",
                value: pendingOrders,
              },
              {
                label: "Monto total",
                value: `$ ${totalAmount.toLocaleString("es-CL")}`,
              },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}

/* ====== COMPONENTES REUTILIZABLES ====== */

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-card-main">
        <div>
          <h4>{title}</h4>
          <p className="stat-value">{value}</p>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
        </div>
        <div className="stat-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, description, children }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {description && <p className="chart-description">{description}</p>}
      <div className="chart-content">{children}</div>
    </div>
  );
}

function ProgressBar({ label, percentage, color }) {
  return (
    <div className="progress-row">
      <div className="progress-header">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function InsightCard({ title, items, description }) {
  return (
    <div className="insight-card">
      <h3>{title}</h3>
      {description && <p className="insight-text">{description}</p>}
      {items && (
        <ul className="insight-list">
          {items.map((it, idx) => (
            <li key={idx}>
              <span>{it.label}</span>
              <strong>{it.value}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
