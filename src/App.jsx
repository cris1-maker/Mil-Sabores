// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes y Páginas
import { AdminLayout } from './components/AdminLayout/AdminLayout.jsx';
import { AdminHome } from './pages/Admin/AdminHome.jsx';
import { AdminUsuarios } from './pages/Admin/AdminUsuarios.jsx';
import { AdminNuevoUsuario } from './pages/Admin/AdminNuevoUsuario.jsx';
import { AdminHistorialCompras } from './pages/Admin/AdminHistorialCompras.jsx';
import { AdminOrdenes } from './pages/Admin/AdminOrdenes.jsx';
import { AdminBoleta } from './pages/Admin/AdminBoleta.jsx';
import { AdminProductosCriticos } from './pages/Admin/AdminProductosCriticos.jsx';
import { AdminPerfil } from './pages/Admin/AdminPerfil.jsx';
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import SocialButton from "./components/SocialButton.jsx";
import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import Contacto from "./pages/Contacto.jsx";
import Blog from "./pages/Blog.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Carrito from "./pages/Carrito.jsx";
import Registro from "./pages/Registro.jsx";
import Checkout from "./pages/Checkout.jsx";
import PagoExitoso from "./pages/PagoExitoso";
import PagoRechazado from "./pages/PagoRechazado";

export default function App() {
  return (
    <div className="app">
      <ToastContainer />
      <NavBar />
      <SocialButton />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-rechazado" element={<PagoRechazado />} />
        
          {/* --- Rutas de Administrador (integradas desde bosque-antiguo) --- */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="usuarios/nuevo" element={<AdminNuevoUsuario />} />
            <Route path="usuarios/:id/historial" element={<AdminHistorialCompras />} />
            <Route path="ordenes" element={<AdminOrdenes />} />
            <Route path="boleta" element={<AdminBoleta />} />
            <Route path="productos" element={<AdminProductosCriticos />} />
            <Route path="perfil" element={<AdminPerfil />} />
          </Route>

</Routes>
      </main>
      <Footer />
    </div>
  );
}