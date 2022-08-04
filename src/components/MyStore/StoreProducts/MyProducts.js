
//import EditProduct from "./EditProduct";
import { useAuth } from "../../../context/AuthContext";
import { useMyStore } from "../../../context/MyStoreContext";
import ProductUpdate from "./ProductUpdate";
function MyProducts(userProducts) {

  const { deleteProduct  } = useAuth();
    const { loadingStore } = useMyStore();
  const handleDelete = async (e) => {
    e.preventDefault();
    const id = e.target.value
    try{
      await deleteProduct(id);
    }
    catch(error){
      console.log(error);
    }
  }
  const ExistsProducts = () => {
    if (userProducts.products){
      return(
        <div>
          {userProducts.products.map((product) => {
            return(
              <div key={product._id} className="d-flex flex-row">
                <h3>{product.Nombre}</h3>
                    <ProductUpdate product={product}/>
                <button onClick={handleDelete} value={product._id}>Eliminar</button>
              </div>
            )
          })
        }
      </div>
      )
    }
  };
    if (loadingStore){
        return(
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    return (
      <div>
        <div>
       
      </div>
      <ExistsProducts />
      </div>
    );
  }

  export default MyProducts;