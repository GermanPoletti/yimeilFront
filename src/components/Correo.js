import React from "react";
import "./Correo.css"; // Añadido archivo CSS para los estilos

const Correo = ({ correo }) => {
    if (!correo) {
        return <div>Seleccione un correo para ver los detalles.</div>;
    }

    return (
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
            {correo.attachments && correo.attachments.url ? (
                <div className="correo-campo">
                    <strong>Archivos adjuntos:</strong>
                    <ul>
                        <li>
                            <a href={correo.attachments.url} target="_blank" rel="noopener noreferrer">
                                {correo.attachments.filename}
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
                <strong>Fecha:</strong> <span>{new Date(correo.receivedAt).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default Correo;
/*import React from "react";

const Correo = ({ correo }) => {
  if (!correo) {
    return <div>Seleccione un correo para ver los detalles.</div>;
  }
  

  return (
    <div className="correo-detalle">
        <h3>De: {correo.from}</h3>
      <h3>Asunto: {correo.subject}</h3>
      <p>{correo.body}</p><br/>
      <p>URL de archivo adjunto: {correo.attachments.url}</p>
      
    </div>
  );
};

export default Correo;*/
