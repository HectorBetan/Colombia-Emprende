import { useAuth } from "../../context/AuthContext";
import StoreDelete from "./StoreDelete";
import { useNavigate  } from "react-router-dom";
import StoreImgUpdate from "./StoreImgUpdate";
import StoreInfoUpdate from "./StoreInfoUpdate";
import { useMyStore } from "../../context/MyStoreContext";
import CreateProduct from "./StoreProducts/CreateProduct";
import { useState, useEffect } from "react";
import { usePublic } from "../../context/PublicContext";
function MyStoreView() {
    const { stores } = usePublic();
    const { userStore, getMyStore  } = useMyStore();
    const navigate = useNavigate();
    const { user, loading, userData } = useAuth();
    const [start, setStart] = useState(true);
    const [myShop, setMyShop] = useState(null);
    useEffect(()=>{
        const getStore = () => {
            if (!userStore && start && userData){
                getMyStore(userData._id);
                setStart(false);
            }
        }
        getStore()
    },[userStore, getMyStore, start, userData])
    if (stores && userData && !myShop){
        let s = stores.find(store => store.store.User_id === userData._id)
        console.log(s)
        setMyShop(s)
    }
    if (loading && !userStore) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
        <div className="spinner-border text-primary text-start" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div> 
    );
    if (userStore){
        console.log(userStore)
    }
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
                            <div className="flex-column text-center">
                                <h5>Hola {user.displayName}</h5>
                                {userStore && <h5>Bienvenido al panel admin de {userStore.Nombre}</h5>}
                            </div>
                        </div>
                        {userStore && <CreateProduct />}
                    </div>
                    
                    
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
                <div className="">
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
                            <div className="accordion-body img-update-home">
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
                            <div className="accordion-body ac-delete">
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