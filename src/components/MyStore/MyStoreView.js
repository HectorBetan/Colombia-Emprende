import { useAuth } from "../../context/AuthContext";
import StoreDelete from "./StoreDelete";
import { useNavigate  } from "react-router-dom";
import StoreImgUpdate from "./StoreImgUpdate";
import StoreInfoUpdate from "./StoreInfoUpdate";
import { useMyStore } from "../../context/MyStoreContext";
import CreateProduct from "./StoreProducts/CreateProduct";
import { useState, useEffect } from "react";
function MyStoreView() {
    const { userStore, getMyStore  } = useMyStore();
    const navigate = useNavigate();
    const { user, loading, userData } = useAuth();
    const [start, setStart] = useState(true)
    useEffect(()=>{
        const getStore = () => {
            if (!userStore && start){
                getMyStore();
                setStart(false);
            }
        }
        getStore()
    },[userStore, getMyStore, start])
    if (loading && !userStore) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
        <div className="spinner-border text-primary text-start" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div> 
    );
    return (
        <div className="d-block">
            <div className="accordion accordion-flush" id="#acordionProfile">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="myProfile">
                        <button className="accordion-button" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#flush-collapse0" 
                        aria-expanded="false" aria-controls="flush-collapse0">
                            <h6 className="align-items-center m-2 me-2">Mi Emprendimiento</h6>
                        </button>
                    </h2>
                    <div id="flush-collapse0" className="accordion-collapse collapse show" 
                    aria-labelledby="myProfile" data-bs-parent="#acordionProfile">
                        <div className="accordion-body">
                            <div className="flex-column text-center w-100">
                                <div>Hola {user.displayName}</div>
                                <div>Bienvenido a Colombia Emprende</div>
                            </div>
                        </div>
                    </div>
                    {userStore && <CreateProduct />}
                    
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="updateProfile">
                        <button className="accordion-button collapsed" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#flush-collapse1" 
                        aria-expanded="false" aria-controls="flush-collapse1">
                            <h6 className="align-items-center m-2 me-2">Editar Emprendimiento</h6>
                        </button>
                    </h2>
                    <div id="flush-collapse1" className="accordion-collapse collapse" 
                    aria-labelledby="updateProfile" data-bs-parent="#acordionProfile">
                        <div className="accordion-body">
                            <StoreInfoUpdate />
                        </div>
                    </div>
                </div>
                <div className="d-xl-flex flex-row justify-contet-evenly">
                    <div className="accordion-item w-100">
                        <h2 className="accordion-header" id="changePassword">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse2" 
                            aria-expanded="false" aria-controls="flush-collapse2">
                                <h6 className="align-items-center">Editar Imagenes</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse2" className="accordion-collapse collapse" 
                        aria-labelledby="changePassword" data-bs-parent="#acordionProfile">
                            <div className="accordion-body">
                                <StoreImgUpdate />
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item  w-100 ">
                        <h2 className="accordion-header" id="deleteAccount">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse3" 
                            aria-expanded="false" aria-controls="flush-collapse3">
                                <h6 className="align-items-center">Eliminar Emprendimiento</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse3" className="accordion-collapse collapse" 
                        aria-labelledby="deleteAccount" data-bs-parent="#acordionProfile">
                            <div className="accordion-body">
                                <StoreDelete />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default MyStoreView;