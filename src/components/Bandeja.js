import React, { useEffect, useState } from "react";
import "./Bandeja.css";
const Bandeja = ({ token, seleccionarCorreo, userEmail }) => {
  const [correos, setCorreos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const systemId = "2";
  const params = new URLSearchParams({
    token: token,
    systemId: systemId,
  });
  const [emailSelec, setEmailSelec] = useState();

  useEffect(() => {
    const fetchCorreos = async () => {
      const baseUrlYimeilGetEmails =
        "https://poo-dev.unsada.edu.ar:8083/yimeil/emails";
      try {
        const response = await fetch(
          `${baseUrlYimeilGetEmails}?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setCorreos(data);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchCorreos();
  }, [token]);

  const fetchDataEmail = async (correo) => {
    const emailId = correo.emailId;
    const baseUrlYimeilGetEmails = `https://poo-dev.unsada.edu.ar:8083/yimeil/emails/${emailId}`;
    try {
      const response = await fetch(
        `${baseUrlYimeilGetEmails}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const emailData = await response.json();
      setEmailSelec(emailData);
      seleccionarCorreo(emailData);
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleClick = (correo) => {
    fetchDataEmail(correo);
  };

  return (
    <div className="bandeja">
      {cargando ? (
        <p>Cargando correos...</p>
      ) : (
        <div className="correos-lista">
          {correos
            .filter((correo) =>
              correo.to.some((destinatario) => destinatario === userEmail)
            )
            .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)) // Ordena de más reciente a más antiguo
            .length === 0 ? (
            <p className="bandeja-vacia">Bandeja de entrada vacía</p>
          ) : (
            correos
              .filter((correo) =>
                correo.to.some((destinatario) => destinatario === userEmail)
              )
              .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)) // Ordena de más reciente a más antiguo
              .map((correo) => (
                <div
                  key={correo.emailId}
                  className="correo-item"
                  onClick={() => handleClick(correo)}
                >
                  <div className="correo-remitente">{correo.from}</div>
                  <div className="correo-asunto">{correo.subject}</div>
                  <div className="correo-fecha">
                    {new Date(correo.receivedAt).toLocaleString()}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default Bandeja;
