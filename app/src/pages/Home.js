import React from "react";
import Navigation from "../components/Navigation";
import HomeView from "../components/HomeView";
import Stores from "../components/Stores";
import Footer from "../components/Footer";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/logos/logo-colombia.png";
import Modal from 'react-bootstrap/Modal';
import Nav from "react-bootstrap/Nav";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Login from "../components/Login";
import Register from "../components/Register";
import { Routes, Route } from "react-router-dom";
import { useState } from 'react';

function Home() {
    const [show, setShow] = useState(false);
    const [key, setKey] = useState('login');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <div>
            <Navbar className="flex-lg-row flex-md-row flex-sm-column flex-column justify-content-between mt-2 me-2 ms-2 p-2" expand="lg">
                <Navbar.Brand href="/" className="ms-3"><img style={{ maxHeight: '75px' }} src={Logo} alt="Logo Colombia Emprende" /></Navbar.Brand>
                <Nav.Link className="m-lg-0 m-md-0 me-sm-5 me-5 text-end d-flex flex-row align-middle align-items-center" 
                role="button"
                onClick={handleShow}>
                <h4 className="align-items-center m-2">Iniciar Sesión</h4>
                <i className="fa-solid fa-circle-user fa-3x"></i>
                </Nav.Link>
                <Modal show={show} onHide={handleClose} backdrop="static">
                    <Modal.Header closeButton />
                        <Tabs
                        justify
                        id="login-tab"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-1 d-flex flex-row justify-content-center"
                        >
                            <Tab eventKey="login" title="Iniciar Sesión" className="ms-4 me-4 mt-2 mb-2">
                                <Login />
                            </Tab>
                            <Tab eventKey="singup" title="Registrarse" className="ms-4 me-4 mt-2 mb-2">
                                <Register />
                            </Tab>
                        </Tabs> 
                        <hr />
                        <p className="text-center">O ingresa con:</p>
                        <div className="d-flex flex-row justify-content-evenly pb-3">
                            <form>
                            <button 
                                className="d-flex flex-row m-3 p-2 justify-content-center" 
                                style={{width:'150px', border:"1.5px solid rgb(0 , 175 ,  255)", borderRadius:"10px"}} 
                                type="submit">
                                <svg className="me-2" 
                                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                width="35" height="35"
                                viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                                </svg>
                                <div className="mt-1 me-2">Google</div>
                            </button>
                            </form>
                        </div>
                </Modal>     
            </Navbar>
            <Navigation />
            <Routes>
                <Route path="/"  element={<HomeView />}/>
                <Route path="/emprendimientos"  element={<Stores />}/>
            </Routes>
            <Footer />
        </div>
    );
}

export default Home;