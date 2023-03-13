import { useAuth } from "../context/AuthContext";
import { useMyStore } from "../context/MyStoreContext";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AdminNav from "../components/Admin/AdminNav";
import AdminView from "../components/Admin/AdminView";
import StoreRegister from "../components/Admin/StoreRegister";
import MyStore from "../components/MyStore/MyStoreProducts";
import MyCart from "../components/Admin/MyCart";
import MyPricings from "../components/Admin/MyPricings";
import MyOrders from "../components/Admin/MyOrders";
import "../styles/Admin.style.css";
import {
  ProtectedRegisterStore,
  ProtectedStore,
} from "../protectedRoutes/protectedStore";
function Admin() {
  const { loading, userData, alertUser } = useAuth();
  const [show, setShow] = useState(false);
  const [startDel, setStartDel] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const {alertDeleteStore, alertDeleteStoreFalse} = useMyStore();

  useEffect(() => {
    const handleModal = () => {
      
      handleShow();
    }
    if (alertDeleteStore && startDel) {
      setStartDel(false)
      return () => {
        alertDeleteStoreFalse();
        handleModal();
      };
    }
    if (userData){
      if(!userData.Emprendimiento_id){
        setStartDel(true)
      }
    }
  }, [alertDeleteStore, alertDeleteStoreFalse, startDel, userData]);
  const ModalDeleteStore = () => {
    return(
      <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fa-solid fa-circle-check me-2 text-success"></i>Emprendimiento Eliminado</Modal.Title>
        </Modal.Header>
        <Modal.Body>Se ha Eliminado tu emprendimiento y los datos asociados a este.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )
  }
  const ModalLoading = () => {
    return(
      <>
        <Modal show={true} className="opa-0">
        <div className="d-flex justify-content-center text-white">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
        </Modal>
      </>
    )
  }
  if (loading || alertDeleteStore)
    return (
      <div className="d-flex justify-content-center mt-5  mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
  );
  return (
    <div className="d-flex flex-row">
      {alertUser && <ModalLoading></ModalLoading>}
      <AdminNav />
      <div className="d-flex flex-row justify-content-center w-100">
        <div className="w-100">
          <ModalDeleteStore />
          <Routes>
            <Route path="/" element={<AdminView />} />
            <Route
              path="/registrar-emprendimiento/*"
              element={
                <ProtectedRegisterStore>
                  <StoreRegister />
                </ProtectedRegisterStore>
              }
            />
            <Route
              path="/mi-emprendimiento/*"
              element={
                <ProtectedStore>
                  <MyStore />
                </ProtectedStore>
              }
            />
            <Route path="/mi-carrito/*" element={<MyCart />} />
            <Route path="/mis-cotizaciones/*" element={<MyPricings />} />
            <Route path="/mis-pedidos/*" element={<MyOrders />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default Admin;