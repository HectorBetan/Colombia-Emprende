import { useAuth } from "../context/AuthContext";
import { Routes, Route } from "react-router-dom";
import MyStoreNav from "../components/MyStore/MyStoreNav";
import MyStoreView from "../components/MyStore/MyStoreView";
import MyStoreProducts from "../components/MyStore/MyStoreProducts";
import StorePricing from "../components/MyStore/StorePricing";
import StoreOrders from "../components/MyStore/StoreOrders";
function MyStoreAdmin() {
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
            <MyStoreNav />
            <div className="d-flex flex-row justify-content-center w-100">
                <div className="w-100">
                    <Routes>
                        <Route path="/" element={<MyStoreView />} />
                        <Route path="/productos/*" element={<MyStoreProducts />} />
                        <Route path="/cotizaciones/*" element={<StorePricing />} />
                        <Route path="/pedidos/*" element={<StoreOrders />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
export default MyStoreAdmin;