import {useState} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Nav from "react-bootstrap/Nav";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Login from "../components/Login";
import Register from "../components/Register";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth } from "../context/AuthContext";
import { handleLogout, handleGoogleSignin } from "../services/user.service";
import { UserLogo, PhotoView } from './photoView.utilities';

export const LoginButton = () => {
    const [show, setShow] = useState(false);
    const [key, setKey] = useState('login');
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {loginWithGoogle} = useAuth();
    
    const ModalLogin = () => {
        return(
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton />
                    <Tabs
                    justify
                    id="login-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-1 d-flex flex-row justify-content-center">
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
                        <form onSubmit={(e) => {e.preventDefault(); handleGoogleSignin(loginWithGoogle)}}>
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
        )
    }
    return (
        <div className='me-3'>
            <Nav.Link className="justify-content-end m-lg-0 m-md-0 me-sm-5 me-5 text-end d-flex flex-row align-middle align-items-center" 
            role="button"
            onClick={handleShow}>
                <div className='d-flex flex-column'>
                    <h4 className="align-items-center m-2">Iniciar Sesión</h4>
                </div>
            
            <UserLogo w="35" h="35" />
            </Nav.Link>
            <Nav.Link className="justify-content-end m-lg-0 m-md-0 me-sm-5 me-5 text-end d-flex flex-row align-middle align-items-center" 
            role="button"
            onClick={(e)=>{
                e.preventDefault();
                setKey("singup");
                handleShow();
            }}>
                <div className='d-flex flex-column'>
                    <h4 className="align-items-center m-2">Registrarse</h4>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="35" heigth="35" viewBox="0 0 576 512" fill='currentColor'>
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm96-96c0 35.3-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64zm128-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
            </svg>
            </Nav.Link>
            <ModalLogin data={{ventana:"login"}} />
        </div>
    );
}
export const LoginButtonNav = () => {
    const [show, setShow] = useState(false);
    const [key, setKey] = useState('login');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {loginWithGoogleRedirect} = useAuth();
    const ModalLogin = () => {
        return(
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton />
                    <Tabs
                    justify
                    id="login-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-1 d-flex flex-row justify-content-center">
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
                        <form onSubmit={(e) => {e.preventDefault(); handleGoogleSignin(loginWithGoogleRedirect)}}>
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
        )
    }
    return (
        <div>
            <Nav.Link className="pt-3 pb-2  d-flex flex-row" 
            role="button"
            onClick={handleShow}>
            <h6 className="align-items-center me-2 ms-2 nav-cel">Iniciar Sesión</h6>
            <UserLogo w="30" h="30" />
            </Nav.Link>
            <Nav.Link className="pt-3 mt-1 pb-2 d-flex flex-row " 
            role="button"
            onClick={(e)=>{e.preventDefault();setKey("singup");handleShow();}}>
            <h6 className="align-items-center me-2 ms-2 nav-cel">Registrarse</h6>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" heigth="30" viewBox="0 0 576 512" fill='currentColor'>
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm96-96c0 35.3-28.7 64-64 64s-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64zm128-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
            </svg>
            </Nav.Link>
            <ModalLogin />
        </div>
    );
}
export const ModalAd = () => {
    const [show, setShow] = useState(false);
    const [key, setKey] = useState('singup');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const {loginWithGoogleRedirect} = useAuth();
    const ModalLogin = () => {
        return(
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton />
                    <Tabs
                    justify
                    id="login-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-1 d-flex flex-row justify-content-center">
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
                        <form onSubmit={(e) => {e.preventDefault(); handleGoogleSignin(loginWithGoogleRedirect)}}>
                        <button 
                            className="d-flex flex-row m-3 p-2 justify-content-center" 
                            style={{width:'150px', border:"1.5px solid rgb(0 , 175 ,  255)", borderRadius:"10px"}} 
                            type="submit">
                            
                            <div className="mt-1 me-2">Google</div>
                        </button>
                        </form>
                    </div>
            </Modal>
        )
    }
    return (
        <div className=' text-center'>
            <div class="tarjeta-registro-footer text-center">
            <a href='*' className="publi-registro text-center" 
            onClick={(e)=>{e.preventDefault();setKey("singup");handleShow();}}>
            Registrate Aqui
            </a>
            <ModalLogin />
            </div>
        </div>
    );
}
export const UserButton = () => {
    const { user, userData, logout } = useAuth();
    let nombre = "";
    if (user && user.displayName){
        nombre = user.displayName.split(" ")
        for (let i = 0; i < nombre.length; i++) {
            if (nombre[i].length === 0) {
                nombre.splice(i, 1)
            }
        }
        nombre = nombre.slice(0,1).join()
    }
    return (
        <div>
            <Dropdown  expand="lg">
                <Dropdown.Toggle variant="info" id="dropdown-basic"
                className="text-end d-flex flex-row align-middle align-items-center log-button">
                <h4 className="align-items-center nombre-button">{nombre}</h4>
                <PhotoView img={user.photoURL} s='54px' />
                </Dropdown.Toggle>
                <Dropdown.Menu variant="dark" >
                <Dropdown.Item as="button" className="drop-menu-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" fill="white" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    <Link to="/admin" className='navi-link ms-2 align-middle '>
                    Mi Perfil
                    </Link>    
                </Dropdown.Item>
                {user && userData && userData.Emprendimiento_id && 
                    <Dropdown.Item as="button" className="drop-menu-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-shop" viewBox="0 0 16 16">
                                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
                            </svg>
                        <Link to="/admin/mi-emprendimiento"  className='navi-link ms-2 align-middle '>
                        Mi Emprendimiento
                        </Link>
                    </Dropdown.Item>}
                <Dropdown.Item as="button" className="drop-menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-cart4" viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                        </svg>
                    <Link to="/admin/mi-carrito"  className='navi-link  ms-2 align-middle '>
                    Mi Carrito
                    </Link>    
                </Dropdown.Item>
                <Dropdown.Item as="button" className="drop-menu-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-coin" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                    </svg>
                    <Link to="/admin/mi-carrito"  className='navi-link  ms-2 align-middle '>
                    Mis Cotizaciones
                    </Link>    
                </Dropdown.Item>
                <Dropdown.Item as="button" className="drop-menu-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                    <Link to="/admin/mi-carrito"  className='navi-link  ms-2 align-middle '>
                    Mis Pedidos
                    </Link>    
                </Dropdown.Item>
                
                <Dropdown.Divider />
                
                <Dropdown.Item as="button" onClick={(e) => {e.preventDefault(); handleLogout(logout)}} className="drop-menu-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                        </svg><span className='navi-link  ms-2 align-middle '>Cerrar Sesión</span></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
