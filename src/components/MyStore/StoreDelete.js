import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
function StoreDelete() {
    const { user, deletePhoto, userEmprendimiento } = useAuth();
        const {deleteStore} = useMyStore();
    const [error, setError] = useState("");
    const [emprendimientoImg, setEmprendimientoImg] = useState(null); 
    useEffect(() => {
        if (userEmprendimiento){
            if (userEmprendimiento.Imagen) {
                setEmprendimientoImg(userEmprendimiento.Imagen);
            }
        }
    }, [userEmprendimiento]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("¿Realmente desea eliminar su emprendimiento?")){
        try {
            await deleteStore();
            if (emprendimientoImg){
            let url = `/emprendimiento/perfil/`;
            let fotos = emprendimientoImg.split(",");
            for (let i = 0; i < fotos.length; i++) {
                try {
                    deletePhoto(user.email, url+i);
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
            
            <div className="text-center">
                <h1>Eliminar Emprendimiento</h1>
                <p>Estas a punto de eliminar tu emprendimiento, eliminaras todos los datos asociados a tu emprendimiento.
                </p>
                <button className="btn btn-danger" onClick={handleSubmit}>Eliminar Emprendimiento</button>
            </div>
        </div>
    );
}
export default StoreDelete;