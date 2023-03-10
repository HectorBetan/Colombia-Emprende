import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Eye from "../../utilities/password.utilities";
import { handleResetPassword } from "../../services/user.service";
import Alert from "../../utilities/alert.utilities";
function UserDelete() {
  const [cargando, setCargando] = useState(false);
  const {
    resetPassword,
    user,
    emailAuth,
    reAuthenticate,
    reAuthenticateGoogle,
    userData,
    deleteUserDoc,
    deletePhoto,
    readStorePays,
    readUserPays,
  } = useAuth();
  const { deleteStore, userStore, getMyStore } = useMyStore();
  const [error, setError] = useState("");
  const [start, setStart] = useState(true);
  const [provider, setProvider] = useState("");
  const [emprendimientoImg, setEmprendimientoImg] = useState(null);
  const [userMsg, setUserMsg] = useState({
    envio: "",
    pagado: "",
    problema: "",
    pendientes: false
  })
  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...usuario, [name]: value });
  const [usuario, setUser] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const getStore = () => {
      if (!userStore && start && userData) {
        if (userData.Emprendimiento_id) {
          getMyStore(userData._id);
          setStart(false);
        }
      }
    };
    getStore();
  }, [userStore, getMyStore, start, userData]);
  useEffect(() => {
    if (userStore) {
      if (userStore.Imagen) {
        setEmprendimientoImg(userStore.Imagen);
      }
    }
  }, [userStore]);
  useEffect(() => {
    if (user.providerData.length > 1) {
      for (let providers in user.providerData) {
        if (user.providerData[providers].providerId === "password") {
          setProvider("password");
        }
      }
    } else {
      setProvider(user.providerData[0].providerId);
    }
  }, [user.providerData, provider]);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [showProblem, setShowProblem] = useState(false);
  const handleCloseProblem = () => {
    setShowProblem(false);
  };

  const ModalAccept = () => {
    return (
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title><i className="fa-solid fa-triangle-exclamation me-2 text-danger"></i>Eliminar Tu Cuenta</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userMsg.pendientes && 
            <div>
              <div className="">
            <div className="text-center">Tu Usuario aun tiene los siguientes pendientes en la sección de pedidos: </div>
            <ul className="m-1">
              {userMsg.envio && <li>{userMsg.envio}</li>}
              {userMsg.pagado && <li>{userMsg.pagado}</li>}
              {userMsg.problema && <li>{userMsg.problema}</li>}
            </ul>
          </div>
              <div className="text-center m-1 fw-light">De igual manera puedes continuar y eliminar tu usuario y todos los datos asociados a este.</div>
            </div>
            }
            <div className="fs-5 text-center m-3">
            ¿Realmente deseas eliminar tu cuenta y todos los datos asociados a ella?
            </div>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleSubmit}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  const ModalProblem = () => {
    return (
      <>
        <Modal
          show={showProblem}
          onHide={handleCloseProblem}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
            <i className="fa-solid fa-circle-exclamation me-2 text-danger"></i>Tienes Pendientes</Modal.Title>
          </Modal.Header>
          <Modal.Body className="justify-content-center">
          <div
            className=" alert alert-danger text-center justify-content-center fw-bolder"
            role="alert"
          >
<i className="fa-solid fa-circle-exclamation me-2 text-danger"></i>
              No puedes eliminar tu cuenta
            
          </div>
          <div className="">
            <div className="text-center">Tu Emprendimiento tiene los siguientes pedidos por finalizar: </div>
            <ul className="m-1">
              {userMsg.envio && <li>{userMsg.envio}</li>}
              {userMsg.pagado && <li>{userMsg.pagado}</li>}
              {userMsg.problema && <li>{userMsg.problema}</li>}
            </ul>
          </div>
          </Modal.Body>
          <div className="text-center m-2 fw-light">
            Si existe algun error contacte a soporte de la página.
          </div>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseProblem}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };
  const storePays = async() =>{
    setCargando(true);
    if (userData.Emprendimiento_id && userStore) {
      
      await readStorePays(userStore._id).then((res) => {
        if (res.data.length > 0) {
          let envio = 0;
          let problema = 0;
          let pagado = 0;
          let e = "";
          let pro = "";
          let pa = "";
            res.data.forEach((problem) => {
              if (problem.Estado === "envio") {
                envio++;
              }
              if (problem.Estado === "pagado") {
                pagado++;
              }
              if (problem.Estado === "problema") {
                problema++;
              }
            });
            if (envio) {
              if (envio === 1){
                e = `${envio} pedido en envio. `;
              } else {
                e = `${envio} pedidos en envio. `;
              }
              
              setUserMsg({...userMsg, envio: e})
            }
            if (pagado) {
              if (pagado === 1){
                pa = `${pagado} pedido pagado. `;
              } else{
                pa = `${pagado} pedidos pagados. `;
              }
              
              setUserMsg({...userMsg, pagado: pa})
            }
            if (problema) {
              if (pagado === 1){
                pro = `${problema} pedido en problema. `;
              } else {
                pro = `${problema} pedidos en problema. `;
              }
              setUserMsg({...userMsg, problema: pro})
            }
            setCargando(false)
            setShowProblem(true)
        }
        else {
          handlePreSubmit()
        }
      })
    } else {
      handlePreSubmit()
    }
    
  }
  const handlePreSubmit = async() =>{
    setCargando(true);
    let e = "";
    let pro = "";
    let pa = "";
    let pends = false;
    readUserPays(userData._id).then((res) => {
      if (res.data.length > 0) {
        let envio = 0;
        let problema = 0;
        let pagado = 0;
        pends = true
        if (res.data.length > 0) {
          res.data.forEach((problem) => {
            if (problem.Estado === "envio") {
              envio++;
            }
            if (problem.Estado === "pagado") {
              pagado++;
            }
            if (problem.Estado === "problema") {
              problema++;
            }
          });
          if (envio) {
            if (envio === 1){
              e = `${envio} pedido en envio. `;
            } else {
              e = `${envio} pedidos en envio. `;
            }
            
            setUserMsg({...userMsg, envio: e})
          }
          if (pagado) {
            if (pagado === 1){
              pa = `${pagado} pedido pagado. `;
            } else{
              pa = `${pagado} pedidos pagados. `;
            }
            
            setUserMsg({...userMsg, pagado: pa})
          }
          if (problema) {
            if (pagado === 1){
              pro = `${problema} pedido en problema. `;
            } else {
              pro = `${problema} pedidos en problema. `;
            }
            setUserMsg({...userMsg, problema: pro})
          }
        }
      }
    });
    setUserMsg({...userMsg, pendientes:pends})
    
    handleShow();
    setCargando(false)
  }
  const handleSubmit = async (e) => {
    setCargando(true);
    if (provider === "password") {
      try {
        let credential = emailAuth(usuario.email, usuario.password);
        await reAuthenticate(credential);
      } catch (error) {
        setError(error.message);
      }
    }
    if (provider === "google.com") {
      try {
        await reAuthenticateGoogle();
      } catch (error) {
        setError(error.message);
      }
    }
    if (userData.Emprendimiento_id) {
      try {
        deleteStore(userData.Emprendimiento_id);
      } catch (error) {
        setError(error.message);
      }
      if (emprendimientoImg) {
        let url = `/emprendimiento/perfil/`;
        let fotos = emprendimientoImg.split(",");
        for (let i = 0; i < fotos.length; i++) {
          try {
            deletePhoto(url + i);
          } catch (error) {}
        }
      }
    }
    await deleteUserDoc(userData._id);
    if (user.photoURL.includes("firebasestorage")) {
      try {
        let userPhoto = `/perfil/profilePhoto`;
        deletePhoto(userPhoto);
      } catch (error) {}
    }
    setCargando(false);
  };
  const ResolveProvider = () => {
    if (provider === "password") {
      return (
        <div className="form-group">
          <p>Para eliminar su cuenta ingrese su email y su contraseña.</p>
          <div className="form-group mb-3 ms-5 pe-3 ps-3">
            <label className="m-1">Ingrese su email actual</label>
            <input
              className="form-control"
              name="email"
              type="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Ingrese un Email valido. ejemplo colombia0emprende@gmail.com"
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3 me-5 pe-3 ps-3">
            <label className="m-1">Ingrese su contraseña</label>
            <div className="input-group">
              <input
                className="form-control"
                name="password"
                type="password"
                id="userDelete"
                onChange={handleChange}
                required
              />
              <Eye passId="userDelete" eyeId="userDeleteEye" />
            </div>
          </div>
          <div className="form-group mb-3  ms-5 pe-3 text-center">
            <a
              className="inline-block align-middle font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#!"
              onClick={(e) => {
                e.preventDefault();
                handleResetPassword(user.email, resetPassword);
              }}
            >
              Olvidaste tu contraseña?
            </a>
          </div>
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
  if (provider === "password") {
    return (
      <div className="m-2">
        <ModalAccept></ModalAccept>
        <ModalProblem></ModalProblem>
        {error && <Alert message={error} />}
        <div className="text-center">
          <h1>Eliminar Cuenta </h1>
          <p>
            Estas a punto de eliminar tu cuenta, eliminaras todos tus datos de
            usuario y demas datos de la plataforma.
          </p>
          <form className="d-flex flex-column justify-content-center">
            <ResolveProvider />
            <div className="mt-4 mb-3 me-5 ms-5 ps-4  text-center">
              <Button
                onClick={(e) => {
                  e.preventDefault(); storePays()}}
                variant="danger"
                type="submit"
                className="me-4 mb-1 mt-1"
              >
                Eliminar Cuenta
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  if (provider === "google.com") {
    return (
      <div  className="m-2">
        <ModalAccept></ModalAccept>
        <ModalProblem></ModalProblem>
        {error && <Alert message={error} />}
        <div className="text-center">
          <h1>Eliminar Cuenta</h1>
          <p>
            Estas a punto de eliminar tu cuenta, eliminaras todos tus datos de
            usuario y demas datos de la plataforma.
          </p>
          <div className="mt-4 mb-3   text-center">
            <Button
              variant="danger"
              size="lg"
              type="submit"
              className="mb-1 mt-1"
              onClick={(e) => {
                e.preventDefault(); storePays()}}
            >
              Eliminar Cuenta
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default UserDelete;
