import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../utilities/alert.utilities";
function Verification() {
  const location = localStorage.getItem("location");
  const [error, setError] = useState("");
  const { emailVerification, user } = useAuth();
  const navigate = useNavigate();
  const show = useState(true);
  useEffect(() => {
    if (user) {
      if (user.emailVerified === true) {
        navigate("/admin", { replace: true });
      }
    }
  });
  const handleModal = (e) => {
    e.preventDefault();
    localStorage.removeItem("location");
    if (location) {
      navigate(location, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };
  const handleResendVerification = async (e) => {
    e.preventDefault();
    try {
      await emailVerification();
      setError({
        error: "SiEmail",
        msg: "Hemos enviado un email, revisa tu correo.",
      });
    } catch (error) {
      setError(error.message);
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
          <div className="d-flex flex-wrap">
            {error && <Alert message={error} />}
          </div>
        </Modal.Header>
        <Modal.Body className="text-center pe-5 ps-5">
          <h5 className="mt-3 mb-3">Hemos registrado tu cuenta</h5>
          <h3 className="text-center mt-3 mb-3">
            Hemos enviado un correo de verificación a{" " + user.email}
          </h3>
          <h6 className="text-center mt-3 mb-4">
            Haz click en el enlace enviado a tu correo para acceder a todos los
            servicios de la pagina.
          </h6>
          <div className="d-inline mb-4 mt-5 " style={{ fontSize: "12px" }}>
            Si no ves tu correo de verificación, revisa la carpeta de Spam de tu
            correo electronico,
            <br /> de lo contrario espera un momento y haz&nbsp;
            <a className="" href="#!" onClick={handleResendVerification}>
              click aqui
            </a>
            &nbsp;para reenviar el correo de verificación.
          </div>
        </Modal.Body>
        <Modal.Footer className="mt-4">
          <Button
            className="me-4"
            variant="primary"
            type="submit"
            onClick={handleModal}
          >
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Verification;