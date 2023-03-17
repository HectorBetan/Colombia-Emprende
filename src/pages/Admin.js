import { useAuth } from "../context/AuthContext";
import { useMyStore  } from "../context/MyStoreContext";
import { Routes, Route } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import AdminNav from "../components/Admin/AdminNav";
import AdminView from "../components/Admin/AdminView";
import StoreRegister from "../components/Admin/StoreRegister";
import MyStore from "../components/MyStore/MyStoreProducts";
import MyCart from "../components/Admin/MyCart";
import MyPricings from "../components/Admin/MyPricings";
import MyOrders from "../components/Admin/MyOrders";
import "../styles/Admin.style.css";
import {
  ProtectedRegisterStore,
  ProtectedStore,
} from "../protectedRoutes/protectedStore";
function Admin() {
  const { loading, alertUser } = useAuth();
  const {alert1DeleteStore} = useMyStore();
  
  const ModalLoading = () => {
    return(
      <>
        <Modal show={true} className="opa-0">
        <div className="d-flex justify-content-center text-white">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
        </Modal>
      </>
    )
  }
  if (loading || alert1DeleteStore)
    return (
      <div className="d-flex justify-content-center mt-5  mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
  );
  return (
    <div className="d-flex flex-row">
      {alertUser && <ModalLoading></ModalLoading>}
      <AdminNav />
      <div className="d-flex flex-row justify-content-center w-100">
        <div className="w-100">
          
          <Routes>
            <Route path="/" element={<AdminView />} />
            <Route
              path="/registrar-emprendimiento/*"
              element={
                <ProtectedRegisterStore>
                  <StoreRegister />
                </ProtectedRegisterStore>
              }
            />
            <Route
              path="/mi-emprendimiento/*"
              element={
                <ProtectedStore>
                  <MyStore />
                </ProtectedStore>
              }
            />
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