import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Alert from "../utilities/alert.utilities";

export function ReVerification() {
    const [error, setError] = useState("");
    const { emailVerification, user } = useAuth();
    const navigate = useNavigate();
    const show = useState(true);
    const location = sessionStorage.getItem("location");
    useEffect(() => {
        if (user){
            if (user.emailVerified === true){
                navigate("/admin", { replace: true });
            }
        }
    });
    const handleModal = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("location");
        navigate(location, { replace: true });
        window.location.reload();
    };
    const handleResendVerification = async (e) => {
        e.preventDefault();
        try {
            await emailVerification();
            setError({error: "SiEmail", msg : 'Hemos enviado un email, revisa tu correo.'})
        } catch (error) {
            setError(error.message)
        }
    };
    return (
        <div>
            <Modal
            show={show}
            onHide={handleModal}
            backdrop="static"
            keyboard={false}
            size="lg"
            centered
            >
                <Modal.Header>
                    <Modal.Title className="ms-3">Verificación de Email</Modal.Title>
                    <div className="d-flex flex-wrap justify-content-center">
                        {error && <Alert message={error} />}
                    </div>
                </Modal.Header>
                <Modal.Body className="text-center pe-5 ps-5">
                    <button
                    className="button-primary btn btn-secondary inline-block align-baseline font-bold mt-4"
                    href="#!"
                    onClick={handleResendVerification}
                    > 
                        Enviar código de verificación
                    </button>
                    
                    <h5 className="mt-4 mb-4">
                        Por favor verifica tu email: {" "+user.email+" "} para poder acceder a todas las funciones.
                    </h5>
                    <div className="d-inline mb-4" style={{ fontSize:"12px"}}>
                        Si no ves tu correo de verificación, revisa la carpeta de Spam
                        de tu correo electronico, <br />de lo contrario espera un momento y haz&nbsp;
                        <a
                        className="font-bold text-sm text-blue-500 hover:text-blue-800 text-center"
                        href="#!"
                        onClick={handleResendVerification}
                        > 
                            click aqui
                        </a>
                        &nbsp;para reenviar el correo de verificación.
                    </div>
                </Modal.Body>
                <Modal.Footer className="mt-4">
                    <Button className="me-4" variant="primary" type="submit" onClick={handleModal}>Entendido</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}