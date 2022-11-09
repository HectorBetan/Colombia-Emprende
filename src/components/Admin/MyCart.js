import React from "react";
import {useEffect, useState} from 'react';
import {cityList} from '../../utilities/citys.utilities';
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
function MyCart() {
  const { user, readStores, readCart, deleteCart, readProducts, updateCart, createPricing, deleteCarts  } = useAuth();
    const [start, setStart] = useState(true);
    const [cargando, setCargando] = useState(true);
    const [miCarrito, setMiCarrito] = useState(null);
    const [productos, setProductos] = useState(null);
    const [tiendas, setTiendas] = useState(null);
    const [startDelete, setStartDelete] = useState(false);
    const groupBy = keys => array =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = keys.map(key => obj[key]).join('-');
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    }, {});
    const resolveProducts = async (products) => {
      await readProducts(products).then(res => {
        setProductos(res.data);
      })
      setCargando(false);
    }
    const resolveTienda = async (tienda) => {
      await readStores(tienda).then(res => {
        setTiendas(res.data);
      })
      
    }
    const resolveCarrito = async () => {
      await readCart(user.uid).then(res => {
        let data = res.data;
        let listaTiendas = [];
        let listaProductos = [];
        for (let i = 0; i < data.length; i++){
          listaProductos.push(data[i].Producto_id);
          listaTiendas.push(data[i].Emprendimiento_id);
        }
        let result = listaTiendas.filter((item,index)=>{
          return listaTiendas.indexOf(item) === index;
        })
        console.log(listaTiendas)
        console.log("result",result)
        resolveTienda(result);
        const group = groupBy(['Emprendimiento_id']);
          let lista = [];
          let objeto = group(data);
          for (let key in objeto){
            lista.push({Tienda: key, Productos:objeto[key]});
        }
        setMiCarrito(lista);
        resolveProducts(listaProductos);
      })
    }
      if (start){
        setCargando(true);
        resolveCarrito();
        setStart(false);
      }  
    useEffect(() => {
      if (startDelete){
        setMiCarrito(miCarrito)
        setStartDelete(false);
      }
      
    }, [miCarrito, startDelete]);

    const handleDelete = async (tkey, pkey, id) => {
      miCarrito[tkey].Productos.splice(pkey, 1);
      setMiCarrito(miCarrito);
      setStartDelete(true);
      //miCarrito[tkey].Productos.Splice(pkey, 1);
      try{
        await deleteCart(id);
      }
      catch(error){
        console.log(error);
      }
    }
 
      const updateOne = async (id, data) => {
        await updateCart(id, data);
      }
    const resolverUpdate = async (tienda) => {
      tienda.Productos.forEach(producto => {
        let cantidad = document.getElementById(producto._id).value;
        if (cantidad){
          updateOne(producto._id, {Cantidad: cantidad});
        }
      })
    }
    const deleteAll = async (tienda) =>{
      let listaDelete = [];
      tienda.Productos.forEach(producto => {
        listaDelete.push(producto._id);
      })
      const deleteMany = {
        id: listaDelete,
      }
      await deleteCarts(deleteMany)
      .then(()=>{resolveCarrito()})
    }
    const handleCotizar = async (tienda, tkey) => {
      console.log(tienda);
      const comentarios = document.getElementById(`comentarios${tienda.Tienda}`).value;
      const ciudad = document.getElementById(`ciudad${tienda.Tienda}`).value;
      let lista = [];
      let listaDelete = [];
      tienda.Productos.forEach(producto => {
        let cantidad = document.getElementById(producto._id).value;
        let product = {Producto: producto.Producto_id , Cantidad: 0};
        if (cantidad){
          product.Cantidad = cantidad;
        } else {
          product.Cantidad = producto.Cantidad;
        }
        lista.push(product)
        listaDelete.push(producto._id);
      })
      console.log("lista",lista);
      console.log("listadelete",listaDelete);
      const cotizacion = {
        User_id: user.uid,
        Emprendimiento_id: tienda.Tienda,
        Pedidos: lista,
        Ciudad_Envio: ciudad,
        Estado: "creada",
        User_Comentarios: comentarios,
        Pago: false,
      }
      miCarrito.splice(tkey, 1);
      setMiCarrito(miCarrito);
      setStartDelete(true);
      await sendCotizacion(cotizacion, listaDelete);
      
    } 
    const sendCotizacion = async (cotizacion, lista) => {
      await createPricing(cotizacion).catch(err => {
        console.log(err);
      }
      )
      const deleteMany = {
        id: lista,
      }
      await deleteCarts(deleteMany);
      
    }
    const CarritoItems = () => {
      const showEdit = (id) => {
        document.getElementById(`edit-cant${id}`).classList.remove("d-none");
        document.getElementById(`edit${id}`).classList.add("d-none");
      }
      const noShowEdit = (id) => {
        document.getElementById(`edit-cant${id}`).classList.add("d-none");
        document.getElementById(`edit${id}`).classList.remove("d-none");
      }
      if (miCarrito){
        console.log(miCarrito)
        if (miCarrito.length > 0 && tiendas){
        return(
          <div className="col-12">
            {miCarrito.map((tienda, tkey) => {
              let valorTotal = 0;
              tienda.Productos.forEach(producto => {
                
                let  item = productos.find(product => product._id === producto.Producto_id);
                let valor = item.Precio * producto.Cantidad;
                valorTotal += valor;
              })
              let store = tiendas.find(item => item._id === tienda.Tienda);
              return(
                <div key={tienda.Tienda} id={tienda.Tienda}>
                  <Link  to={`/Emprendimientos/hola-mundo`} className="btn btn-primary">
                    Ir a Tienda
                  </Link>
                  <h1>{store.Nombre}</h1>
                  <div className="d-flex flex-row col-12">
                  {tienda.Productos.map((producto, pkey) => {
                    let  item = productos.find(product => product._id === producto.Producto_id);
                    let total = item.Precio * producto.Cantidad;
                    return(
                      <div key={producto._id} className="d-flex flex-column m-2">
                      <h2>Producto: {item.Nombre}</h2>
                      <div className="">
                        <div className="d-flex" id={`edit${producto.Producto_id}`}>
                          <h3>Cantidad: {producto.Cantidad}</h3>
                          <button onClick={(e)=>{e.preventDefault();showEdit(producto.Producto_id)}}>Editar</button>
                        </div>
                        <div className="d-flex d-none" id={`edit-cant${producto.Producto_id}`}>
                          <h3>Cantidad: </h3><input type="number" min="1" max="1000" id={producto._id} defaultValue={producto.Cantidad} />
                            <button onClick={(e)=>{e.preventDefault();noShowEdit(producto.Producto_id)}}>Cancelar</button>
                            <button onClick={(e)=>{e.preventDefault();
                              updateOne(producto._id, {Cantidad: document.getElementById(producto._id).value})
                              .then(()=>{resolveCarrito();})
                              }}>Guardar</button>
                        </div>
                      </div>
                      <h3>Precio: {item.Precio}</h3>
                      <h5>Total: {total}</h5>
                      
                      <button onClick={(e)=>{e.preventDefault(); 
                        handleDelete(tkey, pkey, producto._id)}
                      }>Eliminar</button>
                      </div>
                    )
                }
                )}
                ValorTotal: {valorTotal}
                
                </div>
                <div>
                  
                  <div className="d-flex">
                                <label className="">Ciudad de envio:</label>
                                <select defaultValue={"default"} id={`ciudad${tienda.Tienda}`} required>
                                    <option value="default" disabled >Selecciona la ciudad</option>
                                    {cityList}
                                </select>
                            </div>
                </div>
                <div className="d-flex">
                  Comentarios para la tienda:
                  <input type="textarea"  id={`comentarios${tienda.Tienda}`} placeholder="Comentarios" defaultValue=" " />
                  </div>
                <button onClick={(e)=> {e.preventDefault(); deleteAll(tienda) }}>Eliminar todos</button>
                <button onClick={(e)=> {e.preventDefault(); handleCotizar(tienda, tkey) }}>Cotizar Estos Productos</button>
                </div>
              )
            })
          }
          
        </div>
        )
      }
      else{
        return(
          <div>
            <h3>No hay productos en el carrito</h3>
          </div>
        )
      }
    }
      
    };
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
        <CarritoItems/>
      </div>
    );
  }

  export default MyCart;