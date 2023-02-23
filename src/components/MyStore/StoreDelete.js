import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Alert from '../../utilities/alert.utilities';
function StoreDelete() {
    const {deletePhoto,readStorePays} = useAuth();
    const {deleteStore, userStore } = useMyStore();
    const [error, setError] = useState("");
    const [emprendimientoImg, setEmprendimientoImg] = useState(null);
    useEffect(() => {
        if (userStore){
            if (userStore.Imagen) {
                setEmprendimientoImg(userStore.Imagen);
            }
        }
    }, [userStore]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("¿Realmente desea eliminar su emprendimiento?")){
        try {
            readStorePays(userStore._id).then((res) => {
                console.log(res)
                if (res.data.length > 0){
                  console.log("tiene Pendientes")
                } else{
                  console.log("no tiene pendientes")
                }
              })
            await deleteStore(userStore);
            if (emprendimientoImg){
            let url = `/emprendimiento/perfil/`;
            let fotos = emprendimientoImg.split(",");

            
            for (let i = 0; i < fotos.length; i++) {
                try {
                    deletePhoto(url+i);
                } catch (error) {
                    
                }
            }
            }
        } catch (error) {
            setError(error.message);
        }
    
        }
    };
    if (error){
        setTimeout(() => {
            setError("");
        }, 5000);
    }
        return (
        <div>
            {error && <Alert message={error} />}
            <div className="text-center texto-delete-store">
                <h1>Eliminar Emprendimiento</h1>
                <p>Estas a punto de eliminar tu emprendimiento, eliminaras todos los datos asociados a tu emprendimiento.
                </p>
                <button className="btn btn-danger" onClick={handleSubmit}>Eliminar Emprendimiento</button>
            </div>
        </div>
    );
}
export default StoreDelete;