import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { usePublic } from "../context/PublicContext";
function Pay() {
  const location = useLocation();
  const { createOrder, user, sendMail, getRegistro } = useAuth();
  const { stores } = usePublic();
  const pedido = location.state;
  const [pago, setPago] = useState({
    Tipo_Pago: "",
    Cedula: "",
  });
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);
  const [cargando, setCargando] = useState(false);
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
        <h5 className=" m-1 sm:inline text-success align-middle text-center">
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
  
  const show = useState(true);
  const handleModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    navigate(-1, { replace: true });
  };
  const handlePagar = async (e) => {
    setCargando(true)
    e.preventDefault();
    let pay = {
      Tipo_Pago: pago.Tipo_Pago,
      Cedula: pago.Cedula,
      Valor_Total: pedido.total,
    };
    let id = pedido.cotizacion._id;
    let store = stores.find(
      (item) => item._id === pedido.Emprendimiento_id
    );
    await createOrder(id, pay);
    let registro;
        registro = getRegistro(id);
        let numReg
        if(registro){
          numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`
        } else {
          numReg = ""
        }
    let mail = {
      Email: store.Email,
      Nombre: user.displayName,
      Subject: `${user.displayName} ha pagado la cotización enviada.`,
      Html: `<div style="text-align:center;">
      <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
      <h1>Hola <span style="color:#1F7F3C;">${store.Nombre}</span></h1>
      <div style="; background-color:#EFF8F1; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #2A894640;">
      <h2><span style="color:#1F7F3C;">${user.displayName}</span> ha pagado la cotización enviada</h2>
      ${numReg}
      </div>
      <div>El usuario ha pagado la cotización y tienes un nuevo pedido creado en tu emprendimiento.<br /> Ve a los pedidos de tu emprendimiento y podrás responder esta solicitud al cliente.</div>
      <div style="margin:10px;margin-top:25px;background-color: #2A8946; padding: 10px; border-radius:10px; display: inline-block;">
      <a href="https://colombia-emprende.vercel.app/admin/mi-emprendimiento/cotizaciones" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a las Cotizaciones de Mi Emprendimiento</a>
      </div>
      <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a las cotizaciones de tu emprendimiento.</div>
      <h3>Gracias por pertenecer a Colombia Emprende</h3></div>`,
      Msj: "Se ha realizado el pago de la cotización"
    }
    setCargando(false)
    setAlert(true);
    sAlert();
    try {
      await sendMail(mail);
    } catch (error) {
      console.log(error)
    }
    let userMail = {
      Email: user.email,
      Nombre: store.Nombre,
      Subject: `${store.Nombre} ha recibido el pago de la cotización enviada.`,
      Html: `<div style="text-align:center;">
      <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
      <h1>Hola <span style="color:#1F7F3C;">${user.displayName}</span></h1>
      <div style="; background-color:#EFF8F1; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #2A894640;">
      <h2><span style="color:#1F7F3C;">${store.Nombre}</span> ha recibido el pago de la cotización enviada</h2>
      ${numReg}
      </div>
      <div>El emprendimiento ha recibido el pago de la cotización, ya tienes un nuevo pedido creado en tu emprendimiento.<br /> Ve a los pedidos de tu emprendimiento y conoce los detalles del pedido y espera el envio.</div>
      <div style="margin:10px;margin-top:25px;background-color: #2A8946; padding: 10px; border-radius:10px; display: inline-block;">
      <a href="https://colombia-emprende.vercel.app/admin/mis-cotizaciones" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a Mis Cotizaciones</a>
      </div>
      <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a tus cotizaciones.</div>
      <h3>Gracias por pertenecer a Colombia Emprende</h3></div>`,
      Msj: "Se ha realizado el pago de la cotización"
    }
    try {
      await sendMail(userMail);
    } catch (error) {
      console.log(error)
    }
    
    
  };
  const TipoPago = () => {
    if (!pago.Tipo_Pago) {
      return <div>Por favor selecciona un tipo de Pago</div>;
    }
    if (pago.Tipo_Pago === "tarjeta") {
      return (
        <div className="ms-5 me-5">
          <div className="text-center d-flex flex-column justify-content-center">
            Numero Cedula: <input name="Cedula" className="input-pay m-2" />
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