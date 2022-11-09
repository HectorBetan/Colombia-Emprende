import React from "react";
import {useState} from 'react';
import { useAuth } from "../../context/AuthContext";
function StorePricing() {
  const { readProducts, updatePricing, userData,
    readStorePricing, readUserInfo, deletePricing } = useAuth();
    
    const [start, setStart] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [group, setGroup] = useState(null);
    const [productosCotizar, setProductosCotizar] = useState(null);
    const [usuarios, setUsuarios] = useState(null);
    const groupBy = keys => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map(key => obj[key]).join('-');
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});

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
          
          console.log("object",objeto)
          for (let key in objeto){
            if (key !== "tienda-rechazado"){
            lista.push({Estado: key, Cotizaciones:objeto[key]});
            }
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

      if (start){
        
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
          
          return (<div key={tes}>
            {estado.Estado === "creada" && <h1>Pendientes</h1>}
            {estado.Estado === "cotizacion" && <h1>Enviadas</h1>}
            {estado.Estado === "rechazado" && <h1>Rechazadas por Usuario</h1>}
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
                    if (cotiza.Estado === "cotizacion"){
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
                    <p>Valor Total: {valorProductos}</p>
                    {cotiza.User_Comentarios.length > 1 && <div>Comentarios del Cliente: {cotiza.User_Comentarios}</div>}
                    
                    <div>Valor Envio: {cotiza.Valor_Envio}
                    {estado.Estado === "creada" && <input type="number" id={`valor-envio-${tes}`} />}</div>
                    {cotiza.Otros_Valores > 0 && cotiza.Estado !== "creada" && <div>Otros Valores: {cotiza.Otros_Valores}</div>}
                    {cotiza.Estado === "creada" && <div>Otros Valores: 
                    <input type="number" id={`otros-valores-${tes}`} /></div>}
                    {cotiza.Comentarios && <div>{cotiza.Comentarios.length > 1 && 
                    <div>Tus Comentarios: {cotiza.Comentarios}</div>}</div>}
                    {estado.Estado === "creada" && <div>Tus Comentarios: <input  type="text" id={`comentarios-${tes}`} /></div>}
                    {estado.Estado === "cotizacion" && <div>Valor Total: {valorTotal}</div>}
                  </div>
                  
                
                </div>
                {estado.Estado === "creada" &&
                <button className="btn btn-primary"
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
                <button className="btn btn-primary"
                onClick={(e)=>{
                  e.preventDefault();
                  handleRechazar(cotiza._id, cotiza);
                }}
                >Rechazar y Eliminar</button>}
                {estado.Estado === "rechazado" &&
                <button className="btn btn-primary"
                onClick={(e)=>{
                  e.preventDefault();
                  handleDelete(cotiza._id);
                }}
                >Eliminar</button>}
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

  export default StorePricing;