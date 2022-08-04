import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import StoreInfoUpdate from "./StoreInfoUpdate";
import StoreImgUpdate from "./StoreImgUpdate";
import StoreDelete from "./StoreDelete";
import CreateProduct from "./StoreProducts/CreateProduct";
import MyProducts from "./StoreProducts/MyProducts";
function MyStore() {
    const { user, loading } = useAuth();
    const {userStore, loadingStore, userProducts } = useMyStore();
    const Products = () => {
        if (userProducts.length > 0){
            return (
                <div className="accordion-item w-100">
                        <h2 className="accordion-header" id="shopProducts">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse1" 
                            aria-expanded="false" aria-controls="flush-collapse1">
                                <h6 className="align-items-center">Productos</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse1" className="accordion-collapse collapse" 
                        aria-labelledby="shopProducts" data-bs-parent="#acordionShop">
                            <div className="accordion-body">
                        <MyProducts products={userProducts}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
    if (loading||loadingStore) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
        <div className="spinner-border text-primary text-start" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div> 
    );
    return (
        <div className="d-block">
            <div className="accordion accordion-flush" id="#acordionShop">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="myShop">
                        <button className="accordion-button" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#flush-collapse0" 
                        aria-expanded="false" aria-controls="flush-collapse0">
                            <h6 className="align-items-center m-2 me-2">Mi Emprendimiento</h6>
                        </button>
                    </h2>
                    <div id="flush-collapse0" className="accordion-collapse collapse show" 
                    aria-labelledby="myShop" data-bs-parent="#acordionShop">
                        <div className="accordion-body d-flex flex-row justify-content-between">
                            <div className="flex-column text-left">
                                <div>Hola {user.displayName}</div>
                                <div>Panel Admin de {userStore.Nombre}</div>
                            </div>
                            <div className="d-flex flex-column text-end">
                                <CreateProduct />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row justify-contet-evenly">
                    <div className="accordion-item w-50">
                        <h2 className="accordion-header" id="shopPricing">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse6" 
                            aria-expanded="false" aria-controls="flush-collapse6">
                                <h6 className="align-items-center">Cotizaciones</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse6" className="accordion-collapse collapse" 
                        aria-labelledby="shopPricing" data-bs-parent="#acordionShop">
                            <div className="accordion-body">
                            Cotizaciones
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item  w-50 ">
                        <h2 className="accordion-header" id="shopOrders">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse7" 
                            aria-expanded="false" aria-controls="flush-collapse7">
                                <h6 className="align-items-center">Pedidos</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse7" className="accordion-collapse collapse" 
                        aria-labelledby="shopOrders" data-bs-parent="#acordionShop">
                            <div className="accordion-body">
                                Pedidos
                            </div>
                        </div>
                    </div>
                </div>
                <Products />
                <div className="accordion-item">
                    <h2 className="accordion-header" id="updateShop">
                        <button className="accordion-button collapsed" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#flush-collapse3" 
                        aria-expanded="false" aria-controls="flush-collapse3">
                            <h6 className="align-items-center m-2 me-2">Editar Mi Emprendimiento</h6>
                        </button>
                    </h2>
                    <div id="flush-collapse3" className="accordion-collapse collapse" 
                    aria-labelledby="updateShop" data-bs-parent="#acordionShop">
                        <div className="accordion-body">
                            <StoreInfoUpdate />
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row justify-contet-evenly">
                    <div className="accordion-item w-50">
                        <h2 className="accordion-header" id="updateShopImg">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse4" 
                            aria-expanded="false" aria-controls="flush-collapse4">
                                <h6 className="align-items-center">Editar Imagenes</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse4" className="accordion-collapse collapse" 
                        aria-labelledby="updateShopImg" data-bs-parent="#acordionShop">
                            <div className="accordion-body">
                                <StoreImgUpdate />
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item w-50">
                        <h2 className="accordion-header" id="deleteShop">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse5" 
                            aria-expanded="false" aria-controls="flush-collapse5">
                                <h6 className="align-items-center">Eliminar Emprendimiento</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse5" className="accordion-collapse collapse" 
                        aria-labelledby="deleteShop" data-bs-parent="#acordionShop">
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
export default MyStore;