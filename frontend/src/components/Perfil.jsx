// eslint-disable-next-line no-unused-vars
import React from "react";
import Cookies from "js-cookie";

const payloadCookie = Cookies.get("payload");
let payload = {};

// Validar si la cookie existe y parsearla
if (payloadCookie) {
  try {
    payload = JSON.parse(payloadCookie);
  } catch (error) {
    console.error("Error al parsear la cookie payload:", error);
  }
}

const Perfil = () => {
  // Simulando datos de logeo
  const userData = {
    nombre: payload.nombre || "No disponible",
    email: payload.email || "No disponible",
    rol: payload.rol || "No disponible",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        alignItems: "center",
        height: "35vh",
        backgroundColor: "#f8f9fa", // Color de fondo general
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "left",
          color: "#333",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          Perfil de Usuario
        </h2>

        <p style={{ margin: "10px 0", fontSize: "1rem", color: "#555" }}>
          <strong style={{ color: "#333" }}>Nombre:</strong> {userData.nombre}
        </p>
        <p style={{ margin: "10px 0", fontSize: "1rem", color: "#555" }}>
          <strong style={{ color: "#333" }}>Email:</strong> {userData.email}
        </p>
        <p style={{ margin: "10px 0", fontSize: "1rem", color: "#555" }}>
          <strong style={{ color: "#333" }}>Rol:</strong> {userData.rol}
        </p>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button
            onClick={() => {
              Cookies.remove("payload");
              window.location.reload();
            }}
            style={{
              backgroundColor: "#795548",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
