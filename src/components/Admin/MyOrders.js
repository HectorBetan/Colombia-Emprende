import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { ModalFooter } from "react-bootstrap";
function MyOrders() {
  const {
    user,
    readStores,
    readProducts,
    updatePricing,
    readOrders,
    setStars,
    setUserProblem,
    sendMail,
    getRegistro,
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
  const [group2, setGroup2] = useState(null);
  const [reg, setReg] = useState("");
  const [productosOrders, setProductosOrders] = useState(null);
  const [tiendasCotizar, setTiendasCotizar] = useState(null);
  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
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
  const resolveProducts = async (products) => {
    await readProducts(products).then((res) => {
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
      let data = res.data;
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
      data = data.reverse();
      let objeto = group(data);
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
            if (key === "recoger") {
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
      setGroup2(lista);
      resolveProducts(listaProductos);
    });
  };
  if (start) {
    resolveOrders();
    setStart(false);
  }
  const [startT, setStartT] = useState(false);
  const handleFinalizar = async (id) => {
    let estado = { User_Delete: true };
    await updatePricing(id, estado);
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
          setGroup2(grupo);
          setGroup(grupo);
          return false
        } else {
          return false;
        }
      });
      return false;
    });
    setStartT(true);
  };
  useEffect(() => {
    const stGroup = () => {
      setGroup(group);
      if (reg) {
        document.getElementById("reg").value = reg;
      }
    };
    if (startT) {
      setStartT(false);
      setCargando(false);
      return () => {
        stGroup();
      };
    }
  }, [startT, group, reg]);
  const setNewGroupProblem = async (id, comentarios) => {
    let grupo = group2;
    let obj;
    let n;
    let num = null;
    group2.map((estado, ai) => {
      if (estado.Estado === "envio" || estado.Estado === "recoger") {
        return n = ai;
      }
      return false;
    });
    group2[n].Cotizaciones.map((cotizacion, index) => {
      if (cotizacion._id === id) {
        obj = cotizacion;
        obj.Estado = "problema";
        obj.User_Problem[0] = comentarios;
        grupo[n].Cotizaciones.splice(index, 1);
        if (grupo[n].Cotizaciones.length === 0) {
          grupo.splice(n, 1);
        }
        return false;
      } else {
        return false;
      }
    });
    grupo.map((estado, ei) => {
      if (estado.Estado === "problema") {
        num = ei;
        return false;
      }
      return false;
    });
    if (num !== null) {
      grupo[num].Cotizaciones.push(obj);
    } else {
      let c = { Estado: "problema", Cotizaciones: [obj] };
      grupo.push(c);
    }
    setGroup(grupo);
    setGroup2(grupo);
    setStartT(true);
  };
  const [alertBusqueda, setAlertBusqueda] = useState(false);
  const sAlertBusqueda = () => {
    window.scroll(0, 0);
    setTimeout(() => {
      setAlertBusqueda(false);
    }, 4000);
  };
  const AlertBusqueda = () => {
    return (
      <div className="d-flex flex-row justify-content-center">
<div
        className=" alert alert-success text-center p-1"
        role="alert"
      >
        <h6 className=" m-1 sm:inline text-success align-middle ">
          Busqueda de pedido # {reg} exitosa
        </h6>
      </div>
      </div>
      
    );
  };
  const buscar = (e) => {
    e.preventDefault();
    let numeroRegistro = document.getElementById("reg").value;
    if (numeroRegistro) {
      setCargando(true);
      let registro;

      let grupo;
      group2.map((estado, eindex) => {
        estado.Cotizaciones.map((cotizacion, index) => {
          registro = getRegistro(cotizacion._id);
          if (registro === numeroRegistro) {
            grupo = [
              {
                Estado: group2[eindex].Estado,
                Cotizaciones: [group2[eindex].Cotizaciones[index]],
              },
            ];
            setGroup(grupo);
            setReg(numeroRegistro);
            setAlertBusqueda(true);
            sAlertBusqueda();
            setStartT(true);
            return false;
          } else {
            return false;
          }
        });
        return false;
      });
      console.log(grupo);
      if (!grupo) {
        grupo = null;
        setGroup(grupo);
        setReg(numeroRegistro);
        setStartT(true);
      }
    }
  };
  const borrar = (e) => {
    e.preventDefault();
    if (reg) {
      setCargando(true);

      setGroup(group2);
      setReg("");
      setStartT(true);
    } else {
      document.getElementById("reg").value = reg;
    }
  };
  const ModalProblem = (data) => {
    const [comentarios, setComentarios] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const storeName = data.data.tienda;
    const storeEmail = data.data.tiendaEmail;
    const [alertProblem, setAlertProblem] = useState(false);
    const sAlertProblem = (id) => {
      setTimeout(async () => {
        await setNewGroupProblem(id, comentarios);
        setAlertProblem(false);
        handleClose();
      }, 3500);
    };
    const AlertProblem = () => {
      return (
        <div
          className=" alert alert-danger d-flex flex-row flex-wrap justify-content-center"
          role="alert"
        >
          <i className="fa-solid fa-circle-check fa-2x me-1 text-danger"></i>
          <h5 className=" m-1 sm:inline text-success align-middle ">
            Se ha enviado el mensaje y se ha declarado el pedido en problema
          </h5>
        </div>
      );
    };
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
          {alertProblem && <AlertProblem></AlertProblem>}
          {!alertProblem && (
            <Modal.Body>
              <h5>Problema.</h5>
              Envia un mensaje a la tienda sobre este pedido
              <div>
                <textarea
                  type="text-area"
                  className="form-control mt-2 mb-2"
                  onChange={(e) => {
                    e.preventDefault();
                    setComentarios(e.target.value);
                  }}
                />
              </div>
              <div>
                ¿No encuentras una solución? Comunicate con soporte o
                directamente con la tienda en sus canales de contacto.
              </div>
            </Modal.Body>
          )}
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                if (alertProblem) {
                  setNewGroupProblem(data.data.pedido._id);
                }
                handleClose();
              }}
            >
              Cerrar
            </Button>
            {!alertProblem && (
              <button
                className="btn btn-primary"
                onClick={async (e) => {
                  const problem = { User_Problem: comentarios };
                  setUserProblem(data.data.pedido._id, problem);
                  let registro;
                  registro = getRegistro(data.data.pedido._id);
                  let numReg;
                  if (registro) {
                    numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`;
                  } else {
                    numReg = "";
                  }
                  let mail = {
                    Email: storeEmail,
                    Nombre: user.displayName,
                    Subject: `${user.displayName} ha declarado el pedido en problema.`,
                    Html: `<div style="text-align:center;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
                    <h1>Hola <span style="color:#C1171B;">${storeName}</span></h1>
                    <div style="; background-color:#F8F3F3; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #D7705650;">
                    <h2><span style="color:#C1171B;">${user.displayName}</span> ha declarado el pedido en problema</h2>
                    ${numReg}
                    </div>
                    <div>El usuario ha declarado su pedido en problema y te ha enviado el siguiente mensaje:<br /><span style="color:#731717;">${comentarios}</span><br /> Ve a los pedidos de tu emprendimiento y podrás contestar al cliente y resolver el problema.</div>
                    <div style="margin:10px;margin-top:25px;background-color: #CF1519; padding: 10px; border-radius:10px; display: inline-block;">
                    <a href="https://colombia-emprende.vercel.app/admin/mi-emprendimiento/pedidos" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a los Pedidos de Mi Emprendimiento</a>
                    </div>
                    <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a los pedidos de tu emprendimiento.</div>
                    <h3>Gracias por pertenecer a Colombia Emprende</h3>
                    </div>`,
                    Msj: "El usuario ha declarado el pedido en problema y enviado un mensaje.",
                  };
                  await sendMail(mail);
                  setAlertProblem(true);
                  sAlertProblem(data.data.pedido._id);
                }}
              >
                Enviar mensaje
              </button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  const ModalFin = (data) => {
    const [comentarios, setComentarios] = useState("");
    const [show, setShow] = useState(false);
    const [estrella, setEstrella] = useState(0);
    const [click, setClick] = useState(false);
    const [clickNum, setClickNum] = useState(0);
    const [name, setName] = useState(user.displayName);
    const [finalMsg, setFinalMsg] = useState("");
    const [send, setSend] = useState("Enviar Mensaje");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [alertCalificacion, setAlertCalificacion] = useState(false);
    const [alertFinal, setAlertFinal] = useState(false);
    const [alertId, setAlertId] = useState(null);
    const storeName = data.data.tienda;
    const storeEmail = data.data.tiendaEmail;
    
    const handleEnvio = async (id, envio) => {
      await updatePricing(id, envio);
      let registro;
      registro = getRegistro(id);
      let numReg;
      if (registro) {
        numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`;
      } else {
        numReg = "";
      }
      let mail = {
        Email: storeEmail,
        Nombre: user.displayName,
        Subject: `${user.displayName} recibio el pedido y lo ha declarado como finalizado.`,
        Html: `<div style="text-align:center;">
        <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
        <h1>Hola <span style="color:#1F7F3C;">${storeName}</span></h1>
        <div style="; background-color:#EFF8F1; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #2A894640;">
        <h2><span style="color:#1F7F3C;">${user.displayName}</span> ha recibido el pedido y ha declarado el pedido como finalizado</h2>
        ${numReg}
        </div>
        <div>El usuario declaro que recibio el pedido en perfectas condiciones y lo ha dado como finalizado.<br /> Puedes ir a los pedidos de tu emprendimiento y ver los detalles o eliminar este pedido finalizado.</div>
        <div style="margin:10px;margin-top:25px;background-color: #2A8946; padding: 10px; border-radius:10px; display: inline-block;">
        <a href="https://colombia-emprende.vercel.app/admin/mi-emprendimiento/pedidos" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a los Pedidos de Mi Emprendimiento</a>
        </div>
        <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a los pedidos de tu emprendimiento.</div>
        <h3>Gracias por pertenecer a Colombia Emprende</h3>
        </div>`,
        Msj: "El usuario ha recibido el pedido y ha declarado el pedido como finalizado.",
      };
      try {
        await sendMail(mail);
      } catch (error) {
        console.log(error)
      }
      setAlertFinal(true);
      sAlertFinal(id);
      setAlertCalificacion(false);
    };
    const setNewGroup = (id) => {
      let grupo = group2;
      let obj;
      let num;
      group2.map((estado, eindex) => {
        estado.Cotizaciones.map((cotizacion, index) => {
          if (cotizacion._id === id) {
            obj = cotizacion;
            obj.Estado = "finalizado";
            if (alertId === id) {
              obj.Calificacion = true;
            }
            grupo[eindex].Cotizaciones.splice(index, 1);
            if (grupo[eindex].Cotizaciones.length === 0) {
              grupo.splice(eindex, 1);
            }
            return false;
          } else {
            return false;
          }
        });
        return false;
      });
      group2.map((estado, ei) => {
        if (estado.Estado === "finalizado") {
          num = ei;
          return false;
        }
        return false;
      });
      if (num) {
        grupo[num].Cotizaciones.push(obj);
      } else {
        let c = { Estado: "finalizado", Cotizaciones: [obj] };
        grupo.push(c);
      }
      setGroup(grupo);
      setGroup2(grupo);
      setStartT(true);
    };
    const AlertCalificacion = () => {
      return (
        <div
          className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
          role="alert"
        >
          <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
          <h5 className=" m-1 sm:inline text-success align-middle ">
            Se ha enviado la calificación de la tienda
          </h5>
        </div>
      );
    };
    const AlertFinal = () => {
      return (
        <div
          className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
          role="alert"
        >
          <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
          <h5 className=" m-1 sm:inline text-success align-middle ">
            Se ha declarado el pedido como finalizado
          </h5>
        </div>
      );
    };
    const sAlertCalificacion = () => {
      setTimeout(() => {
        setAlertCalificacion(false);
      }, 3500);
    };
    const sAlertFinal = (id) => {
      setTimeout(() => {
        setNewGroup(id);
        setAlertFinal(false);
        handleClose();
      }, 3500);
    };
    const handleEnvioCalificacion = async (id, envio) => {
      await updatePricing(id, envio);
      setAlertCalificacion(true);
      sAlertCalificacion(id);
      setAlertId(id);
    };
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
          <div>
            <Modal.Body>
              <div className="accordion" id={`accordioncalificacion`}>
                {alertCalificacion &&
                  data.data.pedido._id === alertId &&
                  !alertFinal && <AlertCalificacion />}
                {!data.data.pedido.Calificacion &&
                  data.data.pedido._id !== alertId &&
                  !alertFinal && (
                    <div className="accordion-item">
                      <h3
                        className="accordion-header"
                        id={`headingcalificacion`}
                      >
                        <button
                          className="accordion-button acc-us-admin"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapsecalificacion`}
                          aria-expanded="true"
                          aria-controls={`#collapsecalificacion`}
                        >
                          Calificar tienda
                        </button>
                      </h3>
                      <div
                        className="accordion-collapse collapse show"
                        id={`collapsecalificacion`}
                        aria-labelledby={`headingcalificacion`}
                        data-bs-parent={`#accordioncalificacion`}
                      >
                        <div className="accordion-body text-center justify-content-center">
                          <h3>{data.data.tienda}</h3>
                          <div>
                            <div className="stars">
                              <i
                                className="fa-regular fa-2x fa-star star-1 estrella"
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
                                className="fa-regular fa-star fa-2x  star-2 estrella"
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
                                className="fa-regular fa-star fa-2x  star-3 estrella"
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
                                className="fa-regular fa-2x  fa-star star-4 estrella"
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
                                className="fa-regular fa-2x  fa-star star-5 estrella"
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
                            <div className="m-2">
                              Comenta tu opinión de la Tienda:{" "}
                              <div className="d-flex justify-content-center">
                                <textarea
                                  className=" m-2 w-100"
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setComentarios(e.target.value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className="d-flex flex-row justify-content-center mb-3">
                              <input
                                className="m-1"
                                type="checkbox"
                                id="emailCheck"
                                onClick={handleNombre}
                              />
                              Deseo que mi calificación sea anónima.
                            </div>
                            <Modal.Footer>
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
                                  handleEnvioCalificacion(
                                    data.data.pedido._id,
                                    ok
                                  );
                                }}
                              >
                                Enviar Calificación
                              </button>
                            </Modal.Footer>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </Modal.Body>
          </div>
          {alertFinal && <AlertFinal />}
          {data.data.pedido.Estado !== "finalizado" && !alertFinal && (
            <div>
              {" "}
              {!data.data.pedido.Comentarios_Finales && (
                <Modal.Body>
                  <div className="text-center">
                    ¿Deseas enviar un comentario final a la tienda?
                  </div>
                  <div className="m-3">
                    <textarea
                      className="d-none w-100"
                      id="message"
                      onChange={(e) => {
                        e.preventDefault();
                        setFinalMsg(e.target.value);
                      }}
                    />
                    {finalMsg && (
                      <div className="text-center">
                        Su mensaje será enviado al dar como finalizado el
                        pedido.
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-center">
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
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                {!alertFinal && (
                  <div className="">
                    *Al finalizar se declarará el pedido como recibido y la
                    orden como finalizada.
                  </div>
                )}
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    if (alertFinal) {
                      setNewGroup(data.data.pedido._id);
                    }
                    handleClose();
                  }}
                >
                  Cerrar
                </Button>
                {!alertFinal && (
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      let envio = {
                        Estado: "finalizado",
                      };
                      e.preventDefault();
                      handleEnvio(data.data.pedido._id, envio);
                    }}
                  >
                    Finalizar
                  </button>
                )}
              </Modal.Footer>
            </div>
          )}
        </Modal>
      </div>
    );
  };
  const ModalCalificacion = (data) => {
    const [comentarios, setComentarios] = useState("");
    const [show, setShow] = useState(false);
    const [estrella, setEstrella] = useState(0);
    const [click, setClick] = useState(false);
    const [clickNum, setClickNum] = useState(0);
    const [name, setName] = useState(user.displayName);
    const [alertCalificacion, setAlertCalificacion] = useState(false);
    const [alertId, setAlertId] = useState(null);
    const handleClose = () => {
      setShow(false);
    };
    const handleShow = () => setShow(true);
    const AlertCalificacion = () => {
      return (
        <div
          className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
          role="alert"
        >
          <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
          <h5 className=" m-1 sm:inline text-success align-middle ">
            Se ha enviado la calificación de la tienda
          </h5>
        </div>
      );
    };
    const sAlertCalificacion = (id) => {
      setTimeout(() => {
        handleClose();
      }, 3500);
    };
    const handleEnvioCalificacion = async (id, envio) => {
      await updatePricing(id, envio);
      setAlertCalificacion(true);
      sAlertCalificacion(id);
      setAlertId(id);
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
        {data.data.pedido._id !== alertId && (
          <Button variant="primary" onClick={handleShow}>
            {data.data.titulo}
          </Button>
        )}
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Calificar Tienda</Modal.Title>
          </Modal.Header>
          {alertCalificacion && data.data.pedido._id === alertId && (
            <AlertCalificacion />
          )}
          {!data.data.pedido.Calificacion &&
            data.data.pedido._id !== alertId && (
              <div>
                <Modal.Body className="text-center">
                  <div>
                    <h3>{data.data.tienda}</h3>
                    <div>
                      <div className="stars">
                        <i
                          className="fa-regular fa-2x fa-star star-1 estrella"
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
                          className="fa-regular fa-star fa-2x  star-2 estrella"
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
                          className="fa-regular fa-star fa-2x  star-3 estrella"
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
                          className="fa-regular fa-2x  fa-star star-4 estrella"
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
                          className="fa-regular fa-2x  fa-star star-5 estrella"
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
                      <div className="m-2">
                        Comenta tu opinión de la Tienda:{" "}
                        <div className="d-flex justify-content-center">
                          <textarea
                            className=" m-2 w-100"
                            onChange={(e) => {
                              e.preventDefault();
                              setComentarios(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row justify-content-center mb-3">
                        <input
                          className="m-1"
                          type="checkbox"
                          id="emailCheck"
                          onClick={handleNombre}
                        />
                        Deseo que mi calificación sea anónima.
                      </div>
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
                          handleEnvioCalificacion(data.data.pedido._id, ok);
                        }}
                      >
                        Enviar Calificación
                      </button>
                    </Modal.Footer>
                  </div>
                </Modal.Body>
              </div>
            )}
          {alertCalificacion && data.data.pedido._id === alertId && (
            <ModalFooter>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
            </ModalFooter>
          )}
        </Modal>
      </div>
    );
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
    if (group && group2 && tiendasCotizar && productosOrders) {
      if (group.length === 0) {
        return (
          <div className="m-md-4 m-sm-3 m-2">
            <div>{alertDel && <AlertDelete />}</div>
            <div className="text-center m-3">
              <h3 className="m-md-4 m-sm-3 m-2">
                Actualmente no tienes ningún{" "}
                <span className="admin-dif-color">pedido</span>.
              </h3>
            </div>
          </div>
        );
      }
      if (group.length === 0 && group2) {
        return (
          <div className="m-md-4 m-sm-3 m-2">
            <div>{alertDel && <AlertDelete />}</div>
            <div className="text-center m-3">
              <h3 className="m-md-4 m-sm-3 m-2">
                No hay ningun{" "}
                <span className="admin-dif-color">pedido</span> por este
                número.
              </h3>
            </div>
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
                <div className="accordion-item">
                  <h1
                    className="accordion-header us-header"
                    id={`heading${tes}`}
                  >
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
                      {estado.Estado === "recoger" && <>Para Recoger</>}
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
                    <div className="accordion-body  p-0 p-sm-3 mb-0">
                      {estado.Cotizaciones.map((cotiza, index) => {
                        let registro = getRegistro(cotiza._id);
                        let valorProductos = 0;
                        let valorTotal = 0;
                        cotiza.Pedidos.forEach((producto) => {
                          let item = productosOrders.find(
                            (product) => product._id === producto.Producto
                          );
                          let valor = item.Precio * producto.Cantidad;
                          valorProductos += valor;
                        });
                        let val = 0;
                        let otro = 0;
                        if (cotiza.Valor_Envio) {
                          val = parseInt(cotiza.Valor_Envio);
                        }
                        if (cotiza.Otros_Valores) {
                          otro = parseInt(cotiza.Otros_Valores);
                        }
                        valorTotal = valorProductos + val + otro;
                        let store = tiendasCotizar.find(
                          (item) => item._id === cotiza.Emprendimiento_id
                        );
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
                                  className="accordion-button  acc-us-admin"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#collapseuser${cotiza._id}`}
                                  aria-expanded="true"
                                  aria-controls={`#collapseuser${cotiza._id}`}
                                >
                                  <div className="d-flex flex-column">
                                    <div>
                                      {store.Nombre}
                                      {store.Delete && ". (Tienda Eliminada)."}
                                    </div>

                                    <div className="num-pedido">
                                      Pedido{" "}
                                      <i
                                        className="fa fa-hashtag"
                                        aria-hidden="true"
                                      ></i>
                                      : <b>{registro}</b>
                                    </div>
                                  </div>
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
                                    {!store.Delete && (
                                      <Link
                                        to={`/Emprendimientos/${store.Path}`}
                                        className="btn  btn-success  boton-tienda-carrito"
                                      >
                                        Ir a la Tienda
                                      </Link>
                                    )}
                                    {store.Delete && (
                                      <div>La tienda ha sido Eliminada</div>
                                    )}
                                  </div>
                                  <h6 className="text-center m-2 registro">
                                      Pedido #: {registro}
                                    </h6>
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
                                              let item = productosOrders.find(
                                                (item) =>
                                                  item._id === pedido.Producto
                                              );
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
                                        <div className="comentarios-1">
                                          {cotiza.User_Comentarios}
                                        </div>
                                      </div>
                                    )}
                                    {cotiza.Envio && (
                                      <div>
                                        <h2 className="valor-titulo recoger-titulo ms-0">
                                          Pedido con envio a domicilio.
                                        </h2>
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
                                    {!cotiza.Envio && (
                                      <div>
                                        <h2 className="valor-titulo text-center recoger-titulo">
                                          Pedido para recoger en tienda.
                                        </h2>
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
                                    {cotiza.Otros_Valores > 0 &&
                                      cotiza.Estado !== "creada" && (
                                        <div>
                                          <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                            <h2 className="valor-titulo me-2">
                                              Otros Cobros:{" "}
                                              <span className="valor-value">
                                                {formatterPeso.format(
                                                  cotiza.Otros_Valores
                                                )}
                                              </span>
                                            </h2>
                                          </div>
                                          {cotiza.Justificacion && (
                                            <div className="d-flex flex-column mt-2 mb-2 pricing-data">
                                              <h2 className="valor-titulo me-2">
                                                Justificación de Otros Cobros:{" "}
                                              </h2>
                                              <div className="comentarios-1">
                                                {cotiza.Justificacion}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    {cotiza.Comentarios && (
                                      <div>
                                        {cotiza.Comentarios.length > 1 && (
                                          <div className="mt-2 mb-2 fs-5">
                                            <h2 className="valor-titulo me-2">
                                              Comentarios de la tienda:{" "}
                                            </h2>
                                            <div className="comentarios-1">
                                              {cotiza.Comentarios}
                                            </div>
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
                                            <div className="comentarios-1">
                                              {cotiza.Comentarios_Finales}
                                            </div>
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
                                                    Información {cotiza.Envio && " del Envio"}{!cotiza.Envio && "de la Recogida"}
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
                                                        .Recogida && (
                                                        <h5 className="text-center">
                                                          <span className="d-none d-sm-inline">
                                                            Fecha de Recogida:{" "}
                                                          </span>
                                                          <span className="fs-5 fw-normal">
                                                            {
                                                              cotiza.Info_Envio
                                                                .Recogida
                                                            }
                                                          </span>
                                                        </h5>
                                                      )}
                                                    </div>
                                                    <div>
                                                      {cotiza.Info_Envio
                                                        .Empresa_Envio && (
                                                        <h2 className="valor-titulo me-2">
                                                          Empresa{cotiza.Ciudad_Envio !== store.Ciudad && " de Envio"}{cotiza.Ciudad_Envio === store.Ciudad && " del Domicilio"}:{" "}
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
                                                          Numero{cotiza.Ciudad_Envio !== store.Ciudad && " de Guia"}{cotiza.Ciudad_Envio === store.Ciudad && " del Domicilio"}:{" "}
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
                                                              <div className="comentarios-1">
                                                                {
                                                                  cotiza
                                                                    .Info_Envio
                                                                    .Comentarios_Envio
                                                                }
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div>
                                                    {cotiza.Info_Envio.Comentarios_Recogida && (
                                                      <div>
                                                        {cotiza.Info_Envio.Comentarios_Recogida.length > 1 && (
                                                          <div className="mt-2 mb-2 fs-5 comentarios-1">
                                                            <h5 className="me-2">
                                                              Comentarios de la Recogida:{" "}
                                                            </h5>
                                                            {
                                                              cotiza.Info_Envio.Comentarios_Recogida
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
                                    (cotiza.Estado === "envio" || cotiza.Estado === "recoger" ) &&
                                    !store.Delete && (
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
                                              tiendaEmail: store.Email,
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
                                                        .length <= 0 && (
                                                        <div>
                                                          Aun no hay respuesta
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            {!store.Delete && (
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
                                                      onClick={async (e) => {
                                                        e.preventDefault();
                                                        const problem = {
                                                          User_Problem: newMsg,
                                                        };
                                                        await setUserProblem(
                                                          cotiza._id,
                                                          problem
                                                        );
                                                        let registro;
                                                        registro = getRegistro(
                                                          cotiza._id
                                                        );
                                                        let numReg;
                                                        if (registro) {
                                                          numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`;
                                                        } else {
                                                          numReg = "";
                                                        }
                                                        let mail = {
                                                          Email: store.Email,
                                                          Nombre:
                                                            user.displayName,
                                                          Subject: `${user.displayName} ha enviado un nuevo mensaje del pedido en problema.`,
                                                          Html: `<div style="text-align:center;">
                                                          <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
                                                          <h1>Hola <span style="color:#C1171B;">${store.Nombre}</span></h1>
                                                          <div style="; background-color:#F8F3F3; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #D7705650;">
                                                          <h2><span style="color:#C1171B;">${user.displayName}</span> ha enviado un nuevo mensaje del pedido en problema</h2>
                                                          ${numReg}
                                                          </div>
                                                          <div>El usuario te ha enviado el siguiente mensaje sobre su pedido en problema:<br /><span style="color:#731717;">${newMsg}</span><br /> Ve a los pedidos de tu emprendimiento y podrás contestar al cliente y resolver el problema.</div>
                                                          <div style="margin:10px;margin-top:25px;background-color: #CF1519; padding: 10px; border-radius:10px; display: inline-block;">
                                                          <a href="https://colombia-emprende.vercel.app/admin/mi-emprendimiento/pedidos" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a los Pedidos de Mi Emprendimiento</a>
                                                          </div>
                                                          <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a los pedidos de tu emprendimiento.</div>
                                                          <h3>Gracias por pertenecer a Colombia Emprende</h3>
                                                          </div>`,
                                                          Msj: "El usuario te ha enviado un nuevo mensaje del pedido en problema.",
                                                        };
                                                        try {
                                                          await sendMail(mail);
                                                        } catch (error) {
                                                          console.log(error)
                                                        }
                                                      }}
                                                    >
                                                      Enviar nuevo msg
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {!store.Delete && (
                                          <div className="d-flex flex-row justify-content-center p-2">
                                            <ModalFin
                                              data={{
                                                pedido: cotiza,
                                                tienda: store.Nombre,
                                                titulo: "Pedido Recibido",
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  {estado.Estado === "finalizado" && (
                                    <div className="d-flex flex-row justify-content-center buttons-orders">
                                      {!cotiza.Calificacion &&
                                        !store.Delete && (
                                          <div className="m-2">
                                            <ModalCalificacion
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
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-center admin-titles-cel">Mis Pedidos</h1>
      {group2 && (
        <div className="d-flex flex-lg-row flex-column justify-content-center m-2">
          <h4 className="as-center text-center">
            {!reg && "Buscar "}
            {reg && "Buscando "}por # de Pedido:
          </h4>
          <form className="d-flex flex-row caja-column justify-content-center">
            <input className="m-2" type="text" id="reg" />
            <div className="d-flex flex-row justify-content-center">
              <button
                className="btn btn-primary m-2"
                type="submit"
                onClick={buscar}
              >
                Buscar
              </button>
              <button className="btn btn-danger m-2" onClick={borrar}>
                {!reg && "Borrar"}
                {reg && "Borrar y Ver Todos"}
              </button>
            </div>
          </form>
        </div>
      )}
      {group && alertBusqueda && <AlertBusqueda />}
      {!group && (
        <div className="m-md-4 m-sm-3 m-2">
          <div>{alertDel && <AlertDelete />}</div>
          <div className="text-center m-3">
            <h3 className="m-md-4 m-sm-3 m-2">
              No hay ningun <span className="admin-dif-color">pedido</span>{" "}
              por este número.
            </h3>
          </div>
        </div>
      )}
      {!group && !group2 && (
        <div className="m-md-4 m-sm-3 m-2">
          <div>{alertDel && <AlertDelete />}</div>
          <div className="text-center m-3">
            <h3 className="m-md-4 m-sm-3 m-2">
              Actualmente no tienes ningun{" "}
              <span className="admin-dif-color">pedido</span>.
            </h3>
          </div>
        </div>
      )}
      <CotizacionItems />
    </div>
  );
}
export default MyOrders;
