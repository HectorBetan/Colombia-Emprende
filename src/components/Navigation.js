import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { LoginButtonNav, UserButtonNav } from "../utilities/headerButton.utilities";
import {useLocation, useNavigate} from 'react-router-dom';
import Logo from "../assets/logos/logo-colombia-blanco.png";
function NavigationBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const Return = () => {
        if (location.pathname !== "/") {
            return (
                <div className="text-white d-lg-none d-xl-none d-xxl-none" onClick={(e)=>{e.preventDefault(); navigate(-1)}}>
                    Atras
                </div>
            )
        }
    }
    const [show, setShow] = useState(false);
    const {user} = useAuth();
    const handleClose = () => {
        document.body.style.position = 'static';
        setShow(false);
    }
    
    const handleShow = () => {
        document.body.style.position = 'fixed';
        setShow(true)
    };
    const SetButton = () => {
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
            <nav className='navbar navbar-dark bg-dark'>
                <div className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
                    <ul className="navbar-nav me-auto d-flex flex-row">
                        <li className="nav-item ms-4">
                            <Link to={"/"} className="nav-link me-4 ms-2">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/Emprendimientos"} className="nav-link ms-2 me-4">Emprendimientos</Link>
                        </li>
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
                    className="w-50 d-md-none d-lg-none d-xl-none d-xxl-none pr-0">
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Navbar</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <SetButton />
                                <li className="nav-item">
                                    <Link to={"/"} className="nav-link me-4 ms-2">Inicio</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/Emprendimientos"} className="nav-link ms-2 me-4">Emprendimientos</Link>
                                </li>
                        </ul>
                        </Offcanvas.Body>
                    </Offcanvas>
                    
                    
                </div>
            </nav>
        </div>   
    );
}
export default NavigationBar;