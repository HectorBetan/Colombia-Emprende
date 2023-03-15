import React from "react";
import { useEffect, useState } from "react";
import { cityList } from "../../utilities/citys.utilities";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
function MyCart() {
  const {
    user,
    readStores,
    readCart,
    deleteCart,
    readProducts,
    updateCart,
    createPricing,
    deleteCarts,
    sendMail,
    getRegistro,
  } = useAuth();
  const [start, setStart] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [miCarrito, setMiCarrito] = useState(null);
  const [productos, setProductos] = useState(null);
  const [tiendas, setTiendas] = useState(null);
  const [startDelete, setStartDelete] = useState(false);
  const [w, setW] = useState(window.innerWidth);
  const handleResize = () => {
    setW(window.innerWidth);
  };
  const [alert, setAlert] = useState(false);
  const [alertDel, setAlertDel] = useState(false);
  const sAlert = () => {
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };
  const sAlertDel = () => {
    setTimeout(() => {
      setAlertDel(false);
    }, 4000);
  };
  const formatterPeso = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
  const resolveProducts = async (products) => {
    await readProducts(products).then((res) => {
      setProductos(res.data);
    });
    setCargando(false);
  };
  const resolveTienda = async (tienda) => {
    await readStores(tienda).then((res) => {
      setTiendas(res.data);
    });
  };
  const resolveCarrito = async () => {
    await readCart(user.uid).then((res) => {
      let data = res.data;
      let listaTiendas = [];
      let listaProductos = [];
      for (let i = 0; i < data.length; i++) {
        listaProductos.push(data[i].Producto_id);
        listaTiendas.push(data[i].Emprendimiento_id);
      }
      let result = listaTiendas.filter((item, index) => {
        return listaTiendas.indexOf(item) === index;
      });
      resolveTienda(result);
      const group = groupBy(["Emprendimiento_id"]);
      let lista = [];
      let objeto = group(data);
      for (let key in objeto) {
        lista.push({ Tienda: key, Productos: objeto[key] });
      }
      setMiCarrito(lista);
      resolveProducts(listaProductos);
    });
  };
  if (start) {
    setCargando(true);
    resolveCarrito();
    setStart(false);
  }
  useEffect(() => {
    if (startDelete) {
      setMiCarrito(miCarrito);
      setStartDelete(false);
    }
  }, [miCarrito, startDelete]);
  const handleDelete = async (tkey, pkey, id) => {
    miCarrito[tkey].Productos.splice(pkey, 1);
    setMiCarrito(miCarrito);
    setStartDelete(true);
    try {
      await deleteCart(id);
    } catch (error) {}
  };
  const updateOne = async (id, data) => {
    await updateCart(id, data);
  };
  const deleteAll = async (tienda) => {
    let listaDelete = [];
    tienda.Productos.forEach((producto) => {
      listaDelete.push(producto._id);
    });
    const deleteMany = {
      id: listaDelete,
    };
    await deleteCarts(deleteMany).then(() => {
      resolveCarrito();
      window.scroll(0, 0);
    });
    setAlertDel(true);
    sAlertDel();
  };
  const handleCotizar = async (tienda, tkey, store) => {
    const comentarios = document.getElementById(
      `comentarios${tienda.Tienda}`
    ).value;
    let ciudad = document.getElementById(`ciudad${tienda.Tienda}`).value;
    if (ciudad === "default"){
      ciudad = "";
    }
    const dir = document.getElementById(`direccion${tienda.Tienda}`).value;
    let lista = [];
    let listaDelete = [];
    tienda.Productos.forEach((producto) => {
      let cantidad = document.getElementById(`producto${producto._id}`).value;
      let product = { Producto: producto.Producto_id, Cantidad: 0 };
      if (cantidad) {
        product.Cantidad = cantidad;
      } else {
        product.Cantidad = producto.Cantidad;
      }
      lista.push(product);
      listaDelete.push(producto._id);
    });
    const cotizacion = {
      User_id: user.uid,
      Emprendimiento_id: tienda.Tienda,
      Pedidos: lista,
      Ciudad_Envio: ciudad,
      Direccion_Envio: dir,
      Estado: "creada",
      User_Comentarios: comentarios,
      Pago: false,
    };
    miCarrito.splice(tkey, 1);
    setMiCarrito(miCarrito);
    setStartDelete(true);
    setAlert(true);
    sAlert();
    window.scroll(0, 0);
    await sendCotizacion(cotizacion, listaDelete, store);
  };
  
  const sendCotizacion = async (cotizacion, lista, store) => {
    let registro
    await createPricing(cotizacion)
    .then((res)=>{
      if(res.data){
        registro = getRegistro(res.data._id) 
      }
    })
    .catch((err) => {});
    const deleteMany = {
      id: lista,
    };
    let numReg
    if(registro){
      numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600;">${registro}</span></div>`
    } else {
      numReg = ""
    }
    let mail = {
      Email: store.Email,
      Nombre: user.displayName,
      Subject: `${user.displayName} ha solicitado una cotización a tu emprendimiento ${store.Nombre}.`,
      Html: `<div style="text-align:center;">
      <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
      <h1>Hola <span style="color:#114aa5;">${store.Nombre}</span></h1>
      <h2><span style="color:#114aa5;">${user.displayName}</span> te ha solicitado una cotización</h2>
      ${numReg}<div>Tienes una nueva solicitud de cotización en Colombia Emprende.<br /> 
      Ve a las cotizaciones de tu emprendimiento y podrás responder esta solicitud al cliente.</div>
      <div style="margin:10px;margin-top:25px;background-color: #1D67DF; padding: 10px; border-radius:10px; display: inline-block;">
      <a href="https://colombia-emprende.vercel.app/admin/mi-emprendimiento/cotizaciones" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a las Cotizaciones de Mi Emprendimiento</a>
      </div>
      <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a las cotizaciones de tu emprendimiento.</div>
      <h3>Gracias por pertenecer a Colombia Emprende</h3>
      </div>`,
      Msj: "se ha solicitado una nueva cotización"
    }
    await deleteCarts(deleteMany);
    await sendMail(mail);
  };
  const Alert = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Productos enviados a cotización
        </h5>
      </div>
    );
  };
  const AlertDelete = () => {
    return (
      <div
        className=" alert alert-danger d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-danger"></i>
        <h5 className=" m-1 sm:inline text-danger align-middle ">
          Pedido Eliminado
        </h5>
      </div>
    );
  };
  const CarritoItems = () => {
    const showEdit = (id) => {
      document.getElementById(`edit-cant${id}`).classList.remove("d-none");
      document.getElementById(`edit${id}`).classList.add("d-none");
    };
    const noShowEdit = (id) => {
      document.getElementById(`edit-cant${id}`).classList.add("d-none");
      document.getElementById(`edit${id}`).classList.remove("d-none");
    };
    if (miCarrito) {
      if (miCarrito.length > 0 && tiendas) {
        return (
          <div className="accordion">
            {alert && <Alert />}
            {alertDel && <AlertDelete />}
            <h1 className="text-center admin-titles-cel">Mi Carrito</h1>
            {miCarrito.map((tienda, tkey) => {
              let valorTotal = 0;
              tienda.Productos.forEach((producto) => {
                let item = productos.find(
                  (product) => product._id === producto.Producto_id
                );
                let valor = item.Precio * producto.Cantidad;
                valorTotal += valor;
              });
              let store = tiendas.find((item) => item._id === tienda.Tienda);
              return (
                <div
                  key={tienda.Tienda}
                  id={tienda.Tienda}
                  className="accordion-item acordeon-carrito-products card p-2 m-0"
                >
                  <div className="">
                    <div className="caja-tienda-carrito flex-row accordion-header ">
                      <div
                        className="accordion-button "
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse1${tkey}`}
                        aria-expanded="true"
                        aria-controls={`#collapse1${tkey}`}
                      >
                        <div className="d-flex">
                          {w > 400 && store.Imagen && (
                            <img
                              src={store.Imagen}
                              alt="0"
                              className="imgcarrito me-2"
                            ></img>
                          )}
                          <h1 className="m-1 store-name-admin">
                            {store.Nombre}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      id={`collapse1${tkey}`}
                      className="accordion-collapse collapse show"
                      aria-labelledby={`heading1${tkey}`}
                      data-bs-parent={`#accordion1${tkey}`}
                    >
                      <div className="accordion-body pt-0">
                        <div className="d-flex justify-content-end mt-2 mb-2">
                          <Link
                            to={`/Emprendimientos/${store.Path}`}
                            className="btn btn-success boton-tienda-carrito"
                          >
                            Ir a la Tienda
                          </Link>
                        </div>
                        <div className="accordion" id={`accordion${tkey}`}>
                          <div className="accordion-item">
                            <h2
                              className="accordion-header productos-header"
                              id={`heading${tkey}`}
                            >
                              <button
                                className="accordion-button boton-carrito-colla"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${tkey}`}
                                aria-expanded="true"
                                aria-controls={`#collapse${tkey}`}
                              >
                                <h2 className="products-title-admin">
                                  Productos
                                </h2>
                              </button>
                            </h2>
                            <div
                              id={`collapse${tkey}`}
                              className="accordion-collapse collapse show"
                              aria-labelledby={`heading${tkey}`}
                              data-bs-parent={`#accordion${tkey}`}
                            >
                              <div className="accordion-body cuerpo-carrito">
                                <div className="d-flex flex-column">
                                  {w > 991 && (
                                    <div className="d-flex flex-row m-2">
                                      <div className="d-flex flex-row caja1-carrito">
                                        <h3 className="caja-40">Producto:</h3>
                                        <h4 className="caja-20">Cantidad:</h4>
                                      </div>
                                      <div className="d-flex flex-row caja2-carrito">
                                        <div className="d-flex flex-row caja-213">
                                          <h4 className="caja-50  text-center">
                                            Precio:
                                          </h4>
                                          <h4 className="caja-50  text-center">
                                            Total:
                                          </h4>
                                        </div>
                                        <div className="caja-13"></div>
                                      </div>
                                    </div>
                                  )}
                                  {tienda.Productos.map((producto, pkey) => {
                                    let item = productos.find(
                                      (product) =>
                                        product._id === producto.Producto_id
                                    );
                                    if (item.Delete) {
                                      item = {
                                        Nombre:
                                          item.Nombre + " (Producto Eliminado)",
                                        Precio: 0,
                                      };
                                    }
                                    let total = item.Precio * producto.Cantidad;
                                    let cant;
                                    if (w < 400) {
                                      cant = "Cant: ";
                                    } else {
                                      cant = "Cantidad: ";
                                    }
                                    return (
                                      <div key={pkey} className="">
                                        <hr className="mb-xl-4 mb-0" />
                                        <div className="d-block d-lg-flex flex-row m-0 m-md-2 caja-datos-carrito">
                                          <div className="d-flex caja1-carrito">
                                            <h5 className="caja-40 m-0 prod-cant">
                                              {w <= 991 && w > 680 && (
                                                <div>Producto: </div>
                                              )}
                                              {w <= 680 && w > 399 && (
                                                <span>Producto: </span>
                                              )}
                                              {item.Nombre}
                                            </h5>
                                            <div className="caja-20">
                                              {w <= 991 && w > 680 && (
                                                <h5>Cantidad: </h5>
                                              )}
                                              {!producto.Delete && (
                                                <div
                                                  className="d-flex edita-caja"
                                                  id={`edit${pkey}`}
                                                >
                                                  <h5 className="prod-car">
                                                    {w <= 680 && (
                                                      <span>{cant}</span>
                                                    )}
                                                    {producto.Cantidad}
                                                  </h5>
                                                  <button
                                                    className="btn btn-info btn-edit-cant"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      showEdit(pkey);
                                                    }}
                                                  >
                                                    Editar
                                                  </button>
                                                </div>
                                              )}
                                              {!producto.Delete && (
                                                <div
                                                  className="d-flex d-none"
                                                  id={`edit-cant${pkey}`}
                                                >
                                                  <input
                                                    type="number"
                                                    min="1"
                                                    max="1000"
                                                    id={`producto${producto._id}`}
                                                    defaultValue={
                                                      producto.Cantidad
                                                    }
                                                  />
                                                  <button
                                                    className="btn btn-secondary btn-edit-product"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      noShowEdit(pkey);
                                                    }}
                                                  >
                                                    <i className="fa-solid fa-xmark"></i>
                                                  </button>
                                                  <button
                                                    className="btn btn-info btn-edit-product"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      updateOne(producto._id, {
                                                        Cantidad:
                                                          document.getElementById(
                                                            pkey
                                                          ).value,
                                                      }).then(() => {
                                                        resolveCarrito();
                                                      });
                                                    }}
                                                  >
                                                    <i className="fa-solid fa-floppy-disk"></i>
                                                  </button>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                          <div className="d-flex caja2-carrito">
                                            <div className="d-flex flex-row caja-213 prod-cel-box">
                                              <h6 className="caja-50 prod-cant-end prod-cel-res">
                                                {w <= 991 && (
                                                  <div>Precio: </div>
                                                )}
                                                {formatterPeso.format(
                                                  item.Precio
                                                )}
                                              </h6>
                                              <h6 className="caja-50 prod-cant-end prod-cel-res">
                                                {w <= 991 && <div>Total: </div>}
                                                {formatterPeso.format(total)}
                                              </h6>
                                            </div>
                                            <div className="caja-13 prod-cant-end">
                                              <button
                                                className="btn btn-danger"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleDelete(
                                                    tkey,
                                                    pkey,
                                                    producto._id
                                                  );
                                                }}
                                              >
                                                Eliminar
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-start mt-3 mb-3">
                          <div className="m-1 me-md-4 ms-md-4 d-flex flex-column">
                            <h2 className="valor-titulo">
                              Valor Total:{" "}
                              <span className="valor-value">
                                {formatterPeso.format(valorTotal)}
                              </span>
                            </h2>
                          </div>
                          <div className="d-flex m-1 me-md-4 ms-md-4 city-select-box">
                            <label>
                              <h2 className="valor-titulo mt-1">
                                Ciudad de envio:{" "}
                              </h2>
                            </label>
                            <select
                              className="form-select city-input"
                              defaultValue={"default"}
                              id={`ciudad${tienda.Tienda}`}
                              required
                            >
                              <option value="default" disabled>
                                Selecciona la ciudad
                              </option>
                              {cityList}
                            </select>
                          </div>
                          <div className="d-flex m-1 me-md-4 ms-md-4 city-select-box">
                            <label>
                              <h2 className="valor-titulo mt-1">
                                Dirección de envio:{" "}
                              </h2>
                            </label>
                            <input
                              className="form-control city-input"
                              id={`direccion${tienda.Tienda}`}
                              required
                            />
                          </div>
                          <div className="m-1 me-md-4 ms-md-4">
                            <h4 className="valor-titulo">Comentarios:</h4>
                            <textarea
                              className="w-100 m-1 form-control mt-2"
                              type="textarea"
                              id={`comentarios${tienda.Tienda}`}
                              placeholder="Comentarios"
                              defaultValue=" "
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-center flex-column flex-sm-row">
                          <button
                            className="btn btn-primary ms-1 me-1 mt-2 mt-sm-0 "
                            onClick={(e) => {
                              e.preventDefault();
                              handleCotizar(tienda, tkey, store);
                            }}
                          >
                            Cotizar Estos Productos
                          </button>
                          <button
                            className="btn btn-danger ms-1 me-1 mt-2 mt-sm-0 "
                            onClick={(e) => {
                              e.preventDefault();
                              deleteAll(tienda);
                            }}
                          >
                            Eliminar Pedido
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      } else {
        return (
          <div className="text-center m-3">
            {alert && <Alert />}
            {alertDel && <AlertDelete />}
            <h3>No tienes ningun producto en <span className="admin-dif-color">tu carrito</span>.</h3>
          </div>
        );
      }
    }
  };
  if (cargando) {
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div>

      <h1 className="text-center admin-titles-cel">Mi Carrito</h1>
      <CarritoItems />
    </div>
  );
}
export default MyCart;