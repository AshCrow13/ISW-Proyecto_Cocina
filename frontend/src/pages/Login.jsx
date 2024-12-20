import { useNavigate } from "react-router-dom";
import { login as loginService } from "@services/auth.service.js";
import { useAuth } from "../context/AuthContext"; // Importar el contexto
import Form from "@components/Form";
import useLogin from "@hooks/auth/useLogin.jsx";
import "@styles/form.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // Obtenemos la función login del contexto

    const { errorEmail, errorPassword, errorData, handleInputChange } = useLogin();

    const loginSubmit = async (data) => {
        try {
            const response = await loginService(data);
            if (response.userData && response.token) {
                login(response.userData, response.token); // Actualizar el contexto
            } else if (response.error) {
                errorData(response.error); // Manejar error
            }
        } catch (error) {
            console.error("Error en el login:", error);
        }
    };

    return (
        <main className="container">
            <Form
                title="Iniciar sesión"
                fields={[
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.cl",
                        fieldType: "input",
                        type: "email",
                        required: true,
                        minLength: 15,
                        maxLength: 30,
                        errorMessageData: errorEmail,
                        validate: {
                            emailDomain: (value) =>
                                value.endsWith("@gmail.cl") || "El correo debe terminar en @gmail.cl",
                        },
                        onChange: (e) => handleInputChange("email", e.target.value),
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        fieldType: "input",
                        type: "password",
                        required: true,
                        minLength: 8,
                        maxLength: 26,
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                        errorMessageData: errorPassword,
                        onChange: (e) => handleInputChange("password", e.target.value),
                    },
                ]}
                buttonText="Iniciar sesión"
                onSubmit={loginSubmit}
                footerContent={
                    <p>
                        ¿No tienes cuenta?, <a href="/register">¡Regístrate aquí!</a>
                    </p>
                }
            />
        </main>
    );
};

export default Login;
