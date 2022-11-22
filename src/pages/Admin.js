import { useAuth } from "../context/AuthContext";
import { Routes, Route } from "react-router-dom";
import AdminNav from "../components/Admin/AdminNav";
import AdminView from "../components/Admin/AdminView";
import StoreRegister from "../components/Admin/StoreRegister";
import MyStore from "../components/MyStore/MyStoreProducts";
import MyCart from "../components/Admin/MyCart";
import MyPricings from "../components/Admin/MyPricings";
import MyOrders from "../components/Admin/MyOrders";
import '../styles/Admin.style.css'
import { ProtectedRegisterStore, ProtectedStore } from "../protectedRoutes/protectedStore";
function Admin() {
    const { loading } = useAuth();
    if (loading) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
        <div className="spinner-border text-primary text-start" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div> 
    );
    return (
        <div className="d-flex flex-row">
            <AdminNav />
            <div className="d-flex flex-row justify-content-center w-100">
                <div className="w-100">
                    <Routes>
                        <Route path="/" element={<AdminView />} />
                        <Route path="/registrar-emprendimiento/*" element={<ProtectedRegisterStore><StoreRegister /></ProtectedRegisterStore>} />
                        <Route path="/mi-emprendimiento/*" element={<ProtectedStore><MyStore /></ProtectedStore>} />
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