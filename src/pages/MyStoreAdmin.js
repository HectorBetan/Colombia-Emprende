import { useAuth } from "../context/AuthContext";
import { useMyStore } from "../context/MyStoreContext";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MyStoreNav from "../components/MyStore/MyStoreNav";
import MyStoreView from "../components/MyStore/MyStoreView";
import MyStoreProducts from "../components/MyStore/MyStoreProducts";
import StorePricing from "../components/MyStore/StorePricing";
import StoreOrders from "../components/MyStore/StoreOrders";
function MyStoreAdmin() {
  const { loading, userData } = useAuth();
  const navigate = useNavigate();
  const { userStore, loadingStore, getMyStore, getStoreProducts} = useMyStore();
  const [startStore, setStartStore] = useState(true)
  const [startNavig, setStartNavig] = useState(false)
  
  
  useEffect(() => {
    const getStore = async()=> {
      await getMyStore(userData._id)
      await getStoreProducts();
    }
    const nav = () => {
      navigate("/admin", {replace:true})
    };
    if (userData && !loading && startNavig){
      
      if (!userData.Emprendimiento_id && !loading){
        if (!userStore && !loading && !loadingStore && !userData.Emprendimiento_id) {
          return () => {
            nav();
          };
        }
      }
    }
    if (userData && startStore){
      if (userData.Emprendimiento_id){
        if (!userStore){
          getStore();
          setStartStore(false);
        } else{
          setStartNavig(true);
        }
      }
    }
  }, [navigate, userStore, userData, loadingStore, getMyStore, loading, startNavig, startStore,getStoreProducts]);
  if (loading || loadingStore)
    {
      return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );}
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