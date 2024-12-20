import MenuCard from "./MenuCard";
import "../styles/Menu.css";
import { useState, useEffect } from "react";
import { getPlatos } from "../services/plato.service";
import Cookies from "js-cookie";
import { Link } from "react-router-dom"; // Importamos Link para la navegación

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchMenuItems() {
      const data = await getPlatos();
      const dataIds = data.map((item, index) => ({
        ...item,
        id: item.id || index,
      }));
      setMenuItems(dataIds);
    }

    const payloadCookie = Cookies.get("payload");
    
    if (payloadCookie) {
      try {
        const payload = JSON.parse(payloadCookie);
        setIsAdmin(payload.rol.toLowerCase() === "administrador");
      } catch (error) {
        console.error("Error al parsear el payload:", error);
      }
    }

    fetchMenuItems();
  }, []);

  // Filtrar ensaladas
  const ensaladas = menuItems.filter((item) =>
    item.nombre.toLowerCase().includes("ensalada")
  );

  // Filtrar postres
  const postres = menuItems.filter((item) =>
    item.nombre.toLowerCase().includes("postre")
  );

// Filtrar Bebidas
  const Bebidas = menuItems.filter((item) =>
    item.nombre.toLowerCase().includes("bebida")
  );

  // Filtrar el resto de los platos
  const otrosPlatos = menuItems
    .filter((item) => !item.nombre.toLowerCase().includes("ensalada"))
    .filter((item) => !item.nombre.toLowerCase().includes("postre"))
    .filter((item) => !item.nombre.toLowerCase().includes("bebida"))
    .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente

  return (
    <div className="menu-container">
      {/* Botón de gestionar menú para administradores */}
      {isAdmin && ( 
        <div style={{ margin: "10px 0", textAlign: "left" }}>
          <Link to="/gestionmenu">
            <button
              style={{
                backgroundColor: "#795548",
                color: "white",
                border: "none",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
                borderRadius: "5px",
              }}
            >
              Gestionar Menú
            </button>
          </Link>
        </div>
      )}

      {/* Sección para Otros Platos */}
      <div className="menu-grid gap-x-10">
        {otrosPlatos.map((item) => (
          <MenuCard
            key={item.id}
            title={item.nombre}
            description={item.descripcion}
            price={Number(item.precio)}
            isAvailable={item.disponibilidad}
          />
        ))}
      </div>

      {/* Sección para Ensaladas */}
      <h2 className="section-title">Ensaladas</h2>
      <div className="menu-grid gap-x-10">
        {ensaladas.map((item) => (
          <MenuCard
            key={item.id}
            title={item.nombre}
            description={item.descripcion}
            price={Number(item.precio)}
            isAvailable={item.disponibilidad}
          />
        ))}
      </div>

      {/* Sección para Postres */}
      <h2 className="section-title">Postres</h2>
      <div className="menu-grid gap-x-10">
        {postres.map((item) => (
          <MenuCard
            key={item.id}
            title={item.nombre}
            description={item.descripcion}
            price={Number(item.precio)}
            isAvailable={item.disponibilidad}
          />
        ))}
      </div>

      {/* Sección de Bebidas */}
      <h2 className="section-title">Bebidas</h2>
      <div className="menu-grid gap-x-10">
        {Bebidas.map((item) => (
        <MenuCard
          key={item.id}
          title={item.nombre}
          description={item.descripcion}
          price={Number(item.precio)}
          isAvailable={item.disponibilidad}
        />
        ))}
      </div>

    </div>
  );
};

export default Menu;
