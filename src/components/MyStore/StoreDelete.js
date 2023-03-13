import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "../../utilities/alert.utilities";
import { useNavigate } from "react-router-dom";
function StoreDelete() {
  const navigate = useNavigate();
  const { deletePhoto, readStorePays, loading } = useAuth();
  const { deleteStore, userStore, loadingStore, alert1DeleteStoreTrue } = useMyStore();
  const [error, setError] = useState("");
  const [userMsg, setUserMsg] = useState({
    envio: "",
    pagado: "",
    problema: "",
  })
  const [emprendimientoImg, setEmprendimientoImg] = useState(null);
  useEffect(() => {
    if (userStore) {
      if (userStore.Imagen) {
        setEmprendimientoImg(userStore.Imagen);
      }
    }
  }, [userStore]);
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
            <Modal.Title><i className="fa-solid fa-triangle-exclamation me-2 text-danger"></i>Eliminar Tu Emprendimiento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div className="fs-5 text-center m-3">
            ¿Realmente deseas eliminar tu emprendimiento y todos los datos asociados a este?
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
            <Modal.Title><i className="fa-solid fa-circle-exclamation me-2 text-danger"></i>Tienes Pendientes</Modal.Title>
          </Modal.Header>
          <Modal.Body className="justify-content-center">
          <div
            className=" alert alert-danger text-center justify-content-center fw-bolder"
            role="alert"
          >
<i className="fa-solid fa-circle-exclamation me-2 text-danger"></i>
              No puedes eliminar tu emprendimiento.
            
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
  const storePays = async(e) =>{
    e.preventDefault()
    if (userStore) {
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
            setShowProblem(true)
        } else{
          handleShow()
        }

      })
    } 
    
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    alert1DeleteStoreTrue();
    window.scroll(0, 0);
    try {
      deleteStore(userStore);
      if (emprendimientoImg) {
        let url = `/emprendimiento/perfil/`;
        let fotos = emprendimientoImg.split(",");
        for (let i = 0; i < fotos.length; i++) {
          try {
            deletePhoto(url + i);
          } catch (error) {}
        }
      }
    } catch (error) {
      setError(error.message);
    }
    navigate("/admin")
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  if (loading || loadingStore )
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return (
    <div className="m-sm-3 m-1">
      {error && <Alert message={error} />}
      <ModalAccept></ModalAccept>
      <ModalProblem></ModalProblem>
      <div className="text-center texto-delete-store">
        <h1>Eliminar Emprendimiento</h1>
        <p>
          Estas a punto de eliminar tu emprendimiento, eliminaras todos los
          datos asociados a tu emprendimiento.
        </p>
        <button className="btn btn-danger" onClick={storePays}>
          Eliminar Emprendimiento
        </button>
      </div>
    </div>
  );
}
export default StoreDelete;