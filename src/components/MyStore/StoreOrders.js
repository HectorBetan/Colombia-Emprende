import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Button from "react-bootstrap/Button";
function StoreOrders() {
  const {
    readProducts,
    createEnvio,
    userData,
    updatePricing,
    readStoreOrders,
    readUserInfo,
    setStoreProblem,
    sendMail,
    getRegistro,
    createRecoger,
  } = useAuth();
  const {userStore} = useMyStore();
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
  const [productosCotizar, setProductosCotizar] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
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
  const [startT, setStartT] = useState(false);
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
  const [alert, setAlert] = useState(false);
  const sAlert = () => {
    window.scroll(0, 0);
    setTimeout(() => {
      setAlert(false);
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
          Se han añadido datos de envio y declarado como enviado.
        </h5>
      </div>
    );
  };
  const groupBy = (keys) => (array) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map((key) => obj[key]).join("-");
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
  const resolveProductsOrders = async (products) => {
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
    await readStoreOrders(userData.Emprendimiento_id).then((res) => {
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
      data = data.reverse()
      let objeto = group(data);
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
      setGroup2(lista);
      resolveProductsOrders(listaProductos);
      return;
    });
  };
  const handleEmpresaName = (e, tes) =>{
    
    if (e.target.checked) {
      document.getElementById(`empresa-envio-${tes}`).required = false
    }
    if (!e.target.checked) {
      document.getElementById(`empresa-envio-${tes}`).required = true
    }
  }
  const handleNewEnvio = async (cotiza, usuario, tes) => {
    let fecha
    let empresa =""
    let guia =""
    let comentario =""
    let hora
    let hora1
    if (document.getElementById(`fecha-envio-${tes}`)){
      fecha = document.getElementById(
        `fecha-envio-${tes}`
      ).value
    }
    if (document.getElementById(`empresa-envio-${tes}`)){
      empresa = document.getElementById(
        `empresa-envio-${tes}`
      ).value
    }
    if (document.getElementById(`check-${tes}`).checked) {
      if (empresa){
        empresa = empresa +" - "+userStore.Nombre
      } else{
        empresa = userStore.Nombre
      }
      
    }
    if (document.getElementById(`numero-guia-${tes}`)){
      guia= document.getElementById(
        `numero-guia-${tes}`
      ).value
    }
    if (document.getElementById(`comentarios-envio-${tes}`)){
      comentario = document.getElementById(
        `comentarios-envio-${tes}`
      ).value
    }
    if (document.getElementById(`hora-${tes}`)){
      hora = document.getElementById(
        `hora-${tes}`
      ).value
    }
    if (document.getElementById(`hora-1-${tes}`)){
      hora1 = document.getElementById(
        `hora-1-${tes}`
      ).value
    }
    let mes = fecha.toString().slice(5,7)
    let dia = fecha.toString().slice(8)
    let meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    let txt = ""
    let txt1 =""
    let txt2 =""
    let txt3 =""
    if (fecha || hora){
      txt = "Puedes recoger tu pedido"
    }
    if(fecha){
      txt1 = ` a partir del ${dia} de ${meses[mes-1]}`
    }
    if (hora){
      let h = parseInt(hora.slice(0,2))
      if (h > 12){
        h = h-12
        hora = h.toString() + hora.slice(2) + " p.m."
      }
      else {
        hora = hora + " a.m."
      }
      txt2 = ` en horario desde las ${hora}`
      if (hora1){
        let h1 = parseInt(hora1.slice(0,2))
      if (h1 > 12){
        h1 = h1-12
        hora1 = h1.toString() + hora1.slice(2) + " p.m."
      }
      else {
        hora1 = hora1 + " a.m."
      }
        txt3 = ` hasta las ${hora1}`
      }
    }
    let recogida
    recogida = txt+txt1+txt2+txt3
    if (!recogida){
      recogida= "Puedes recoger tu pedido cuando quieras"
    }
    let envio
    let esta
    if (cotiza.Envio){
      esta = "envio"
      envio = {
        Fecha_Envio:fecha,
        Empresa_Envio:empresa,
        Numero_Guia:guia,
        Comentarios_Envio:comentario,
      };
      await createEnvio(cotiza._id, envio)
      .catch((error) =>{
        console.log(error)
      })
      ;
    } else {
      esta = "recoger"
      envio = {
        Recogida:recogida,
        Comentarios_Recogida:comentario,
      };
      await createRecoger(cotiza._id, envio)
      .catch((error) =>{
        console.log(error)
      })
    }
    setAlert(true);
    sAlert();

    let grupo = group2;
    let num = null;
    let co;
    group2.map((estado, eindex) => {
      estado.Cotizaciones.map((cotizacion, index) => {
        if (cotizacion._id === cotiza._id) {
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
      if (estado.Estado === "envio" || estado.Estado === "recoger") {
        num = ei;
      }
      return false;
    });
    if (num !== null) {
      co.Estado = esta;
      co.Info_Envio = envio;
      grupo[num].Cotizaciones.push(co);
    } else {
      co.Estado = esta;
      co.Info_Envio = envio;
      let c = { Estado: esta, Cotizaciones: [co] };
      grupo.push(c);
    }
    setGroup(grupo);
    setGroup2(grupo);
    let registro;
                                                        registro = getRegistro(cotiza._id);
                                                        let numReg
                                                        if(registro){
                                                          numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`
                                                        } else {
                                                          numReg = ""
                                                        }
    let mail = {
      Email: usuario.Email,
      Nombre: userStore.Nombre,
      Subject: `${userStore.Nombre} te ha enviado el pedido solicitado.`,
      Html: `<div style="text-align:center;">
      <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
      <h1>Hola <span style="color:#114aa5;">${usuario.Nombre}</span></h1>
      <div style="; background-color:#EFF6FD; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #114aa550;">
      <h2><span style="color:#114aa5;">${userStore.Nombre}</span> te ha enviado el pedido que habias solicitado</h2>
      ${numReg}
      </div>
      <div>La tienda ha realizado el envío, el estado de tu pedido cambio a: en envío.<br /> Ve a tus pedidos y podrás confirmar la llegada de tu pedido o solucionar problemas.</div>
      <div style="margin:10px;margin-top:25px;background-color: #1D67DF; padding: 10px; border-radius:10px; display: inline-block;">
      <a href="https://colombia-emprende.vercel.app/admin/mis-pedidos" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a Mis Pedidos</a>
      </div>
      <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a tus pedidos.</div>
      <h3>Gracias por pertenecer a Colombia Emprende</h3>
      </div>`,
      Msj: "El emprendimiento te ha enviado el pedido que habias solicitado."
    }
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
    let estado = { Store_Delete: true };
    await updatePricing(id, estado);
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
    if (group && group2 && usuarios && productosCotizar) {
      if (group.length === 0) {
        return (
          <div>
            <div className="m-md-4 m-sm-3 m-2">
              {alertDel && <AlertDelete />}
              {alert && <Alert />}
            </div>
            <div className="text-center m-3">
              <h3 className="m-md-4 m-sm-3 m-2 admin-no-item">Actualmente tu emprendimiento <span className="admin-dif-color">{userStore.Nombre}</span> no tiene ningun pedido.</h3>
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
                    <div className="accordion-body p-0 p-sm-3 mb-0">
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
                        if (cotiza.Pago === true) {
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
                        if (!usuario){
                          usuario = {
                            Nombre: "Usuario Eliminado",
                            Delete: true
                          }
                        }
                        let nuevoMensaje;
                        if (cotiza.Store_Problem.length <= 0) {
                          nuevoMensaje = "Responder el Mensaje";
                        } else {
                          nuevoMensaje = "Agregar Nuevo Mensaje";
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
                                  <div>
                                    Usuario: {usuario.Nombre}
                                  </div>
                                    
                                    <div className="num-pedido-1">Pedido <i className="fa fa-hashtag" aria-hidden="true"></i>: <b>{registro}</b></div>
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
                                <h6 className="text-center m-2 registro">
                                      Pedido #: {registro}
                                    </h6>
                                  <div
                                    className="accordion mt-3 mb-3"
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
                                              let item = productosCotizar.find(
                                                (item) =>
                                                  item._id === pedido.Producto
                                              );
                                              if (item.Delete) {
                                                item.Nombre =
                                                  item.Nombre +
                                                  " (Producto Eliminado)";
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
                                          <div className="comentarios-1">
                                          {cotiza.Comentarios_Finales}
                                            </div>
                                          
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {cotiza.Estado === "pagado" &&
                                    cotiza.Pago === true &&
                                    !usuario.Delete && (
                                      <form onSubmit={(e) => {
                                            
                                        e.preventDefault();
                                        handleNewEnvio(cotiza, usuario, tes);
                                      }}>
                                      <div className="comentarios-1 m-2 ms-1 me-1">
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo1 me-2">
                                            Fecha {cotiza.Envio&&"de Envio"}{!cotiza.Envio&&"de Recogida"}:{" "}
                                          </h2>
                                          <input className="fechainput"
                                            type="date"
                                            id={`fecha-envio-${tes}`}
                                          />
                                        </div>
                                        {!cotiza.Envio && <div className="d-flex flex-column mt-2 mb-2 pricing-data">
                                        <h2 className="valor-titulo1 me-2">
                                            Horario de Recogida:
                                          </h2>
                                        <div className="d-flex flex-row mt-2 mb-2 pricing-data fs-4">
                                        De: <input type="time" className="ms-2 me-2" 
                                          id={`hora-${tes}`}/>  
                                        
                                        A: <input type="time" className="ms-2 me-2" 
                                          id={`hora-1-${tes}`}/>  
                                        </div>
                                        </div>
                                        
                                          }
                                        {cotiza.Envio && <div className="d-flex flex-row mt-2 pricing-data">
                                          <h2 className="valor-titulo1 me-2">
                                            Empresa{cotiza.Ciudad_Envio !== userStore.Ciudad && " de Envio"}{cotiza.Ciudad_Envio === userStore.Ciudad && " del Domicilio"}:{" "}
                                          </h2>
                                          <input
                                            type="text"
                                            id={`empresa-envio-${tes}`}
                                           required={true} />
                                        </div>}
                                        {cotiza.Ciudad_Envio === userStore.Ciudad && <div>
                                            <p className="d-flex flex-row justify-content-start m-2 mb-4 fw-500">
                                            <input
                                              className="form-check-input me-1"
                                              type="checkbox"
                                              id={`check-${tes}`}
                                              onChange={(e)=>{
                                                handleEmpresaName(e, tes)
                                              }
                                              }
                                            />
                                            <span className="">
                                              Domicilio <span className="no-wor">a cargo </span>de Mi Emprendimiento
                                            </span>
                                          </p>
                                          </div>}
                                        {cotiza.Envio&&"Envio" && <div className="d-flex flex-row mt-2 mb-2 pricing-data">
                                          <h2 className="valor-titulo1 me-2">
                                            Numero{cotiza.Ciudad_Envio !== userStore.Ciudad && " de Guia"}{cotiza.Ciudad_Envio === userStore.Ciudad && " del Domicilio"}:{" "}
                                          </h2>
                                          <input className="admin-num-input"
                                            type="number"
                                            id={`numero-guia-${tes}`}
                                          required />
                                        </div>}
                                        <div className="mt-2 mb-2 pricing-data text-center text-sm-start">
                                          <h2 className="valor-titulo1 me-2">
                                            Comentarios {cotiza.Envio&&"del Envio"}{!cotiza.Envio&&"de la Recogida"}:{" "}
                                          </h2>
                                          <textarea
                                            className="w-100"
                                            type="text"
                                            id={`comentarios-envio-${tes}`}
                                          />
                                        </div>
                                        <div className="d-flex flex-row justify-content-center m-3">
                                          <button
                                            className="btn btn-primary"
                                            type="submit"
                                            
                                          >
                                            {cotiza.Envio&&"Envio Realizado"}{!cotiza.Envio&&"Enviar Información de Recogida"}
                                     
                                          </button>
                                        </div>
                                      </div>
                                      </form>
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
                                                className="accordion-header info-envio-header"
                                                id={`headingEnvio${cotiza._id}`}
                                              >
                                                <button
                                                  className="accordion-button collapsed  acc-title-products-admin"
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
                                                    {cotiza.Info_Envio.Fecha_Envio && (
                                                      <h2 className="valor-titulo me-2">
                                                        Fecha de Envio:{" "}
                                                        <span className="valor-value">
                                                          {
                                                            cotiza.Info_Envio.Fecha_Envio
                                                          }
                                                        </span>
                                                      </h2>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio.Recogida && (
                                                      <h5 className="text-center">
                                                        <span className="d-none d-sm-inline">Fecha de Recogida:{" "}</span>
                                                        <span className="fs-5 fw-normal">
                                                          {
                                                            cotiza.Info_Envio.Recogida
                                                          }
                                                        </span>
                                                      </h5>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio.Empresa_Envio && (
                                                      <h2 className="valor-titulo me-2">
                                                        Empresa de Envio:{" "}
                                                        <span className="valor-value">
                                                          {
                                                            cotiza.Info_Envio.Empresa_Envio
                                                          }
                                                        </span>
                                                      </h2>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio.Numero_Guia && (
                                                      <h2 className="valor-titulo me-2">
                                                        Número de guia:{" "}
                                                        <span className="valor-value">
                                                          {
                                                            cotiza.Info_Envio.Numero_Guia
                                                          }
                                                        </span>
                                                      </h2>
                                                    )}
                                                  </div>
                                                  <div>
                                                    {cotiza.Info_Envio.Comentarios_Envio && (
                                                      <div>
                                                        {cotiza.Info_Envio.Comentarios_Envio.length > 1 && (
                                                          <div className="mt-2 mb-2 fs-5">
                                                            <h2 className="valor-titulo me-2">
                                                              Comentarios del
                                                              Envio:{" "}
                                                            </h2>
                                                            {
                                                              cotiza.Info_Envio.Comentarios_Envio
                                                            }
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
                                    
                                  {cotiza.Pago === true &&
                                    cotiza.Estado === "problema" && (
                                      <div
                                        className="accordion mb-3"
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
                                            {!usuario.Delete && (
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
                                                      onClick={async (e) => {
                                                        e.preventDefault()
                                                        const problem = {
                                                          User_Problem: newMsg,
                                                        };
                                                        await setStoreProblem(
                                                          cotiza._id,
                                                          problem
                                                        );
                                                        let registro;
                                                        registro = getRegistro(cotiza._id);
                                                        let numReg
                                                        if(registro){
                                                          numReg = `<div style="margin-bottom:15px;"><span style="font-size:20px; margin-right:5px;">Cotización #:</span><span style="font-size:21px; font-weight:600; color:#114aa5">${registro}</span></div>`
                                                        } else {
                                                          numReg = ""
                                                        }
                                                        let mail = {
                                                          Email: usuario.Email,
                                                          Nombre: userStore.Nombre,
                                                          Subject: `${userStore.Nombre} ha enviado un nuevo mensaje de tu pedido en problema.`,
                                                          Html: `<div style="text-align:center;">
                                                          <img src="https://firebasestorage.googleapis.com/v0/b/colombia-emprende-app.appspot.com/o/assets%2Flogo-colombia-emprende.png?alt=media&token=d74058e0-1418-41a6-8e72-d384c48c8cd0" alt="Logo Colombia Emprende" style="width:300px;" />
                                                          <h1>Hola <span style="color:#C1171B;">${usuario.Nombre}</span></h1>
                                                          <div style="; background-color:#F8F3F3; border-radius:10px; display: inline-block; padding: 0px 15px; margin-bottom:10px; border-style: solid; border-color: #D7705650;">
                                                          <h2><span style="color:#C1171B;">${userStore.Nombre}</span> ha enviado un nuevo mensaje de tu pedido en problema</h2>
                                                          ${numReg}
                                                          </div>
                                                          <div>${userStore.Nombre} te ha enviado el siguiente mensaje sobre tu pedido en problema:<br /><span style="color:#731717;">${newMsg}</span><br /> Ve a tus pedidos para enviar mas mensajes a la tienda y resolver el problema.</div>
                                                          <div style="margin:10px;margin-top:25px;background-color: #CF1519; padding: 10px; border-radius:10px; display: inline-block;">
                                                          <a href="https://colombia-emprende.vercel.app/admin/mis-pedidos" style="color: #fff; font-size:15px; font-weight:500; text-decoration:none;">Ir a Mis Pedidos</a>
                                                          </div>
                                                          <div style="font-size:11px; font-weigth:300;">Si sigues este botón debes tener la sesión iniciada, de lo contrario ve a Colombia Emprende inicia sesión y ve a tus pedidos.</div>
                                                          <h3>Gracias por pertenecer a Colombia Emprende</h3>
                                                          </div>`,
                                                          Msj: "El emprendimiento ha enviado un nuevo mensaje de tu pedido en problema."
                                                        }
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
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-center admin-titles-cel">Pedidos</h1>
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
export default StoreOrders;