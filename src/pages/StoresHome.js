import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { usePublic } from "../context/PublicContext";
import Stores from "../components/Stores/Stores";
import Store from "../components/Stores/Store";
import "../styles/Stores.style.css";
function StoresHome() {
  const { loading } = useAuth();
  const { stores } = usePublic();
  const [cargando, setCargando] = useState(true);
  let dataList = [];
  const [lista, setLista] = useState(null);
  if (stores && cargando) {
    let data = {};
    for (let i = 0; i < stores.length; i++) {
      data = { key: i, value: stores[i] };
      dataList.push(data);
    }
    setLista(dataList);
    setCargando(false);
  }
  if (cargando || loading) {
    return (
      <div>
        <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
      </div>
    );
  }
  if (stores)
    return (
      <div>
        <Routes>
          <Route path="/*" element={<Stores data={lista} />} />
          <Route path="/:nombre" element={<Store data={lista} />} />
        </Routes>
      </div>
    );
}
export default StoresHome;