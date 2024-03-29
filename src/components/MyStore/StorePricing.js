import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
function StorePricing() {
  const {
    readProducts,
    updatePricing,
    userData,
    readStorePricing,
    readUserInfo,
    deletePricing,
    sendMail,
    getRegistro,
  } = useAuth();
  const { userStore } = useMyStore();
  const [w, setW] = useState(window.innerWidth);
  const [start, setStart] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [group, setGroup] = useState(null);
  const [group2, setGroup2] = useState(null);
  const [reg, setReg] = useState("");
  const [productosCotizar, setProductosCotizar] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
  const [startT, setStartT] = useState(false);
  const [required, setRequired] = useState(false);
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
          Se ha enviado la Cotización Al Cliente.
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
      if (reg) {
        document.getElementById("reg").value = reg;
      }
    };
    if (startT) {
      setStartT(false);
      setCargando(false)
      return () => {
        stGroup();
      };
    }
  }, [startT, group, reg]);
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
      let data = res.data;
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
      data = data.reverse();
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
      setGroup2(lista);
      resolveProductsCotizar(listaProductos);
      return;
    });
  };
  const handleNewCotizacion = async (id, usuario, tes) => {
    let valor
    let otrosval
    let justificacion = ""
    let comentario = ""
    if (document.getElementById(`valor-envio-${tes}`)){
      valor = document.getElementById(
        `valor-envio-${tes}`
      ).value
    }
    if (document.getElementById(`otros-valores-${tes}`)){
      otrosval = document.getElementById(
        `otros-valores-${tes}`
      ).value
    }
    if (document.getElementById(`justificacion-${tes}`)){
      justificacion= document.getElementById(
        `justificacion-${tes}`
      ).value
    }
    if (document.getElementById(`comentarios-${tes}`)){
      comentario = document.getElementById(
        `comentarios-${tes}`
      ).value
    }
    let newCotizacion = {
      Valor_Envio: valor,
      Otros_Valores: otrosval,
      Justificacion:justificacion,
      Comentarios: comentario,
      Estado: "cotizacion",
    };
    await updatePricing(id, newCotizacion);
    setAlert(true);
    sAlert();
    let lista1;
    let grupo = group2;
    let num = null;
    let co;
    group2.map((estado, eindex) => {
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
      co.Valor_Envio = newCotizacion.Valor_Envio;
      co.Otros_Valores = newCotizacion.Otros_Valores;
      co.Justificacion = newCotizacion.Justificacion;
      co.Comentarios = newCotizacion.Comentarios;
      co.Estado = "cotizacion";
      grupo[num].Cotizaciones.push(co);
    } else {
      co.Valor_Envio = newCotizacion.Valor_Envio;
      co.Otros_Valores = newCotizacion.Otros_Valores;
      co.Justificacion = newCotizacion.Justificacion;
      co.Comentarios = newCotizacion.Comentarios;
      co.Estado = "cotizacion";
      let c = { Estado: "cotizacion", Cotizaciones: [co] };
      grupo.push(c);
    }
    setGroup(grupo);
    setGroup2(grupo);
    let registro;
    registro = getRegistro(id);
    let numReg;
    if (registro) {
      numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`;
    } else {
      numReg = "";
    }
    let mail = {
      Email: usuario.Email,
      Nombre: userStore.Nombre,
      Subject: `${userStore.Nombre} ha enviado la cotización solicitada.`,
      Html: `<div style="text-align:center;">
      <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
      <h1>Hola <span style="color:#114aa5;">${usuario.Nombre}</span></h1>
      <div style="; background-color:#EFF6FD; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #114aa550;">
      <h2><span style="color:#114aa5;">${userStore.Nombre}</span> te ha enviado la cotización solicitada</h2>
      ${numReg}
      </div>
      <div>Tienes una nueva cotización enviada a tu usuario.<br /> Ve a tus cotizaciones y podrás revisar todos los detalles de la cotización que has solicitado previamente.</div>
      <div style="margin:10px;margin-top:25px;background-color: #1D67DF; padding: 10px; border-radius:10px; display: inline-block;">
      <a href="https://colombia-emprende.vercel.app/admin/mis-cotizaciones" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a Mis Cotizaciones</a>
      </div>
      <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a tus cotizaciones.</div>
      <h3>Gracias por pertenecer a Colombia Emprende</h3>
      </div>`,

      Msj: "El emprendimiento te ha enviado la cotización solicitada.",
    };
    try {
      await sendMail(mail);
    } catch (error) {
      console.log(error)
    }
    setStartT(true);
  };
  const handleRechazar = async (id, usuario) => {
    const pedido = { Estado: "tienda-rechazado", Store_Delete: true };
    await updatePricing(id, pedido);
    setAlertDel(true);
    sAlertDel();
    let lista1;
    let grupo = group2;
    group2.map((estado, eindex) => {
      lista1 = estado.Cotizaciones;
      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === id) {
          lista1.splice(index, 1);
          grupo[eindex].Cotizaciones.splice(index, 1);
          if (grupo[eindex].Cotizaciones.length === 0) {
            grupo.splice(eindex, 1);
          }
          setGroup(grupo);
          setGroup2(grupo);
          return false;
        } else {
          return false;
        }
      });
      return false;
    });
    let registro;
    registro = getRegistro(id);
    let numReg;
    if (registro) {
      numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`;
    } else {
      numReg = "";
    }
    let mail = {
      Email: usuario.Email,
      Nombre: userStore.Nombre,
      Subject: `${userStore.Nombre} ha rechazado la cotización solicitada.`,
      Html: `<div style="text-align:center;">
      <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
      <h1>Hola <span style="color:#C1171B;">${usuario.Nombre}</span></h1>
      <div style="; background-color:#F8F3F3; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #D7705650;">
      <h2><span style="color:#C1171B;">${userStore.Nombre}</span> ha rechazado la cotización enviada</h2>
      ${numReg}
      </div>
      <div>El emprendimiento ha rechazado la cotización que habias solicitado.<br /> Ve a las cotizaciones de tu emprendimiento y podrás ver los detalles de esta cotización y eliminarla.</div>
      <div style="margin:10px;margin-top:25px;background-color: #CF1519; padding: 10px; border-radius:10px; display: inline-block;">
      <a href="https://colombia-emprende.vercel.app/admin/mis-cotizaciones" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a Mis Cotizaciones</a>
      </div>
      <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a tus cotizaciones.</div>
      <h3>Gracias por pertenecer a Colombia Emprende</h3>
      </div>`,
      Msj: "El emprendimiento ha rechazado la cotización solicitada.",
    };
    try {
      await sendMail(mail);
    } catch (error) {
      console.log(error)
    }
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
    let grupo = group2;
    group2.map((estado, eindex) => {
      lista1 = estado.Cotizaciones;
      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === id) {
          lista1.splice(index, 1);
          grupo[eindex].Cotizaciones.splice(index, 1);
          if (grupo[eindex].Cotizaciones.length === 0) {
            grupo.splice(eindex, 1);
          }
          setGroup(grupo);
          setGroup2(grupo);
          return false;
        } else {
          return false;
        }
      });
      return false;
    });
  };
  const handleOtrosCobros = (tes) => {
    document.getElementById(`otros-cobros-${tes}`).classList.add("d-none");
    setRequired(true);
  };
  const handleNoOtrosCobros = (tes) => {
    document.getElementById(`otros-cobros-${tes}`).classList.remove("d-none");
    setRequired(false);
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
          Busqueda de cotización # {reg} exitosa
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
  const CotizacionItems = () => {
    if (group && group2 && usuarios && productosCotizar && userStore) {
      if (group.length === 0) {
        return (
          <div className="m-md-4 m-sm-3 m-2">
            <div>
              {alertDel && <AlertDelete />}
              {alert && <Alert />}
            </div>
            <div className="text-center m-3">
              <h3 className="m-md-4 m-sm-3 m-2 admin-no-item">
                Actualmente tu emprendimiento{" "}
                <span className="admin-dif-color">{userStore.Nombre}</span> no
                tiene ninguna cotización.
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
                No hay ninguna{" "}
                <span className="admin-dif-color">cotización</span> por este
                número.
              </h3>
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
                    <div className="accordion-body  p-0 p-sm-3 mb-0">
                      {estado.Cotizaciones.map((cotiza, index) => {
                        let registro = getRegistro(cotiza._id);
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
                          let val = 0
                          let otro = 0
                          if (cotiza.Valor_Envio){
                            val=parseInt(cotiza.Valor_Envio)
                          }
                          if (cotiza.Otros_Valores){
                            otro=parseInt(cotiza.Otros_Valores) 
                          }
                          valorTotal =
                            valorProductos +
                            val +
                            otro;
                        }
                        let usuario = usuarios.find(
                          (item) => item.Uid === cotiza.User_id
                        );
                        if (!usuario) {
                          usuario = {
                            Nombre: "Usuario Eliminado",
                            Delete: true,
                          };
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
                                  <div className="d-flex flex-column">
                                    <div>Usuario: {usuario.Nombre}</div>
                                    <div className="num-pedido-1">
                                      Cotización{" "}
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
                                <div className="accordion-body">
                                <h6 className="text-center m-2 registro">
                                      Cotización #: {registro}
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
                                          <div className="comentarios-1">
                                            {cotiza.User_Comentarios}
                                          </div>
                                        </div>
                                      )}
                                      {cotiza.Envio && (
                                      <div>
                                        <h2 className="valor-titulo recoger-titulo ms-0 text-center">
                                          Cotización con envio a domicilio.
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
                                          Cotización para recoger en tienda.
                                        </h2>
                                      </div>
                                    )}
                                    <form>

                                    </form>
                                    <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                      {estado.Estado !== "cancelado" &&
                                        cotiza.Envio && (
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
                                        !usuario.Delete &&
                                        cotiza.Envio && (
                                          <input
                                            className="admin-num-input"
                                            type="number"
                                            id={`valor-envio-${tes}`}
                                          />
                                        )}
                                    </div>
                                    {cotiza.Otros_Valores > 0 &&
                                      cotiza.Estado !== "creada" &&
                                      (
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
                                          {cotiza.Justificacion && <div className="d-flex flex-column mt-2 mb-2 pricing-data">
                                            <h2 className="valor-titulo me-2">
                                              Justificación de Otros Cobros:{" "}
                                              
                                            </h2>
                                            <div className="comentarios-1">
                                            {cotiza.Justificacion}
                                          </div>
                                          </div>}
                                        </div>
                                      )}
                                    {cotiza.Estado === "creada" &&
                                      !usuario.Delete && (
                                        <div>
                                          <div
                                            className="d-flex justify-content-center"
                                            id={`otros-cobros-${tes}`}
                                          >
                                            <button
                                              className="btn btn-primary"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleOtrosCobros(tes);
                                              }}
                                            >
                                              Agregar Otros Cobros
                                            </button>
                                          </div>

                                          {required && <div
                                            className="m-2 otros-cobros mb-4 me-2 me-sm-4 me-md-5"
                                            id={`otros-cobros-caja-${tes}`}
                                          >
                                            <p className="caja-otros-cobros">
                                              <i
                                                className="fa-solid fa-xmark fa-2x"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  handleNoOtrosCobros(tes);
                                                }}
                                              ></i>
                                            </p>

                                            <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                              <h5 className="valor-titulo me-2">
                                                Otros Cobros:{" "}
                                              </h5>
                                              <input
                                                type="number"
                                                className="admin-num-input"
                                                id={`otros-valores-${tes}`}
                                              />
                                            </div>
                                            <div className="a">
                                              <h5 className="valor-titulo me-2">
                                                Justificación de Otros Cobros:{" "}
                                              </h5>
                                              <textarea
                                                className="form-control"
                                                type="text"
                                                id={`justificacion-${tes}`}
                                              />
                                            </div>
                                          </div>}
                                        </div>
                                      )}
                                    {cotiza.Comentarios && (
                                      <div>
                                        {cotiza.Comentarios.length > 1 && (
                                          <div className="mt-2 mb-2 fs-5">
                                            <h2 className="valor-titulo me-2">
                                              Tus Comentarios:{" "}
                                            </h2>
                                            <div className="comentarios-1">
                                              {cotiza.Comentarios}
                                            </div>
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
                                        <div className="mt-2 mb-2 pricing-data me-2 me-sm-3 me-md-4">
                                          <h2 className="valor-titulo me-2">
                                            Tus Comentarios:{" "}
                                          </h2>
                                          <textarea
                                            className="form-control "
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
                                            className="btn btn-primary m-1 "
                                            onClick={(e) => {
                                              
                                              e.preventDefault();
                                              handleNewCotizacion(
                                                cotiza._id,
                                                
                                                usuario, tes
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
                                                usuario
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
      <h1 className="text-center admin-titles-cel">Cotizaciones</h1>
      {group2 && (
        <div className="d-flex flex-lg-row flex-column justify-content-center m-2  caja-buscar">
          <h4 className="as-center text-center">
            {!reg && "Buscar "}
            {reg && "Buscando "}por # de Cotización:
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
              No hay ninguna <span className="admin-dif-color">cotización</span>{" "}
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
              Actualmente no tienes ninguna{" "}
              <span className="admin-dif-color">cotización</span>.
            </h3>
          </div>
        </div>
      )}
      <CotizacionItems />
    </div>
  );
}
export default StorePricing;
