import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import { useState, useEffect } from "react";
import CreateProduct from "./StoreProducts/CreateProduct";
import MyProducts from "./StoreProducts/MyProducts";

function MyStoreProducts() {
    const {  loading } = useAuth();
    const { userStore, loadingStore, userProducts, getStoreProducts, getMyStore, showProducts } = useMyStore();
    const [cargando, setCargando] = useState(true);
    useEffect(() => {
        const setStore = async () => {
            if (!userStore && loadingStore && !loading) {
                await getMyStore();
            }
        }
        setStore();
    }
    , [ userStore, loading, getMyStore, loadingStore ]);
    useEffect(() => {
        const setStoreProducts = async () => {
            if (!userProducts && !loading && userStore) {
                await getStoreProducts();
            }
        }
        setStoreProducts();
    }
    , [ userProducts, loading, getStoreProducts, loadingStore, userStore ]);
    useEffect(() => {
        const setLoading = async () => {
            if (userProducts !== null && userStore !== null && !loading && !loadingStore) {
                setCargando(false);
            }
        }
        setLoading();
    }
    , [ userProducts, userStore, loading, loadingStore, getStoreProducts ]);
    const Products = () => {
        if (userProducts){
            console.log(userProducts)
            if (userProducts.length > 0){
                return (
                    <div className="w-100">
                        <div id="" className={`${showProducts}`}>
                            <div className="accordion-body">
                                <MyProducts products={userProducts}/>
                                <CreateProduct />
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
    if (loading||loadingStore||cargando) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
        <div className="spinner-border text-primary text-start" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div> 
    );
    return (
        <div className="d-block">
            <div className="accordion accordion-flush" id="#acordionShop">
                
                <Products />
                
                    
                
            </div>
        </div>
    );
}
export default MyStoreProducts;