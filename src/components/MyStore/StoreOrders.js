import React from "react";
import {useState} from 'react';
import { useAuth } from "../../context/AuthContext";
import Button from 'react-bootstrap/Button';
function StoreOrders() {
  const { readProducts, createEnvio, userData, updatePricing,
     deleteCarts, readStoreOrders, readUserInfo, deletePricing,  setStoreProblem } = useAuth();
    
    const [start, setStart] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [group, setGroup] = useState(null);
    const [productosCotizar, setProductosCotizar] = useState(null);
    const [usuarios, setUsuarios] = useState(null);
    const [cotizacion, setCotizacion] = useState(null);
    const groupBy = keys => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map(key => obj[key]).join('-');
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

    const resolveProductsOrders = async (products) => {
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
      await readStoreOrders(userData.Emprendimiento_id).then(res => {
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
          
          console.log("object",objeto)
          for (let key in objeto){
            objeto[key].forEach((pedido) => {
              if (!pedido.Store_Delete){
                lista.push({Estado: key, Cotizaciones:objeto[key]});
              }
            })

        }
        setGroup(lista);
        console.log(listaProductos)
        resolveProductsOrders(listaProductos);
        setCotizacion(data);
        return
      });
      
    }
    const handleNewEnvio = async (id, cotizacion) => {
      await createEnvio(id, cotizacion).then(res => {
        console.log("res",res);
      })
      
    }

    const handleRechazar= async (id, cotizacion) => {
      let data = {Estado:"rechazado"}
      let lista = []
      console.log("cotizacion",cotizacion);
      cotizacion.Pedidos.forEach(element => {
        console.log("element",element);
        lista.push(element._id);
      })
      const deleteMany = {
        id: lista,
      }
      await createEnvio(id, data).then(res => {
        console.log("res",res);
      })
      await deleteCarts(deleteMany).then(res => {
        console.log("res",res);
      })
    }

      if (start){
        
        resolveCotizacion();
        setStart(false);
      }
        
      const handleDelete = async (id) => {
        let estado = {Store_Delete: true}
        await updatePricing(id, estado)
      }
      const StoreResp = (data) =>{
        const handleNewMsg = () => {
          document.getElementById("new-msg").classList.remove("d-none");
          document.getElementById("new-msg-btn").classList.add("d-none");
        }
        const cancelNewMsg = () =>{
          document.getElementById("new-msg-btn").classList.remove("d-none");
          document.getElementById("new-msg").classList.add("d-none");
        }
        const [newMsg, setNewMsg] = useState("")
        const [msg, setMsg] = useState("")
        console.log(data)
        if (!data.data.Store_Problem || data.data.Store_Problem.length === 0){
          return (
            <div>
              <Button variant="dark" onClick={handleNewMsg} id="new-msg-btn" className="">
                    Responder al cliente
              </Button>
              <div className="d-none"   id="new-msg">
                          <input type="text-area" onChange={(e)=>{e.preventDefault(); setMsg(e.target.value)}} />
                          <div>
                          <Button variant="secondary" onClick={cancelNewMsg}>
                            Cancelar
                          </Button>
                          <Button variant="primary" onClick={(e)=>{e.preventDefault(); setStoreProblem(data.data._id,{Store_Problem: msg})}}>
                            Enviar msg
                          </Button>
                          </div>
                        </div>
            </div>
          )
        }
        else {
          return(
            <div>
              <Button variant="dark" onClick={handleNewMsg} id="new-msg-btn" className="">
                    Envia nuevo msj al cliente
              </Button>
              <div className="d-none"   id="new-msg">
                          <input type="text-area" onChange={(e)=>{e.preventDefault(); setNewMsg(e.target.value)}} />
                          <div>
                          <Button variant="secondary" onClick={cancelNewMsg}>
                            Cancelar
                          </Button>
                          <Button variant="primary" onClick={(e)=>{e.preventDefault(); setStoreProblem(data.data._id,{Store_Problem: msg})}}>
                            Enviar msg
                          </Button>
                          </div>
                        </div>
            </div>
          )
        }
       }
    const CotizacionItems = () => {


      
      if(group && usuarios && productosCotizar){
        console.log(group);
        return(
          <div>
            {group.map((estado, tes) => {
          console.log(tes + " hola "+ estado)
          console.log(estado)
          
          return (<div key={tes}>
            {estado.Estado === "creada" && <h1>Pendientes</h1>}
            {estado.Estado === "cotizacion" && <h1>Enviadas</h1>}
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
                    if (cotiza.Pago === true){
                      valorTotal = valorProductos + cotiza.Valor_Envio + cotiza.Otros_Valores
                    }
            let usuario = usuarios.find(item => item.Uid === cotiza.User_id);
            return(
              <div className="" key={index}>
                <div className="card">
                  <h1>{usuario.Nombre}</h1>
                  <div className="d-flex">
                  {cotiza.Pedidos.map((pedido,index)=>{
                    console.log("pedido",pedido);
                    let product = productosCotizar.find(item => item._id === pedido.Producto);

                    return(
                      <div key={index}>
                        <p>{product.Nombre}</p>
                        <p>{pedido.Cantidad}</p>
                        <p>{product.Precio}</p>

                      </div>
                    )
                  })
                  }
                  </div>
                  <div>
                    <p>Valor Productos: {valorProductos}</p>
                    {cotiza.User_Comentarios.length > 1 && <div>Comentarios del Cliente: {cotiza.User_Comentarios}</div>}
                    
                    {cotiza.Valor_Envio > 0 && <div>Valor Envio: {cotiza.Valor_Envio}</div>}
                    {cotiza.Otros_Valores > 0 && <div>Otros Valores: {cotiza.Otros_Valores}</div>}
                    {cotiza.Comentarios && <div>{cotiza.Comentarios.length > 1 && 
                    <div>Tus Comentarios: {cotiza.Comentarios}</div>}</div>}
                    {cotiza.Pago === true && <div>Valor Total: {valorTotal}</div>}
                  </div>
                  {cotiza.Estado === "pagado" && cotiza.Pago === true &&
                  <div>
                    <div>
                      Fecha Envio: <input type="text" id={`fecha-envio-${tes}`} />
                    </div>
                    <div>
                      Empresa Envio: <input type="text" id={`empresa-envio-${tes}`} />
                    </div>
                    <div>
                      Numero de Guia: <input type="text" id={`numero-guia-${tes}`} />
                    </div>
                    <div>
                      Comentarios de Envio: <input type="text" id={`comentarios-envio-${tes}`} />
                    </div>
                    <button className="btn btn-primary"
                    onClick={(e)=>{
                      
                      let envio = {
                        Fecha_Envio: document.getElementById(`fecha-envio-${tes}`).value,
                        Empresa_Envio: document.getElementById(`empresa-envio-${tes}`).value,
                        Numero_Guia: document.getElementById(`numero-guia-${tes}`).value,
                        Comentarios_Envio: document.getElementById(`comentarios-envio-${tes}`).value,
                        Estado: "envio",
                      }
                      console.log(envio)
                      e.preventDefault();
                      handleNewEnvio(cotiza._id, envio);
                    }}
                    >Envio Realizado</button>
                  </div>
                  }
                  {cotiza.Pago === true && cotiza.Estado === "envio" &&
                    <div>
                    <div>
                      {cotiza.Info_Envio.Fecha_Envio && <div>Fecha de Envio: {cotiza.Info_Envio.Fecha_Envio}</div>}
                    </div>  
                    <div>
                    {cotiza.Info_Envio.Empresa_Envio && <div>Empresa de Envio: {cotiza.Info_Envio.Empresa_Envio}</div>}
                  </div> 
                  <div>
                      {cotiza.Info_Envio.Numero_Guia && <div>Numero de Guia: {cotiza.Info_Envio.Numero_Guia}</div>}
                    </div> 
                    <div>
                      {cotiza.Info_Envio.Comentarios_Envio && <div>Comentarios de Envio: {cotiza.Info_Envio.Comentarios_Envio}</div>}
                    </div> 
                    
                  </div>
                    }
{cotiza.Pago === true && cotiza.Estado === "problema" && 
                    <div>
                    <div>
                      {cotiza.Info_Envio.Fecha_Envio && <div>Fecha de Envio: {cotiza.Info_Envio.Fecha_Envio}</div>}
                    </div>  
                    <div>
                    {cotiza.Info_Envio.Empresa_Envio && <div>Empresa de Envio: {cotiza.Info_Envio.Empresa_Envio}</div>}
                  </div> 
                  <div>
                      {cotiza.Info_Envio.Numero_Guia && <div>Numero de Guia: {cotiza.Info_Envio.Numero_Guia}</div>}
                    </div> 
                    <div>
                      {cotiza.Info_Envio.Comentarios_Envio && <div>Comentarios de Envio: {cotiza.Info_Envio.Comentarios_Envio}</div>}
                    </div> 
                    
                    <div className="d-flex">
                      <div>
                      <h6>Mensajes de usuario</h6>
                        {cotiza.User_Problem && 
                        <div>
                          
                          {cotiza.User_Problem.map((msg, i)=>{
                            return (
                              <div>
                                Mensaje {i+1}: {msg}
                              </div>  
                            )
                          })}
                        
                        
                        
                            
            
                        
                        </div> 
                        }

                      </div>
                      <div>
                      <h6>Mensajes de la Tienda:</h6>
                      {cotiza.Store_Problem && 
                        <div>
                          {cotiza.Store_Problem.map((msg, i)=>{
                            return (
                              <div>
                                Mensaje {i+1}: {msg}
                              </div>  
                            )
                          })}
                        </div>  
                        }
                      <StoreResp data={cotiza} />  
                      </div> 
                    </div>
                    
                  </div>
                    }
                
                </div>
                {estado.Estado === "finalizado" && <div>
                <div>
                      {cotiza.Info_Envio.Fecha_Envio && <div>Fecha de Envio: {cotiza.Info_Envio.Fecha_Envio}</div>}
                    </div>  
                    <div>
                    {cotiza.Info_Envio.Empresa_Envio && <div>Empresa de Envio: {cotiza.Info_Envio.Empresa_Envio}</div>}
                  </div> 
                  <div>
                      {cotiza.Info_Envio.Numero_Guia && <div>Numero de Guia: {cotiza.Info_Envio.Numero_Guia}</div>}
                    </div> 
                    <div>
                      {cotiza.Info_Envio.Comentarios_Envio && <div>Comentarios de Envio: {cotiza.Info_Envio.Comentarios_Envio}</div>}
                    </div> 
                <div>
                {cotiza.Comentarios_Finales && <div>Comentarios Finales del Cliente: {cotiza.Comentarios_Finales}</div>}
              </div> 
                <button className="btn btn-primary"
                onClick={(e)=>{
                  e.preventDefault();
                  handleDelete(cotiza._id);
                }}
                >Eliminar</button></div> }
              </div>
            )
          }
          )}
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

  export default StoreOrders;