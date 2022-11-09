import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
function Store(data) {
    const navigate = useNavigate();
    const { user, createCart } = useAuth();
    const {nombre} = useParams();
    const lista = data.data;
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
     
    const DataViewEmprendimiento = () => {
      if (emprendimiento){
        return (
            <div className="card d-flex flex-row">
              <img src={emprendimiento.value.store.Imagen} className="card-img-left rounded col-3" style={{maxHeight: '300px'}} alt="..." />
              <div className="card-body col-9">
                <h5 className="card-title">{emprendimiento.value.store.Nombre}</h5>
                <p className="card-text">{emprendimiento.value.store.Descripcion}</p>
              </div>  
            </div>
          
          
        );
      }
    };
    
    
      return (
        <div>
          <button onClick={(e)=> {e.preventDefault(); navigate(-1)}}>Volver</button>
            <DataViewEmprendimiento />
            <ExistsProducts />
        </div>
      )
    
};
  export default Store;