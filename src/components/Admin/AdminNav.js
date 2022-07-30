import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
function AdminNav() {
    const { loading, logout, userData } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error.message);
        }
    };
    const NavEmprendimiento = () => {  
        if (userData){
            if (userData.Emprendimiento_id)
            return (
                <div>
                    <li className="nav-item">
                        <Link className="nav-link m-1" to={"/admin/miemprendimiento"}>Mi emprendimiento</Link>
                        </li>
                </div>
            );
        }
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
        <div className="w-25" >
            <nav className="navbar navbar-dark bg-dark flex-column" id="adminNav" style={{minHeight:"400px"}}>
                <nav className="nav nav-pills navbar-dark bg-dark flex-column ps-5 mb-3 mt-2">
                    <li className="nav-item">
                        <Link className="nav-link m-1" aria-current="page" to={"/admin"}>Mi Perfil</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link m-1 m-1" to={"/admin/micarrito"}>Mi Carrito</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link m-1" to={"/admin/miscotizaciones"}>Mis Cotizaciones</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link m-1" to={"/admin/mispedidos"}>Mis Pedidos</Link>
                    </li>
                    <NavEmprendimiento />
                    <li className="nav-item">
                        <div className="nav-link m-1" onClick={handleLogout} tabIndex="-1" aria-disabled="true">Cerrar Sesión</div>
                    </li>
                </nav>
            </nav>
        </div>
    );
}
export default AdminNav;