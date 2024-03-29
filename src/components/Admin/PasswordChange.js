import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Eye from "../../utilities/password.utilities";
import { handleResetPassword } from "../../services/user.service";
import Alert from "../../utilities/alert.utilities";
function PasswordChange() {
  const {
    user,
    emailAuth,
    resetPassword,
    reAuthenticate,
    passwordUpdate,
    reAuthenticateGoogle,
    alertPasswordTrue,
    alertUserTrue,
    alertUserFalse,
  } = useAuth();
  const [error, setError] = useState("");
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [passTitle1, setPassTitle1] = useState("");
  const [passTitle2, setPassTitle2] = useState("");
  const [cargando, setCargando] = useState(false);
  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...usuario, [name]: value });
  const [usuario, setUser] = useState({
    newPassword: "",
    password: "",
    newPasswordConfirm: "",
  });
  const [provider, setProvider] = useState("");
  useEffect(() => {
    if (user.providerData.length > 1) {
      for (let providers in user.providerData) {
        if (user.providerData[providers].providerId === "password") {
          setProvider("password");
          setName1("password");
          setName2("newPassword");
          setPassTitle1("Contraseña Actual");
          setPassTitle2("Nueva Contraseña");
        }
      }
    } else {
      setProvider(user.providerData[0].providerId);
      setName1("newPassword");
      setName2("newPasswordConfirm");
      setPassTitle1("Nueva Contraseña");
      setPassTitle2("Confirmar Contraseña");
    }
  }, [user.providerData, provider]);
  const [show, setShow] = useState(false);
  const handleClose = () => {
      setShow(false);
      document.getElementById("passwordChange1").value = "";
      document.getElementById("passwordChange2").value = "";
    };
  const handleShow = () => setShow(true);
  const ModalAccept = () =>{
    return (
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title><i className="fa-solid fa-triangle-exclamation me-2 text-warning"></i>Actualizar Tu Contraseña</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className="m-3 text-center fs-5">¿Realmente deseas cambiar tu contraseña?</div>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>Aceptar</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    alertUserTrue()
    if (usuario.newPassword.length < 8) {
      return setError("Ingresa una contraseña valida");
    }

      if (provider === "password") {
        let credential;
        setCargando(true);
        setError("");
        try {
          const cred = await emailAuth(user.email, usuario.password);
          credential = cred;
        } catch (error) {
          setCargando(false);
          setError(error.message);
        }
        try {
          await reAuthenticate(credential);
        } catch (error) {
          setError(error.message);
        }
      }
      if (provider === "google.com") {
        if (usuario.newPassword !== usuario.newPasswordConfirm) {
          setError("Las contraseñas no coinciden");
          return;
        }
        try {
          await reAuthenticateGoogle();
        } catch (error) {
          setError(error.message);
        }
      }
      try {
        await passwordUpdate(usuario.newPassword).then(() => {
          setProvider("password");
        });
        setCargando(false);
        setUser({
          ...usuario,
          newPassword: "",
          password: "",
          newPasswordConfirm: "",
        });
      } catch (error) {
        setError(error.message);
        setCargando(false);
      }
      window.scrollTo(0, 0);
      alertPasswordTrue()
      alertUserFalse()
  };
  const ResetPasswordView = () => {
    if (provider === "password") {
      return (
        <div className="text-center">
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              handleResetPassword(user.email, resetPassword);
            }}
          >
            Olvidaste tu contraseña?
          </a>
        </div>
      );
    }
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  if (cargando) {
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="m-2">
      {error && <Alert message={error} />}
      <ModalAccept></ModalAccept>
      <form onSubmit={(e) => {
              e.preventDefault(); handleShow()}}>
        <div className="d-block d-sm-flex d-md-flex flex-row d-lg-flex justify-content-center">
          <div className="form-group mb-3 me-2 ms-2 pe-1 ps-1">
            <label className="m-1">{passTitle1}</label>
            <div className="input-group">
              <input
                className="form-control"
                name={name1}
                type="password"
                id="passwordChange1"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Ingresa un contraseña válida. Esta contiene al menos 1 número, una letra mayuscula y una minuscula, y mas de 8 caracteres"
                onChange={handleChange}
                required
              />
              <Eye passId="passwordChange1" eyeId="passwordEye1" />
            </div>
          </div>
          <div className="form-group mb-3 me-2 ms-2 pe-1 ps-1">
            <label className="m-1">{passTitle2}</label>
            <div className="input-group">
              <input
                className="form-control"
                name={name2}
                type="password"
                id="passwordChange2"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Ingresa un contraseña válida. Esta contiene al menos 1 número, una letra mayuscula y una minuscula, y mas de 8 caracteres"
                onChange={handleChange}
                required
              />
              <Eye passId="passwordChange2" eyeId="passwordEye2" />
            </div>
          </div>
        </div>
        <ResetPasswordView />
        <div className="mt-4 mb-3 me-5 ms-5 ps-5 pe-1 text-center">
          <Button
            variant="primary"
            type="submit"
            className="me-4 mb-1 mt-1"
          >
            Aceptar
          </Button>
        </div>
      </form>
    </div>
  );
}
export default PasswordChange;