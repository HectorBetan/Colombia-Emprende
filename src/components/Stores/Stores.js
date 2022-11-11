import { useState } from "react";
import { Link } from "react-router-dom";
import {categorys} from '../../models/Categorys.model'
import {citys} from '../../models/City.model';
function Stores(data) {
    const lista = data.data;
    const [newList, setNewList] = useState(null);
    const DataView = () => {
      if (lista){
        console.log(lista)
        return (
          <div className="">
            {lista.map((data) => {
              return (
                  <div className="card d-flex flex-row ms-5 me-5 mt-4 mb-4" key={data.key}>
                    <img src={data.value.store.Imagen} className="card-img-top rounded img-tiendas" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{data.value.store.Nombre}</h5>
                      <p className="card-text">{data.value.store.Descripcion}</p>
                      <Link  to={`/emprendimientos/${data.value.store.Path}`}  data={data} className="btn btn-primary">
                        Ver más
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
              return (
                
                  <div className="card d-flex flex-row ms-5 me-5 mt-4 mb-4" key={data.key}>
                    <img src={data.value.store.Imagen} className="card-img-top rounded img-tiendas" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{data.value.store.Nombre}</h5>
                      <p className="card-text">{data.value.store.Descripcion}</p>
                      <Link  to={`/emprendimientos/${data.value.store.Path}`} className="btn btn-primary">
                        Ver más
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