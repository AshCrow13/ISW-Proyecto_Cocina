"use strict";
import express, { json, urlencoded } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { cookieKey, HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";
import { createEmpleados } from "./config/initialSetup.js"; // Si es necesario para la creación de usuarios iniciales
import { passportJwtSetup } from "./auth/passport.auth.js"; // Configuración de Passport JWT
import indexRoutes from "./routes/index.routes.js"; // Rutas principales de la API
import authRoutes from "./routes/auth.routes.js"; // Rutas de autenticación (Login, Registro)
import { authenticateJwt } from "./middlewares/authentication.middleware.js"; // Middleware de autenticación
import { isAdmin } from "./middlewares/authorization.middleware.js"; // Middleware de autorización (por ejemplo, admin)
import { AppDataSource } from "./config/configDb.js"; // Importar la clase AppDataSource

// Función para configurar y arrancar el servidor
async function setupServer() {
  try {
    const app = express();
    // Deshabilitar cabecera "x-powered-by"
    app.disable("x-powered-by");
    // Configuración de CORS
    app.use(
      cors({
        credentials: true,
        origin: true, // Ajusta esto según la URL de tu frontend
      }),
    );
    // Configuración para parsear datos en formato JSON y URL encoded
    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));

        // Configuración de cookies y sesión
        app.use(cookieParser());
        app.use(session({
            secret: cookieKey,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,  // Usar 'true' si tienes HTTPS configurado
                httpOnly: true,
                sameSite: "strict",
            },
        }));
        
        // Configuración de Passport para manejar la autenticación (JWT, sessions, etc.)
        app.use(passport.initialize());
        app.use(passport.session());
        passportJwtSetup();  // Setup de Passport para JWT

    // Middleware de logging
    app.use(morgan("dev"));

    // Rutas de autenticación (Login, Registro)
    app.use("/api/auth", authRoutes);

    // Rutas protegidas (requieren autenticación y autorización)
    app.use("/api/proveedores", authenticateJwt, isAdmin, indexRoutes); // Por ejemplo, rutas de proveedores

    // Rutas generales de la API
    app.use("/api", indexRoutes); // Aquí puedes incluir todas tus rutas principales

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer(), el error es: ", error);
  }
}

// Función para conectar a la base de datos y luego iniciar el servidor
async function setupAPI() {
  try {
    await connectDB(); // Conexión a la base de datos
    await setupServer(); // Configuración del servidor y rutas
    await createEmpleados(); // Crear usuarios iniciales (si es necesario)
  } catch (error) {
    console.log("Error en index.js -> setupAPI(), el error es: ", error);
  }
}

// Llamar la función para iniciar la API
setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) =>
    console.log("Error en index.js -> setupAPI(), el error es: ", error),
  );
