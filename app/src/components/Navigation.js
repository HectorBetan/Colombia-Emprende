import { Link } from "react-router-dom";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { LoginButtonNav, UserButtonNav } from "../utilities/headerButton.utilities";
import Logo from "../assets/logos/logo-colombia-blanco.png";
function NavigationBar() {
    const [show, setShow] = useState(false);
    const {user} = useAuth();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const SetButton = () => {
        if (user) {
            return (
                <div className="d-block d-lg-none d-xl-none d-xxl-none">
                    <UserButtonNav />
                </div>
            )
        }
        else {
            return (
                <div className="d-block d-lg-none d-xl-none d-xxl-none">
                    <LoginButtonNav />
                </div>
            )
        }
    }
    return (
        <div>
            <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>
                <div className="d-none d-lg-block d-xl-block d-xxl-block">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item ms-4">
                            <Link to={"/"} className="nav-link me-4 ms-2">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link to={"/Emprendimientos"} className="nav-link ms-2 me-4">Emprendimientos</Link>
                        </li>
                    </ul>
                </div>
                <div className="container-fluid">
                    <span class="navbar-brand mb-0 h1 d-lg-none d-xl-none d-xxl-none"><img src={Logo} alt="Logo" 
                    style={{maxWidth:'300px'}} /></span>
                    <button className="navbar-toggler" type="button" onClick={handleShow}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Offcanvas placement='end' show={show} onHide={handleClose} responsive="lg" className="w-50 d-lg-none d-xl-none d-xxl-none">
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Navbar</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <SetButton />
                                <li className="nav-item">
                                    <Link to={"/"} className="nav-link me-4">Inicio</Link>
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