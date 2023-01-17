
//import EditProduct from "./EditProduct";
import { useMyStore } from "../../../context/MyStoreContext";
import ProductUpdate from "./ProductUpdate";
import { useState, useEffect } from "react";
import imgProducts from "../../../assets/img-product.png";
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import {PhotoProductView, ProductLogo} from '../../../utilities/photoView.utilities';
function MyProducts(userProducts) {
  const { loadingStore, deleteProduct  } = useMyStore();
  const [w, setW] = useState(window.innerWidth);
  const handleResize = () => {
    setW(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
          
          <img className="rounded img-producto admin-product-foto" src={img} alt="1"/>
      );
  }
  else {
      return (
        <img className="rounded img-producto admin-product-foto" src={imgProducts} alt="1"/>
          
      );
  }
  }
  const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  })
  const PopOver = (data) =>{
    let desc = data.data.desc
    let i =  data.data.i
    let key = `key-${i}`
    const [show, setShow] = useState(false)
    console.log(desc)
    let popover
              popover = (
                <Popover id={i} key={key}>
                  <Popover.Header as="h3" className="d-flex flex-row justify-content-between">
                  Descripción
                  <button type="button" className="btn-close text-end" aria-label="Close" onClick={(e)=>{
                    e.preventDefault()
                    setShow(false)
                  }}></button></Popover.Header>
                  <Popover.Body>
                    {desc}
                  </Popover.Body>
                </Popover>
              );
            
    return(
      <OverlayTrigger show={show} trigger="click" placement="bottom" overlay={popover}>
                          <span role="button" onClick={(e)=>{
                            e.preventDefault()
                            setShow(!show)
                          }}> Ver más...</span>
                          </OverlayTrigger>
    )
    
  }
  const ExistsProducts = () => {
    if (userProducts.products){
      let desc
      let verMas
      return(
        <div className="d-flex flex-column">
          {userProducts.products.map((product, i) => {
            if (w <= 400){
              if (product.Descripcion.length > 80){
                desc = product.Descripcion.substring(0,78).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            else if (w <= 768){
              if (product.Descripcion.length > 100){
                desc = product.Descripcion.substring(0,98).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            else if (w < 880){
              if (product.Descripcion.length > 70){
                desc = product.Descripcion.substring(0,68).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            else if (w < 1000){
              if (product.Descripcion.length > 80){
                desc = product.Descripcion.substring(0,78).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            else if (w < 1050){
              if (product.Descripcion.length > 90){
                desc = product.Descripcion.substring(0,88).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            else if (w < 1100){
              if (product.Descripcion.length > 110){
                desc = product.Descripcion.substring(0,108).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            else if (w < 1200){
              if (product.Descripcion.length > 110){
                desc = product.Descripcion.substring(0,108).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            
            
            
            
            else{
              if (product.Descripcion.length > 150){
                desc = product.Descripcion.substring(0,148).concat("... ")
                verMas = true
              } else {
                desc = product.Descripcion
              }
            }
            
            let precio
            if (product.Precio){
              precio = formatterPeso.format(product.Precio)
            }
            return(
              <div key={product._id} className="card d-flex flex-column justify-content-start  p-2 p-sm-3 p-md-3 p-lg-3 p-xl-3 p-xxl-3 m-2">
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column justify-content-center">
                  <ProductPhotoView imgs={product.Imagen} />
                  </div>
                  
                  <div className="d-flex flex-column justify-content-center product-store  ms-3 me-3">
                    <h2>{product.Nombre}</h2>
                    <h3>{precio}</h3>
                    {w>768 &&<p className="pb-0 mb-0">{desc}
                    {verMas && <span className="ver-mas-descripcion">
                      <PopOver data={{desc:product.Descripcion, i:i}} />
                      </span>
                    }
                    </p>
                    }
                    
                  </div>
                </div>
                
                {w<=768 &&<p className="descprod">{desc}
                {verMas && <span className="ver-mas-descripcion">
                  <PopOver data={{desc:product.Descripcion, i:i}} />
                  </span>
                }
                </p>}
                
                <div className="d-flex flex-row justify-content-center m-2 buttons-product-update">
                  <ProductUpdate product={product}/>
                  <button className="btn btn-danger text-white p-2 m-1 btn-editar-product" onClick={handleDelete} value={product._id}>Eliminar Producto</button>
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