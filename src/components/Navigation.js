import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { LoginButtonNav } from "../utilities/loginButton.utilities";
import {useLocation, useNavigate} from 'react-router-dom';
import Logo from "../assets/logos/logo-colombia-blanco.png";
import { handleLogout } from "../services/user.service";
import { PhotoView } from '../utilities/photoView.utilities';
import LogoNav from "../assets/logos/logo-colombia.png";
function NavigationBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const Return = () => {
        if (location.pathname !== "/") {
            return (
                <div className="text-white d-lg-none d-xl-none d-xxl-none" onClick={(e)=>{e.preventDefault(); navigate(-1)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
                    </svg>
                </div>
            )
        }
    }
    const [show, setShow] = useState(false);
    const {user, userData, loading, logout} = useAuth();
    const handleClose = () => {
        document.body.style.position = 'static';
        setShow(false);
    }
    
    const handleShow = () => {
        document.body.style.position = 'fixed';
        setShow(true)
    };
    const CelNav = () => {
        let nombre = "";
    if (user){
        nombre = user.displayName.split(" ")
        for (let i = 0; i < nombre.length; i++) {
            if (nombre[i].length === 0) {
                nombre.splice(i, 1)
            }
        }
        nombre = nombre.slice(0,1).join("")
    }
    return (
        
            <div className="accordion accordion-flush pt-2" id="#acordionMenu">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="ac-menu-1">
                            <button className="accordion-button collapsed p-2" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse1" 
                            aria-expanded="false" aria-controls="flush-collapse1">
                                <h6 className="pt-2 pe-3 nav-cel-user">{nombre}</h6>
                                <PhotoView img={user.photoURL} s='44px' />
                            </button>
                        </h2>
                        <div id="flush-collapse1" className="accordion-collapse collapse" 
                        aria-labelledby="ac-menu-1" data-bs-parent="#acordionMenu">
                            <div className="accordion-body">
                            <h6 className='cel-menu-user' role="button" onClick={(e)=>{
                                    e.preventDefault();
                                    navigate("/admin");
                                    handleClose();
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#092036" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                                    <div to="/admin" className=' ms-2 align-middle nav-cel-links'>
                                        Mi Perfil
                                    </div> 
                                </h6>
                                {user  && userData && userData.Emprendimiento_id &&
                                    <h6 className='cel-menu-user' role="button" onClick={(e)=>{
                                        e.preventDefault();
                                        navigate("/admin/mi-emprendimiento");
                                        handleClose();
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#092036" className="bi bi-shop" viewBox="0 0 16 16">
                                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
                            </svg>
                                        <div to="/admin/mi-emprendimiento" className=' ms-2 align-middle nav-cel-links'>
                                            Mi Emprendimiento
                                        </div>
                                    </h6>}
                                    <h6 className='cel-menu-user' role="button" onClick={(e)=>{
                                    e.preventDefault();
                                    navigate("/admin/mi-carrito");
                                    handleClose();
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#092036" className="bi bi-cart4" viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                        </svg>
                                    <div to="/admin/micarrito" className=' ms-2 align-middle nav-cel-links'>
                                        Mi Carrito
                                    </div> 
                                </h6>
                                <h6 className='cel-menu-user' role="button" onClick={(e)=>{
                                    e.preventDefault();
                                    navigate("/admin/mis-cotizaciones");
                                    handleClose();
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#092036" className="bi bi-coin" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                    </svg>
                                    <div to="/admin/micarrito" className=' ms-2 align-middle nav-cel-links'>
                                        Mis Cotizaciones
                                    </div> 
                                </h6>
                                <h6 className='cel-menu-user' role="button" onClick={(e)=>{
                                    e.preventDefault();
                                    navigate("/admin/mis-pedidos");
                                    handleClose();
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#092036" className="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                                    <div className=' ms-2 align-middle nav-cel-links'>
                                        Mis Pedidos
                                    </div> 
                                </h6>
                                <hr />
                                <h6 role="button" className='cel-menu-user'type="button" onClick={(e) => {e.preventDefault(); handleClose(); handleLogout(logout)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#092036" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                        </svg><span className='ms-2 align-middle  nav-cel-links'>Cerrar Sesión</span></h6>
                            </div>
                        </div>
                    </div>
                </div>
            
        
    );
    }
    const SetButton = () => {
        if (loading) return (
            <div style={{width:"239.61px", minHeight:"80px"}} className="text-end me-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> 
        );
        if (user) {
            return (
                <div className="d-block d-md-none d-lg-none d-xl-none d-xxl-none">
                    <CelNav />
                </div>
            )
        }
        else {
            return (
                <div className="d-block d-md-none d-lg-none d-xl-none d-xxl-none">
                    <LoginButtonNav />
                </div>
            )
        }
    }
    return (
        <div>
            <nav className='navbar navbar-dark bg-dark justify-content-evenly'>
                <div className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
                    <ul className="navbar-nav me-auto d-flex flex-row">
                        <li className="nav-item ms-4">
                            <Link to={"/"} className="nav-link me-4 ms-4 navi-big">Inicio</Link>
                        </li>
                        <div className="separador"></div>
                        <li className="nav-item">
                            <Link to={"/Emprendimientos"} className="nav-link ms-4 me-4 navi-big">Emprendimientos</Link>
                        </li>
                        {user && 
                            <div className="separador"></div>
                             
                        }
                        {user && 
                             <li className="nav-item">
                                <Link to={"/Emprendimientos"} className="nav-link ms-4 me-4 navi-big">Mi Perfil</Link>
                            </li>
                        }
                        {user && userData && userData.Emprendimiento_id && 
                            <div className="separador"></div>
                             }
                        {user && userData && userData.Emprendimiento_id && 
                             <li className="nav-item">
                                <Link to={"/Emprendimientos"} className="nav-link ms-4 me-4 navi-big">Mi Emprendimiento</Link>
                            </li>
                        }
                    </ul>
                </div>
                <div className="container d-md-none d-lg-none d-xl-none d-xxl-none">
                    <Return />
                    <span className="navbar-brand mb-0 d-md-none d-lg-none d-xl-none d-xxl-none"><img src={Logo} alt="Logo" 
                    style={{maxWidth:'220px'}} /></span>
                    <button className="navbar-toggler" type="button" onClick={handleShow}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Offcanvas style={{position:"fixed"}} placement='end' show={show} onHide={handleClose}
                    className="navegacion d-md-none d-lg-none d-xl-none d-xxl-none pr-0">
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title><img src={LogoNav} alt="" width="130"/></Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            
                                <li className="nav-item pt-2 pb-2">
                                    <div role="button" className="nav-link me-3 ms-2 nav-cel" onClick={(e)=>{e.preventDefault();navigate("/");handleClose()}}>Inicio</div>
                                </li>
                                <li className="nav-item pt-2 pb-2">
                                    <div role="button" className="nav-link ms-2 me-4 nav-cel" onClick={(e)=>{e.preventDefault();navigate("/emprendimientos");handleClose()}}>Emprendimientos</div>
                                </li>
                                <SetButton />
                        </ul>
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>
            </nav>
        </div>   
    );
}
export default NavigationBar;