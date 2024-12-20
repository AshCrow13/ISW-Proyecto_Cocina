import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Hook personalizado para consumir el contexto
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user; // Verifica si hay un usuario logueado

  // Función para iniciar sesión
  const login = (newUser) => {
    sessionStorage.setItem("usuario", JSON.stringify(newUser)); // Guardar en sessionStorage
    setUser(newUser); // Actualizar el estado
    navigate("/"); // Redirigir después del login
  };

  // Función para cerrar sesión
  const logout = () => {
    sessionStorage.removeItem("usuario"); // Eliminar de sessionStorage
    setUser(null); // Limpiar el estado del usuario
    navigate("/"); // Redirigir a la página de inicio
  };

  useEffect(() => {
    console.log("Usuario:", user);
    if (!isAuthenticated) {
      console.log("No hay usuario logueado");
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
