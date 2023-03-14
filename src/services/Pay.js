import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { usePublic } from "../context/PublicContext";
function Pay() {
  const location = useLocation();
  const { createOrder, user, sendMail } = useAuth();
  const { stores } = usePublic();
  const pedido = location.state;
  const [pago, setPago] = useState({
    Tipo_Pago: "",
    Cedula: "",
  });
  const [alert, setAlert] = useState(false);
  const sAlert = () => {
    window.scroll(0, 0);
    setTimeout(() => {
      navigate(-1, { replace: true });
    }, 5000);
  };
  const Alert = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Se ha realizado el Pago y se ha creado la Orden de Pedido
        </h5>
      </div>
    );
  };
  const handleChange = ({ target: { value, name } }) => {
    setPago({ ...pago, [name]: value });
  };
  const formatterPeso = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  const navigate = useNavigate();
  const show = useState(true);
  const handleModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    navigate(-1, { replace: true });
  };
  const handlePagar = async (e) => {
    e.preventDefault();
    let pay = {
      Tipo_Pago: pago.Tipo_Pago,
      Cedula: pago.Cedula,
      Valor_Total: pedido.total,
    };
    let id = pedido.cotizacion._id;
    console.log(stores)
    let store = stores.find(
      (item) => item._id === pedido.Emprendimiento_id
    );
    await createOrder(id, pay);
    let mail = {
      Email: store.Email,
      Nombre: user.displayName,
      Subject: `${user.displayName} ha pagado la cotización enviada.`,
      Html: `<div style="text-align:center;"><img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0"
      alt="Logo Colombia Emprende" style="width:300px;" /><h1>Hola <span style="color:#114aa5;">${store.Nombre}</span></h1><h1><span style="color:#114aa5;">${user.displayName}</span> ha pagado la cotización enviada.</h1><div>El usuario ha pagado la cotización y tienes un nuevo pedido creado en tu emprendimiento.<br /> Ve a los pedidos de tu emprendimiento y podrás responder esta solicitud al cliente.<div><br /><div style="font-size:12px; font-weigth:300;">Si sigues el siguiente link debes tener la sesión iniciada, de lo contrario inicia sesión y ve a los pedidos de tu emprendimiento.</div><a href="http://localhost:3000/admin/mi-emprendimiento/pedidos">Ir a los Pedidos de mi Emprendimiento</a></div></div><h3>Gracias por pertenecer a Colombia Emprende</h3></div>`,
      Msj: "Se ha realizado el pago de la cotización"
    }
    await sendMail(mail);
    setAlert(true);
    sAlert();
  };
  const TipoPago = () => {
    if (!pago.Tipo_Pago) {
      return <div>Por favor selecciona un tipo de Pago</div>;
    }
    if (pago.Tipo_Pago === "tarjeta") {
      return (
        <div className="ms-5 me-5">
          <div className="text-center d-flex flex-column justify-content-center">
            Numero Cedula: <input className="input-pay m-2" />
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            Numero Tarjeta: <input className="input-pay m-2" />
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            Nombre Completo: <input className="input-pay m-2" />
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            CSV: <input className="input-pay m-2" />
          </div>
        </div>
      );
    }
    if (pago.Tipo_Pago === "pse") {
      return (
        <div>
          <div className="text-center d-flex flex-column justify-content-center">
            Numero Cedula: <input className="input-pay m-2" />
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            Nombre Completo: <input className="input-pay m-2" />
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            Banco: <input className="input-pay m-2" />
          </div>
          <div className="text-center d-flex flex-column justify-content-center">
            Email Registrado en Banco: <input className="input-pay m-2" />
          </div>
        </div>
      );
    }
  };
  if (pedido) {
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
          <Modal.Header closeButton>
            <Modal.Title className="ms-3">
              Pago en Colombia Emprende
            </Modal.Title>
          </Modal.Header>
          {alert && <Alert />}
          {!alert && (
            <Modal.Body className="text-center pe-5 ps-5">
              <div
                className=" alert alert-danger d-flex flex-row flex-wrap justify-content-center"
                role="alert"
              >
                <h6 className=" m-1 sm:inline text-danger align-middle text-center">
                  La aplicación aun no cuenta con un sistema de pagos real. Esta ventana simula el pago y captura los datos. Por favor no introducir datos bancarios reales.
                </h6>
              </div>
              <h3>
                Compra en <span className="pago-info">{pedido.tienda}</span>
              </h3>
              <h4>
                Valor Total:{" "}
                <span className="pago-info">
                  {formatterPeso.format(pedido.total)}
                </span>
              </h4>
              <h5>
                Metodo de pago:
                <span className="pago-select">
                  <select
                    className="m-2 p-1 pago-select-a p-2"
                    defaultValue={"default"}
                    onChange={handleChange}
                    name="Tipo_Pago"
                    required
                  >
                    <option value="default" disabled>
                      Ninguno
                    </option>
                    <option value="tarjeta">Tarjeta de Crédito</option>
                    <option value="pse">Pago con PSE</option>
                  </select>
                </span>
              </h5>
              <hr />
              <TipoPago />
            </Modal.Body>
          )}
          <Modal.Footer className="d-flex flex-row">
            <Button className="m-2" variant="secondary" onClick={handleModal}>
              Volver
            </Button>
            {!alert && (
              <Button
                className="m-2"
                variant="primary"
                type="submit"
                onClick={handlePagar}
              >
                Pagar
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default Pay;