"use strict";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/configDb.js";
import { comparePassword, encryptPassword } from "../helpers/bcrypt.helper.js";
import Empleado from "../entity/Empleado.entity.js"; // Asegúrate de que la entidad Empleado esté correctamente definida
import { ACCESS_TOKEN_SECRET } from "../config/configEnv.js"; // Agregar el secreto para el refresh token
import { REFRESH_TOKEN_SECRET } from "../config/configEnv.js"; // Agregar el secreto para el refresh token

// Lógica para iniciar sesión
export async function loginService(empleado) {
  try {
    console.log("ACCESS_TOKEN_SECRET:", ACCESS_TOKEN_SECRET);
    console.log("REFRESH_TOKEN_SECRET:", REFRESH_TOKEN_SECRET);

    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error("Faltan los secretos para generar los tokens JWT");
    }

    const empleadoRepository = AppDataSource.getRepository(Empleado);
    const { email, password } = empleado;

    const empleadoFound = await empleadoRepository.findOne({ where: { email } });

    if (!empleadoFound) {
      return [null, { field: "email", message: "El correo electrónico es incorrecto" }];
    }

    const isMatch = await comparePassword(password, empleadoFound.password);

    if (!isMatch) {
      return [null, { field: "password", message: "La contraseña es incorrecta" }];
    }

    // Creación del payload para el JWT
    const payload = {
      nombre: empleadoFound.nombre,
      email: empleadoFound.email,
      rut: empleadoFound.rut,
      rol: empleadoFound.rol,
    };

    // Crear el access token
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "3d", // El token expira en 3 día
    });

    // Crear el refresh token para renovar el access token
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "10d", // El refresh token expira en 10 días
    });

    return [{ accessToken, refreshToken, payload }, null];
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    handleErrorServer(res, 500, "Error interno del servidor");
  }
}

// Lógica para registrar un nuevo empleado
export async function registerService(empleado) {
  try {
    const empleadoRepository = AppDataSource.getRepository(Empleado);
    const { nombre, rut, email, password } = empleado;

    // Verificar si el correo o el rut ya están en uso
    const existingEmailEmpleado = await empleadoRepository.findOne({ where: { email } });
    if (existingEmailEmpleado) {
      return [null, { field: "email", message: "Correo electrónico en uso" }];
    }

    const existingRutEmpleado = await empleadoRepository.findOne({ where: { rut } });
    if (existingRutEmpleado) {
      return [null, { field: "rut", message: "Rut ya asociado a una cuenta" }];
    }

    // Crear un nuevo empleado
    const hashedPassword = await encryptPassword(password);
    const newEmpleado = empleadoRepository.create({
      nombre,
      email,
      rut,
      password: hashedPassword,
      rol: "Empleado", // Puedes ajustar el rol según sea necesario
    });

    await empleadoRepository.save(newEmpleado);

    // Retornar los datos del empleado, excluyendo la contraseña
    const { password: pass, ...dataEmpleado } = newEmpleado;
    return [dataEmpleado, null];
  } catch (error) {
    console.error("Error al registrar un empleado:", error);
    return [null, { message: "Error interno del servidor" }];
  }
}
