import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmailList = () => {
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);

    // Función para obtener la lista de correos
    useEffect(() => {
        axios.get('http://localhost:8080/api/emails')
            .then(response => setEmails(response.data))
            .catch(error => console.error('There was an error fetching the emails!', error));
    }, []);

    // Función para obtener detalles de un correo
    const getEmailDetails = (emailId) => {
        axios.get(`http://localhost:8080/api/emails/${emailId}`)
            .then(response => setSelectedEmail(response.data))
            .catch(error => console.error('There was an error fetching the email details!', error));
    };

    return (
        <div>
            <h1>Email List</h1>
            <ul>
                {emails.map(email => (
                    <li key={email.id} onClick={() => getEmailDetails(email.id)}>
                        {email.subject}
                    </li>
                ))}
            </ul>
            {selectedEmail && (
                <div>
                    <h2>{selectedEmail.subject}</h2>
                    <p>{selectedEmail.body}</p>
                </div>
            )}
        </div>
    );
};

export default EmailList;
