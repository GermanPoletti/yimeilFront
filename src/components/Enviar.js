import React, { useState } from "react";
import "./Enviar.css";
import axios from "axios";

const Enviar = ({ handleEnviarCorreo, authData }) => {
  const token = `${authData.token}`;
  const [systemId, setSystemId] = '2';
  const [from, setFrom] = useState("");
  const [to, setTo] = useState([""]);
  const [subjet, setSubjet] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([{ filename: "", url: "" }]);
  const [fileDetails, setFileDetails] = useState({
    fileName: "",
    fileExt: "",
    filePath: "",
    mimeType: "",
    content: "",
    isPublic: false,
  });
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    // Expresión regular para validar un correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const infoFile = (event) => {
    const file = event.target.files[0];
    if (file !== null) {
      setFileDetails(() => ({
        fileName: file.name,
        fileExt: file.name.split(".").pop(),
        filePath: file.webkitRelativePath || file.name,
        mimeType: file.type,
        isPublic: false,
      }));
    }
  };

  //limpia el asunto borrando espacios y caracteres especiales
  const cleanSubject = (subject) => {
    return subject.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "");
  };

  const params = new URLSearchParams({
    token: token,
    systemId: systemId,
  });

  const folderDrive = async () => {
    const folderPath = `adjuntos/${cleanSubject(subjet)}`;
    const folderPathTest = `/`;
    const draivFilesUrl = "https://poo2024.unsada.edu.ar/draiv/files";

    try {
      const folderExiste = await fetch(
        `${draivFilesUrl}?${params.toString()}&path=${folderPath}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!folderExiste.ok) {
        throw new Error("error");
      }

      const folderResponse = await folderExiste.json();
    } catch (error) {
      console.error("error conectando al endpoind files: " + error);
    }
  };

  const uploadDraiv = async () => {
    const draivUpload = await fetch(
      "https://poo2024.unsada.edu.ar/draiv/files",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,         
          systemId: systemId,   
          filePath: "string",         
          fileExt: "string",         
          fileName: "string",         
          mimeType: "string",  
          content: "string",      
          isPublic: true/false  
        }),
      }
    );
  };
//SCBPQWIDBCIwbipqcv




  const enviarCorreo = (event) => {
    setError("");
    event.preventDefault();

    if (!to) {
      setError("El campo de destinatarios es obligatorio.");
      return;
    }
    if (!isValidEmail(to)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    if (!subjet) {
      setError("El asunto es obligatorio.");
      return;
    }

    const dataEmail = { token, systemId, from, to, subjet, body, attachments };
    folderDrive();
    //comentado para probar esta parte sin que se vuelva al menu principal
    handleEnviarCorreo(dataEmail);
  };

  return (
    <div className="capa">
      <h2>Enviar Mensaje</h2>
      <form className="formEnviar" onSubmit={enviarCorreo}>
        <input
            className="inputEmail"
            type="email"
            placeholder="Remitente:"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        <input
          className="inputEmail"
          type="email"
          placeholder="Destinatarios:"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <input
          className="inputSubjet"
          type="text"
          value={subjet}
          placeholder="Asunto:"
          onChange={(e) => setSubjet(e.target.value)}
        />

        <input className="inputAttachments" type="file" onChange={infoFile} />

        <textarea
          className="inputBody"
          value={body}
          placeholder="Mensaje"
          onChange={(e) => setBody(e.target.value)}
        />

        <button className="btnEnviar" type="submit">
          Enviar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Enviar;
/*import React, { useState } from "react";
import "./Enviar.css";
import axios from "axios";

const Enviar = ({ handleEnviarCorreo, authData }) => {
  const token = `${authData.token}`;
  const [systemId, setSystemId] = '2';
  const [from, setFrom] = useState("");
  const [to, setTo] = useState([""]);
  const [subjet, setSubjet] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([{ filename: "", url: "" }]);
  const [fileDetails, setFileDetails] = useState({
    fileName: "",
    fileExt: "",
    filePath: "",
    mimeType: "",
    content: "",
    isPublic: false,
  });
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    // Expresión regular para validar un correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const infoFile = (event) => {
    const file = event.target.files[0];
    if (file !== null) {
      setFileDetails(() => ({
        fileName: file.name,
        fileExt: file.name.split(".").pop(),
        filePath: file.webkitRelativePath || file.name,
        mimeType: file.type,
        isPublic: false,
      }));
    }
  };

  //limpia el asunto borrando espacios y caracteres especiales
  const cleanSubject = (subject) => {
    return subject.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "");
  };

  const params = new URLSearchParams({
    token: token,
    systemId: systemId,
  });

  const folderDrive = async () => {
    const folderPath = `adjuntos/${cleanSubject(subjet)}`;
    const folderPathTest = `/`;
    const draivFilesUrl = "https://poo2024.unsada.edu.ar/draiv/files";

    try {
      const folderExiste = await fetch(
        `${draivFilesUrl}?${params.toString()}&path=${folderPath}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!folderExiste.ok) {
        throw new Error("error");
      }

      const folderResponse = await folderExiste.json();
    } catch (error) {
      console.error("error conectando al endpoind files: " + error);
    }
  };

  const uploadDraiv = async () => {
    const draivUpload = await fetch(
      "https://poo2024.unsada.edu.ar/draiv/files",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,         
          systemId: systemId,   
          filePath: "string",         
          fileExt: "string",         
          fileName: "string",         
          mimeType: "string",  
          content: "string",      
          isPublic: true/false  
        }),
      }
    );
  };

  const enviarCorreo = (event) => {
    setError("");
    event.preventDefault();

    if (!to) {
      setError("El campo de destinatarios es obligatorio.");
      return;
    }
    if (!isValidEmail(to)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    if (!subjet) {
      setError("El asunto es obligatorio.");
      return;
    }

    const dataEmail = { token, systemId, from, to, subjet, body, attachments };
    folderDrive();
    //comentado para probar esta parte sin que se vuelva al menu principal
    handleEnviarCorreo(dataEmail);
  };

  return (
    <div className="capa">
      <h2>Enviar Mensaje</h2>
      <form className="formEnviar" onSubmit={enviarCorreo}>
        <input
          className="inputEmail"
          type="email"
          placeholder="Destinatarios:"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />

        <input
          className="inputSubjet"
          type="text"
          value={subjet}
          placeholder="Asunto:"
          onChange={(e) => setSubjet(e.target.value)}
        />

        <input className="inputAttachments" type="file" onChange={infoFile} />

        <textarea
          className="inputBody"
          value={body}
          placeholder="Mensaje"
          onChange={(e) => setBody(e.target.value)}
        />

        <button className="btnEnviar" type="submit">
          Enviar
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Enviar;*/
