import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "react-bootstrap/Button";

function StoreOrders() {
  const {
    readProducts,
    createEnvio,
    userData,
    updatePricing,
    deleteCarts,
    readStoreOrders,
    readUserInfo,
    deletePricing,
    setStoreProblem,
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
  const formatterPeso = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
  const [start, setStart] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [group, setGroup] = useState(null);
  const [productosCotizar, setProductosCotizar] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
  const [cotizacion, setCotizacion] = useState(null);
  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

  const resolveProductsOrders = async (products) => {
    await readProducts(products).then((res) => {
      console.log("resData", res.data);
      setProductosCotizar(res.data);
    });
    setCargando(false);
  };

  const resolveUsers = async (tienda) => {
    console.log(tienda);
    console.log("tienda");
    await readUserInfo(tienda).then((res) => {
      setUsuarios(res.data);
    });
  };
  const resolveCotizacion = async () => {
    await readStoreOrders(userData.Emprendimiento_id).then((res) => {
      const data = res.data;
      console.log(data);
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

      console.log("object", objeto);
      let creadas;
      let rechazadas;
      let final;
      let enviadas;
      for (let key in objeto) {
        // eslint-disable-next-line no-loop-func
        objeto[key].forEach((pedido) => {
          if (!pedido.User_Delete) {
            if (key === "pagado") {
              creadas = { Estado: key, Cotizaciones: objeto[key] };
            }
            if (key === "problema") {
              rechazadas = { Estado: key, Cotizaciones: objeto[key] };
            }
            if (key === "envio") {
              enviadas = { Estado: key, Cotizaciones: objeto[key] };
            }
            if (key === "finalizado") {
              final = { Estado: key, Cotizaciones: objeto[key] };
            }
          }
        });
      }
      if (rechazadas) {
        lista.push(rechazadas);
      }

      if (creadas) {
        lista.push(creadas);
      }
      if (enviadas) {
        lista.push(enviadas);
      }
      if (final) {
        lista.push(final);
      }

      setGroup(lista);
      console.log(listaProductos);
      resolveProductsOrders(listaProductos);
      setCotizacion(data);
      return;
    });
  };
  const handleNewEnvio = async (id, cotizacion) => {
    await createEnvio(id, cotizacion).then((res) => {
      console.log("res", res);
    });
  };

  const handleRechazar = async (id, cotizacion) => {
    let data = { Estado: "rechazado" };
    let lista = [];
    console.log("cotizacion", cotizacion);
    cotizacion.Pedidos.forEach((element) => {
      console.log("element", element);
      lista.push(element._id);
    });
    const deleteMany = {
      id: lista,
    };
    await createEnvio(id, data).then((res) => {
      console.log("res", res);
    });
    await deleteCarts(deleteMany).then((res) => {
      console.log("res", res);
    });
  };

  if (start && userData) {
    resolveCotizacion();
    setStart(false);
  }

  const handleDelete = async (id) => {
    let estado = { Store_Delete: true };
    await updatePricing(id, estado);
  };
  const StoreResp = (data) => {
    console.log(data);
    if (data.data.Store_Problem.length <= 0) {
      return <div>Aun no hay respuesta</div>;
    }
  };
  const CotizacionItems = () => {
    const [newMsg, setNewMsg] = useState("");
    const handleNewMsg = () => {
      document.getElementById("new-msg").classList.remove("d-none");
      document.getElementById("new-msg-btn").classList.add("d-none");
    };
    const cancelNewMsg = () => {
      document.getElementById("new-msg-btn").classList.remove("d-none");
      document.getElementById("new-msg").classList.add("d-none");
    };
    if (group && usuarios && productosCotizar) {
      console.log(group);
      return (
        <div>
          {group.map((estado, tes) => {
            console.log(tes + " hola " + estado);
            console.log(estado);

            return (
              <div key={tes} className="accordion" id={`accordion${tes}`}>
                <div className="accordion-item">
                  <h1 className="accordion-header" id={`heading${tes}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${tes}`}
                      aria-expanded="true"
                      aria-controls={`#collapse${tes}`}
                    >
                      {estado.Estado === "problema" && <>En Revisión</>}
                      {estado.Estado === "envio" && <>En Envio</>}
                      {estado.Estado === "pagado" && <>Pagadas</>}
                      {estado.Estado === "finalizado" && <>Finalizadas</>}
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
                        console.log("cotiza");
                        console.log(cotiza);
                        let valorProductos = 0;
                        let valorTotal = 0;
                        cotiza.Pedidos.forEach((producto) => {
                          let item = productosCotizar.find(
                            (product) => product._id === producto.Producto
                          );
                          console.log("item", item);
                          let valor = item.Precio * producto.Cantidad;
                          valorProductos += valor;
                        });
                        if (cotiza.Pago === true) {
                          valorTotal =
                            valorProductos +
                            cotiza.Valor_Envio +
                            cotiza.Otros_Valores;
                        }
                        let usuario = usuarios.find(
                          (item) => item.Uid === cotiza.User_id
                        );
                        let nuevoMensaje;
                        if (cotiza.Store_Problem.length <= 0) {
                          nuevoMensaje = "Responder el Mensaje";
                        } else {
                          nuevoMensaje = "Agregar Nuevo Mensaje";
                        }
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
                                  className="accordion-button "
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapseuser${cotiza._id}`}
                                  aria-expanded="true"
                                  aria-controls={`#collapseuser${cotiza._id}`}
                                >
                                  Usuario: {usuario.Nombre}
                                </button>
                              </h2>
                              <div
                                className="accordion-collapse collapse show"
                                id={`collapseuser${cotiza._id}`}
                                aria-labelledby={`headinguser${cotiza._id}`}
                                data-bs-parent={`#accordionuser${cotiza._id}`}
                              >
                                <div className="accordion-body pt-0 pb-0 ">
                                  <div
                                    className="accordion mt-3 mb-3"
                                    id={`accordionproducts${cotiza._id}`}
                                  >
                                    <div className="accordion-item">
                                      <h3
                                        className="accordion-header"
                                        id={`headingproducts${cotiza._id}`}
                                      >
                                        <button
                                          className="accordion-button collapsed"
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
                                              console.log("pedido", pedido);
                                              let item = productosCotizar.find(
                                                (item) =>
                                                  item._id === pedido.Producto
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

                                  <div className=" mt-2 mb-2 pricing-data">
                                    <h2 className="valor-titulo mt-2 mb-2">
                                      Valor Productos:{" "}
                                      <span className="valor-value">
                                        {formatterPeso.format(valorProductos)}
                                      </span>
                                    </h2>
                                    {cotiza.User_Comentarios.length > 1 && (
                                      <div className="fs-5  mt-2 mb-2">
                                        <h2 className="valor-titulo">
                                          Comentarios del Cliente:{" "}
                                        </h2>
                                        {cotiza.User_Comentarios}
                                      </div>
                                    )}
                                    {cotiza.Valor_Envio > 0 && (
                                      <div>
                                        <h2 className="valor-titulo me-2">
                                          Valor Envio:{" "}
                                          <span className="valor-value">
                                            {formatterPeso.format(
                                              cotiza.Valor_Envio
                                            )}
                                          </span>
                                        </h2>
                                      </div>
                                    )}
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
                                    {valorTotal > 0 && (
                                      <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                        <h2 className="valor-titulo me-2">
                                          Valor Total:{" "}
                                          <span className="valor-value">
                                            {formatterPeso.format(valorTotal)}
                                          </span>
                                        </h2>
                                      </div>
                                    )}
                                  </div>
                                  {estado.Estado === "finalizado" && (
                                    <div>
                                      {cotiza.Comentarios_Finales && (
                                        <div className="mt-2 mb-2 fs-5">
                                          <h2 className="valor-titulo me-2">
                                            Comentarios Finales del Cliente:{" "}
                                          </h2>
                                          {cotiza.Comentarios_Finales}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {cotiza.Estado === "pagado" &&
                                    cotiza.Pago === true && (
                                      <div>
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Fecha Envio:{" "}
                                          </h2>

                                          <input
                                            type="text"
                                            id={`fecha-envio-${tes}`}
                                          />
                                        </div>
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Empresa Envio:{" "}
                                          </h2>

                                          <input
                                            type="text"
                                            id={`empresa-envio-${tes}`}
                                          />
                                        </div>
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Numero de Guia:{" "}
                                          </h2>

                                          <input
                                            type="text"
                                            id={`numero-guia-${tes}`}
                                          />
                                        </div>
                                        <div className="mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo me-2">
                                            Comentarios de Envio:{" "}
                                          </h2>

                                          <textarea className="w-100"
                                            type="text"
                                            id={`comentarios-envio-${tes}`}
                                          />
                                        </div>
                                        <div className="d-flex flex-row justify-content-center m-3">
                                        <button
                                          className="btn btn-primary"
                                          onClick={(e) => {
                                            let envio = {
                                              Fecha_Envio:
                                                document.getElementById(
                                                  `fecha-envio-${tes}`
                                                ).value,
                                              Empresa_Envio:
                                                document.getElementById(
                                                  `empresa-envio-${tes}`
                                                ).value,
                                              Numero_Guia:
                                                document.getElementById(
                                                  `numero-guia-${tes}`
                                                ).value,
                                              Comentarios_Envio:
                                                document.getElementById(
                                                  `comentarios-envio-${tes}`
                                                ).value,
                                              Estado: "envio",
                                            };
                                            console.log(envio);
                                            e.preventDefault();
                                            handleNewEnvio(cotiza._id, envio);
                                          }}
                                        >
                                          Envio Realizado
                                        </button></div>
                                      </div>
                                    )}
                                  {cotiza.Pago === true &&
                                    cotiza.Info_Envio && (
                                      <div>
                                        <div>
                                          <div
                                            className="accordion mb-3"
                                            id={`accordionEnvio${cotiza._id}`}
                                          >
                                            <div className="accordion-item">
                                              <h3
                                                className="accordion-header"
                                                id={`headingEnvio${cotiza._id}`}
                                              >
                                                <button
                                                  className="accordion-button collapsed"
                                                  type="button"
                                                  data-bs-toggle="collapse"
                                                  data-bs-target={`#collapseEnvio${cotiza._id}`}
                                                  aria-expanded="true"
                                                  aria-controls={`#collapseEnvio${cotiza._id}`}
                                                >
                                                  Información del Envio
                                                </button>
                                              </h3>

                                              <div
                                                className="accordion-collapse collapse"
                                                id={`collapseEnvio${cotiza._id}`}
                                                aria-labelledby={`headingEnvio${cotiza._id}`}
                                                data-bs-parent={`#accordionEnvio${cotiza._id}`}
                                              >
                                                <div className="accordion-body">
                                                  <div>
                                                    {cotiza.Info_Envio
                                                      .Fecha_Envio && (
                                                      <h2 className="valor-titulo me-2">
                                                        Fecha de Envio:{" "}
                                                        <span className="valor-value">
                                                          {
                                                            cotiza.Info_Envio
                                                              .Fecha_Envio
                                                          }
                                                        </span>
                                                      </h2>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio
                                                      .Empresa_Envio && (
                                                      <h2 className="valor-titulo me-2">
                                                        Fecha de Envio:{" "}
                                                        <span className="valor-value">
                                                          {
                                                            cotiza.Info_Envio
                                                              .Empresa_Envio
                                                          }
                                                        </span>
                                                      </h2>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio
                                                      .Numero_Guia && (
                                                      <h2 className="valor-titulo me-2">
                                                        Fecha de Envio:{" "}
                                                        <span className="valor-value">
                                                          {
                                                            cotiza.Info_Envio
                                                              .Numero_Guia
                                                          }
                                                        </span>
                                                      </h2>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio
                                                      .Comentarios_Envio && (
                                                      <div>
                                                        {cotiza.Info_Envio
                                                          .Comentarios_Envio
                                                          .length > 1 && (
                                                          <div className="mt-2 mb-2 fs-5">
                                                            <h2 className="valor-titulo me-2">
                                                              Comentarios del
                                                              Envio:{" "}
                                                            </h2>
                                                            {
                                                              cotiza.Info_Envio
                                                                .Comentarios_Envio
                                                            }
                                                          </div>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  {cotiza.Pago === true &&
                                    cotiza.Estado === "problema" && (
                                      <div
                                        className="accordion mb-3"
                                        id={`accordionProblem${cotiza._id}`}
                                      >
                                        <div className="accordion-item">
                                          <h3
                                            className="accordion-header"
                                            id={`headingProblem${cotiza._id}`}
                                          >
                                            <button
                                              className="accordion-button collapsed"
                                              type="button"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#collapseProblem${cotiza._id}`}
                                              aria-expanded="true"
                                              aria-controls={`#collapseProblem${cotiza._id}`}
                                            >
                                              Mensajes de revisión
                                            </button>
                                          </h3>

                                          <div
                                            className="accordion-collapse collapse"
                                            id={`collapseProblem${cotiza._id}`}
                                            aria-labelledby={`headingProblem${cotiza._id}`}
                                            data-bs-parent={`#accordionProblem${cotiza._id}`}
                                          >
                                            <div className="accordion-body d-flex flex-row pb-0">
                                              <div className="mensajes-problema">
                                                <h6>Mis Mensajes:</h6>
                                                {cotiza.User_Problem && (
                                                  <div>
                                                    {cotiza.User_Problem.map(
                                                      (msg, i) => {
                                                        return (
                                                          <div>
                                                            Msg {i + 1}: {msg}
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                              <div className="mensajes-problema">
                                                <h6>Mensajes de la Tienda:</h6>
                                                {cotiza.Store_Problem && (
                                                  <div>
                                                    {cotiza.Store_Problem.map(
                                                      (msg, i) => {
                                                        return (
                                                          <div>
                                                            Msg {i + 1}: {msg}
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                                <StoreResp data={cotiza} />
                                              </div>
                                            </div>
                                            <div className="d-flex flex-row justify-content-center m-2">
                                              <Button
                                                variant="dark"
                                                onClick={handleNewMsg}
                                                id="new-msg-btn"
                                                className="text-center"
                                              >
                                                {nuevoMensaje}
                                              </Button>
                                              <div
                                                className="d-none"
                                                id="new-msg"
                                              >
                                                <input
                                                  type="text-area"
                                                  onChange={(e) => {
                                                    e.preventDefault();
                                                    setNewMsg(e.target.value);
                                                  }}
                                                />
                                                <div>
                                                  <Button
                                                    variant="secondary"
                                                    onClick={cancelNewMsg}
                                                  >
                                                    Cancelar
                                                  </Button>
                                                  <Button
                                                    variant="primary"
                                                    onClick={(e) => {
                                                      const problem = {
                                                        User_Problem: newMsg,
                                                      };
                                                      setStoreProblem(
                                                        cotiza._id,
                                                        problem
                                                      );
                                                    }}
                                                  >
                                                    Enviar nuevo msg
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </div>
                                {estado.Estado === "finalizado" && (
                                  <div className="d-flex flex-row justify-content-center">
                                    <button
                                      className="btn btn-danger mb-3"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDelete(cotiza._id);
                                      }}
                                    >
                                      Eliminar
                                    </button>
                                  </div>
                                )}
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
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <CotizacionItems />
    </div>
  );
}

export default StoreOrders;
