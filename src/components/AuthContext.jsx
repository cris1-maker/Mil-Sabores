// src/components/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { LS, readJSON, writeJSON, del } from "../utils/storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => readJSON(LS.USERS, []));
  const [session, setSession] = useState(() => readJSON(LS.SESSION, null));

  useEffect(() => {
    writeJSON(LS.USERS, users);
  }, [users]);

  useEffect(() => {
    if (session) {
      writeJSON(LS.SESSION, session);
    } else {
      del(LS.SESSION);
    }
  }, [session]);

  const register = useCallback((u, { autoLogin = true } = {}) => {
    const exists = users.some(
      (x) => x.email.toLowerCase() === String(u.email || "").toLowerCase()
    );
    if (exists) {
      throw new Error("Ya existe un usuario con ese correo.");
    }

    const newUser = {
      id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now())),
      name: u.name,
      email: u.email,
      password: u.password, // Recuerda: Contraseña en texto plano (solo para demo)
      phone: u.phone,
      region: u.region,
      comuna: u.comuna,
    };

    setUsers((prev) => [...prev, newUser]);

    if (autoLogin) {
      setSession({ id: newUser.id, name: newUser.name, email: newUser.email });
    }
    return newUser;
  }, [users]);

  const login = useCallback((email, password) => {
    const u = users.find(
      (x) => x.email.toLowerCase() === String(email || "").toLowerCase()
    );
    if (!u || u.password !== password) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    setSession({ id: u.id, name: u.name, email: u.email });
    return u;
  }, [users]);

  // Aquí declaramos la función logout
  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuth: !!session,
      login,
      logout, // Ahora logout está definida antes de ser usada aquí
      register,
    }),
    [session, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return ctx;
}