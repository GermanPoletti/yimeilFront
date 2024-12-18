import React, { useState } from "react";
import "./Correo.css"; // Añadido archivo CSS para los estilos

const Correo = ({ correo, cambiarVista }) => {
  const emailId = correo.emailId;
  const [mensaje, setMensaje] = useState("");
  const [clickedTwice, setClickedTwice] = useState(false);
  const [borrando, setBorrando] = useState(false);
  if (!correo) {
    return <div>Seleccione un correo para ver los detalles.</div>;
  }
  
  const borrarMsj = async () => {
    if (!clickedTwice) {
      setClickedTwice(true);
      return;
    }
    setBorrando(true);
    try {
      const rta = await fetch(
        `https://poo-dev.unsada.edu.ar:8083/yimeil/emails/${emailId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!rta.ok) {
        throw new Error("Error borrando el correo");
      }
      setMensaje("Correo Eliminado Exitosamente");
      setClickedTwice(false);
      setTimeout(() => {
        cambiarVista("bandeja");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="correo-detalle">
        <div className="correo-campo">
          <strong>De:</strong> <span>{correo.from}</span>
        </div>

        <div className="correo-campo">
          <strong>Asunto:</strong> <span>{correo.subject}</span>
        </div>

        <div className="correo-campo">
          <strong>Cuerpo:</strong>
          <p>{correo.body}</p> {/* Cuerpo del mensaje */}
        </div>

        {/* Archivos adjuntos */}
        {correo.attachments && correo.attachments.length > 0 ? (
          <div className="correo-campo">
            <strong>Archivos adjuntos:</strong>
            <ul>
              <li>
                <a
                  href={correo.attachments[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {correo.attachments[0].filename}
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="correo-campo">
            <strong>Archivos adjuntos:</strong> No hay archivos adjuntos.
          </div>
        )}

        <div className="correo-campo">
          <strong>Fecha:</strong>{" "}
          <span>{new Date(correo.receivedAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="contenedorBorrar">
        <button className="botonBorrar" onClick={borrarMsj} disabled={borrando}>
          {clickedTwice ? "Confirmar" : "Borrar"}
        </button>
      </div>

      <div>{mensaje}</div>
    </div>
  );
};

export default Correo;
