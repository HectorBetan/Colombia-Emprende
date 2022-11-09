import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
function Pay() {
    const location = useLocation();
    const { user, createOrder} = useAuth();
    const pedido = location.state;
    const [pago, setPago] = useState({
        Tipo_Pago: "",
        Cedula: "",
    })
    const handleChange = ({ target: { value, name } }) => 
    {   
        setPago({ ...pago, [name]: value });
    }
    const navigate = useNavigate();
    const show = useState(true);
    const handleModal = (e) => {
        if (e){e.preventDefault();}
        
            navigate(-1, { replace: true });
    };
    const handlePagar = (e) => {
        e.preventDefault();
        let pay = {
            Tipo_Pago: pago.Tipo_Pago,
            Cedula: pago.Cedula,
            Valor_Total: pedido.total,
        }
        let cot = {
            Pago: true,
            Estado: "Pagado",
            Info_Pago: pay,
        }
        let id = pedido.cotizacion._id
        createOrder(id, pay)
    }
    const TipoPago = () => {
        if (!pago.Tipo_Pago){
            return(
                <div>
                    Por favor selecciona un tipo de Pago
                </div>
            )
        }
        if (pago.Tipo_Pago === "tarjeta"){
            return (
                <div>
                    <div>Numero Cedula: <input /></div>
                    <div>Numero Tarjeta: <input /></div>
                    <div>Nombre: <input /></div>
                    <div>csv: <input /></div>
                </div>
            )
        }
        if (pago.Tipo_Pago === "pse"){
            return(
                <div>
                    <div>Numero Cedula: <input /></div>
                    <div>Banco: <input /></div>
                    <div>Email registrado: <input /></div>
                </div>
            )
        }
    }
    if (pedido){
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
                    <Modal.Title className="ms-3">Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center pe-5 ps-5">
                    <h3 className="mt-3 mb-3">Aqui puedes pagar - Pasarela de Pago</h3>
                    <div>Compra en {pedido.tienda}</div>
                    <div>Valor Total: {pedido.total}</div>
                    <div>Metodo de pago: 
                    <select defaultValue={"default"} onChange={handleChange} name="Tipo_Pago" required>
                        <option value="default" disabled>Ninguno</option>
                        <option value="tarjeta">Tarjeta de Crédito</option>
                        <option value="pse">Pago con PSE</option>
                    </select>
                    </div>
                    <hr />
                    <TipoPago />
                </Modal.Body>
                <Modal.Footer className="mt-4">
                    <Button className="me-4" variant="info" onClick={handleModal}>Volver</Button>
                    <Button className="me-4" variant="primary" type="submit" onClick={handlePagar}>Pagar</Button>
                </Modal.Footer> 
            </Modal>
        </div>
    );
    }
}
export default Pay;