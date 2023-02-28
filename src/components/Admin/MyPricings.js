import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function MyPricings() {
  const {
    user,
    readStores,
    readProducts,
    updatePricing,
    readPricing,
    deletePricing,
  } = useAuth();
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
  const [startT, setStartT] = useState(false);

  const navigate = useNavigate();
  const [start, setStart] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [group, setGroup] = useState(null);
  const [productosCotizar, setProductosCotizar] = useState(null);
  const [tiendasCotizar, setTiendasCotizar] = useState(null);
  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
  const formatterPeso = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  useEffect(() => {
    const stGroup = () => {
      setGroup(group);
    };
    if (startT) {
      setStartT(false);
      return () => {
        stGroup();
      };
    }
  }, [startT, group]);
  const [alertDel, setAlertDel] = useState(false);

  const sAlertDel = () => {
    window.scroll(0, 0);
    setTimeout(() => {
      setAlertDel(false);
    }, 4000);
  };

  const AlertDelete = () => {
    return (
      <div
        className=" alert alert-danger d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-danger"></i>
        <h5 className=" m-1 sm:inline text-danger align-middle ">
          Cotización Eliminada
        </h5>
      </div>
    );
  };
  const resolveProductsCotizar = async (products) => {
    await readProducts(products).then((res) => {
      setProductosCotizar(res.data);
    });
    setCargando(false);
  };

  const resolveTiendaCotizar = async (tienda) => {
    await readStores(tienda).then((res) => {
      setTiendasCotizar(res.data);
    });
  };
  const resolveCotizacion = async () => {
    await readPricing(user.uid).then((res) => {
      const data = res.data;
      let listaTiendas = [];
      let listaProductos = [];
      data.forEach((element) => {
        listaTiendas.push(element.Emprendimiento_id);
        for (let i = 0; i < element.Pedidos.length; i++) {
          listaProductos.push(element.Pedidos[i].Producto);
        }
      });
      let result = listaTiendas.filter((item, index) => {
        return listaTiendas.indexOf(item) === index;
      });
      resolveTiendaCotizar(result);
      const group = groupBy(["Estado"]);
      let lista = [];
      let objeto = group(data);
      let creadas;
      let rechazadas;
      let enviadas;
      for (let key in objeto) {
        if (key !== "rechazado") {
          if (key === "creada") {
            creadas = { Estado: key, Cotizaciones: objeto[key] };
          }
          if (key === "tienda-rechazado") {
            rechazadas = { Estado: key, Cotizaciones: objeto[key] };
          }
          if (key === "cotizacion") {
            enviadas = { Estado: key, Cotizaciones: objeto[key] };
          }
        }
      }
      if (enviadas) {
        lista.push(enviadas);
      }
      if (rechazadas) {
        lista.push(rechazadas);
      }
      if (creadas) {
        lista.push(creadas);
      }

      setGroup(lista);
      resolveProductsCotizar(listaProductos);
      return;
    });
  };
  const handlePagar = async (cotizacion, total, tienda) => {
    navigate("/pago", { state: { cotizacion, total, tienda } });
  };
  if (start) {
    resolveCotizacion();
    setStart(false);
  }
  const handleDelete = async (id) => {
    await deletePricing(id);
    setAlertDel(true);
    sAlertDel();

    let grupo = group;
    group.map((estado, eindex) => {
      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === id) {
          grupo[eindex].Cotizaciones.splice(index, 1);
          if (grupo[eindex].Cotizaciones.length === 0) {
            grupo.splice(eindex, 1);
          }
          setGroup(grupo);
          return false;
        } else {
          return false;
        }
      });
      return false;
    });
    setStartT(true);
  };
  const handleRechazar = async (id) => {
    const pedido = { Estado: "rechazado" };
    await updatePricing(id, pedido);
    setAlertDel(true);
    sAlertDel();
    let lista1;
    let grupo = group;

    group.map((estado, eindex) => {
      lista1 = estado.Cotizaciones;

      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === id) {
          lista1.splice(index, 1);
          grupo[eindex].Cotizaciones.splice(index, 1);
          if (grupo[eindex].Cotizaciones.length === 0) {
            grupo.splice(eindex, 1);
          }
          setGroup(grupo);
          return false;
        } else {
          return false;
        }
      });
      return false;
    });
    setStartT(true);
  };
  const handleCancelar = async (id) => {
    const pedido = { Estado: "cancelado" };
    await updatePricing(id, pedido);
    setAlertDel(true);
    sAlertDel();
    let lista1;
    let grupo = group;

    group.map((estado, eindex) => {
      lista1 = estado.Cotizaciones;

      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === id) {
          lista1.splice(index, 1);
          grupo[eindex].Cotizaciones.splice(index, 1);
          if (grupo[eindex].Cotizaciones.length === 0) {
            grupo.splice(eindex, 1);
          }
          setGroup(grupo);
          return false;
        } else {
          return false;
        }
      });
      return false;
    });
    setStartT(true);
  };
  const CotizacionItems = () => {
    if (group && tiendasCotizar && productosCotizar) {
      if (group.length === 0) {
        return (
          <div>
            <div>{alertDel && <AlertDelete />}</div>
            <h3>No hay cotizaciones</h3>
          </div>
        );
      }
      return (
        <div>
          {alertDel && <AlertDelete />}
          {group.map((estado, tes) => {
            return (
              <div
                key={tes}
                className="accordion m-1 mb-2 mt-2"
                id={`accordion${tes}`}
              >
                {estado.Cotizaciones.length > 0 && (
                  <div className="accordion-item">
                    <h1
                      className="accordion-header us-header"
                      id={`heading${tes}`}
                    >
                      <button
                        className="accordion-button acc-titulos-admin"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${tes}`}
                        aria-expanded="true"
                        aria-controls={`#collapse${tes}`}
                      >
                        {estado.Estado === "creada" &&
                          estado.Cotizaciones.length > 0 && <>Enviadas</>}
                        {estado.Estado === "cotizacion" &&
                          estado.Cotizaciones.length > 0 && <>Recibidas</>}
                        {estado.Estado === "tienda-rechazado" &&
                          estado.Cotizaciones.length > 0 && (
                            <>Rechazadas por Tienda</>
                          )}
                      </button>
                    </h1>
                    <div
                      className="accordion-collapse collapse show"
                      id={`collapse${tes}`}
                      aria-labelledby={`heading${tes}`}
                      data-bs-parent={`#accordion${tes}`}
                    >
                      <div className="accordion-body">
                        {estado.Cotizaciones.map((cotiza, index) => {
                          let valorProductos = 0;
                          let valorTotal = 0;
                          cotiza.Pedidos.forEach((producto) => {
                            let item = productosCotizar.find(
                              (product) => product._id === producto.Producto
                            );

                            let valor = item.Precio * producto.Cantidad;
                            valorProductos += valor;
                          });
                          if (cotiza.Estado !== "creada") {
                            valorTotal =
                              valorProductos +
                              cotiza.Valor_Envio +
                              cotiza.Otros_Valores;
                          }
                          let store = tiendasCotizar.find(
                            (item) => item._id === cotiza.Emprendimiento_id
                          );
                          return (
                            <div
                              className="accordion mb-3"
                              id={`accordionuser${cotiza._id}`}
                              key={cotiza._id}
                            >
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id={`headinguser${cotiza._id}`}
                                >
                                  <button
                                    className="accordion-button acc-us-admin"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapseuser${cotiza._id}`}
                                    aria-expanded="true"
                                    aria-controls={`#collapseuser${cotiza._id}`}
                                  >
                                    {store.Nombre}{store.Delete && ". (Tienda Eliminada)."}
                                  </button>
                                </h2>
                                <div
                                  className="accordion-collapse collapse show"
                                  id={`collapseuser${cotiza._id}`}
                                  aria-labelledby={`headinguser${cotiza._id}`}
                                  data-bs-parent={`#accordionuser${cotiza._id}`}
                                >
                                  <div className="accordion-body pt-0 pb-0 ">
                                    <div className="d-flex justify-content-end mt-2 mb-2">
                                      {!store.Delete && <Link
                                        to={`/Emprendimientos/${store.Path}`}
                                        className="btn  btn-success  boton-tienda-carrito"
                                      >
                                        Ir a la Tienda
                                      </Link>}
                                      {store.Delete && <div>La tienda ha sido Eliminada</div>}
                                    </div>
                                    <div
                                      className="accordion"
                                      id={`accordionproducts${cotiza._id}`}
                                    >
                                      <div className="accordion-item">
                                        <h3
                                          className="accordion-header productos-header"
                                          id={`headingproducts${cotiza._id}`}
                                        >
                                          <button
                                            className="accordion-button collapsed  acc-title-products-admin"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapseproducts${cotiza._id}`}
                                            aria-expanded="true"
                                            aria-controls={`#collapseproducts${cotiza._id}`}
                                          >
                                            Productos
                                          </button>
                                        </h3>
                                        <div
                                          className="accordion-collapse collapse"
                                          id={`collapseproducts${cotiza._id}`}
                                          aria-labelledby={`headingproducts${cotiza._id}`}
                                          data-bs-parent={`#accordionproducts${cotiza._id}`}
                                        >
                                          <div className="accordion-body">
                                            {w > 991 && (
                                              <div className="d-flex flex-row m-2">
                                                <div className="d-flex flex-row caja1-carrito">
                                                  <h3 className="caja-40">
                                                    Producto:
                                                  </h3>
                                                  <h4 className="caja-20">
                                                    Cantidad:
                                                  </h4>
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
                                            {cotiza.Pedidos.map(
                                              (pedido, tkey) => {
                                                let item =
                                                  productosCotizar.find(
                                                    (item) =>
                                                      item._id ===
                                                      pedido.Producto
                                                  );

                                                /*let  item = productos.find(product => product._id === producto.Producto_id);*/
                                                let total =
                                                  item.Precio * pedido.Cantidad;
                                                let cant;
                                                if (w < 400) {
                                                  cant = "Cant: ";
                                                } else {
                                                  cant = "Cantidad: ";
                                                }
                                                return (
                                                  <div key={tkey} className="">
                                                    <hr className="mb-xl-4 mb-0" />
                                                    <div className="d-block d-lg-flex flex-row m-0 m-md-2 caja-datos-carrito">
                                                      <div className="d-flex caja1-carrito">
                                                        <h5 className="caja-40 m-0 prod-cant">
                                                          {w <= 991 &&
                                                            w > 680 && (
                                                              <div>
                                                                Producto:{" "}
                                                              </div>
                                                            )}
                                                          {w <= 680 &&
                                                            w > 399 && (
                                                              <span>
                                                                Producto:{" "}
                                                              </span>
                                                            )}
                                                          {item.Nombre}
                                                        </h5>
                                                        <div className="caja-20">
                                                          {w <= 991 &&
                                                            w > 680 && (
                                                              <h5>
                                                                Cantidad:{" "}
                                                              </h5>
                                                            )}

                                                          <h5 className="prod-car">
                                                            {w <= 680 && (
                                                              <span>
                                                                {cant}
                                                              </span>
                                                            )}
                                                            {pedido.Cantidad}
                                                          </h5>
                                                        </div>
                                                      </div>

                                                      <div className="d-flex caja2-carrito">
                                                        <div className="d-flex flex-row caja-213 prod-cel-box">
                                                          <h6 className="caja-50 prod-cant-end prod-cel-res">
                                                            {w <= 991 && (
                                                              <div>
                                                                Precio:{" "}
                                                              </div>
                                                            )}
                                                            {formatterPeso.format(
                                                              item.Precio
                                                            )}
                                                          </h6>
                                                          <h6 className="caja-50 prod-cant-end prod-cel-res">
                                                            {w <= 991 && (
                                                              <div>Total: </div>
                                                            )}
                                                            {formatterPeso.format(
                                                              total
                                                            )}
                                                          </h6>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="m-md-3 m-1">
                                      <div className=" mt-2 mb-2 pricing-data">
                                        <h2 className="valor-titulo mt-2 mb-2">
                                          Valor Productos:{" "}
                                          <span className="valor-value">
                                            {formatterPeso.format(
                                              valorProductos
                                            )}
                                          </span>
                                        </h2>
                                        {cotiza.User_Comentarios &&
                                          cotiza.User_Comentarios.length >
                                            1 && (
                                            <div className="fs-5  mt-2 mb-2">
                                              <h2 className="valor-titulo">
                                                Mis Comentarios:{" "}
                                              </h2>
                                              {cotiza.User_Comentarios}
                                            </div>
                                          )}
                                        {cotiza.Ciudad_Envio &&
                                          cotiza.Ciudad_Envio.length > 1 && (
                                            <div className="d-flex flex-row pricing-data">
                                              <h2 className="valor-titulo mt-2">
                                                Ciudad de Envio:{" "}
                                              </h2>
                                              <span className="valor-value">
                                                {cotiza.Ciudad_Envio}
                                              </span>
                                            </div>
                                          )}
                                        {cotiza.Direccion_Envio && (
                                          <div className="fs-5  mt-2 mb-2">
                                            <h2 className="valor-titulo">
                                              Direccion de Envio:{" "}
                                            </h2>
                                            <span className="valor-value">
                                              {cotiza.Direccion_Envio}
                                            </span>
                                          </div>
                                        )}
                                        {estado.Estado === "cotizacion" && (
                                          <div>
                                            <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                              {cotiza.Valor_Envio > 0 && (
                                                <h2 className="valor-titulo me-2">
                                                  Valor Envio:{" "}
                                                  {estado.Estado !==
                                                    "creada" && (
                                                    <span className="valor-value">
                                                      {formatterPeso.format(
                                                        cotiza.Valor_Envio
                                                      )}
                                                    </span>
                                                  )}
                                                </h2>
                                              )}
                                            </div>
                                            {cotiza.Otros_Valores > 0 && (
                                              <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                                <h2 className="valor-titulo me-2">
                                                  Otros Valores:{" "}
                                                  <span className="valor-value">
                                                    {formatterPeso.format(
                                                      cotiza.Otros_Valores
                                                    )}
                                                  </span>
                                                </h2>
                                              </div>
                                            )}
                                            {cotiza.Comentarios && (
                                              <div>
                                                {cotiza.Comentarios.length >
                                                  1 && (
                                                  <div className="mt-2 mb-2 fs-5">
                                                    <h2 className="valor-titulo me-2">
                                                      Comentarios de la tienda:{" "}
                                                    </h2>
                                                    {cotiza.Comentarios}
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            {valorTotal > 0 && (
                                              <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                                <h2 className="valor-titulo me-2">
                                                  Valor Total:{" "}
                                                  <span className="valor-value">
                                                    {formatterPeso.format(
                                                      valorTotal
                                                    )}
                                                  </span>
                                                </h2>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-row justify-content-center botones-pricing mb-3">
                                    {estado.Estado === "creada" && (
                                      <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCancelar(cotiza._id);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                    {estado.Estado === "cotizacion" && !store.Delete && (
                                      <div className="d-flex flex-row justify-content-center botones-pricing">
                                        <div className="btns-pricing">
                                          <button
                                            className="btn btn-primary m-1 ms-3 me-3 ms-sm-1 me-sm-1"
                                            onClick={(e) => {
                                              e.preventDefault(); 
                                              handlePagar(
                                                cotiza,
                                                valorTotal,
                                                store.Nombre
                                              );
                                            }}
                                          >
                                            Pagar
                                          </button>
                                        </div>
                                        <div className="btns-pricing">
                                          <button
                                            className="btn btn-danger m-1 ms-3 me-3"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRechazar(cotiza._id);
                                            }}
                                          >
                                            Rechazar y eliminar
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                    {estado.Estado === "cotizacion" && store.Delete && (
                                      <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCancelar(cotiza._id);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                    {estado.Estado === "tienda-rechazado" && (
                                      <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDelete(cotiza._id);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };
  if (cargando) {
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
      <h1 className="text-center admin-titles-cel">Mis Cotizaciones</h1>
      <CotizacionItems />
    </div>
  );
}

export default MyPricings;
