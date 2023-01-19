import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
function MyOrders() {
  const {
    user,
    readStores,
    readProducts,
    deletePricing,
    updatePricing,
    readOrders,
    setStars,
    setUserProblem,
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
  const navigate = useNavigate();
  const [start, setStart] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [group, setGroup] = useState(null);
  const [productosOrders, setProductosOrders] = useState(null);
  const [tiendasCotizar, setTiendasCotizar] = useState(null);
  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

  const resolveProducts = async (products) => {
    await readProducts(products).then((res) => {
      console.log("resData", res.data);
      setProductosOrders(res.data);
    });
    setCargando(false);
  };

  const resolveTiendas = async (tienda) => {
    await readStores(tienda).then((res) => {
      setTiendasCotizar(res.data);
    });
  };
  const resolveOrders = async () => {
    await readOrders(user.uid).then((res) => {
      const data = res.data;
      console.log(data);
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
      resolveTiendas(result);
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
          if (!pedido.Store_Delete) {
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
      if (enviadas) {
        lista.push(enviadas);
      }
      if (creadas) {
        lista.push(creadas);
      }
      if (final) {
        lista.push(final);
      }

      setGroup(lista);
      console.log(listaProductos);
      resolveProducts(listaProductos);
      return;
    });
  };
  const handlePagar = async (cotizacion, total, tienda) => {
    console.log(cotizacion);
    navigate("/pago", { state: { cotizacion, total, tienda } });
  };

  if (start) {
    resolveOrders();
    setStart(false);
  }
  const handleDelete = async (id) => {
    await deletePricing(id);
  };
  const handleEnvio = async (id, envio) => {
    await updatePricing(id, envio);
  };
  const handleFinalizar = async (id) => {
    let estado = { User_Delete: true };
    await updatePricing(id, estado);
  };
  const ModalProblem = (data) => {
    const [comentarios, setComentarios] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <div>
        <Button variant="secondary" onClick={handleShow}>
          ¿Tienes un Problema?
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>¿Tienes un Problema?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Problema.</h5>
            Envia un mensaje a la tienda sobre este pedido
            <div>
              <input
                type="text-area"
                className=""
                onChange={(e) => {
                  e.preventDefault();
                  setComentarios(e.target.value);
                }}
              />
            </div>
            <div>
              ¿No encuentras una solución? Comunicate con soporte o directamente
              con la tienda en sus canales de contacto.
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <button
              className="btn btn-primary"
              onClick={(e) => {
                const problem = { User_Problem: comentarios };
                setUserProblem(data.data.pedido._id, problem);
              }}
            >
              Enviar mensaje
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  const ModalFin = (data) => {
    console.log(data);
    const [comentarios, setComentarios] = useState("");
    const [show, setShow] = useState(false);
    const [estrella, setEstrella] = useState(0);
    const [click, setClick] = useState(false);
    const [clickNum, setClickNum] = useState(0);
    const [name, setName] = useState(user.displayName);
    const [finalMsg, setFinalMsg] = useState("");
    const [calificacion, setCalificacion] = useState(false);
    const [send, setSend] = useState("Enviar Mensaje");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleMessage = () => {
      document.getElementById("message").classList.remove("d-none");
      document.getElementById("message-btn").classList.remove("btn-primary");
      document.getElementById("message-btn").classList.add("btn-secondary");
      setSend("Cancelar");
    };

    const handleNoMessage = () => {
      document.getElementById("message").classList.add("d-none");
      document.getElementById("message-btn").classList.remove("btn-secondary");
      document.getElementById("message-btn").classList.add("btn-primary");
      document.getElementById("message").value = "";
      setSend("Enviar Mensaje");
      setFinalMsg("");
    };
    const setStar = (num) => {
      setEstrella(num);
      let x = 1;
      while (x <= 5) {
        let star = document.getElementById(`star-${x}`);
        if (x <= num) {
          star.classList.remove("fa-regular");
          star.classList.add("fa-solid");
          x++;
        } else {
          star.classList.remove("fa-solid");
          star.classList.add("fa-regular");
          x++;
        }
      }
    };
    const unsetStar = (num) => {
      let x = 1;
      if (!click) {
        while (x <= 5) {
          let star = document.getElementById(`star-${x}`);
          if (x <= num) {
            star.classList.remove("fa-solid");
            star.classList.add("fa-regular");
            x++;
          } else {
            x++;
          }
        }
      }
    };
    const handleNombre = (e) => {
      if (e.target.checked) {
        setName("Anónimo");
      }
      if (!e.target.checked) {
        setName(user.displayName);
      }
    };

    return (
      <div>
        <Button variant="primary" onClick={handleShow}>
          {data.data.titulo}
        </Button>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Finalizar Pedido</Modal.Title>
          </Modal.Header>
          {(calificacion || !data.data.pedido.Calificacion) && (
            <div>
              <Modal.Body>
                <h5>Calificar tienda</h5>
                <div>{data.data.tienda}</div>
                <div className="stars">
                  <i
                    className="fa-regular fa-star star-1"
                    id="star-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setClickNum(1);
                      if (click === true && clickNum === 1) {
                        setClick(false);
                      } else {
                        setClick(true);
                      }
                      setStar(1);
                    }}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setStar(1);
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      unsetStar(1);
                    }}
                  ></i>
                  <i
                    className="fa-regular fa-star star-2"
                    id="star-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setClickNum(2);
                      if (click === true && clickNum === 2) {
                        setClick(false);
                      } else {
                        setClick(true);
                      }
                      setStar(2);
                    }}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setStar(2);
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      unsetStar(2);
                    }}
                  ></i>
                  <i
                    className="fa-regular fa-star star-3"
                    id="star-3"
                    onClick={(e) => {
                      e.preventDefault();
                      setClickNum(3);
                      if (click === true && clickNum === 3) {
                        setClick(false);
                      } else {
                        setClick(true);
                      }
                      setStar(3);
                    }}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setStar(3);
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      unsetStar(3);
                    }}
                  ></i>
                  <i
                    className="fa-regular fa-star star-4"
                    id="star-4"
                    onClick={(e) => {
                      e.preventDefault();
                      setClickNum(4);
                      if (click === true && clickNum === 4) {
                        setClick(false);
                      } else {
                        setClick(true);
                      }
                      setStar(4);
                    }}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setStar(4);
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      unsetStar(4);
                    }}
                  ></i>
                  <i
                    className="fa-regular fa-star star-5"
                    id="star-5"
                    onClick={(e) => {
                      e.preventDefault();
                      setClickNum(5);
                      if (click === true && clickNum === 5) {
                        setClick(false);
                      } else {
                        setClick(true);
                      }
                      setStar(5);
                    }}
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setStar(5);
                    }}
                    onMouseLeave={(e) => {
                      e.preventDefault();
                      unsetStar(5);
                    }}
                  ></i>
                </div>
                <div>
                  Comenta tu opinión de la Tienda:{" "}
                  <div>
                    <input
                      type="text-area"
                      onChange={(e) => {
                        e.preventDefault();
                        setComentarios(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row">
                  <input
                    className="m-1"
                    type="checkbox"
                    id="emailCheck"
                    onClick={handleNombre}
                  />
                  Deseo que mi calificación sea anónima.
                </div>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      let calificacion = {
                        Usuario: name,
                        Comentarios: comentarios,
                        Stars: estrella,
                      };
                      let ok = {
                        Calificacion: true,
                      };
                      e.preventDefault();
                      setStars(
                        data.data.pedido.Emprendimiento_id,
                        calificacion
                      );
                      handleEnvio(data.data.pedido._id, ok);
                    }}
                  >
                    Enviar Calificación
                  </button>
                </Modal.Footer>
              </Modal.Body>
            </div>
          )}
          {!calificacion &&
            !data.data.pedido.Calificacion &&
            data.data.pedido.Estado !== "finalizado" && (
              <div>
                {" "}
                <Modal.Body>
                  <div className="">
                    ¿Deseas enviar un comentario final a la tienda?
                  </div>
                  <div>
                    <input
                      type="text-area"
                      className="d-none"
                      id="message"
                      onChange={(e) => {
                        e.preventDefault();
                        setFinalMsg(e.target.value);
                      }}
                    />
                  </div>
                  {finalMsg && (
                    <div>
                      Su mensaje será enviado al hacer click en finalizar
                    </div>
                  )}
                  <Button
                    className="btn btn-primary"
                    id="message-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      if (send === "Enviar Mensaje") {
                        handleMessage();
                      } else if (send === "Cancelar") {
                        handleNoMessage();
                      }
                    }}
                  >
                    {send}
                  </Button>
                </Modal.Body>
                <Modal.Footer>
                  <div className="">
                    *Al finalizar se declarará el pedido como recibido y la
                    orden como finalizada.
                  </div>
                  <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      let envio = {
                        Estado: "finalizado",
                      };

                      e.preventDefault();
                      handleEnvio(data.data.pedido._id, envio);
                      setCalificacion(true);
                    }}
                  >
                    Finalizar
                  </button>
                </Modal.Footer>
              </div>
            )}
        </Modal>
      </div>
    );
  };
  const StoreResp = (data) => {
    console.log(data);
    if (!data.data.Store_Problem.length <= 0) {
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
    if (group && tiendasCotizar && productosOrders) {
      console.log(group);
      return (
        <div>
          {group.map((estado, tes) => {
            console.log(tes + " hola " + estado);
            console.log(estado);
            return (
              <div key={tes} className="accordion m-1 mb-2 mt-2" id={`accordion${tes}`}>
                <div className="accordion-item">
                  <h1 className="accordion-header us-header" id={`heading${tes}`}>
                    <button
                      className="accordion-button  acc-titulos-admin"
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
                          let item = productosOrders.find(
                            (product) => product._id === producto.Producto
                          );
                          console.log("item", item);
                          let valor = item.Precio * producto.Cantidad;
                          valorProductos += valor;
                        });

                        valorTotal =
                          valorProductos +
                          cotiza.Valor_Envio +
                          cotiza.Otros_Valores;

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
                                  className="accordion-button  acc-us-admin"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapseuser${cotiza._id}`}
                                  aria-expanded="true"
                                  aria-controls={`#collapseuser${cotiza._id}`}
                                >
                                  {store.Nombre}
                                </button>
                              </h2>
                              <div
                                className="accordion-collapse collapse show"
                                id={`collapseuser${cotiza._id}`}
                                aria-labelledby={`headinguser${cotiza._id}`}
                                data-bs-parent={`#accordionuser${cotiza._id}`}
                              >
                                <div className="accordion-body pt-0 pb-0 ">
                                  <div className="d-flex justify-content-end">
                                    <Link
                                      to={`/Emprendimientos/${store.Path}`}
                                      className="btn btn-dark boton-tienda-carrito mt-2 mb-2"
                                    >
                                      Ir a la Tienda
                                    </Link>
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
                                              console.log("pedido", pedido);
                                              let item = productosOrders.find(
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
                                          Mis Comentarios:{" "}
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
                                            {formatterPeso.format(valorTotal)}
                                          </span>
                                        </h2>
                                      </div>
                                    )}
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
                                    {cotiza.Pago === true &&
                                      cotiza.Info_Envio && (
                                        <div>
                                          <div>
                                            <div
                                              className="accordion"
                                              id={`accordionEnvio${cotiza._id}`}
                                            >
                                              <div className="accordion-item">
                                                <h3
                                                  className="accordion-header info-envio-header"
                                                  id={`headingEnvio${cotiza._id}`}
                                                >
                                                  <button
                                                    className="accordion-button collapsed acc-title-products-admin"
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
                                                                cotiza
                                                                  .Info_Envio
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
                                  </div>
                                  {cotiza.Pago === true &&
                                    cotiza.Estado === "envio" && (
                                      <div className="d-flex flex-row justify-content-center buttons-orders">
                                        <div className="m-2">
                                          <ModalFin
                                            data={{
                                              pedido: cotiza,
                                              tienda: store.Nombre,
                                              titulo: "Pedido Recibido",
                                            }}
                                          />
                                        </div>
                                        <div className="m-2">
                                          <ModalProblem
                                            data={{
                                              pedido: cotiza,
                                              tienda: store.Nombre,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  {cotiza.Pago === true &&
                                    cotiza.Estado === "problema" && (
                                      <div
                                        className="accordion"
                                        id={`accordionProblem${cotiza._id}`}
                                      >
                                        <div className="accordion-item">
                                          <h3
                                            className="accordion-header problem-header"
                                            id={`headingProblem${cotiza._id}`}
                                          >
                                            <button
                                              className="accordion-button acc-title-products-admin"
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
                                            className="accordion-collapse collapse show"
                                            id={`collapseProblem${cotiza._id}`}
                                            aria-labelledby={`headingProblem${cotiza._id}`}
                                            data-bs-parent={`#accordionProblem${cotiza._id}`}
                                          >
                                            <div className="accordion-body d-flex flex-row pb-0 msjs-problem">
                                              <div
                                                className="mensajes-problema accordion mb-2"
                                                id={`accordionProblemMsg${cotiza._id}`}
                                              >
                                                <div className="accordion-item">
                                                  <h6
                                                    className="accordion-header"
                                                    id={`headingProblemMsg${cotiza._id}`}
                                                  >
                                                    <button
                                                      className="accordion-button"
                                                      type="button"
                                                      data-bs-toggle="collapse"
                                                      data-bs-target={`#collapseProblemMsg${cotiza._id}`}
                                                      aria-expanded="true"
                                                      aria-controls={`#collapseProblemMsg${cotiza._id}`}
                                                    >
                                                      Mis Mensajes:
                                                    </button>
                                                  </h6>
                                                  <div
                                                    className="accordion-collapse collapse show"
                                                    id={`collapseProblemMsg${cotiza._id}`}
                                                    aria-labelledby={`headingProblemMsg${cotiza._id}`}
                                                    data-bs-parent={`#accordionProblemMsg${cotiza._id}`}
                                                  >
                                                    <div className="accordion-item  p-2">
                                                      {cotiza.User_Problem && (
                                                        <div>
                                                          {cotiza.User_Problem.map(
                                                            (msg, i) => {
                                                              return (
                                                                <div>
                                                                  Msg {i + 1}:{" "}
                                                                  {msg}
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className="mensajes-problema accordion"
                                                id={`accordionProblemMsgStore${cotiza._id}`}
                                              >
                                                <div className="accordion-item">
                                                  <h6
                                                    className="accordion-header"
                                                    id={`headingProblemMsgStore${cotiza._id}`}
                                                  >
                                                    <button
                                                      className="accordion-button"
                                                      type="button"
                                                      data-bs-toggle="collapse"
                                                      data-bs-target={`#collapseProblemMsgStore${cotiza._id}`}
                                                      aria-expanded="true"
                                                      aria-controls={`#collapseProblemMsgStore${cotiza._id}`}
                                                    >
                                                      Mensajes de la Tienda:
                                                    </button>
                                                  </h6>
                                                  <div
                                                    className="accordion-collapse collapse show"
                                                    id={`collapseProblemMsgStore${cotiza._id}`}
                                                    aria-labelledby={`headingProblemMsgStore${cotiza._id}`}
                                                    data-bs-parent={`#accordionProblemMsgStore${cotiza._id}`}
                                                  >
                                                    <div className="accordion-item p-2">
                                                      {cotiza.Store_Problem
                                                        .length > 0 && (
                                                        <div>
                                                          {cotiza.Store_Problem.map(
                                                            (msg, i) => {
                                                              return (
                                                                <div>
                                                                  Msg {i + 1}:{" "}
                                                                  {msg}
                                                                </div>
                                                              );
                                                            }
                                                          )}
                                                          
                                                        </div>
                                                      )}
                                                      {cotiza.Store_Problem
                                                        .length <= 0 &&<div>Aun no hay respuesta</div>}
                                                      
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="d-flex flex-row justify-content-center m-2">
                                              <Button
                                                variant="dark"
                                                onClick={handleNewMsg}
                                                id="new-msg-btn"
                                                className="text-center"
                                              >
                                                Agregar nuevo mensaje
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
                                                      setUserProblem(
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
                                        <div className="d-flex flex-row justify-content-center p-2">
                                          <ModalFin
                                            data={{
                                              pedido: cotiza,
                                              tienda: store.Nombre,
                                              titulo: "Pedido Recibido",
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}

                                  {estado.Estado === "finalizado" && (
                                    <div className="d-flex flex-row justify-content-center buttons-orders">
                                      {!cotiza.Calificacion && (
                                        <div className="m-2">
                                          <ModalFin
                                            data={{
                                              pedido: cotiza,
                                              tienda: store.Nombre,
                                              titulo: "Calificar Tienda",
                                            }}
                                          />
                                        </div>
                                      )}
                                      <div className="m-2">
                                        <button
                                          className="btn btn-danger"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleFinalizar(cotiza._id);
                                          }}
                                        >
                                          Eliminar
                                        </button>
                                      </div>
                                    </div>
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
      <h1 className="text-center admin-titles-cel">Mis Pedidos</h1>
      <CotizacionItems />
    </div>
  );
}

export default MyOrders;
