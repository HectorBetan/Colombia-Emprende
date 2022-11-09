import React from "react";
import {useState} from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
function MyPricings() {
  const { user, readStores, readProducts, updatePricing,
    readPricing, deletePricing } = useAuth();
    const navigate = useNavigate();
    const [start, setStart] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [group, setGroup] = useState(null);
    const [productosCotizar, setProductosCotizar] = useState(null);
    const [tiendasCotizar, setTiendasCotizar] = useState(null);
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

    const resolveTiendaCotizar = async (tienda) => {
      await readStores(tienda).then(res => {
        setTiendasCotizar(res.data);
        
      })
      
    }
    const resolveCotizacion = async () => {
      await readPricing(user.uid).then(res => {
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
        resolveTiendaCotizar(result);
        const group = groupBy(['Estado']);
          let lista = [];
          let objeto = group(data);
          
          console.log("object",objeto)
          for (let key in objeto){
            if (key !== "rechazado"){
            lista.push({Estado: key, Cotizaciones:objeto[key]});
            }
        }
        setGroup(lista);
        console.log(listaProductos)
        resolveProductsCotizar(listaProductos);
        return
      });
      
    }
    const handlePagar = async (cotizacion, total, tienda) => {
      console.log(cotizacion)
      navigate("/pago",{state:{cotizacion, total, tienda}})
    }

      if (start){
        
        resolveCotizacion();
        setStart(false);
      }
        
    const handleDelete = async (id) => {
      await deletePricing(id)
    }
    const handleRechazar = async (id) => {
      const pedido = {Estado: "rechazado"}
      await updatePricing(id, pedido)
    }
    const CotizacionItems = () => {
      if(group && tiendasCotizar && productosCotizar){
        if (group.length === 0){
          return (
            <div>
              No hay cotizaciones
            </div>
          )
        }
        console.log(group);
        return(
          <div>
            {group.map((estado, tes) => {
          console.log(tes + " hola "+ estado)
          console.log(estado)
          console.log(productosCotizar)
          return (<div key={tes}>
            <h1>{estado.Estado}</h1>
            {estado.Cotizaciones.map((cotiza,index)=>{
              console.log("cotiza")
              console.log(cotiza)
            let valorProductos = 0;
            let valorTotal = 0;
            cotiza.Pedidos.forEach((producto) => {
              console.log("producto")
              console.log(producto)
              let item = productosCotizar.find(product => product._id === producto.Producto);
              console.log("item",item);
              let valor = item.Precio * producto.Cantidad;
              valorProductos += valor;
            })
            if (cotiza.Estado === "cotizacion"){
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
                    {estado.Estado === "cotizacion" &&
                    <div>
                    <div>Valor Envio: {cotiza.Valor_Envio}</div>
                    {cotiza.Otros_Valores > 0 && <div>Otros Valores: {cotiza.Otros_Valores}</div>}
                    {cotiza.Comentarios.length > 1 && <div>Comentarios: {cotiza.Comentarios}</div>}
                    <div>Valor Total: {valorTotal}</div>
                    </div>}
                  </div>
                </div>
                {estado.Estado === "cotizacion" && 
                <div>
                  <button className="btn btn-primary" onClick={(e)=>{
                    e.preventDefault();
                    handlePagar(cotiza, valorTotal, store.Nombre);
                  }}>Pagar</button>
                  <button className="btn btn-primary"
                  onClick={(e)=>{
                    e.preventDefault();
                    handleRechazar(cotiza._id);
                  }}
                  >Rechazar y eliminar</button>
                </div>
                }
                
                {estado.Estado !== "cotizacion" &&
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

  export default MyPricings;