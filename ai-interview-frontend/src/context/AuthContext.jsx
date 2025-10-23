import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

// Normalize API/backend user object into consistent shape with .id
const normalizeUser = (payload) => {
  if (!payload) return null;
  const u = payload.user || payload; // pick payload.user if exists
  const id = u._id || u.id || u.userId || u.uid; // ensure .id exists
  return { ...u, id };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(normalizeUser(JSON.parse(storedUser)));
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData) => {
    const actualUser = normalizeUser(userData);
    setUser(actualUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
