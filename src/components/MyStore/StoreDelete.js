import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Alert from "../../utilities/alert.utilities";
import { useNavigate } from "react-router-dom";
function StoreDelete() {
  const navigate = useNavigate();
  const { deletePhoto, readStorePays, loading } = useAuth();
  const { deleteStore, userStore, loadingStore, alert1DeleteStoreTrue } = useMyStore();
  const [error, setError] = useState("");
  const [emprendimientoImg, setEmprendimientoImg] = useState(null);
  useEffect(() => {
    if (userStore) {
      if (userStore.Imagen) {
        setEmprendimientoImg(userStore.Imagen);
      }
    }
  }, [userStore]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert1DeleteStoreTrue();
    window.scroll(0, 0);
    await readStorePays(userStore._id).then((res) => {
      if (res.data.length > 0) {
        let envio = 0;
        let problema = 0;
        let pagado = 0;
        let e = "";
        let pro = "";
        let pa = "";
        if (res.data.length > 0) {
          res.data.forEach((problem) => {
            if (problem.Estado === "envio") {
              envio++;
            }
            if (problem.Estado === "pagado") {
              pagado++;
            }
            if (problem.Estado === "problema") {
              problema++;
            }
          });
          if (envio) {
            e = `${envio} pedidos en envio. `;
          }
          if (pagado) {
            pa = `${pagado} pedidos pagados. `;
          }
          if (problema) {
            pro = `${problema} pedidos en problema. `;
          }
        }
        window.alert(
          `No puede eliminar su emprendimiento. Tiene los siguientes pedidos por finalizar: ${e}${pa}${pro} Si existe algun error contacte a soporte de la página.`
        );
      } else {
        if (window.confirm("¿Realmente desea eliminar su emprendimiento?")) {
          try {
            deleteStore(userStore);
            if (emprendimientoImg) {
              let url = `/emprendimiento/perfil/`;
              let fotos = emprendimientoImg.split(",");
              for (let i = 0; i < fotos.length; i++) {
                try {
                  deletePhoto(url + i);
                } catch (error) {}
              }
            }
          } catch (error) {
            setError(error.message);
          }
          navigate("/admin")
        }
      }
    });
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  if (loading || loadingStore )
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return (
    <div>
      {error && <Alert message={error} />}
      <div className="text-center texto-delete-store">
        <h1>Eliminar Emprendimiento</h1>
        <p>
          Estas a punto de eliminar tu emprendimiento, eliminaras todos los
          datos asociados a tu emprendimiento.
        </p>
        <button className="btn btn-danger" onClick={handleSubmit}>
          Eliminar Emprendimiento
        </button>
      </div>
    </div>
  );
}
export default StoreDelete;