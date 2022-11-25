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
          <div className="">
            {miCarrito.map((tienda, tkey) => {
              let valorTotal = 0;
              tienda.Productos.forEach(producto => {
                
                let  item = productos.find(product => product._id === producto.Producto_id);
                let valor = item.Precio * producto.Cantidad;
                valorTotal += valor;
              })
              let store = tiendas.find(item => item._id === tienda.Tienda);
              return(
                <div key={tienda.Tienda} id={tienda.Tienda} className="card m-3 p-3 ">
                  <div className="d-flex flex-row">
                    <img src={store.Imagen} alt="0" className="imgcarrito"></img>
                    <h1 className="m-1 ms-3">{store.Nombre}</h1>
                    <Link  to={`/Emprendimientos/hola-mundo`} className="btn btn-dark boton-tienda-carrito">
                      Ir a la Tienda
                    </Link>
                  </div>
                  <div className="accordion mt-3" id={`accordion${tkey}`}>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id={`heading${tkey}`}>
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${tkey}`} aria-expanded="true" aria-controls={`#collapse${tkey}`}>
                          <h2>Productos</h2>
                        </button>
                      </h2>
                      <div id={`collapse${tkey}`} className="accordion-collapse collapse show" aria-labelledby={`heading${tkey}`} data-bs-parent={`#accordion${tkey}`}>
                        <div className="accordion-body">
                          
                  <div className="d-flex flex-column">
                    {w > 991 && <div  className="d-flex flex-row m-2">
                    <div className="d-flex flex-row caja1-carrito">
                      <h3 className="caja-40">Producto:</h3>
                      <h4 className="caja-20">Cantidad:</h4>

                      </div>
                      <div className="d-flex flex-row caja2-carrito">
                      <div className="d-flex flex-row caja-213">
                      <h4 className="caja-50  text-center">Precio:</h4>
                      <h4 className="caja-50  text-center">Total:</h4>
                      </div>
                      <div className="caja-13"></div>
                      </div>
                    </div>}
                    
                    {tienda.Productos.map((producto, pkey) => {
                    let  item = productos.find(product => product._id === producto.Producto_id);
                    let total = item.Precio * producto.Cantidad;
                    return(
                    <div key={pkey} className="">
                      <hr className="mb-4" />
                      <div  className="d-block d-lg-flex flex-row m-2 caja-datos-carrito">
                        <div className="d-flex caja1-carrito">
                          <h5  className="caja-40 m-0 prod-cant">{(w <= 991 && w > 680) && <div>Producto: </div>}
                          {w <= 680 && <span>Producto: </span>}{item.Nombre}</h5>
                          <div className="caja-20">
                            {(w <= 991 && w > 680) && <h5>Cantidad: </h5>}
                            <div className="d-flex edita-caja" id={`edit${pkey}`}>
                              <h5 className="prod-car">{ w <= 680 && <span>Cantidad: </span>}{producto.Cantidad}</h5>
                              <button className="btn btn-info btn-edit-cant" onClick={(e)=>{e.preventDefault();showEdit(pkey)}}>Editar</button>
                            </div>
                            <div className="d-flex d-none" id={`edit-cant${pkey}`}>
                              <input type="number" min="1" max="1000" id={pkey} defaultValue={producto.Cantidad} />
                                <button className="btn btn-info" onClick={(e)=>{e.preventDefault();noShowEdit(pkey)}}><i className="fa-solid fa-xmark"></i></button>
                                <button className="btn btn-info" onClick={(e)=>{e.preventDefault();
                                  updateOne(producto._id, {Cantidad: document.getElementById(pkey).value})
                                  .then(()=>{resolveCarrito();})
                                  }}><i className="fa-solid fa-floppy-disk"></i></button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="d-flex caja2-carrito">
                          <div className="d-flex flex-row caja-213">
                          <h6  className="caja-50 prod-cant-end">{w <= 991 && <div>Precio: </div>}{item.Precio}</h6>
                          <h6  className="caja-50 prod-cant-end">{w <= 991 && <div>Total: </div>}{total}</h6>
                          </div>
                          
                          <div className="caja-13 prod-cant-end">

                            <button className="btn btn-danger" onClick={(e)=>{e.preventDefault(); 
                              handleDelete(tkey, pkey, producto._id)}
                            }>Eliminar</button>
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
                    </div>
                
                  </div>
                <div className="text-start mt-2 mb-3">
                  <div className="text-start m-3 me-md-4 ms-md-4">ValorTotal: {valorTotal}</div>
                    <div className="d-flex justify-content-start m-3 me-md-4 ms-md-4">
                                  
                                  <label className="">Ciudad de envio:</label>
                                  <select defaultValue={"default"} id={`ciudad${tienda.Tienda}`} required>
                                      <option value="default" disabled >Selecciona la ciudad</option>
                                      {cityList}
                                  </select>
                              </div>
                  
                  <div className="d-flex justify-content-start m-3 me-md-4 ms-md-4">
                    Comentarios para la tienda:
                    <input type="textarea"  id={`comentarios${tienda.Tienda}`} placeholder="Comentarios" defaultValue=" " />
                  </div>
                  </div>
                    <button onClick={(e)=> {e.preventDefault(); handleCotizar(tienda, tkey) }}>Cotizar Estos Productos</button>
                    <button onClick={(e)=> {e.preventDefault(); deleteAll(tienda) }}>Eliminar todos</button>

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