import "../styles/navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../services/root.service.js";
import Cookies from "js-cookie";
//import { useSnackbar } from "../components/SnackbarContext.jsx";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar errores de login

  // Estado para almacenar el rol del usuario logueado
  const [rol, setRol] = useState(null);

  const toggleModal = (e) => {
    setIsModalOpen(!isModalOpen);
    if (e.target.className === "modal-overlay") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const payloadCookie = Cookies.get("payload");
    if (payloadCookie) {
      try {
        const payload = JSON.parse(payloadCookie);
        console.log("Rol del usuario:", payload.rol); // Verificar el valor
        setRol(payload.rol);
      } catch (error) {
        console.error("Error al parsear el payload:", error);
      }
    }
  }, []);

  //  const { showSnackbar } = useSnackbar();

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      console.log("Login exitoso:", response.data);
      alert("Login exitoso", "success");

      // Obtener la cookie 'payload'
      const payloadCookie = Cookies.get("payload");

      if (payloadCookie) {
        try {
          const payload = JSON.parse(payloadCookie);
          console.log("Datos del payload:", payload);
        } catch (e) {
          console.error("Error al parsear el payload:", e);
        }
      } else {
        console.log("No existe la cookie de payload");
      }

      setErrorMessage(""); // Limpiar mensaje de error si el login es exitoso
      setIsModalOpen(false); // Cerrar el modal tras el login exitoso
    } catch (error) {
      if (error.response) {
        // Error del backend
        setErrorMessage(error.response.data.message || "Error en el login");
      } else {
        // Error de red u otro problema
        setErrorMessage("Error al conectar con el servidor");
      }
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__brand">
          <h1 style={{ fontFamily: "Newsreader, serif" }}>Restaurante</h1>
        </div>
        <div className="navbar__right">
          <div className="navbar__user-options">
            <a
              href="https://www.google.com/maps/@-37.816279,144.953735,15z?hl=en&entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
            >Dirección</a>
            <div style={{ margin: "10px 0", textAlign: "left" }}></div>
              <>
              {rol === "Administrador" && (
                <Link to="/perfil">
                  <button>Perfil</button>
                </Link>
              )}
              </>
            
            {/* Botón para abrir el modal */}
            <button className="navbar__login" onClick={toggleModal}>
              Login
            </button>
          </div>
        </div>
      </nav>

      <nav>
        <ul className="navbar__links">
          <li>
            <Link
              to="/"
              style={{ fontFamily: "Newsreader, serif", fontSize: "1.4rem" }}
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              style={{ fontFamily: "Newsreader", fontSize: "1.4rem" }}
            >
              Menú
            </Link>
          </li>

          {(rol === "Mesero" ||
            rol === "Chef" ||
            rol === "JefeCocina" ||
            rol === "Administrador") && (
            <li>
              <Link to="/pedidos"
              style={{ fontFamily: "Newsreader", fontSize: "1.4rem" }}
              >Pedidos</Link>{" "}
              {/* Solo visible para estos roles */}
            </li>
          )}
          {(rol === "Chef" ||
            rol === "JefeCocina" ||
            rol === "Administrador") && (
            <li>
              <Link to="/ingrediente"
              style={{ fontFamily: "Newsreader", fontSize: "1.4rem" }}
              >Ingredientes</Link>{" "}
              {/* Solo visible para estos roles */}
            </li>
          )}
          {(rol === "JefeCocina" || rol === "Administrador") && (
            <li>
              <Link to="/inventario"
              style={{ fontFamily: "Newsreader", fontSize: "1.4rem" }}
              >Inventario</Link>{" "}
              {/* Solo visible para estos roles */}
            </li>
          )}
          {rol === "Administrador" && (
            <li>
              <Link
                to="/turnos"
                style={{ fontFamily: "Newsreader, serif", fontSize: "1.4rem" }}
              >
                Turnos
              </Link>
            </li>
          )}
          {rol === "Administrador" && (
            <li>
              <Link
                to="/proveedor"
                style={{ fontFamily: "Newsreader, serif", fontSize: "1.4rem" }}
              >
                Proveedores
              </Link>
            </li>
          )}
          {rol === "Administrador" && (
            <li>
              <Link
                to="/empleados"
                style={{ fontFamily: "Newsreader, serif", fontSize: "1.4rem" }}
              >
                Empleados
              </Link>
            </li>
          )}
          {(rol === "Mesero" || rol === "Administrador") && (
            <li>
              <Link to="/cliente"
              style={{ fontFamily: "Newsreader", fontSize: "1.4rem" }}
              >Clientes</Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="email"
                required
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="password"
                required
              />
              <button type="submit">Login</button>
            </form>
            {/* Mensaje de error */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {/* Botón para cerrar el modal */}
            <button className="modal-close" onClick={toggleModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
