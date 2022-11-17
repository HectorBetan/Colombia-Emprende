import React from "react";
import Modal from 'react-bootstrap/Modal';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import imgStore from "../../assets/img-store.jpg";
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
function Store(data) {
  const [cargando, setCargando] = useState(true);
  const [ant, setAnt] = useState(false);
  const [w, setW] = useState(window.innerWidth);
  useEffect(()=>{
    const setDataView = () => {
      let storesViewDat ;
      if(cargando){
        try {
          storesViewDat = JSON.parse(sessionStorage.getItem("storesViewData"))
        } catch (error) {
          
        }
        if (storesViewDat){
          setAnt(true)
        }
        setCargando(false)
      }
      
    }
    setDataView();
  })
  const handleResize = () => {
    setW(window.innerWidth);
  };
  useEffect(() => {
    
    window.addEventListener("resize", handleResize);
    console.log("tamaño")
    return () => {
      
      window.removeEventListener("resize", handleResize);
      
    };
  }, []);
    const navigate = useNavigate();
    const { user, createCart } = useAuth();
    const {nombre} = useParams();
    const lista = data.data;
    const [seles, setSeles] = useState(true)
    const emprendimiento = lista.find(emprendimiento => emprendimiento.value.store.Path === nombre);  
    const agregar = async (producto) => {
      const cantidad = document.getElementById(producto._id).value;
      console.log(producto)
      const pedido = {
        User_id: user.uid,
        Emprendimiento_id: producto.Emprendimiento_id,
        Producto_id: producto._id,
        Cantidad: cantidad,
      }
      
      try{
        await createCart(pedido);
        document.getElementById(producto._id).value=0;
        document.getElementById(producto._id+"success").classList.remove("d-none");
        suc(producto._id)
      }
      catch(error){
        console.log(error);
      }
    }
    const Alert = () => {
      return (
        <div>
          <i className="fa-solid fa-circle-check me-1 text-success"></i>
          <span className="sm:inline block text-success">Producto añadido al carrito</span>
        </div>
      )
    }
    const suc = (id) => {
      setTimeout(() => {
        document.getElementById(id+"success").classList.add("d-none");
      }, 4000);
    }
    const PhotoProducts = (foto) =>{
      let fotos = foto.foto
      if (fotos){
        return(
          <img onClick={(e)=>{
            e.preventDefault();
            handleShowModal();
          }}
          className="d-block rounded img-producto"
          src={fotos[0]}
          alt="img"
          />
        )
      } else{

      }
    }
    const formatterPeso = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    })
    const PopOver = (data) =>{
      let desc = data.data.desc
      let i =  data.data.i
      const [show, setShow] = useState(false)
      console.log(desc)
      let popover
              
                popover = (
                  <Popover id={i} key={i}>
                    <Popover.Header as="h3" className="d-flex flex-row justify-content-between">
                    Descripción
                    <button type="button" className="btn-close text-end" aria-label="Close" onClick={(e)=>{
                      e.preventDefault()
                      setShow(false)
                    }}></button></Popover.Header>
                    <Popover.Body>
                      {desc}
                    </Popover.Body>
                  </Popover>
                );
              
      return(
        <OverlayTrigger show={show} trigger="click" placement="bottom" overlay={popover}>
                            <span role="button" onClick={(e)=>{
                              e.preventDefault()
                              setShow(!show)
                            }}>Ver más...</span>
                            </OverlayTrigger>
      )
      
    }
    const ExistsProducts = () => {
      if (emprendimiento.value.products){
        return(
          <div>
            {emprendimiento.value.products.map((producto, i) => {
              let precio = formatterPeso.format(producto.Precio)
              let fotos
              let desc
              let verMas
              if(producto.Descripcion.length){
                if(w<=950){
                  if (producto.Descripcion.length > 100){
                    desc = producto.Descripcion.substring(0,98).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                } else if(w<=1000){
                  if (producto.Descripcion.length > 118){
                    desc = producto.Descripcion.substring(0,116).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                }else if(w<=1100){
                  if (producto.Descripcion.length > 130){
                    desc = producto.Descripcion.substring(0,128).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                } 
                else if(w<=1200){
                  if (producto.Descripcion.length > 162){
                    desc = producto.Descripcion.substring(0,160).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                } 
                else if(w<=1250){
                  if (producto.Descripcion.length > 182){
                    desc = producto.Descripcion.substring(0,180).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                } 
                else if(w>1300){
                  if (producto.Descripcion.length > 240){
                    desc = producto.Descripcion.substring(0,238).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                }else{
                  if (producto.Descripcion.length > 220){
                    desc = producto.Descripcion.substring(0,218).concat("... ")
                    verMas = true
                  } else {
                    desc = producto.Descripcion
                  }
                }
                
              }
              console.log(producto.Nombre)
              console.log(producto.Descripcion.length)
              if (producto.Imagen){
                fotos = producto.Imagen.split(",")
              } else {
                fotos = [imgStore]
              }
              let c 
              if (w> 370){
                c= "Cantidad:"
              } else{
                c="Cant:"
              }
              
              return(<div className="card p-2 p-sm-3 p-md-3 p-lg-3 p-xl-3 p-xxl-3 mb-3">
                <div key={producto._id} className="d-flex flex-row justify-content-between">
                  
                    <div className="d-flex flex-row  justify-content-between">
                      <div className="d-flex flex-column justify-content-center">
                        <PhotoProducts foto={fotos} />
                      </div>
                      <div className="d-flex flex-column ms-2 me-3 ms-md-3 me-md-2 ps-md-2 pe-md-2 ms-lg-3 me-lg-3 ps-lg-3 pe-lg-3 ms-xl-3 me-xl-3 ps-xl-3 pe-xl-3 ms-xxl-3 me-xxl-3 ps-xxl-3 pe-xxl-3  justify-content-center producto-data">
                        <h3 className="ps-2 pe-2">{producto.Nombre}</h3>
                        <h5 className="ps-2 pe-2">Precio: {precio}</h5>
                        {producto.Descripcion && w>600 && <div className="ps-2 pe-2 desc">
                          Descripción: <span>{desc}</span>
                          {verMas && <span className="ver-mas-descripcion">
                            <PopOver data={{desc:producto.Descripcion, i:i}} />
                          </span>
                          }
                          </div>}
                      </div>
                    </div>
                    {w >= 750 && 
                    <div  className="d-flex flex-column justify-content-center">
                      <div className="d-flex flex-row  justify-content-evenly agregar-carrito-input">
                        <label>Cantidad:</label>
                        <input type="number" min="1" max="99" id={producto._id} defaultValue=""/>

                      </div>
                      <button className="btn btn-primary boton-agregar-carrito" onClick={(e) => {e.preventDefault(); agregar(producto) }}>
                        Agregar al carrito
                      </button>
                      <div className="m-1 d-none" id={`${producto._id}success`} ><Alert /></div>
                    </div>
                    }  
                  
                </div>
                {producto.Descripcion && w<=600 && <div className="ps-2 pe-2 desc">
                          Descripción: <span>{desc}</span>
                          {verMas && <span className="ver-mas-descripcion">
                            <PopOver data={{desc:producto.Descripcion, i:i}} />
                          </span>
                          }
                          </div>}
                {w < 750 && 
                  <div  className="d-flex flex-row justify-content-center mt-3 stores-btn-a">
                    <div className="d-flex flex-row  justify-content-evenly agregar-carrito-input-cel">
                      <label>{c}</label>
                      <input type="number" min="1" max="99" id={producto._id} defaultValue=""/>

                    </div>
                    <button className="btn btn-primary boton-agregar-carrito-cel" onClick={(e) => {e.preventDefault(); agregar(producto) }}>
                      Agregar al carrito
                    </button>
                    <div className="m-1 d-none" id={`${producto._id}success`} ><Alert /></div>
                  </div>
                  }  
                </div>
              )
            })
          }
        </div>
        )
      }
    };
    const [showModal, setShowModal] = useState("");
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    const ModalPhotos = () => {
      const [selected, setSelected] = useState(0);
      let fotos;
      if(emprendimiento.value.store.Imagen){
        fotos = emprendimiento.value.store.Imagen.split(",");
      }
      if (fotos.length > 1){
        return(
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
            <Modal.Header closeButton>
              <h3>Fotos de {emprendimiento.value.store.Nombre}</h3>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="m-2 d-flex  justify-content-center">
                  
                    <img
                    className="d-block m-2 rounded foto-modal"
                    src={fotos[selected]}
                    alt={selected}
                  />
                </div>
                <div className="d-flex flex-row justify-content-evenly mt-1">
                    {fotos.map((img, i) => {
                      return (
                        <button className="btn btn-ligth p-0" key={i} onClick={(e) => {e.preventDefault(); setSelected(i)}}>
                          <img
                          className="d-block rounded img-btn-modal"
                        
                          src={img}
                          alt={i}
                          />
                        </button>
                      )
                      })}
                  </div>
              </div>
            </Modal.Body>
          </Modal>
        )
      } else{
        return(
          <Modal show={showModal} onHide={handleCloseModal} backdrop="static">
            <Modal.Header closeButton>
              <h3>Foto de {emprendimiento.value.store.Nombre}</h3>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="m-2 d-flex  justify-content-center">
                  
                    <img
                    className="d-block m-2 rounded foto-modal"
                    src={fotos[0]}
                    alt={"Perfil"}
                  />
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )
      }
      
    }
    const PhotosViewCel= () =>{
      let fotos;
      const [selected, setSelected] = useState(0);
      if(emprendimiento.value.store.Imagen){
        fotos = emprendimiento.value.store.Imagen.split(",");
      }

      
      if (fotos){
        if (fotos.length > 1){
          if (seles){
            setTimeout(() => {
              if (selected === fotos.length-1){
                setSelected(0);
                  setSeles(false);
              } else{
                setSelected(selected+1)
              };
            }, 5000);
          }
          return (
            <div>
            <img onClick={(e)=>{
              e.preventDefault();
              handleShowModal();

            }}
              className="d-block imagen-btn-cel"
              
              src={fotos[selected]}
              alt="fotos"
              >
              
              </img>
            
            </div>
            
              
          )
        }else {
          return (
            <img
              className="d-block imagen-btn-cel"
              onClick={(e)=>{
                e.preventDefault();
                handleShowModal();
  
              }}
              src={fotos[0]}
              alt="fotos"
              />
          )
        }

      } else {
        return (
          <img
            className="d-block imagen-btn-cel"
            
            src={imgStore}
            alt="fotos"
            />
        )
      }

    }
    const PhotosView = () =>{
      let fotos;
      const [selected, setSelected] = useState(0);
      if(emprendimiento.value.store.Imagen){
        fotos = emprendimiento.value.store.Imagen.split(",");
      }

      
      if (fotos){
        if (fotos.length > 1){
          console.log(fotos.length)
          console.log(selected)
          
          
            if (seles){
              setTimeout(() => {
                if (selected === fotos.length-1){
                  setSelected(0);
                    setSeles(false);
                } else{
                  setSelected(selected+1)
                };
              }, 5000);
              }
            return(
              <div className="d-flex flex-column justify-content-center">
                <div className="d-flex flex-row m-2">
                <div className="d-flex flex-column justify-content-center mt-1">
                      {fotos.map((img, i) => {
                          return (
                                  <button className="botn-imagen btn btn-ligth p-0" key={i} onClick={(e) => {e.preventDefault(); setSelected(i)}}>
                                      <img 
                                      className="d-block rounded imagen-btn"
                              
                                      src={img}
                                      alt={i}
                                      />
                                  </button>
                              
                          )
                      })}
                      </div>
                      <img onClick={(e)=>{
                        e.preventDefault();
                        handleShowModal();
          
                      }}
                      className="d-block m-2 rounded img-principal"
                      src={fotos[selected]}
                      alt={selected}
                      />
                      
                      
                  </div>
              </div>
            )
          
          
          
          
        } else{
          return(
            <div className="d-flex flex-column justify-content-center align-middle m-2">
              <div className="d-flex flex-column justify-content-center align-middle">
                    <img onClick={(e)=>{
                      e.preventDefault();
                      handleShowModal();
        
                    }}
                    className="d-block  rounded img-principal"
                    src={fotos[0]}
                    alt="img"
                    />
                </div>
            </div>
          )
        }
      } else {
        return(
          <div>
            <div className="d-flex flex-row">
                  <img
                  className="d-block  rounded"
                  style={{ maxHeight: "325px", width: "100vh", objectFit: "cover" }}
                  src={imgStore}
                  alt="img-store"
                  />
              </div>
          </div>
        )
      }

    }

    const CalificacionView = () =>{

      let total = 0
      if (emprendimiento.value.store.Calificacion){
        let calificacion = emprendimiento.value.store.Calificacion;
        let totalCalificacion = 0;

        for (let i = 0; i < calificacion.length; i++){
          totalCalificacion = totalCalificacion + calificacion[i].Estrellas
        }
        total = totalCalificacion/calificacion.length;

      }
      let nums = [1,2,3,4,5]
      return(<div className="d-flex flex-row sstars">
        {
          nums.map((n)=>{
            console.log(n)
            
            return(<div key={n}>
              
              {n<=total && <i className="fa-solid fa-star star-1 estrella" id="star-1" />}
              {n>total && <i className="fa-regular fa-star star-1 estrella-vacia" id="star-1" />}
            </div>)
          })
        }
      </div>)
     

      
    }
    const DataViewEmprendimiento = () => {
      if (emprendimiento){
        return (
            <div className="card d-flex flex-row justify-content-start">
              {w >= 600 && <PhotosView />}
              <div className="card-body  d-flex flex-column justify-content-center caja-datos">
              {w >= 600 && <h5  className="card-title store-title">{emprendimiento.value.store.Nombre}</h5>}
                {emprendimiento.value.store.Calificacion && <div>
                  {w >= 600 && <CalificacionView />}
                </div>}
                {w >= 600 && <h4 className="card-text store-categoria">{w >= 600 && <span>Categoria: </span>}<span className="stores-cel">{emprendimiento.value.store.Categoria}</span></h4>}
                {w < 600 && <div className="d-flex flex-row mb-2">
                  <PhotosViewCel />
                  <div className="d-flex flex-column">
                    <h5 className="card-title store-title store-title-1">{emprendimiento.value.store.Nombre}</h5>
                    
                <h4 className="card-text store-categoria">{w>350 &&<span>Categoria: </span>}{emprendimiento.value.store.Categoria}</h4>
                  </div>
                  </div>}
                  {emprendimiento.value.store.Calificacion && w < 600 &&<div className="text-center d-flex flex-row">
                  <span className="me-1">Calificación:</span><CalificacionView />
                </div>}
                  <h3 className="card-text store-ciudad"><span>Ciudad: </span><span className="stores-cel">{emprendimiento.value.store.Ciudad}</span></h3>

                <h3 className="card-text store-celular">{w >= 600 && <span>Celular: </span>}{w < 600 && <span>Celular: </span>}<span className="stores-cel">{emprendimiento.value.store.Celular}</span></h3>
                
                {emprendimiento.value.store.Telefono &&
                  w >= 600 &&<h4 className="card-text store-categoria">
                    {w >= 600 && <span>Telefono: </span>}<span className="stores-cel">
                    {emprendimiento.value.store.Telefono}</span>
                  </h4>
                  
                }       
                
                {emprendimiento.value.store.Direccion && <h4 className="card-text store-categoria">
                  {w >= 800 && <span>Dirección: </span>}<span className="stores-cel">
                  {emprendimiento.value.store.Direccion}</span></h4>}
                  {w> 300 && <span>
                    {w > 300 && <h4 className="card-text store-email">
                          {w >950 && <span>E-mail: </span>}
                          
                          
                          <span className="stores-cel">{emprendimiento.value.store.Email}</span></h4>}
                        
                    </span>}
                
              </div>  
            </div>
          
          
        );
      }
    };
    
    
      return (
        <div className="text-center">
        <ModalPhotos></ModalPhotos>
          {ant && <button className="btn btn-primary m-2" onClick={(e)=> {e.preventDefault(); navigate(-1)}}>
            Volver a Emprendimientos
          </button>}
          
          <div className="accordion ms-4 me-4 ms-md-4 me-md-4 ms-lg-5 me-lg-5 ms-xl-5 me-xl-5 ms-xxl-5 me-xxl-5 mb-4" id="accordionStore">
            <div className="accordion-item">
              <h2 className="accordion-header" id="accordionStore-headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordionStore-collapseOne" aria-expanded="true" aria-controls="accordionStore-collapseOne">
                  Información de {emprendimiento.value.store.Nombre}
                </button>
              </h2>
              <div id="accordionStore-collapseOne" className="accordion-collapse collapse show" aria-labelledby="accordionStore-headingOne">
                <div className="accordion-body text-start pe-4 ps-4">
                  <DataViewEmprendimiento />
                </div>
              </div>
            </div>
            {emprendimiento.value.products.length > 0 && <div className="accordion-item">
              <h2 className="accordion-header" id="accordionStore-headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionStore-collapseTwo" aria-expanded="false" aria-controls="accordionStore-collapseTwo">
                  Productos de {emprendimiento.value.store.Nombre}
                </button>
              </h2>
              <div id="accordionStore-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="accordionStore-headingTwo">
                <div className="accordion-body  text-start pe-4 ps-4">
                  <ExistsProducts />
                </div>
              </div>
            </div>}
            
          </div>
          
        </div>
      )
    
};
  export default Store;