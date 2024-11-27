import React, { useEffect, useState } from "react";

const Bienvenida = ({ token, userId }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const fetchUserData = async () => {
    const baseUrlUser = `https://poo-dev.unsada.edu.ar/cuentas/user/${userId}`;
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

      const data = await response.json();


      setUsuario(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchUserData();
    } else {
      console.log("userId or token is missing.");
    }
  }, [userId, token]);

  return (
      <div className="capa bienvenida">
        <img src="/LogoY.png" alt="Logo YIMEIL" className="logo-img" />
        <h2>¡Bienvenido!</h2>
        {cargando ? (
            <p>Cargando información del usuario...</p>
        ) : usuario ? (
            <div>
              <p>
                Hola, {usuario.firstName} {usuario.lastName} ({usuario.username})
              </p>
            </div>
        ) : (
            <p>Error al cargar la información del usuario.</p>
        )}
      </div>
  );
};

export default Bienvenida;
