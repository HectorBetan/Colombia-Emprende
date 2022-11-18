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
  const [show, setShow] = useState(null)
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
    const PhotoProducts = (data) =>{
      let fotos = data.data.fotos
      let i = data.data.i
      
      let producto = data.data.producto
      let imgProd = data.data.imgProd
      const [select, setSelect] = useState(0)
      
      const [showModalPro, setShowModalProd] = useState(null)
      const handleClose=()=>{
        setShowModalProd(null)
        setShow(null)
      }
      const handleShow=(x)=>{
        setShowModalProd(x)
      }
      useEffect(() => {
          if(show === i){
            setShowModalProd(i);
          }
      },[i]);
      if (fotos){
        return(<span>
          <img role="button"
          className="d-block rounded img-producto"
          onClick={(e)=>{
            e.preventDefault()
            setShow(i)
            handleShow(i)
          }}
          src={fotos[0]}
          alt="img"
          />
          <Modal show={showModalPro === i} onHide={handleClose} id={`productModal-${i}`}  backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Fotos de Producto: {producto}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div>
                    <div className="d-flex  justify-content-center">
                      
                        <img
                        className="d-block rounded foto-modal"
                        src={fotos[select]}
                        alt={select}
                      />
                    </div>
                    {fotos.length > 1 && 
                    <div className="d-flex flex-row justify-content-evenly mt-2 pt-2">
                        {fotos.map((img, i) => {
                          return (
                            <button className="btn btn-ligth p-0" key={i} onClick={(e) => {e.preventDefault(); setSelect(i)}}>
                              <img
                              className="rounded img-btn-modal"
                            
                              src={img}
                              alt={i}
                              />
                            </button>
                          )
                          })}
                    </div>}
                  </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
            </Modal.Footer>
          </Modal>
          
          
          </span>
        )
        
      } else{
        return(<span>
          <img
          className="d-block rounded img-producto"
          src={imgProd}
          alt="img"
          />
          </span>
        )
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
      let key = `key-${i}`
      const [show, setShow] = useState(false)
      console.log(desc)
      let popover
                popover = (
                  <Popover id={i} key={key}>
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
              let imgProd
              console.log(producto.Nombre)
              console.log(producto.Descripcion.length)
              if (producto.Imagen){
                fotos = producto.Imagen.split(",")
              } else {
                imgProd = [imgStore]
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
                        <PhotoProducts data={{fotos:fotos, i:i, producto:producto.Nombre, imgProd:imgProd}} />
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
      let desc = "";
      let descripcion = ""
      let verMas = false
      
      if (emprendimiento.value.store.Descripcion){
        desc = emprendimiento.value.store.Descripcion
        
        
        if(w> 700){
          if (desc.length > 290){
            descripcion = desc.substring(0,288).concat("... ")
            verMas= true
          }
          
          else{
            descripcion = desc
          }
        }
        if (w < 700){
          if (desc.length > 200){
            descripcion = desc.substring(0,198).concat("... ")
            verMas= true
          }
          
          else{
            descripcion = desc
          }
        }
        if(w< 550){
          if (desc.length > 150){
            descripcion = desc.substring(0,148).concat("... ")
            verMas= true
          }
          
          else{
            descripcion = desc
          }
        }
        if(w< 500){
          if (desc.length > 120){
            descripcion = desc.substring(0,118).concat("... ")
            verMas= true
          }
          
          else{
            descripcion = desc
          }
        }
        if(w< 450){
          if (desc.length > 100){
            descripcion = desc.substring(0,98).concat("... ")
            verMas= true
          }
          
          else{
            descripcion = desc
          }
        }
        if(w< 370){
          if (desc.length > 85){
            descripcion = desc.substring(0,83).concat("... ")
            verMas= true
          }
          
          else{
            descripcion = desc
          }
        }
      }
        
      
      if (emprendimiento){
        let face
        let insta
        let web
        let ht ="https:"
        if (emprendimiento){
          
        }
        if (emprendimiento.value.store.Facebook){
          if(emprendimiento.value.store.Facebook.includes("http")){
            console.log("a")
            face = emprendimiento.value.store.Facebook
          } else{
            console.log("b")
            face = ht+emprendimiento.value.store.Facebook
          }
        }
        if (emprendimiento.value.store.Instagram){
          if(emprendimiento.value.store.Instagram.includes("http")){
            insta = emprendimiento.value.store.Instagram
          }else{
            insta = ht+emprendimiento.value.store.Instagram
          }
        }
        if (emprendimiento.value.store.Web){
          if(emprendimiento.value.store.Instagram.includes("http")){
            web = emprendimiento.value.store.Web
          }else{
            web= ht+emprendimiento.value.store.Web
          }
        }
        return (<div className="card pb-3">
            <div className="d-flex flex-row justify-content-start">
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
            {emprendimiento.value.store.Descripcion && <hr />}
            {emprendimiento.value.store.Descripcion && <div className="ps-3 pe-3 store-descripcion">
              <b>Descripcion: </b>{descripcion} 
              {verMas && <span className="ver-mas-descripcion">
                            <PopOver data={{desc:emprendimiento.value.store.Descripcion, i:0}} />
                          </span>
                          }
              </div>}
              {(emprendimiento.value.store.Facebook || emprendimiento.value.store.Instagram || emprendimiento.value.Web) && <hr />}
              <div className="d-flex flex-row justify-content-center ">
                {emprendimiento.value.store.Facebook && <span>
                  <a role="button" className="btn botonredes ms-4 me-4" href={face} target="_blank" rel="noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" heigth="40" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg>
                      
                      {w>=700 &&<span className="ms-2">Facebook</span>}
                    </a>
                  </span>}
                {emprendimiento.value.store.Instagram && <span>
                  <a role="button" href={insta} target="_blank" rel="noreferrer" className="btn botonredes ms-4 me-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="logoinsta" width="36" heigth="35" viewBox="0 0 448 512"><path d="M224,202.66A53.34,53.34,0,1,0,277.36,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.41-30.41c-21-8.29-71-6.43-94.3-6.43s-73.25-1.93-94.31,6.43a54,54,0,0,0-30.41,30.41c-8.28,21-6.43,71.05-6.43,94.33S91,329.26,99.32,350.33a54,54,0,0,0,30.41,30.41c21,8.29,71,6.43,94.31,6.43s73.24,1.93,94.3-6.43a54,54,0,0,0,30.41-30.41c8.35-21,6.43-71.05,6.43-94.33S357.1,182.74,348.75,161.67ZM224,338a82,82,0,1,1,82-82A81.9,81.9,0,0,1,224,338Zm85.38-148.3a19.14,19.14,0,1,1,19.13-19.14A19.1,19.1,0,0,1,309.42,189.74ZM400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32ZM382.88,322c-1.29,25.63-7.14,48.34-25.85,67s-41.4,24.63-67,25.85c-26.41,1.49-105.59,1.49-132,0-25.63-1.29-48.26-7.15-67-25.85s-24.63-41.42-25.85-67c-1.49-26.42-1.49-105.61,0-132,1.29-25.63,7.07-48.34,25.85-67s41.47-24.56,67-25.78c26.41-1.49,105.59-1.49,132,0,25.63,1.29,48.33,7.15,67,25.85s24.63,41.42,25.85,67.05C384.37,216.44,384.37,295.56,382.88,322Z"/></svg>
                  {w>=700 &&<span className="ms-2">Instagram</span>}
                    </a>
                  </span>}


                {emprendimiento.value.store.Web && <span>
                  <a role="button" href={web} target="_blank" rel="noreferrer" className="btn botonredes ms-4 me-4">
                  <svg className="p-1" xmlns="http://www.w3.org/2000/svg" width="40" heigth="40" viewBox="0 0 512 512"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>
                  {w>=700 &&<span className="ms-2">Página Web</span>}
                    
                    </a>
                </span>}
              </div>
            </div>
            
          
        );
      }
    };
    if (cargando) {return (<div>
      <div className="d-flex justify-content-center m-5">
        <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>)} else{
    
      return (
        <div className="text-center">
        <ModalPhotos></ModalPhotos>
          {ant && <button className="btn btn-primary m-2" onClick={(e)=> {e.preventDefault(); navigate(-1)}}>
            Volver a Emprendimientos
          </button>}
          
          <div className="accordion ms-4 me-4 ms-md-4 me-md-4 ms-lg-5 me-lg-5 ms-xl-5 me-xl-5 ms-xxl-5 me-xxl-5 mb-4" id="accordionStore">
            <div className="accordion-item">
              <h2 className="accordion-header" id="accordionStore-headingOne">
                <button className="accordion-button  acordeon-tienda" type="button" data-bs-toggle="collapse" data-bs-target="#accordionStore-collapseOne" aria-expanded="true" aria-controls="accordionStore-collapseOne">
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
                <button className="accordion-button collapsed acordeon-tienda" type="button" data-bs-toggle="collapse" data-bs-target="#accordionStore-collapseTwo" aria-expanded="false" aria-controls="accordionStore-collapseTwo">
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
    }
};
  export default Store;