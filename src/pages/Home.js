import Navigation from "../components/Navigation";
import HomeView from "../components/HomeView";
import Stores from "./StoresHome";
import Footer from "../components/Footer";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/logos/logo-colombia.png";
import Admin from "./Admin";
import MyStoreAdmin from "./MyStoreAdmin";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyStore } from "../context/MyStoreContext";
import { useEffect, useState } from "react";
import { LoginButton, UserButton } from "../utilities/loginButton.utilities";
import { ProtectedUser } from "../protectedRoutes/protectedUser";
import { UserVerified } from "../protectedRoutes/userVerified";
import "../styles/Home.style.css";
function Home() {
  const routePath = useLocation();
  const {alert1CreateStore, alert1DeleteStore} = useMyStore();
  const { user, loading, userData, alertDeleteUser, alertDeleteUserFalse, alert1DeleteUser, alertCreateUser, alertCreateUserFalse, alert1CreateUser } = useAuth();
  const onTop = () => {
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    onTop();
  }, [routePath]);
  const [startModalCreate, setStartModalCreate] = useState();
  const [showCreate, setShowCreate] = useState(false);
  const handleCloseCreate = () => setShowCreate(false);
  const handleShowCreate = () => setShowCreate(true);
  useEffect(() => {
    const handleModalCreate = () => {
      handleShowCreate();
    }
    if (alertCreateUser && startModalCreate) {
      setStartModalCreate(false)
      alertCreateUserFalse();
      return () => {
        handleModalCreate();
      };
    }
    if (user && userData && !loading && user.emailVerified){
      return setStartModalCreate(true);
    }
  }, [alertCreateUser, alertCreateUserFalse, startModalCreate, userData, loading, user]);
  const ModalCreateUser = () => {
    return(
      <>
        <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fa-solid fa-circle-check me-2 text-success"></i>Cuenta Creada</Modal.Title>
        </Modal.Header>
        <Modal.Body>Se ha creado tu cuenta de usuario.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreate}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )
  }
  const [startModal, setStartModal] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  useEffect(() => {
    const handleModal = () => {
      handleShow();
    }
    if (alertDeleteUser && startModal) {
      setStartModal(false)
      return () => {
        alertDeleteUserFalse();
        handleModal();
      };
    }
    if (!userData){
        setStartModal(true); 
    }
  }, [alertDeleteUser, alertDeleteUserFalse, startModal, userData]);
  const ModalDeleteUser = () => {
    return(
      <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fa-solid fa-circle-check me-2 text-success"></i>Cuenta Eliminada</Modal.Title>
        </Modal.Header>
        <Modal.Body>Se ha Eliminado tu cuenta de usuario y todos los datos asociados a ella.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      </>
    )
  }
  
  const ModalBackDrop= () => {
    return(
      <>
        <Modal show={true} className="opa-0">
        
        </Modal>
      </>
    )
  }
  const ModalLoading = () => {
    return(
      <>
        <Modal show={true} className="opa-0">
        <div className="d-flex justify-content-center mt-5  mb-5 text-white">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
        </Modal>
      </>
    )
  }
  return (
    <div>
      <ModalCreateUser></ModalCreateUser>
      <ModalDeleteUser></ModalDeleteUser>
      {alert1DeleteUser && <ModalBackDrop></ModalBackDrop>}
      {alert1CreateUser && <ModalLoading></ModalLoading>}
      {alert1CreateStore && <ModalBackDrop></ModalBackDrop>}
      {alert1DeleteStore && <ModalBackDrop></ModalBackDrop>}
      <Navbar className="d-none d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between mt-2 me-2 ms-2 p-2">
        <Navbar.Brand href="/" className="ms-3">
          <img
            style={{ maxHeight: "75px" }}
            src={Logo}
            alt="Logo Colombia Emprende"
            className="logo"
          />
        </Navbar.Brand>
        {(loading && (!user || !userData)) && (
          <div
            style={{ width: "239.61px", minHeight: "80px" }}
            className="text-end me-5"
          >
            <div className="spinner-border" role="status" style={{ width: "3rem", height: "3rem", marginTop:"8px" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {user && !loading && userData && (
          <div className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
            <UserButton />
          </div>
        )}
        {!user && !loading && (
          <div className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
            <LoginButton />
          </div>
        )}
      </Navbar>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/emprendimientos/*" element={<Stores />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedUser>
              <UserVerified>
                <Admin />
              </UserVerified>
            </ProtectedUser>
          }
        />
        <Route
          path="/admin/mi-emprendimiento/*"
          element={
            <ProtectedUser>
              <UserVerified>
                <MyStoreAdmin />
              </UserVerified>
            </ProtectedUser>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
export default Home;