import React, { useEffect, useState } from "react";
import "./Login.css";

const Login = ({ manejarToken, cerrarSesion }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const dataGuardada = JSON.parse(localStorage.getItem("data"));
    const storedLoginTime = localStorage.getItem("horaInicio");
    if (dataGuardada && storedLoginTime) {
      const horaLogin = new Date(storedLoginTime);
      const horaActual = new Date();

      const diferenciaHoras = Math.floor((horaActual - horaLogin) / 1000);
      console.log(
        `tiempo restante para expiracion: ${
          dataGuardada.expiresIn - diferenciaHoras
        } segundos`
      );
      if (diferenciaHoras < dataGuardada.expiresIn) {
        manejarToken(dataGuardada);
      } else {
        localStorage.removeItem("data");
        localStorage.removeItem("horaInicio");
        console.log("El token ha expirado.");
        cerrarSesion();
      }
    }
  }, [manejarToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Debe completar ambos campos");
      return;
    }

    try {
      const response = await fetch(
        //"https://poo2024.unsada.edu.ar/cuentas/login",
        "https://poo-dev.unsada.edu.ar:8088/cuentas/API/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: email,
            password: password,
          }),
        }
      );

      // Verificar si la respuesta no fue exitosa
      if (!response.ok) {
        let errorMessage = "Error desconocido";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          console.warn("No se pudo leer el mensaje de error del servidor.");
        }

        if (response.status === 401) {
          setError(
            "La cuenta no existe o las credenciales no son válidas. Intente de nuevo"
          );
        } else {
          setError(errorMessage);
        }

        console.warn(`Error HTTP ${response.status}: ${errorMessage}`);
        return;
      }

      const data = await response.json();

      const authorized = await fetch(
        "https://poo-dev.unsada.edu.ar:8088/cuentas/API/authorize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: data.token, // Usamos el token obtenido del primer fetch
            systemId: 2, // Reemplaza con el ID de sistema correspondiente
          }),
        }
      );

      if (!authorized.ok) {
        console.warn(
          `Error en la autorización. HTTP Status: ${authorized.status}`
        );
        const errorData = await authorized.json();
        setError(errorData.error || "Error de autorización");
        return;
      }

      const authorizedResponse = await authorized.json();

      if (!authorizedResponse.authorized) {
        setError("Usuario no autorizado para el servicio");
        return;
      }

      // Guardar información en el localStorage
      localStorage.setItem("data", JSON.stringify(data));
      const loginTime = new Date().toISOString();
      localStorage.setItem("horaInicio", loginTime);
      manejarToken(data);

      // Configurar el temporizador para la expiración del token
      const timeoutId = setTimeout(() => {
        localStorage.removeItem("data");
        console.log("Datos de inicio de sesión eliminados del localStorage");
        cerrarSesion();
      }, data.expiresIn * 1000);

      console.log(
        `Token expirará en: ${data.expiresIn} segundos (${
          data.expiresIn * 1000
        } ms)`
      );

      // Limpiar el temporizador si el componente se desmonta
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error("Error inesperado:", error.message);
      setError(
        "Ocurrió un problema al conectarse con el servidor. Intente nuevamente."
      );
    }
  };

  return (
    <div className="capa">
      <h2>Iniciar sesión</h2>
      <input
        className="loginInput"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="loginInput"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="loginBtn" onClick={handleLogin}>
        Iniciar sesión
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
