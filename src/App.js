import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Bandeja from "./components/Bandeja";
import Enviar from "./components/Enviar";
import Bienvenida from "./components/Bienvenida";
import Correo from "./components/Correo";
import "./App.css";

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [vistaActiva, setVistaActiva] = useState("login"); // Estado inicial: login
  const [mensajeExito, setMensajeExito] = useState("");
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null);
  const [authData, setAuthData] = useState(null);
  const [userData, setUserData] = useState(null);

  // Función para obtener datos del usuario
  const fetchUserData = async (idUsuario, token) => {
    const baseUrlUser = `https://poo-dev.unsada.edu.ar/cuentas/user/${idUsuario}`;
    const params = new URLSearchParams({ token: token });

    try {
      const response = await fetch(`${baseUrlUser}?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener la información del usuario.");
      }

      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const seleccionarCorreo = (correo) => {
    setCorreoSeleccionado(correo);
  };

  useEffect(() => {
    if (correoSeleccionado) {
      setVistaActiva("correo");
    }
  }, [correoSeleccionado]);

  // Función para manejar el login y establecer datos de sesión
  const manejarToken = (data) => {
    setAuthData(data);
    setToken(data.token);
    setUserId(data.userId);
    setVistaActiva("bienvenida"); // Vista inicial tras login
    fetchUserData(data.userId, data.token);
  };

  const manejarData = (data) => {
    setAuthData(data);
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setToken(null);
    localStorage.setItem("data", null);
    setVistaActiva("login");
  };

  // Función para cambiar entre vistas
  const cambiarVista = (vista) => {
    setVistaActiva(vista);
  };

  const handleEnviarCorreo = async (emailData) => {
    try {
      await fetch("https://poo2024.unsada.edu.ar/yimeil/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: `${emailData.token}`,
          systemId: `${emailData.systemId}`,
          from: `${emailData.from}`,
          to: `${emailData.to}`,
          subject: `${emailData.subject}`,
          body: `${emailData.body}`,
          attachments: emailData.attachments.map((attachment) => ({
            filename: attachment.filename,
            url: attachment.url,
          })),
        }),
      });
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }

    setMensajeExito("Correo enviado con éxito");
    setTimeout(() => {
      setMensajeExito("");
      setVistaActiva("bandeja");
    }, 3000);
  };

  return (
      <div className="App">
        <Sidebar
            token={token}
            cambiarVista={cambiarVista}
            cerrarSesion={cerrarSesion}
        />
        <div className="main-content">
          {vistaActiva === "bienvenida" && token && userId && (
              <Bienvenida
                  userId={userId}
                  token={token}
                  cambiarVista={cambiarVista} // Pasamos la función para cambiar vistas
              />
          )}
          {vistaActiva === "login" && <Login manejarToken={manejarToken} />}
          {vistaActiva === "bandeja" && token && (
              <Bandeja token={token} seleccionarCorreo={seleccionarCorreo} />
          )}
          {vistaActiva === "correo" && correoSeleccionado && (
              <Correo correo={correoSeleccionado} />
          )}
          {vistaActiva === "enviar" && token && (
              <Enviar
                  handleEnviarCorreo={handleEnviarCorreo}
                  authData={authData}
                  userData={userData}
              />
          )}
          {mensajeExito && <div className="exito">{mensajeExito}</div>}
        </div>
      </div>
  );
};

export default App;
