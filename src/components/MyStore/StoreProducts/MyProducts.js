
//import EditProduct from "./EditProduct";
import { useMyStore } from "../../../context/MyStoreContext";
import ProductUpdate from "./ProductUpdate";
import {PhotoProductView, ProductLogo} from '../../../utilities/photoView.utilities';
function MyProducts(userProducts) {
  const { loadingStore, deleteProduct  } = useMyStore();
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
  const ProductPhotoView = (product) => {
    if (product.imgs) {
      let img = product.imgs.split(",");
      img = img[0]
      return (
          <PhotoProductView img={img} s='80px' />
      );
  }
  else {
      return (
          <ProductLogo w="50" h="50" />
      );
  }
  }
  const ExistsProducts = () => {
    if (userProducts.products){
      return(
        <div className="d-flex">
          {userProducts.products.map((product) => {
            return(
              <div key={product._id} className="d-flex flex-column justify-content-start m-2">
                <div className="d-flex flex-row">
                  <ProductPhotoView imgs={product.Imagen} />
                  <div className="d-flex flex-column">
                    <h5>{product.Nombre}</h5>
                    <h6>{product.Precio}</h6>
                    <p>{product.Descripcion}</p>
                  </div>
                </div>
                <div className="d-flex flex-row">
                  <ProductUpdate product={product}/>
                  <button className="btn btn-primary text-white p-1 m-1" onClick={handleDelete} value={product._id}>Eliminar</button>
                </div>
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