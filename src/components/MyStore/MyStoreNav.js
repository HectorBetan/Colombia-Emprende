import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Offcanvas from 'react-bootstrap/Offcanvas';
function MyStoreNav() {
    const navigate = useNavigate();
    const { loading, logout, userData } = useAuth();
    const routePath = useLocation();
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error.message);
        }
    };
    const activar = (ruta) =>{
        if (routePath.pathname === ruta){
            return({
                backgroundColor:"rgb(72, 95, 158)",
                color:"#fff",
            });
        } else {
            return({
                borderRadius:"none",
            })
        }
    }
    const NavUserCel = () => {  
        if (userData){ return(
            <div>{userData &&
                    <div>
                        <li className="nav-item  d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin")}}>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                            <Link className="nav-link" to={"/admin"}>Ir a Mi Perfil</Link>
                            </li>
                    </div>}
            </div>)
        }
    }
    const NavUser = () => {  
        if (userData){ return(
            <div>{userData &&
                    <div>
                        <li className="nav-item  d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin")}}>
                            
                            <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                            <Link className="nav-link  d-none d-md-block  d-lg-block d-xl-block d-xxl-block" to={"/admin"}>Ir a Mi Perfil</Link>
                            </li>
                    </div>}
            </div>)
        }
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const OffNav = () =>{
        return(<>
            <Offcanvas show={show} onHide={handleClose} className="admin-nav-cel bg-dark">
                <Offcanvas.Header>
                <Offcanvas.Title className="text-white">Mi Emprendimiento</Offcanvas.Title>
                <button type="button" className="btn-close btn-close-white text-white text-end" aria-label="Close" onClick={handleClose}></button>
                </Offcanvas.Header>
                <Offcanvas.Body className="bg-dark p-0">
                <nav className="navbar navbar-dark bg-dark flex-column admin-nav pt-2 pb-3">
                <nav className="nav nav-pills navbar-dark bg-dark flex-column w-100">
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento")}} style={activar("/admin/mi-emprendimiento")}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-shop" viewBox="0 0 16 16">
                                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
                            </svg>
                        <Link className="nav-link" aria-current="page" to={"/admin/mi-emprendimiento"}>Mi Emprendimiento</Link>
                    </li>
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento/productos")}} style={activar("/admin/mi-emprendimiento/productos")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-cart4" viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                        </svg>
                        <Link className="nav-link" to={"/admin/mi-emprendimiento/productos"}>Mis Productos</Link>
                    </li>
                    
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento/cotizaciones")}} style={activar("/admin/mi-emprendimiento/cotizaciones")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-coin" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                        <Link className="nav-link" to={"/admin/mi-emprendimiento/cotizaciones"}>Cotizaciones</Link>
                    </li>
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento/pedidos")}} style={activar("/admin/mi-emprendimiento/pedidos")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                        <Link className="nav-link" to={"/admin/mi-emprendimiento/pedidos"}>Pedidos</Link>
                    </li>
                    <NavUserCel />
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        handleLogout()}}>
                        <svg xmlns="http://www.w3.org/2000/svg"  className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                        </svg>
                        <div className="nav-link logout-btn" onClick={handleLogout} tabIndex="-1" aria-disabled="true">Cerrar Sesión</div>
                    </li>
                </nav>
            </nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>)
    }
    
    if (loading) return (
        <div style={{minHeight:"300px"}} className="d-flex flex-row justify-content-center">
            <div className="col-3 bg-dark"></div>
            <div className="col-9">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>    
            </div>
        </div> 
    );
    return (
        <div className="navegacion-admin" >
            <nav className="navbar navbar-dark bg-dark flex-column admin-nav pt-2 pb-3" id="adminNav">
                <nav className="nav nav-pills navbar-dark bg-dark flex-column w-100">
                    <li className="nav-item d-flex flex-row d-md-none d-lg-none d-xl-none d-xxl-none"  role="button"  onClick={handleShow}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM241 377c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l87-87-87-87c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L345 239c9.4 9.4 9.4 24.6 0 33.9L241 377z"/></svg>
                    </li>
                    <OffNav />
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento")}} style={activar("/admin/mi-emprendimiento")}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-shop" viewBox="0 0 16 16">
                                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
                            </svg>
                        <Link className="nav-link  d-none d-md-block  d-lg-block d-xl-block d-xxl-block" aria-current="page" to={"/admin/mi-emprendimiento"}>Mi Emprendimiento</Link>
                    </li>
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento/productos")}} style={activar("/admin/mi-emprendimiento/productos")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-cart4" viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                        </svg>
                        <Link className="nav-link  d-none d-md-block  d-lg-block d-xl-block d-xxl-block" to={"/admin/mi-emprendimiento/productos"}>Mis Productos</Link>
                    </li>
                    
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento/cotizaciones")}} style={activar("/admin/mi-emprendimiento/cotizaciones")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-coin" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                        <Link className="nav-link  d-none d-md-block  d-lg-block d-xl-block d-xxl-block" to={"/admin/mi-emprendimiento/cotizaciones"}>Cotizaciones</Link>
                    </li>
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        navigate("/admin/mi-emprendimiento/pedidos")}} style={activar("/admin/mi-emprendimiento/pedidos")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                        <Link className="nav-link  d-none d-md-block  d-lg-block d-xl-block d-xxl-block" to={"/admin/mi-emprendimiento/pedidos"}>Pedidos</Link>
                    </li>
                    <NavUser />
                    <li className="nav-item d-flex flex-row" role="button" onClick={(e)=>{e.preventDefault();
                        handleLogout()}}>
                        <svg xmlns="http://www.w3.org/2000/svg"  className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
                            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
                        </svg>
                        <div className="nav-link   d-none d-md-block  d-lg-block d-xl-block d-xxl-block logout-btn" onClick={handleLogout} tabIndex="-1" aria-disabled="true">Cerrar Sesión</div>
                    </li>
                </nav>
            </nav>
        </div>
    );
}
export default MyStoreNav;