import React from "react";
import {useState} from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
function MyOrders() {
  const { user, readStores, readProducts, deletePricing, updatePricing,
    readOrders, setStars, setUserProblem} = useAuth();
    const navigate = useNavigate();
    const [start, setStart] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [group, setGroup] = useState(null);
    const [productosOrders, setProductosOrders] = useState(null);
    const [tiendasCotizar, setTiendasCotizar] = useState(null);
    const groupBy = keys => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map(key => obj[key]).join('-');
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

    const resolveProducts = async (products) => {
      await readProducts(products).then(res => {
        console.log("resData",res.data);
        setProductosOrders(res.data);
      })
      setCargando(false);
    }

    const resolveTiendas = async (tienda) => {
      await readStores(tienda).then(res => {
        setTiendasCotizar(res.data);
        
      })
      
    }
    const resolveOrders = async () => {
      await readOrders(user.uid).then(res => {
        const data = res.data;
        console.log(data);
        let listaTiendas = [];
        let listaProductos = [];
        data.forEach(element => {
          listaTiendas.push(element.Emprendimiento_id);
          for (let i=0; i < element.Pedidos.length; i++){
            listaProductos.push(element.Pedidos[i].Producto);
          }
        })
        let result = listaTiendas.filter((item,index)=>{
          return listaTiendas.indexOf(item) === index;
        })
        resolveTiendas(result);
        const group = groupBy(['Estado']);
          let lista = [];
          let objeto = group(data);
          
          console.log("object",objeto)
          for (let key in objeto){
            console.log(objeto[key])

                objeto[key].forEach((pedido) => {
                  if (!pedido.User_Delete){
                    return
                  }
                })
                lista.push({Estado: key, Cotizaciones:objeto[key]});
            
            
            
        }
        setGroup(lista);
        console.log(listaProductos)
        resolveProducts(listaProductos);
        return
      });
      
    }
    const handlePagar = async (cotizacion, total, tienda) => {
      console.log(cotizacion)
      navigate("/pago",{state:{cotizacion, total, tienda}})
    }
    
    

      if (start){
        
        resolveOrders();
        setStart(false);
      }
      const handleDelete = async (id) => {
        await deletePricing(id)
      }
      const handleEnvio = async (id, envio) => {
        await updatePricing(id, envio)
      }
      const handleFinalizar = async (id) => {
        let estado = {User_Delete: true}
        await updatePricing(id, estado)
      }
      const ModalProblem = (data) => {
        const [comentarios, setComentarios] = useState("")
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

                    
    
                <div><input type="text-area" className="" onChange={(e)=>{e.preventDefault();setComentarios(e.target.value);}}/></div>
                <div>¿No encuentras una solución? Comunicate con soporte o directamente con la tienda en sus canales de contacto.</div>
              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                <button className="btn btn-primary"
                    onClick={(e)=>{
                      const problem = {User_Problem:comentarios}
                      setUserProblem(data.data.pedido._id, problem)
                    }}
                    >Enviar mensaje</button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
      const ModalFin=(data)=> {
        console.log(data)
        const [comentarios, setComentarios] = useState("")
        const [show, setShow] = useState(false);
        const [estrella, setEstrella] = useState(0);
        const [click, setClick] = useState(false)
        const [clickNum, setClickNum] = useState(0)
        const [name, setName] = useState(user.displayName)
        const [finalMsg, setFinalMsg] = useState("")
        const [calificacion, setCalificacion] = useState(false)
        const [send, setSend] = useState("Enviar Mensaje")
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const handleMessage = () => {
          document.getElementById("message").classList.remove("d-none");
          document.getElementById("message-btn").classList.remove("btn-primary");
          document.getElementById("message-btn").classList.add("btn-secondary");
          setSend("Cancelar")
        }
        
        const handleNoMessage = () => {
          document.getElementById("message").classList.add("d-none");
          document.getElementById("message-btn").classList.remove("btn-secondary");
          document.getElementById("message-btn").classList.add("btn-primary");
          document.getElementById("message").value = "";
          setSend("Enviar Mensaje")
          setFinalMsg("")
        }
        const setStar = (num) => {
          setEstrella(num);
          let x = 1
          while (x <= 5){
            let star = document.getElementById(`star-${x}`)
            if (x <=num ){
              star.classList.remove("fa-regular")
              star.classList.add("fa-solid")
              x++
            } else {
              star.classList.remove("fa-solid")
              star.classList.add("fa-regular")
              x++
            }
            
          }
        }
        const unsetStar = (num) => {
          let x = 1
          if (!click){
          while (x <= 5){
            let star = document.getElementById(`star-${x}`)
            if (x <=num ){
              star.classList.remove("fa-solid")
              star.classList.add("fa-regular")
              x++
            } 
            else {
              x++
            }
          }}
        }
        const handleNombre = (e) => {
          if (e.target.checked) {
            setName("Anónimo")
        }
        if (!e.target.checked) {
          setName(user.displayName)
        }
        }
        
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
              {(calificacion || !data.data.pedido.Calificacion) && <div><Modal.Body>
                <h5>
                
                
                Calificar tienda</h5>
                <div>{data.data.tienda}</div>
                <div className="stars">
                  
                    <i className="fa-regular fa-star star-1" id="star-1" onClick={
                    (e) => {e.preventDefault();
                    setClickNum(1)
                    if (click === true && clickNum === 1){
                      setClick(false);
                    } else  {
                      setClick(true)
                    }
                    setStar(1)}}
                    onMouseEnter={(e)=>{
                      e.preventDefault();
                      setStar(1)
                    }}
                    onMouseLeave={(e)=>{
                      e.preventDefault();
                      unsetStar(1)
                    }}
                    ></i>
                    <i className="fa-regular fa-star star-2" id="star-2" onClick={(e) => {e.preventDefault();
                     setClickNum(2)
                     if (click === true && clickNum === 2){
                       setClick(false);
                     } else  {
                       setClick(true)
                     }
                    setStar(2)}}
                    onMouseEnter={(e)=>{
                      e.preventDefault();
                      setStar(2)
                    }}
                    onMouseLeave={(e)=>{
                      e.preventDefault();
                      unsetStar(2)
                    }}
                    ></i>
                    <i className="fa-regular fa-star star-3" id="star-3" onClick={(e) => {e.preventDefault();
                     setClickNum(3)
                     if (click === true && clickNum === 3){
                       setClick(false);
                     } else  {
                       setClick(true)
                     }
                    setStar(3)}}
                    onMouseEnter={(e)=>{
                      e.preventDefault();
                      setStar(3)
                    }}
                    onMouseLeave={(e)=>{
                      e.preventDefault();
                      unsetStar(3)
                    }}
                    ></i>
                    <i className="fa-regular fa-star star-4" id="star-4" onClick={(e) => {e.preventDefault();
                     setClickNum(4)
                     if (click === true && clickNum === 4){
                       setClick(false);
                     } else  {
                       setClick(true)
                     }
                    setStar(4)}}
                    onMouseEnter={(e)=>{
                      e.preventDefault();
                      setStar(4)
                    }}
                    onMouseLeave={(e)=>{
                      e.preventDefault();
                      unsetStar(4)
                    }}
                    ></i>
                    <i className="fa-regular fa-star star-5" id="star-5" 
                    onClick={(e) => {e.preventDefault();
                      setClickNum(5)
                      if (click === true && clickNum === 5){
                        setClick(false);
                      } else  {
                        setClick(true)
                      }
                      setStar(5)}}
                    onMouseEnter={(e)=>{
                      e.preventDefault();
                      setStar(5)
                    }}
                    onMouseLeave={(e)=>{
                      e.preventDefault();
                      unsetStar(5)
                    }}
                    ></i>
                  
                  
                </div>
                <div>
                      Comenta tu opinión de la Tienda: <div><input type="text-area" onChange={(e) => {e.preventDefault(); setComentarios(e.target.value)}}/></div>
                    </div>
                    <div className="d-flex flex-row">
                                    <input className="m-1" type="checkbox" id="emailCheck" onClick={handleNombre}
                                     />
                                    Deseo que mi calificación sea anónima.</div>
                                    
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                    <button className="btn btn-primary"
                    onClick={(e)=>{
                      let calificacion = {
                        Usuario: name,
                        Comentarios: comentarios,
                        Stars: estrella
                      }
                      let ok = {
                        Calificacion: true
                      }
                      e.preventDefault();
                      setStars(data.data.pedido.Emprendimiento_id, calificacion);
                      handleEnvio(data.data.pedido._id, ok);
                      
                    }}
                    >Enviar Calificación</button>
                
                
                    
              </Modal.Footer>
                    </Modal.Body>
                    </div>}
                    {!calificacion && !data.data.pedido.Calificacion && data.data.pedido.Estado !== "finalizado" && <div>  <Modal.Body>
                    <div className="">¿Deseas enviar un comentario final a la tienda?</div>
                    <div><input type="text-area" className="d-none" id="message" onChange={(e)=>{e.preventDefault(); setFinalMsg(e.target.value)}}/></div>
                    {finalMsg && <div>
                    Su mensaje será enviado al hacer click en finalizar  
                  </div>}
                    <Button className="btn btn-primary" id="message-btn" onClick={(e)=>{e.preventDefault();
                    if (send === "Enviar Mensaje"){
                      handleMessage();
                    }
                    else if (send === "Cancelar"){
                      handleNoMessage();
                    }
                    }}>
                  {send}
                  
                </Button>
                
                
              </Modal.Body>
              <Modal.Footer>
                <div className="">*Al finalizar se declarará el pedido como recibido y la orden como finalizada.</div>
                <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                <button className="btn btn-primary"
                    onClick={(e)=>{
                      let envio = {
                        Estado: "finalizado",
                      }
                      
                      e.preventDefault();
                      handleEnvio(data.data.pedido._id, envio);
                      setCalificacion(true);
                    }}
                    >Finalizar</button>
                    
              </Modal.Footer>
              </div>}
            </Modal>
          </div>
          
        );
      }
 const StoreResp = (data) =>{
  console.log(data)
  if (!data.Store_Problem){
    return (
      <div>
        Aun no hay respuesta
      </div>
    )
  }
 }
    const CotizacionItems = () => {
      const [newMsg, setNewMsg] = useState("")
      const handleNewMsg = () => {
        document.getElementById("new-msg").classList.remove("d-none");
        document.getElementById("new-msg-btn").classList.add("d-none");
      }
      const cancelNewMsg = () =>{
        document.getElementById("new-msg-btn").classList.remove("d-none");
        document.getElementById("new-msg").classList.add("d-none");
      }
      if(group && tiendasCotizar && productosOrders){
        console.log(group);
        return(
          <div>
            {group.map((estado, tes) => {
          console.log(tes + " hola "+ estado)
          console.log(estado)
          return (<div key={tes}>
            <h1>{estado.Estado}</h1>
            {estado.Cotizaciones.map((cotiza,index)=>{
              console.log("cotiza")
              console.log(cotiza)
            let valorProductos = 0;
            let valorTotal = 0;
            cotiza.Pedidos.forEach((producto) => {
              let item = productosOrders.find(product => product._id === producto.Producto);
              console.log("item",item);
              let valor = item.Precio * producto.Cantidad;
              valorProductos += valor;
            })
            if (cotiza.Pago === true){
              valorTotal = valorProductos + cotiza.Valor_Envio + cotiza.Otros_Valores
            }
            let store = tiendasCotizar.find(item => item._id === cotiza.Emprendimiento_id);
            return(
              <div className="" key={index}>
                <div className="card">
                  <h1>{store.Nombre}</h1>
                  <div className="d-flex">
                  {cotiza.Pedidos.map((pedido,index)=>{
                    console.log("pedido",pedido);
                    let product = productosOrders.find(item => item._id === pedido.Producto);

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
                    {cotiza.User_Comentarios.length > 1 && <div>Tus Comentarios: {cotiza.User_Comentarios}</div>}
                    {cotiza.Valor_Envio > 0 && <div>Valor Envio: {cotiza.Valor_Envio}</div>}
                    {cotiza.Otros_Valores > 0 && <div>Otros Valores: {cotiza.Otros_Valores}</div>}
                    {cotiza.Comentarios && <div>{cotiza.Comentarios.length > 1 && 
                    <div>Comentarios de la tienda: {cotiza.Comentarios}</div>}</div>}
                    {cotiza.Pago === true && <div>Valor Total: {valorTotal}</div>}
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
                    
                    <div className="d-flex">
                      <ModalProblem data={{pedido:cotiza, tienda:store.Nombre}} />
                      
                      </div>
                    
                  </div>
                    }
                  </div>
                </div>
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
                        
                        <Button variant="dark" onClick={handleNewMsg} id="new-msg-btn" className="">
                    
                  Agregar nuevo mensaje
                </Button>
                        <div className="d-none"   id="new-msg">
                          <input type="text-area" onChange={(e)=>{e.preventDefault(); setNewMsg(e.target.value)}}/>
                          <div>
                          <Button variant="secondary" onClick={cancelNewMsg}>
                            Cancelar
                          </Button>
                          <Button variant="primary" onClick={(e)=>{
                            const problem = {User_Problem:newMsg}
                            setUserProblem(cotiza._id, problem)
                          }}>
                            Enviar nuevo msg
                          </Button>
                          </div>
                        </div>
                            
            
                        
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
                    <ModalFin data={{pedido:cotiza, tienda:store.Nombre, titulo:"Pedido Recibido"}} />
                  </div>
                    }
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
                    {!cotiza.Calificacion && <ModalFin data={{pedido:cotiza, tienda:store.Nombre, titulo:"Calificar Tienda"}} />}
                <button className="btn btn-primary" onClick={(e)=>{
                  e.preventDefault();
                  handleFinalizar(cotiza._id);
                }}>Eliminar</button></div> }
                
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

  export default MyOrders;