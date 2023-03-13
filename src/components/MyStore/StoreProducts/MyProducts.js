import { useMyStore } from "../../../context/MyStoreContext";
import ProductUpdate from "./ProductUpdate";
import { useState, useEffect } from "react";
import imgProducts from "../../../assets/img-product.png";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import CreateProduct from "./CreateProduct";
function MyProducts(userProducts) {
  const {
    loadingStore,
    deleteProduct,
    alertCreateProdFalse,
    alertEditProdFalse,
    alertDeleteProdFalse,
    alertCreateProduct,
    alertEditProduct,
    alertEditImgProduct,
    alertEditImgProdFalse,
    alertDeleteProduct,
  } = useMyStore();
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
  useEffect(() => {
    const create = () => {
      setTimeout(() => {
        alertCreateProdFalse();
      }, 5000);
    };
    if (alertCreateProduct) {
      return () => {
        create();
      };
    }
  }, [alertCreateProduct, alertCreateProdFalse]);
  useEffect(() => {
    const edit = () => {
      setTimeout(() => {
        alertEditProdFalse();
      }, 5000);
    };
    if (alertEditProduct) {
      return () => {
        edit();
      };
    }
  }, [alertEditProduct, alertEditProdFalse]);
  useEffect(() => {
    const edit = () => {
      setTimeout(() => {
        alertEditImgProdFalse();
      }, 5000);
    };
    if (alertEditImgProduct) {
      return () => {
        edit();
      };
    }
  }, [alertEditImgProduct, alertEditImgProdFalse]);
  useEffect(() => {
    const del = () => {
      setTimeout(() => {
        alertDeleteProdFalse();
      }, 5000);
    };
    if (alertDeleteProduct) {
      return () => {
        del();
      };
    }
  }, [alertDeleteProduct, alertDeleteProdFalse]);
  const handleDelete = async (e) => {
    e.preventDefault();
    const id = e.target.value;
    try {
      await deleteProduct(id);
      window.scroll(0, 0);
    } catch (error) {
      console.log(error);
    }
  };

  const AlertDelete = () => {
    return (
      <div
        className=" alert alert-danger d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-danger"></i>
        <h5 className=" m-1 sm:inline text-danger align-middle ">
          Producto Eliminado
        </h5>
      </div>
    );
  };
  const AlertCreate = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Producto Creado con exito
        </h5>
      </div>
    );
  };

  const AlertEdit = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Informacion del producto actualizada con exito
        </h5>
      </div>
    );
  };
  const AlertEditImg = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Imagenes del producto actualizadas con exito
        </h5>
      </div>
    );
  };
  const ProductPhotoView = (product) => {
    if (product.imgs) {
      let img = product.imgs.split(",");
      img = img[0];
      return (
        <img
          className="rounded img-producto admin-product-foto"
          src={img}
          alt="1"
        />
      );
    } else {
      return (
        <img
          className="rounded img-producto admin-product-foto"
          src={imgProducts}
          alt="1"
        />
      );
    }
  };
  const formatterPeso = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  const PopOver = (data) => {
    let desc = data.data.desc;
    let i = data.data.i;
    let key = `key-${i}`;
    const [show, setShow] = useState(false);
    let popover;
    popover = (
      <Popover id={i} key={key}>
        <Popover.Header
          as="h3"
          className="d-flex flex-row justify-content-between"
        >
          Descripción
          <button
            type="button"
            className="btn-close text-end"
            aria-label="Close"
            onClick={(e) => {
              e.preventDefault();
              setShow(false);
            }}
          ></button>
        </Popover.Header>
        <Popover.Body>{desc}</Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger
        show={show}
        trigger="click"
        placement="bottom"
        overlay={popover}
      >
        <span
          role="button"
          onClick={(e) => {
            e.preventDefault();
            setShow(!show);
          }}
        >
          {" "}
          Ver más...
        </span>
      </OverlayTrigger>
    );
  };
  const ExistsProducts = () => {
    if (userProducts.products) {
      let desc;
      let verMas;
      let y = 0
    let z = 0
    let noProd = false
    for (y in userProducts.products){
      if (userProducts.products[y].Delete === true){
        z++;
      }
      y++;
    }
    if (z===y){
      noProd = true
    }
    
      return (
        <div className="d-flex flex-column">
          {alertDeleteProduct && <AlertDelete />}
          {alertCreateProduct && <AlertCreate />}
          {alertEditProduct && <AlertEdit />}
          {alertEditImgProduct && <AlertEditImg />}
          {noProd && <div className="text-center m-3">
            {alertDeleteProduct && <AlertDelete />}
            <h3>Tu Emprendimiento aun no tiene Productos registrados.</h3>
            <h6>Haz click en el botón de abajo para añadir un nuevo producto.</h6>
          </div>}
          <CreateProduct />
          {userProducts.products.map((product, i) => {
            if (w <= 400) {
              if (product.Descripcion.length > 80) {
                desc = product.Descripcion.substring(0, 78).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else if (w <= 768) {
              if (product.Descripcion.length > 100) {
                desc = product.Descripcion.substring(0, 98).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else if (w < 880) {
              if (product.Descripcion.length > 70) {
                desc = product.Descripcion.substring(0, 68).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else if (w < 1000) {
              if (product.Descripcion.length > 80) {
                desc = product.Descripcion.substring(0, 78).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else if (w < 1050) {
              if (product.Descripcion.length > 90) {
                desc = product.Descripcion.substring(0, 88).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else if (w < 1100) {
              if (product.Descripcion.length > 110) {
                desc = product.Descripcion.substring(0, 108).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else if (w < 1200) {
              if (product.Descripcion.length > 110) {
                desc = product.Descripcion.substring(0, 108).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            } else {
              if (product.Descripcion.length > 150) {
                desc = product.Descripcion.substring(0, 148).concat("... ");
                verMas = true;
              } else {
                desc = product.Descripcion;
              }
            }
            let precio;
            if (product.Precio) {
              precio = formatterPeso.format(product.Precio);
            }
            if (!product.Delete) {
              return (
                <div
                  key={product._id}
                  className="card d-flex flex-column justify-content-start  p-2 p-sm-3 p-md-3 p-lg-3 p-xl-3 p-xxl-3 m-2"
                >
                  <div className="d-flex flex-row">
                    <div className="d-flex flex-column justify-content-center">
                      <ProductPhotoView imgs={product.Imagen} />
                    </div>
                    <div className="d-flex flex-column justify-content-center product-store  ms-3 me-3">
                      <h2>{product.Nombre}</h2>
                      <h3>{precio}</h3>
                      {w > 768 && (
                        <p className="pb-0 mb-0">
                          {desc}
                          {verMas && (
                            <span className="ver-mas-descripcion">
                              <PopOver
                                data={{ desc: product.Descripcion, i: i }}
                              />
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  {w <= 768 && (
                    <p className="descprod">
                      {desc}
                      {verMas && (
                        <span className="ver-mas-descripcion">
                          <PopOver data={{ desc: product.Descripcion, i: i }} />
                        </span>
                      )}
                    </p>
                  )}
                  <div className="d-flex flex-row justify-content-center m-2 buttons-product-update">
                    <ProductUpdate product={product} />
                    <button
                      className="btn btn-danger text-white p-2 m-1 btn-editar-product"
                      onClick={handleDelete}
                      value={product._id}
                    >
                      Eliminar Producto
                    </button>
                  </div>
                </div>
              );
            } else {
              return true;
            }
          })}
          
        </div>
      );
      
    } 
    
  };
  if (loadingStore) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div></div>
      <ExistsProducts />
    </div>
  );
}
export default MyProducts;