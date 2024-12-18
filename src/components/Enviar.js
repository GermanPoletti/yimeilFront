import React, { useEffect, useState } from "react";
import "./Enviar.css";


const Enviar = ({ handleEnviarCorreo, authData, userData }) => {
  const token = `${authData.token}`;
  const [systemId, setSystemId] = '2';
  const from = userData.userName;
  const [to, setTo] = useState([]);
  const [subjet, setSubjet] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileDetails, setFileDetails] = useState({
    fileName: "",
    fileExt: "",
    filePath: "",
    mimeType: "",
    content: "",
    isPublic: false,
  });
  let storedFileURL;
  const [driveFolders, setDriveFolders] = useState([]);
  const [fileExiste, setFileExiste] = useState(false);
  const [esPublico, setEsPublico] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Eliminamos el encabezado
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Lee el archivo como Data URL
    });
  };

  const cambio = (event) => {
    const inputValue = event.target.value;
    const emails = inputValue.split(",").map((email) => email.trim());
    setTo(emails);
  };

  const manejarCambioCheckbox = (e) => {
    setEsPublico(e.target.checked);
  };

  const isValidEmail = (email) => {
    // Expresión regular para validar un correo electrónico
    const regex = /^[^\s@]+@gugle\.com$/;
    return regex.test(email);
  };

  const infoFile = async (event) => {
    const file = event.target.files[0];
    if (file !== null) {
      const base64Content = await convertToBase64(file);
      setFileExiste(true);
      setFileDetails(() => ({
        fileName: file.name,
        fileExt: file.name.split(".").pop(),
        filePath: cleanSubject(subjet),
        mimeType: file.type,
        isPublic: false,
        content: base64Content,
      }));
    }
  };

  const updateAttachments = (attachment) => {
    return new Promise((resolve) => {
      const newAttachments = [attachment]; // Creamos el valor actualizado
      setAttachments(newAttachments);
      resolve(newAttachments); // Retornamos el nuevo valor
    });
  };
  
  
  //limpia el asunto borrando espacios y caracteres especiales
  const cleanSubject = (subject) => {
    return subject.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "");
  };

  const params = new URLSearchParams({
    token: token,
    systemId: systemId,
    userId: authData.userId
  });

  const folderDrive = async () => {
    const folderPath = `/adjuntos`;
    const draivFilesUrl = "https://poo-dev.unsada.edu.ar:8082/draiv/files";


    /* En esta parte se obtiene el listado de todas las carpetas que hayan, a fin de verificar si ya 
    existe una con el nombre del subject */
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
      setDriveFolders(folderResponse);
      //si existe una carpeta con el nombre del asunto en /adjuntos sube el archivo ahí, sino, la crea y luego sube el archivo
      if (folderResponse.some((carpeta) => carpeta.isFolder && carpeta.fileName == subjet)) {
        await uploadDraiv(false);
      } else {
        await uploadDraiv(true);
        await uploadDraiv(false);
      }
    } catch (error) {
      console.error("error conectando al endpoind files: " + error);
    }
  };

  const uploadDraiv = async (esCarpeta) => {
    try {
      const draivUpload = await fetch(
         "https://poo-dev.unsada.edu.ar:8082/draiv/files",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            systemId: systemId,
            userId: authData.userId,
            isFolder: esCarpeta,
            filePath: `${esCarpeta ? "/adjuntos" : `/adjuntos/${cleanSubject(subjet)}`}`,
            fileExt: `${esCarpeta ? "" : fileDetails.fileExt}`,
            fileName: `${esCarpeta ? cleanSubject(subjet) : fileDetails.fileName}`,
            mimeType: `${esCarpeta ? "" : fileDetails.mimeType}`,
            content: `${esCarpeta ? "" : fileDetails.content}`,
            isPublic: esPublico,
          }),
        }
      );
      if (!draivUpload.ok) {
        throw new Error("error");
      }
      const uploadedFileInfo = await draivUpload.json();

      if(!esCarpeta){
        storedFileURL = uploadedFileInfo.fileURL
      }

    } catch (error) {
      console.error("error:" , error)
    }
  };

  const enviarCorreo = async (event) => {
    event.preventDefault();
    
    setError("");
    
    if (!to.length) {
      setError("El campo de destinatarios es obligatorio.");
      return;
    }

    const invalidEmails = to.filter((email) => !isValidEmail(email));
    if (invalidEmails.length) {
      setError(`Los siguientes correos no son válidos: ${invalidEmails.join(", ")} \"(emailExample@gugle.com)\"`);
      return;
    }
    if (!subjet) {
      setError("El asunto es obligatorio.");
      return;
    }
    
    if (!fileExiste && !body) {
      setError(
        "El correo no puede estar vacio, debe haber alguno de los siguientes: Archivo, Mensaje."
      );
      return;
    }
    setIsSubmitting(true);
    let updatedAttachments = [];
    if (fileExiste) {
      await folderDrive();
      updatedAttachments = await updateAttachments({
        filename: fileDetails.fileName,
        url: storedFileURL, 
      });
    }
    

    
    const dataEmail = { token, systemId, from, to, subjet, body, updatedAttachments };
    await handleEnviarCorreo(dataEmail);
    // setTimeout(() => {
    //   setIsSubmitting(false);
    // }, 5000);
  };
  
 
  return (
      <div className="EnviarContenedor">
        <h2>Enviar Mensaje</h2>
        <form className="formEnviar" onSubmit={enviarCorreo}>
          <input
              className="inputEmail"
              type="text"
              placeholder="Destinatarios (separados por comas):"
              value={to.join(", ")}
              onChange={cambio}
          />

          <input
              className="inputSubjet"
              type="text"
              value={subjet}
              placeholder="Asunto:"
              onChange={(e) => setSubjet(e.target.value)}
          />

          <div className="contenedorArchivo">
            <input className="inputAttachments" type="file" onChange={infoFile}/>
            <label className="contenedorCheckbox">
              ¿Es público?
              <input
                  type="checkbox"
                  checked={esPublico}
                  onChange={manejarCambioCheckbox}
              />
            </label>
          </div>
          <textarea
              className="inputBody"
              value={body}
              placeholder="Mensaje"
              onChange={(e) => setBody(e.target.value)}
          />

          <button className="btnEnviar" type="submit" disabled={isSubmitting}>
          Enviar
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
  );
};

export default Enviar;
