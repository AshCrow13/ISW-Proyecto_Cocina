import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "@pages/Login";
import Home from "@pages/Home";
import Users from "@pages/Users";
import Register from "@pages/Register";
import Error404 from "@pages/Error404";
import Root from "@pages/Root";
import ProtectedRoute from "@components/ProtectedRoute.jsx";
import "@styles/styles.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import App from "./App.jsx";

import Menu from '@components/Menu';
import Ingrediente from './pages/IngredientePage.jsx';
import Pedido from '@components/Pedido';
import Proveedores from '@components/Proveedores';
import Turnos from '@components/Turnos';
import Inventario from './pages/InventarioPage.jsx';
import VerPedidos from '@components/VerPedidos';
import Perfil from '@components/Perfil';
import GestionMenuPage from './pages/gestionMenuPage.jsx';
import Empleado from './components/Empleado.jsx';
import Cliente from "./components/Cliente.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      { path: '/menu', element: <Menu /> },
      { path: '/ingrediente', element: <Ingrediente /> },
      { path: '/pedidos', element: <Pedido /> },
      { path: '/proveedor', element: <Proveedores /> },
      { path: '/turnos', element: <Turnos /> },
      { path: '/inventario', element: <Inventario /> },
      { path: '/verpedidos', element: <VerPedidos /> },
      { path: '/perfil', element: <Perfil /> },
      { path: '/gestionmenu', element: <GestionMenuPage /> },
      { path: '/empleados', element: <Empleado /> },
      { path: '/cliente', element: <Cliente/>}
    ],
  },
  {
    path: "/auth",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <AuthProvider>
      <App />
      {/*<SnackbarProvider>*/}
      {/* Aquí se aseguran el router y el contexto */}
      {/*</SnackbarProvider> */}
    </AuthProvider>
  </RouterProvider>
);
