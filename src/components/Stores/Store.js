import React from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import imgStore from "../../assets/img-store.jpg";
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
    const ExistsProducts = () => {
      if (emprendimiento.value.products){
        return(
          <div>
            {emprendimiento.value.products.map((producto) => {
              return(
                <div key={producto._id} className="d-flex flex-row">
                  <h3>{producto.Nombre}</h3>
                  <input type="number" min="1" max="99" id={producto._id} defaultValue="0"/>
                  <button onClick={(e) => {e.preventDefault(); agregar(producto) }}>Agregar al carrito</button>
                  <div className="m-1 d-none" id={`${producto._id}success`} ><Alert /></div>
                </div>
              )
            })
          }
        </div>
        )
      }
    };
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
            <img
              className="d-block circle imagen-btn-cel"
              
              src={fotos[selected]}
              alt="fotos"
              />
          )
        }else {
          return (
            <img
              className="d-block circle imagen-btn-cel"
              
              src={fotos[0]}
              alt="fotos"
              />
          )
        }

      } else {
        return (
          <img
            className="d-block imagen-btn-cel"
            
            src={fotos[0]}
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
          
          if (w>767){
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
              <div>
                <div className="d-flex flex-row m-2">
                <div className="d-flex flex-column mt-1">
                      {fotos.map((img, i) => {
                          return (
                                  <button className="m-1 botn-imagen" key={i} onClick={(e) => {e.preventDefault(); setSelected(i)}}>
                                      <img
                                      className="d-block rounded imagen-btn"
                              
                                      src={img}
                                      alt={i}
                                      />
                                  </button>
                              
                          )
                      })}
                      </div>
                      <img
                      className="d-block m-2 rounded img-principal"
                      src={fotos[selected]}
                      alt={selected}
                      />
                      
                      
                  </div>
              </div>
            )
          }
          else {
            if (seles){
              setTimeout(() => {
                if (selected === fotos.length-2){
                  setSelected(0);
                    setSeles(false);
                } else{
                  setSelected(selected+1)
                };
              }, 5000);
              }
            return(
              <div className="d-flex flex-column justify-content-center m-2">
                <img
                      className="d-block m-2 rounded img-principal-cel"
                      src={fotos[selected]}
                      alt={selected}
                      />
                <img
                      className="d-block m-2 rounded img-principal-cel"
                      src={fotos[selected+1]}
                      alt={selected}
                      />
              </div>
            )
          }
          
          
        } else{
          return(
            <div className="d-flex flex-column justify-content-center align-middle m-2">
              <div className="d-flex flex-column justify-content-center align-middle">
                    <img
                    className="d-block  rounded img-principal-cel"
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
      return(<div className="d-flex flex-row">
        {
          nums.map((n)=>{
            console.log(n)
            
            return(<div key={n}>
              
              {n<=total && <i className="fa-solid fa-star star-1" id="star-1" />}
              {n>total && <i className="fa-regular fa-star star-1" id="star-1" />}
            </div>)
          })
        }
      </div>)
     

      
    }
    const DataViewEmprendimiento = () => {
      if (emprendimiento){
        return (
            <div className="card d-flex flex-row justify-content-start">
              {w >= 550 && <PhotosView />}
              
              
              
              <div className="card-body  d-flex flex-column justify-content-center caja-datos">
              {w >= 550 && <h5  className="card-title store-title">{emprendimiento.value.store.Nombre}</h5>}
                {emprendimiento.value.store.Calificacion && <div>
                  {w >= 550 && <CalificacionView />}
                </div>}
                {w >= 550 && <h4 className="card-text store-categoria">{w >= 550 && <span>Categoria: </span>}<span className="stores-cel">{emprendimiento.value.store.Categoria}</span></h4>}
                {w < 550 && <div className="d-flex flex-row mb-2">
                  <PhotosViewCel />
                  <div className="d-flex flex-column">
                    <h5 className="card-title store-title">{emprendimiento.value.store.Nombre}</h5>
                    {emprendimiento.value.store.Calificacion && <div>
                  <CalificacionView />
                </div>}
                <h4 className="card-text store-categoria">{w>350 &&<span>Categoria: </span>}{emprendimiento.value.store.Categoria}</h4>
                  </div>
                  </div>}
                  <h3 className="card-text store-ciudad"><span>Ciudad: </span><span className="stores-cel">{emprendimiento.value.store.Ciudad}</span></h3>

                <h3 className="card-text store-celular">{w >= 600 && <span>Celular: </span>}{w < 600 && <span>Cel: </span>}<span className="stores-cel">{emprendimiento.value.store.Celular}</span></h3>
                
                {emprendimiento.value.store.Telefono &&
                  w >= 550 &&<h4 className="card-text store-categoria">
                    {w >= 600 && <span>Telefono: </span>}<span className="stores-cel">
                    {emprendimiento.value.store.Telefono}</span>
                  </h4>
                  
                }       
                {w> 670 && <span>
                  {w > 950 && <h4 className="card-text store-email">
                        {w >950 && <span>E-mail: </span>}
                        
                        
                        <span className="stores-cel">{emprendimiento.value.store.Email}</span></h4>}
                      
                  </span>}
                
                {emprendimiento.value.store.Direccion && <h4 className="card-text store-categoria">
                  {w >= 800 && <span>Dirección: </span>}<span className="stores-cel">
                  {emprendimiento.value.store.Direccion}</span></h4>}

                
              </div>  
            </div>
          
          
        );
      }
    };
    
    
      return (
        <div className="text-center">
          {ant && <button className="btn btn-primary m-2" onClick={(e)=> {e.preventDefault(); navigate(-1)}}>
            Volver a Emprendimientos
          </button>}
          
          <div className="accordion ms-5 me-5 mb-4" id="accordionStore">
            <div className="accordion-item">
              <h2 className="accordion-header" id="accordionStore-headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordionStore-collapseOne" aria-expanded="true" aria-controls="accordionStore-collapseOne">
                  Información de {emprendimiento.value.store.Nombre}
                </button>
              </h2>
              <div id="accordionStore-collapseOne" className="accordion-collapse collapse show" aria-labelledby="accordionStore-headingOne">
                <div className="accordion-body text-start">
                  <DataViewEmprendimiento />
                </div>
              </div>
            </div>
            {emprendimiento.value.products && <div className="accordion-item">
              <h2 className="accordion-header" id="accordionStore-headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#accordionStore-collapseTwo" aria-expanded="false" aria-controls="accordionStore-collapseTwo">
                  Productos de {emprendimiento.value.store.Nombre}
                </button>
              </h2>
              <div id="accordionStore-collapseTwo" className="accordion-collapse collapse show" aria-labelledby="accordionStore-headingTwo">
                <div className="accordion-body  text-start">
                  <ExistsProducts />
                </div>
              </div>
            </div>}
            
          </div>
          
        </div>
      )
    
};
  export default Store;