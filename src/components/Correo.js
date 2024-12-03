import React from "react";
import "./Correo.css"; // Añadido archivo CSS para los estilos

const Correo = ({ correo }) => {
    const emailId = correo.emailId;
    console.log(correo.attachments[0].url);
    if (!correo) {
        return <div>Seleccione un correo para ver los detalles.</div>;
    }

    const borrarMsj = async () =>{

        try {
            const rta = await fetch(`https://poo-dev.unsada.edu.ar/yimeil/emails/${emailId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        } catch (error) {
            
        }

    }


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
            {correo.attachments ? (
                <div className="correo-campo">
                    <strong>Archivos adjuntos:</strong>
                    <ul>
                        <li>
                            <a href={correo.attachments[0].url} target="_blank" rel="noopener noreferrer">
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
                <strong>Fecha:</strong> <span>{new Date(correo.receivedAt).toLocaleString()}</span>
            </div>
        </div>
            <div className="contenedorBorrar"><button className="botonBorrar" onClick={borrarMsj}>Borrar</button></div>
            {/* <div>{mensaje}</div> */}
        </div>
    );
};

export default Correo;
