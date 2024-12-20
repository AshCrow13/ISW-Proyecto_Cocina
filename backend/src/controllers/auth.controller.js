"use strict";
import { loginService, registerService } from "../services/auth.service.js";
import { sendEmailDefault } from "../controllers/email.controller.js";
import {
  authValidation,
  //cookieValidation,
  registerValidation,
} from "../validations/auth.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

// Función de inicio de sesión
export async function login(req, res) {
  try {
    const { body } = req;

    // Validar datos de entrada
    const { error } = authValidation.validate(body);
    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Llamar al servicio de login
    const [result, errorToken] = await loginService(body);

    if (errorToken) {
      return handleErrorClient(res, 400, "Error iniciando sesión", errorToken);
    }

    const { accessToken, payload } = result;

    // Configurar cookies
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 día
    });

    res.cookie("payload", JSON.stringify(payload), {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      sameSite: "Lax",
      path: "/",
    });

    // Agregar un console.log para verificar la respuesta
    console.log("Respuesta enviada al cliente:", {
      status: "Success",
      message: "Inicio de sesión exitoso",
      data: { token: accessToken },
    });

    // Respuesta exitosa
    handleSuccess(res, 200, "Inicio de sesión exitoso", { token: accessToken });
  } catch (error) {
    console.error("Error en el controlador login:", error);
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}



// Función de registro de usuario
export async function register(req, res) {
  try {
    const { body } = req;

    // Validación de los datos de entrada para el registro
    const { error } = registerValidation.validate(body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validación", error.message);
    }

    // Llamada al servicio de registro
    const [newUser, errorNewUser] = await registerService(body);

    // Si ocurre un error en el servicio de registro
    if (errorNewUser) {
      return handleErrorClient(res, 400, "Error registrando al usuario", errorNewUser);
    }

    const resEmail = await sendEmailDefault({ 
      body: {
        email: body.email,
        subject: "Bienvenido a Restaurante/Cocina",
        message: `Bienvenido nuevo Empleado ${newUser.nombreCompleto}`,
      }
    });

    if (!resEmail.success) {
      console.error("Error enviando el correo:", resEmail.error);
    }

    // Respuesta exitosa con los datos del nuevo usuario
    handleSuccess(res, 201, "Usuario registrado con éxito", newUser);
  } catch (error) {
    // Manejo de errores internos del servidor
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}

// Función de cierre de sesión
export async function logout(req, res) {
  try {
    // Limpiar la cookie del JWT
    res.clearCookie("jwt-auth", { httpOnly: true });

    // Respuesta exitosa al cerrar sesión
    handleSuccess(res, 200, "Sesión cerrada exitosamente");
  } catch (error) {
    // Manejo de errores internos del servidor
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}
