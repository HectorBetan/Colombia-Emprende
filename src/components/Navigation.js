import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { LoginButtonNav, UserButtonNav } from "../utilities/loginButton.utilities";
import {useLocation, useNavigate} from 'react-router-dom';
import Logo from "../assets/logos/logo-colombia-blanco.png";
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
    const {user, userData, loading} = useAuth();
    const handleClose = () => {
        document.body.style.position = 'static';
        setShow(false);
    }
    
    const handleShow = () => {
        document.body.style.position = 'fixed';
        setShow(true)
    };
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
                    <UserButtonNav />
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
                        <Offcanvas.Title>Navbar</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            
                                <li className="nav-item pt-2 pb-2">
                                    <Link to={"/"} className="nav-link me-4 ms-2 nav-cel">Inicio</Link>
                                </li>
                                <li className="nav-item pt-2 pb-2">
                                    <Link to={"/Emprendimientos"} className="nav-link ms-2 me-4 nav-cel">Emprendimientos</Link>
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