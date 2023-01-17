import React from "react";
import {useState, useEffect} from 'react';
import { useAuth } from "../../context/AuthContext";
function StorePricing() {
  const { readProducts, updatePricing, userData,
    readStorePricing, readUserInfo, deletePricing } = useAuth();
    const [w, setW] = useState(window.innerWidth);
    const [start, setStart] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [group, setGroup] = useState(null);
    const [productosCotizar, setProductosCotizar] = useState(null);
    const [usuarios, setUsuarios] = useState(null);
    const handleResize = () => {
      setW(window.innerWidth);
    };
    useEffect(() => {
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
    const groupBy = keys => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map(key => obj[key]).join('-');
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })
    const resolveProductsCotizar = async (products) => {
      await readProducts(products).then(res => {
        console.log("resData",res.data);
        setProductosCotizar(res.data);
      })
      setCargando(false);
    }
    const resolveUsers = async (tienda) => {
        console.log(tienda)
        console.log("tienda")
        await readUserInfo(tienda).then(res => {
          setUsuarios(res.data);
          
        })
        
      }
    const resolveCotizacion = async () => {
      await readStorePricing(userData.Emprendimiento_id).then(res => {
        const data = res.data;
        console.log(data);
        let listaUsuarios = [];
        let listaProductos = [];
        data.forEach(element => {
          listaUsuarios.push(element.User_id);
          for (let i=0; i < element.Pedidos.length; i++){
            listaProductos.push(element.Pedidos[i].Producto);
          }
        })
        let result = listaUsuarios.filter((item,index)=>{
          return listaUsuarios.indexOf(item) === index;
        })
        
        resolveUsers(result);
        const group = groupBy(['Estado']);
          let lista = [];
          let objeto = group(data);
          
          console.log("object")
          console.log(objeto)
          let creadas
          let rechazadas
          let enviadas
          for (let key in objeto){
            if (key !== "tienda-rechazado"){
              if (key === 'creada'){
                creadas = {Estado: key, Cotizaciones:objeto[key]}
              }
              if (key === 'rechazado'){
                rechazadas = {Estado: key, Cotizaciones:objeto[key]}
              }
              if (key === 'cotizacion'){
                enviadas = {Estado: key, Cotizaciones:objeto[key]}
              }
              
            }
          }
          if (creadas){
            lista.push(creadas);
          }
          if (rechazadas){
            lista.push(rechazadas);
          }
          if (enviadas){
            lista.push(enviadas);
          }
        setGroup(lista);
        console.log(listaProductos)
        resolveProductsCotizar(listaProductos);
        return
      });
      
    }
    const handleNewCotizacion = async (id, cotizacion) => {
      await updatePricing(id, cotizacion).then(res => {
        console.log("res",res);
      })
      
    }
    const handleRechazar = async (id) => {
      const pedido = {Estado: "tienda-rechazado"}
      await updatePricing(id, pedido)
    }

      if (start && userData){
        
        resolveCotizacion();
        setStart(false);
      }
      const handleDelete = async (id) => {
        await deletePricing(id)
      }  
      
    const CotizacionItems = () => {
      if(group && usuarios && productosCotizar){
        console.log(group);
        return(
          <div>
            {group.map((estado, tes) => {
          console.log(tes + " hola "+ estado)
          console.log(estado)
          
          return (<div key={tes}  className="accordion" id={`accordion${tes}`}>
            <div className="accordion-item">
              <h1 className="accordion-header" id={`heading${tes}`}>
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${tes}`} aria-expanded="true" aria-controls={`#collapse${tes}`}>
                
                
                  {estado.Estado === "creada" && <>Pendientes</>}
                  {estado.Estado === "cotizacion" && <>Enviadas</>}
                  {estado.Estado === "rechazado" && <>Rechazadas por Usuario</>}
                  </button>
                  </h1>
                  <div className="accordion-collapse collapse show" id={`collapse${tes}`} aria-labelledby={`heading${tes}`} data-bs-parent={`#accordion${tes}`}>
                    <div className="accordion-body">

                    
                      {estado.Cotizaciones.map((cotiza,index)=>{
                        console.log("cotiza")
                        console.log(cotiza)
                        
                        let valorProductos = 0;
                        let valorTotal = 0;
                        cotiza.Pedidos.forEach((producto) => {
                          let item = productosCotizar.find(product => product._id === producto.Producto);
                          console.log("item",item);
                          let valor = item.Precio * producto.Cantidad;
                          valorProductos += valor;
                        })
                        if (cotiza.Estado !== "creada"){
                          valorTotal = valorProductos + cotiza.Valor_Envio + cotiza.Otros_Valores
                        }
                        let usuario = usuarios.find(item => item.Uid === cotiza.User_id);
                        return(
                        <div  className="accordion" id={`accordionuser${cotiza._id}`} key={cotiza._id}>
                          <div className="accordion-item">

                          
                          
                            <h2 className="accordion-header" id={`headinguser${cotiza._id}`}>
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseuser${cotiza._id}`} aria-expanded="true" aria-controls={`#collapseuser${cotiza._id}`}>
                                Usuario: {usuario.Nombre}
                              </button>
                            </h2>
                            <div className="accordion-collapse collapse show" id={`collapseuser${cotiza._id}`} aria-labelledby={`headinguser${cotiza._id}`} data-bs-parent={`#accordionuser${cotiza._id}`}>
                              <div className="accordion-body">
                                <div className="accordion" id={`accordionproducts${cotiza._id}`}>
                                  <div className="accordion-item">
                                    <h3 className="accordion-header" id={`headingproducts${cotiza._id}`}>
                                      <button  className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseproducts${cotiza._id}`} aria-expanded="true" aria-controls={`#collapseproducts${cotiza._id}`}>
                                        Productos
                                      </button>
                                    </h3>
                                    <div className="accordion-collapse collapse show" id={`collapseproducts${cotiza._id}`} aria-labelledby={`headingproducts${cotiza._id}`} data-bs-parent={`#accordionproducts${cotiza._id}`}>
                                      <div className="accordion-body">
                                            {cotiza.Pedidos.map((pedido,tkey)=>{
                                          console.log("pedido",pedido);
                                          let item = productosCotizar.find(item => item._id === pedido.Producto);

                                          /*let  item = productos.find(product => product._id === producto.Producto_id);*/
                    let total = item.Precio * pedido.Cantidad;
                    let cant
                    if (w < 400){
                      cant = "Cant: "
                    } else{
                      cant = "Cantidad: "
                    }
                    return(
                    <div key={tkey} className="">
                      <hr className="mb-xl-4 mb-0" />
                      <div  className="d-block d-lg-flex flex-row m-0 m-md-2 caja-datos-carrito">
                        <div className="d-flex caja1-carrito">
                          <h5  className="caja-40 m-0 prod-cant">{(w <= 991 && w > 680) && <div>Producto: </div>}
                          {(w <= 680 && w >399) && <span>Producto: </span>}{item.Nombre}</h5>
                          <div className="caja-20">
                            {(w <= 991 && w > 680) && <h5>Cantidad: </h5>}
                            
                              <h5 className="prod-car">{ w <= 680  && <span>{cant}</span>}{pedido.Cantidad}</h5>
                              

                          </div>
                        </div>
                        
                        <div className="d-flex caja2-carrito">
                          <div className="d-flex flex-row caja-213 prod-cel-box">
                          <h6  className="caja-50 prod-cant-end prod-cel-res">{w <= 991 && <div>Precio: </div>}{formatterPeso.format(item.Precio)}</h6>
                          <h6  className="caja-50 prod-cant-end prod-cel-res">{w <= 991 && <div>Total: </div>}{formatterPeso.format(total)}</h6>
                          </div>
                          
                        </div>
                        
                      </div>
                      
                    </div>
                  )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                  
                                </div>
                                <div className="m-md-3 m-1 w-100">
                                <div className="d-flex flex-row mt-2 mb-2 pricing-data"><h2 className="valor-titulo mt-2 mb-2">Valor Productos: <span  className="valor-value">{formatterPeso.format(valorProductos)}</span></h2></div>
                                  {cotiza.User_Comentarios.length > 1 && <div className="fs-5  mt-2 mb-2"><h2 className="valor-titulo">Comentarios del Cliente: </h2>{cotiza.User_Comentarios}</div>}
                                  <div className="d-flex flex-row mt-2 mb-2 pricing-data"><h2 className="valor-titulo me-2">Valor Envio: {estado.Estado !== "creada" &&<span className="valor-value">{formatterPeso.format(cotiza.Valor_Envio)}</span>}</h2>
                                  {estado.Estado === "creada" && <input type="number" id={`valor-envio-${tes}`} />}</div>
                                  {cotiza.Otros_Valores > 0 && cotiza.Estado !== "creada" && <div className="d-flex flex-row mt-2 mb-2 pricing-data"><h2 className="valor-titulo me-2">Otros Valores: <span className="valor-value">{formatterPeso.format(cotiza.Otros_Valores)}</span></h2></div>}
                                  {cotiza.Estado === "creada" && <div className="d-flex flex-row mt-2 mb-2 pricing-data"><h2 className="valor-titulo me-2">Otros Valores: </h2>
                                  <input type="number" id={`otros-valores-${tes}`} /></div>}
                                  {cotiza.Comentarios && <div>{cotiza.Comentarios.length > 1 && 
                                  <div className="mt-2 mb-2 fs-5"><h2 className="valor-titulo me-2">Tus Comentarios: </h2>{cotiza.Comentarios}</div>}</div>}
                                  
                                  {estado.Estado !== "creada" && <div className="d-flex flex-row mt-2 mb-2 pricing-data"><h2 className="valor-titulo me-2">Valor Total: <span className="valor-value">{formatterPeso.format(valorTotal)}</span></h2></div>}
                                  {estado.Estado === "creada" && <div className="d-flex flex-row mt-2 mb-2 pricing-data"><h2 className="valor-titulo me-2">Tus Comentarios: </h2><input  type="text" id={`comentarios-${tes}`} /></div>}
                                </div>
                            
                          
                              <div className="d-flex flex-row justify-content-evenly botones-pricing">
                              {estado.Estado === "creada" &&
                                <button className="btn btn-primary m-1"
                                onClick={(e)=>{
                                  
                                  let newCotizacion = {
                                    Valor_Envio: document.getElementById(`valor-envio-${tes}`).value,
                                    Otros_Valores: document.getElementById(`otros-valores-${tes}`).value,
                                    Comentarios: document.getElementById(`comentarios-${tes}`).value,
                                    Estado: "cotizacion",
                                  }
                                  console.log(newCotizacion)
                                  e.preventDefault();
                                  handleNewCotizacion(cotiza._id, newCotizacion);
                                }}
                                >Enviar Cotización</button>}
                                {estado.Estado === "creada" &&
                                <button className="btn btn-danger m-1"
                                onClick={(e)=>{
                                  e.preventDefault();
                                  handleRechazar(cotiza._id, cotiza);
                                }}
                                >Rechazar y Eliminar</button>}
                                {estado.Estado === "rechazado" &&
                                <button className="btn btn-danger m-1"
                                onClick={(e)=>{
                                  e.preventDefault();
                                  handleDelete(cotiza._id);
                                }}
                                >Eliminar</button>}
                              </div>
                                
                              </div>
                            </div>
                            
                        </div>
                      </div>
                      )
                    }
                    )}
                </div>
              </div>
              
            </div>
          </div>)
        })}
          </div>
        )
        
        
      }
      
    }
    if (cargando){
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
        <CotizacionItems />
      </div>
    );
  }

  export default StorePricing;