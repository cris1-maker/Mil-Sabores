// src/components/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { AUTH_URL } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("ms_session");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuth = !!session;

  const isAdmin =
    !!session &&
    (
      session.role === "ADMIN" || // si el backend manda "role"
      (Array.isArray(session.roles) && session.roles.includes("ADMIN")) // si manda "roles"
    );

  // Opcional: revalidar /me al recargar
  useEffect(() => {
    const token = session?.token;
    if (!token) return;

    const fetchMe = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("No se pudo revalidar sesión, cerrando sesión.");
          logout();
          return;
        }

        const me = await res.json();
        const newSession = { ...me, token };
        setSession(newSession);
        localStorage.setItem("ms_session", JSON.stringify(newSession));
      } catch (e) {
        console.error("Error revalidando /me", e);
        logout();
      }
    };

    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    // 1) login => obtener token
    const res = await fetch(`${AUTH_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Error en login:", res.status, txt);
      throw new Error("Credenciales inválidas");
    }

    const data = await res.json(); // { token: "..." }
    const token = data.token;

    // 2) llamar /me para obtener datos del usuario + rol
    const resMe = await fetch(`${AUTH_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resMe.ok) {
      const txt = await resMe.text();
      console.error("Error en /me:", resMe.status, txt);
      throw new Error("No se pudo obtener información del usuario");
    }

    const me = await resMe.json(); // { id, email, name, role, ... }

    const newSession = { ...me, token };
    setSession(newSession);
    localStorage.setItem("ms_session", JSON.stringify(newSession));
  };

  const register = async (payload) => {
    const res = await fetch(`${AUTH_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Error en register:", res.status, txt);
      throw new Error("Error al registrar usuario");
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("ms_session");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isAdmin,
        session,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
