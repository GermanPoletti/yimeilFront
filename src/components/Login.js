import React, { useEffect, useState } from "react";
import './Login.css';


const Login = ({ manejarToken, cerrarSesion }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const dataGuardada = JSON.parse(localStorage.getItem('data'));
        const storedLoginTime = localStorage.getItem("horaInicio");
        if (dataGuardada && storedLoginTime) {
            const horaLogin = new Date(storedLoginTime)
            const horaActual = new Date();

            const diferenciaHoras = Math.floor((horaActual - horaLogin) / 1000);
            console.log(`tiempo restante para expiracion: ${dataGuardada.expiresIn - diferenciaHoras} segundos`);
            if(diferenciaHoras < dataGuardada.expiresIn){
                manejarToken(dataGuardada);
            }else{
                localStorage.removeItem('data');
                localStorage.removeItem('horaInicio');
                console.log("El token ha expirado.");
                cerrarSesion();
            }
        }
    }, [manejarToken]);



  const handleLogin = async () => {
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
            let errorMessage = "Error desconocido"; // Mensaje por defecto
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage; // Mensaje de error del servidor
            } catch {
                console.warn("No se pudo leer el mensaje de error del servidor.");
            }

            // Manejar el error sin lanzar una excepción
            if (response.status === 401) {
                setError("La cuenta no existe o las credenciales no son válidas. Intente de nuevo");
            } else {
                setError(errorMessage);
            }
            console.warn(`Error HTTP ${response.status}: ${errorMessage}`);
            return; // Detener el flujo
        }

        // Si la respuesta es exitosa
        const data = await response.json();

        // Guardar información en el localStorage
        localStorage.setItem('data', JSON.stringify(data));
        const loginTime = new Date().toISOString();
        localStorage.setItem('horaInicio', loginTime);
        manejarToken(data);

        // Configurar el temporizador para la expiración del token
        const timeoutId = setTimeout(() => {
            localStorage.removeItem('data');
            console.log("Datos de inicio de sesión eliminados del localStorage");
            cerrarSesion();
        }, data.expiresIn * 1000);

        console.log(`Token expirará en: ${data.expiresIn} segundos (${data.expiresIn * 1000} ms)`);

        // Limpiar el temporizador si el componente se desmonta
        return () => clearTimeout(timeoutId);
    } catch (error) {
        console.error("Error inesperado:", error.message);
        setError("Ocurrió un problema al conectarse con el servidor. Intente nuevamente.");
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
            <button className="loginBtn" onClick={handleLogin}>Iniciar sesión</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;

