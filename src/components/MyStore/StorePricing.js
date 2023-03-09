import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
function StorePricing() {
  const {
    readProducts,
    updatePricing,
    userData,
    readStorePricing,
    readUserInfo,
    deletePricing,
  } = useAuth();
  const [w, setW] = useState(window.innerWidth);
  const [start, setStart] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [group, setGroup] = useState(null);
  const [productosCotizar, setProductosCotizar] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
  const [startT, setStartT] = useState(false);
  const handleResize = () => {
    setW(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const [alert, setAlert] = useState(false);
  const [alertDel, setAlertDel] = useState(false);
  const sAlert = () => {
    window.scroll(0, 0);
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };
  const sAlertDel = () => {
    window.scroll(0, 0);
    setTimeout(() => {
      setAlertDel(false);
    }, 4000);
  };
  const Alert = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Se ha enviado la Cotización Al Cliente
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
          Cotización Eliminada
        </h5>
      </div>
    );
  };
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
  const resolveProductsCotizar = async (products) => {
    await readProducts(products).then((res) => {
      setProductosCotizar(res.data);
    });
    setCargando(false);
  };
  const resolveUsers = async (tienda) => {
    await readUserInfo(tienda).then((res) => {
      setUsuarios(res.data);
    });
  };
  const resolveCotizacion = async () => {
    await readStorePricing(userData.Emprendimiento_id).then((res) => {
      const data = res.data;
      let listaUsuarios = [];
      let listaProductos = [];
      data.forEach((element) => {
        listaUsuarios.push(element.User_id);
        for (let i = 0; i < element.Pedidos.length; i++) {
          listaProductos.push(element.Pedidos[i].Producto);
        }
      });
      let result = listaUsuarios.filter((item, index) => {
        return listaUsuarios.indexOf(item) === index;
      });
      resolveUsers(result);
      const group = groupBy(["Estado"]);
      let lista = [];
      let objeto = group(data);
      let creadas;
      let rechazadas;
      let enviadas;
      let cancel;
      for (let key in objeto) {
        if (key !== "tienda-rechazado") {
          if (key === "creada") {
            creadas = { Estado: key, Cotizaciones: objeto[key] };
          }
          if (key === "rechazado") {
            rechazadas = { Estado: key, Cotizaciones: objeto[key] };
          }
          if (key === "cotizacion") {
            enviadas = { Estado: key, Cotizaciones: objeto[key] };
          }
          if (key === "cancelado") {
            cancel = { Estado: key, Cotizaciones: objeto[key] };
          }
        }
      }
      if (creadas) {
        lista.push(creadas);
      }
      if (rechazadas) {
        lista.push(rechazadas);
      }
      if (enviadas) {
        lista.push(enviadas);
      }
      if (cancel) {
        lista.push(cancel);
      }
      setGroup(lista);
      resolveProductsCotizar(listaProductos);
      return;
    });
  };
  const handleNewCotizacion = async (id, cotiza) => {
    await updatePricing(id, cotiza).then((res) => {});
    setAlert(true);
    sAlert();
    let lista1;
    let grupo = group;
    let num = null;
    let co;
    group.map((estado, eindex) => {
      lista1 = estado.Cotizaciones;
      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === id) {
          lista1.splice(index, 1);
          grupo[eindex].Cotizaciones.splice(index, 1);
          if (grupo[eindex].Cotizaciones.length === 0) {
            grupo.splice(eindex, 1);
          }
          co = cotizacion;
        }
        return false;
      });
      return false;
    });
    grupo.map((estado, ei) => {
      if (estado.Estado === "cotizacion") {
        num = ei;
        return false;
      }
      return false;
    });
    if (num !== null) {
      co.Valor_Envio = cotiza.Valor_Envio;
      co.Otros_Valores = cotiza.Otros_Valores;
      co.Comentarios = cotiza.Comentarios;
      co.Estado = "cotizacion";
      grupo[num].Cotizaciones.push(co);
    } else {
      co.Valor_Envio = cotiza.Valor_Envio;
      co.Otros_Valores = cotiza.Otros_Valores;
      co.Comentarios = cotiza.Comentarios;
      co.Estado = "cotizacion";
      let c = { Estado: "cotizacion", Cotizaciones: [co] };
      grupo.push(c);
    }
    setGroup(grupo);
    setStartT(true);
  };
  const handleRechazar = async (id) => {
    const pedido = { Estado: "tienda-rechazado" };
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
  if (start && userData) {
    resolveCotizacion();
    setStart(false);
  }
  const handleDelete = async (id) => {
    await deletePricing(id);
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
  };
  const CotizacionItems = () => {
    if (group && usuarios && productosCotizar) {
      if (group.length === 0) {
        return (
          <div>
            <div>
              {alertDel && <AlertDelete />}
              {alert && <Alert />}
            </div>
            <div className="text-center mt-3">
              <h3>Actualmente tu tienda no tiene ninguna cotización.</h3>
            </div>
          </div>
        );
      }
      return (
        <div>
          {alertDel && <AlertDelete />}
          {alert && <Alert />}
          {group.map((estado, tes) => {
            return (
              <div
                key={tes}
                className="accordion m-1 mb-2 mt-2"
                id={`accordion${tes}`}
              >
                <div className="accordion-item">
                  <h1
                    className="accordion-header  us-header"
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
                      {estado.Estado === "creada" && <>Pendientes</>}
                      {estado.Estado === "cotizacion" && <>Enviadas</>}
                      {estado.Estado === "cancelado" && (
                        <>Canceladas por Usuario</>
                      )}
                      {estado.Estado === "rechazado" && (
                        <>Rechazadas por Usuario</>
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
                        let usuario = usuarios.find(
                          (item) => item.Uid === cotiza.User_id
                        );
                        if (!usuario){
                          usuario = {
                            Nombre: "Usuario Eliminado",
                            Delete: true
                          }
                        }
                        return (
                          <div
                            className="accordion"
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
                                  Usuario: {usuario.Nombre}{" "}
                                  {usuario.Delete && ". (Usuario Eliminado)."}
                                </button>
                              </h2>
                              <div
                                className="accordion-collapse collapse show"
                                id={`collapseuser${cotiza._id}`}
                                aria-labelledby={`headinguser${cotiza._id}`}
                                data-bs-parent={`#accordionuser${cotiza._id}`}
                              >
                                <div className="accordion-body">
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
                                          className="accordion-button collapsed acc-title-products-admin"
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
                                              let item = productosCotizar.find(
                                                (item) =>
                                                  item._id === pedido.Producto
                                              );
                                              if (item.Delete) {
                                                item = {
                                                  Nombre:
                                                    item.Nombre +
                                                    " (Producto Eliminado)",
                                                  Precio: 0,
                                                };
                                              }
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
                                                            <h5>Cantidad: </h5>
                                                          )}
                                                        <h5 className="prod-car">
                                                          {w <= 680 && (
                                                            <span>{cant}</span>
                                                          )}
                                                          {pedido.Cantidad}
                                                        </h5>
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
                                  <div className="m-md-3 m-1 w-100">
                                    <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                      <h2 className="valor-titulo mt-2 mb-2">
                                        Valor Productos:{" "}
                                        <span className="valor-value">
                                          {formatterPeso.format(valorProductos)}
                                        </span>
                                      </h2>
                                    </div>
                                    {cotiza.User_Comentarios &&
                                      cotiza.User_Comentarios.length > 1 && (
                                        <div className="fs-5  mt-2 mb-2">
                                          <h2 className="valor-titulo">
                                            Comentarios del Cliente:{" "}
                                          </h2>
                                          {cotiza.User_Comentarios}
                                        </div>
                                      )}
                                    {cotiza.Ciudad_Envio &&
                                      cotiza.Ciudad_Envio.length > 1 && (
                                        <div className="fs-5  mt-2 mb-2">
                                          <h2 className="valor-titulo">
                                            Ciudad de Envio:{" "}
                                          </h2>
                                          {cotiza.Ciudad_Envio}
                                        </div>
                                      )}
                                    {cotiza.Direccion_Envio && (
                                      <div className="fs-5  mt-2 mb-2">
                                        <h2 className="valor-titulo">
                                          Direccion de Envio:{" "}
                                        </h2>
                                        {cotiza.Direccion_Envio}
                                      </div>
                                    )}
                                    <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                      {estado.Estado !== "cancelado" && (
                                        <h2 className="valor-titulo me-2">
                                          Valor Envio:{" "}
                                          {estado.Estado !== "creada" &&
                                            estado.Estado !== "cancelado" && (
                                              <span className="valor-value">
                                                {formatterPeso.format(
                                                  cotiza.Valor_Envio
                                                )}
                                              </span>
                                            )}
                                        </h2>
                                      )}
                                      {estado.Estado === "creada" &&
                                        !usuario.Delete && (
                                          <input
                                            type="number"
                                            id={`valor-envio-${tes}`}
                                          />
                                        )}
                                    </div>
                                    {cotiza.Otros_Valores > 0 &&
                                      cotiza.Estado !== "creada" && (
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
                                    {cotiza.Estado === "creada" &&
                                      !usuario.Delete && (
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Otros Valores:{" "}
                                          </h2>
                                          <input
                                            type="number"
                                            id={`otros-valores-${tes}`}
                                          />
                                        </div>
                                      )}
                                    {cotiza.Comentarios && (
                                      <div>
                                        {cotiza.Comentarios.length > 1 && (
                                          <div className="mt-2 mb-2 fs-5">
                                            <h2 className="valor-titulo me-2">
                                              Tus Comentarios:{" "}
                                            </h2>
                                            {cotiza.Comentarios}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {estado.Estado !== "creada" &&
                                      estado.Estado !== "cancelado" && (
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Valor Total:{" "}
                                            <span className="valor-value">
                                              {formatterPeso.format(valorTotal)}
                                            </span>
                                          </h2>
                                        </div>
                                      )}
                                    {estado.Estado === "creada" &&
                                      !usuario.Delete && (
                                        <div className="mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Tus Comentarios:{" "}
                                          </h2>
                                          <textarea
                                            className="w-100"
                                            type="text"
                                            id={`comentarios-${tes}`}
                                          />
                                        </div>
                                      )}
                                  </div>
                                  <div className="d-flex flex-row justify-content-evenly botones-pricing">
                                    {estado.Estado === "creada" &&
                                      !usuario.Delete && (
                                        <div className="btns-pricing">
                                          <button
                                            className="btn btn-primary m-1"
                                            onClick={(e) => {
                                              let newCotizacion = {
                                                Valor_Envio:
                                                  document.getElementById(
                                                    `valor-envio-${tes}`
                                                  ).value,
                                                Otros_Valores:
                                                  document.getElementById(
                                                    `otros-valores-${tes}`
                                                  ).value,
                                                Comentarios:
                                                  document.getElementById(
                                                    `comentarios-${tes}`
                                                  ).value,
                                                Estado: "cotizacion",
                                              };
                                              e.preventDefault();
                                              handleNewCotizacion(
                                                cotiza._id,
                                                newCotizacion
                                              );
                                            }}
                                          >
                                            Enviar Cotización
                                          </button>
                                        </div>
                                      )}
                                    {estado.Estado === "creada" &&
                                      !usuario.Delete && (
                                        <div className="btns-pricing">
                                          <button
                                            className="btn btn-danger m-1"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleRechazar(
                                                cotiza._id,
                                                cotiza
                                              );
                                            }}
                                          >
                                            Rechazar y Eliminar
                                          </button>
                                        </div>
                                      )}
                                    {estado.Estado === "creada" &&
                                      usuario.Delete && (
                                        <div className="btns-pricing">
                                          <button
                                            className="btn btn-danger m-1"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              handleDelete(cotiza._id);
                                            }}
                                          >
                                            Eliminar
                                          </button>
                                        </div>
                                      )}
                                    {estado.Estado === "cancelado" && (
                                      <button
                                        className="btn btn-danger m-1"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDelete(cotiza._id);
                                        }}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                    {estado.Estado === "rechazado" && (
                                      <button
                                        className="btn btn-danger m-1"
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
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
      <h1 className="text-center admin-titles-cel">Cotizaciones</h1>
      <CotizacionItems />
    </div>
  );
}
export default StorePricing;