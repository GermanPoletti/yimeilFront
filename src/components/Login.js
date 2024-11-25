import React, { useEffect, useState } from "react";
import './Login.css';


const Login = ({ manejarToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const dataGuardada = JSON.parse(localStorage.getItem('data'));
        if (dataGuardada) {
            manejarToken(dataGuardada);
        }
    }, [manejarToken]);



    const handleLogin = async () => {
        try {
            const response = await fetch(
                "https://poo2024.unsada.edu.ar/cuentas/login",
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error desconocido");
            }

            const data = await response.json();

            localStorage.setItem('data', JSON.stringify(data));
            manejarToken(data);

            // Convertir expiresIn a milisegundos y establecer un temporizador
            const timeoutId = setTimeout(() => {
                localStorage.removeItem('data');
                console.log("Datos de inicio de sesión eliminados del localStorage");
            }, data.expiresIn * 1000);

            console.log(`Token expirará en: ${data.expiresIn} segundos (${data.expiresIn * 1000} ms)`);

            // Limpiar el temporizador si el componente se desmonta o el tiempo de expiración cambia
            return () => clearTimeout(timeoutId);
        } catch (error) {
            if (error == "Error: Unauthorized") {
                setError(
                    "La cuenta no existe o las credenciales no son validas. Intente de nuevo"
                );
                return;
            }
            setError(error.message);
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

