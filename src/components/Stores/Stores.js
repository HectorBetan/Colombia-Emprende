import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {categorys} from '../../models/Categorys.model'
import {citys} from '../../models/City.model';
import imgStore from "../../assets/img-store.jpg"
function Stores(data) {
  const [w, setW] = useState(window.innerWidth);
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
    const lista = data.data;
    const [newList, setNewList] = useState(null);
  
    const DataView = () => {
      if (lista){
        console.log(lista)
        return (
          <div className="">
            {lista.map((data) => {
              let img;
              if (!data.value.store.Imagen){
                  img = imgStore;
              }
              else {
                console.log(data.value.store.Imagen)
                  img = data.value.store.Imagen;
              }
              return (
                <div  key={data.key} className="card   store-box">
                  <div className="d-flex flex-row">
                    <img src={img} className="card-img-top rounded img-tiendas" alt="..." />
                    <div className="card-body card-caja">
                    <h5  className="card-title store-title">{data.value.store.Nombre}</h5>
                      
                      <h4 className="card-text store-categoria">{w >= 325 && <span>Categoria: </span>}<span className="stores-cel">{data.value.store.Categoria}</span></h4>
                      <h3 className="card-text store-ciudad">{w >= 325 && <span>Ciudad: </span>}<span className="stores-cel">{data.value.store.Ciudad}</span></h3>
                      <h3 className="card-text store-celular">{w >= 325 && <span>Celular: </span>}<span className="stores-cel">{data.value.store.Celular}</span></h3>
                      {w > 670 && <h4 className="card-text store-email">
                        {w >670 && <span>E-mail: </span>}
                        
                        
                        <span className="stores-cel">{data.value.store.Email}</span></h4>}
                      {w <= 670 && w > 575 && data.value.store.Nombre.length <= 24 && <h4 className="card-text store-email">
                      {w >575 && data.value.store.Email.length <20 && <span>E-mail: </span>}
                        <span className="stores-cel">{data.value.store.Email}</span></h4>}
                      {w <= 575 && w > 500 && data.value.store.Nombre.length <= 24 && <h4 className="card-text store-email">
                      {w >500 && data.value.store.Email.length <20 && <span>E-mail: </span>}
                        <span className="stores-cel">{data.value.store.Email}</span></h4>}
                    </div>  
                  </div>
                  <div  className="text-center pb-2 card-footer">
                    <Link  to={`/emprendimientos/${data.value.store.Path}`} className="btn btn-primary text-center boton-tienda">
                      Ir a la Tienda
                    </Link>
                  </div>
                </div>
                
              );
            }
            )}
          </div>
        );
      }
    };
    const DataViewCategoria = () => {
      if (newList){
        return (
          <div className="">
            {newList.map((data) => {
              let img;
              if (!data.value.store.Imagen){
                  img = imgStore;
              }
              else {
                console.log(data.value.store.Imagen)
                  img = data.value.store.Imagen;
              }
              return (
                <div  key={data.key}  className="card   store-box">
                  <div className="card d-flex flex-row">
                    <img src={img} className="card-img-top rounded img-tiendas" alt="..." />
                    <div className="card-body card-caja">
                    <h5  className="card-title store-title">{data.value.store.Nombre}</h5>
                      
                    <h4 className="card-text store-categoria">{w >= 325 && <span>Categoria: </span>}<span className="stores-cel">{data.value.store.Categoria}</span></h4>
                      <h3 className="card-text store-ciudad">{w >= 325 && <span>Ciudad: </span>}<span className="stores-cel">{data.value.store.Ciudad}</span></h3>
                      <h3 className="card-text store-celular">{w >= 325 && <span>Celular: </span>}<span className="stores-cel">{data.value.store.Celular}</span></h3>
                      {w > 670 && <h4 className="card-text store-email">
                        {w >670 && <span>E-mail: </span>}
                        
                        
                        <span className="stores-cel">{data.value.store.Email}</span></h4>}
                      {w <= 670 && w > 575 && data.value.store.Nombre.length <= 24 && <h4 className="card-text store-email">
                      {w >575 && data.value.store.Email.length <20 && <span>E-mail: </span>}
                        <span className="stores-cel">{data.value.store.Email}</span></h4>}
                      {w <= 575 && w > 500 && data.value.store.Nombre.length <= 24 && <h4 className="card-text store-email">
                      {w >500 && data.value.store.Email.length <20 && <span>E-mail: </span>}
                        <span className="stores-cel">{data.value.store.Email}</span></h4>}
                    </div>  
                  </div>
                  <div  className="text-center pb-2 card-footer d-grid gap-2 d-md-block">
                  <Link  to={`/emprendimientos/${data.value.store.Path}`} className="btn btn-primary text-center boton-tienda">
                    Ir a la Tienda
                  </Link>
                  </div>
                </div>
              );
            }
            )}
          </div>
        );
      }
    };
    
    const ciudades = citys;
      const cityLista = ciudades.map((city) => {
          return (
              <option key={city} value={city} className="text-dark">
                  {city}
              </option>
          );
      });
    const categorias = categorys;
      const categoriaList = categorias.map((categoria) => {
        return (
          <option key={categoria} value={categoria} className="text-dark">
              {categoria}
          </option>
        );
      });
    const search = (categoriaSelect, citySelect) => {
        let list;
        if (categoriaSelect && citySelect) {
            list = lista.filter((data) => {
              return data.value.store.Ciudad === citySelect && data.value.store.Categoria === categoriaSelect;
            });
          }
          if (citySelect && !categoriaSelect) {
            list = lista.filter((data) => {
              return data.value.store.Ciudad === citySelect;
            });
          }
          if (categoriaSelect && !citySelect) {
            list = lista.filter((data) => {
              return data.value.store.Categoria === categoriaSelect;
            });
          }
          if (!categoriaSelect && citySelect) {
            list = lista.filter((data) => {
              return data.value.store.Ciudad === citySelect;
            });
          }
          if (!citySelect && !categoriaSelect) {return setNewList(null);}
          setNewList(list);
          
    }
    const handleSearch = (e) => {
      e.preventDefault();
      let categoriaSelect = document.getElementById("categoriaSelect").value;
      let citySelect = document.getElementById("citySelect").value;
      search(categoriaSelect, citySelect);
    };
    const clearCategoria = (e) => {
      e.preventDefault();
      document.getElementById("categoriaSelect").value = "";
      let categoriaSelect = false;
      let citySelect = document.getElementById("citySelect").value;
      search(categoriaSelect, citySelect);
    }
    const clearCity = (e) => {
      e.preventDefault();
      document.getElementById("citySelect").value = "";
      let categoriaSelect = document.getElementById("categoriaSelect").value;
      let citySelect = false;
      search(categoriaSelect, citySelect);
    };
    if (newList){
      return (
        <div className="">
          <div className="bg-info d-flex flex-row justify-content-center">
            <div>
              <form className="d-flex flex-row  justify-content-center">
                <select onChange={handleSearch} id="categoriaSelect" defaultValue="" className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg">
                  <option value="">Ninguna</option>
                  {categoriaList}
                </select>
                <span><button onClick={clearCategoria} className="btn btn-lg btn-secondary m-2 boton-borrar">Borrar</button></span>
                <select onChange={handleSearch} id="citySelect" defaultValue="" className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg">
                <option value="">Ninguna</option>
                  {cityLista}
                </select>
                <span><button onClick={clearCity} className="btn btn-lg btn-secondary m-2 boton-borrar">Borrar</button></span>
              </form>
            </div>
          </div>
            <DataViewCategoria />
        </div>
      );
    }
    if (lista){
      return (
        <div className="">
          <div className="bg-info d-flex flex-row justify-content-center">
            <div>
              <form className="d-flex flex-row  justify-content-center">
                <select className="form-select form-select-lg selection-forma m-2 ps-2 pe-2 seleccion" onChange={handleSearch} id="categoriaSelect" defaultValue="">
                <option value="">Ninguna</option>
                  {categoriaList}
                </select>
                <span><button onClick={clearCategoria} className="btn btn-lg btn-secondary m-2 boton-borrar">Borrar</button></span>
                <select onChange={handleSearch} id="citySelect" defaultValue="" className="selection-forma seleccion ps-2 pe-2 m-2 form-select form-select-lg">
                <option value="">Ninguna</option>
                  {cityLista}
                </select>
                <span><button onClick={clearCity} className="btn btn-lg btn-secondary m-2 boton-borrar">Borrar</button></span>
              </form>
            </div>
          </div>
            <DataView />
        </div>
      );
    }
};
  export default Stores;