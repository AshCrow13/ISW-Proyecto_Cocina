import axios from "./root.service.js";
import { jwtDecode } from "jwt-decode";
import { convertirMinusculas } from "@helpers/formatData.js";

export async function login(dataUser) {
    try {
        const response = await axios.post("/auth/login", {
            email: dataUser.email,
            password: dataUser.password,
        });

        const { status, data } = response;

        if (status === 200) {
            const decodedToken = jwtDecode(data.data.token);
            const { nombreCompleto, email, rut, rol } = decodedToken;
            const userData = { nombreCompleto, email, rut, rol };

            return { userData, token: data.data.token };
        }
    } catch (error) {
        return { error: error.response?.data || "Error en el login" };
    }
}

export async function register(data) {
    try {
        const dataRegister = convertirMinusculas(data);
        const { nombreCompleto, email, rut, password } = dataRegister;
        const response = await axios.post("/auth/register", {
            nombreCompleto,
            email,
            rut,
            password,
        });
        return response.data;
    } catch (error) {
        return error.response?.data || "Error en el registro";
    }
}
