import { useState } from "react";
import { Link } from "react-router-dom";

function Stores(data) {
    const lista = data.data;
    const [newList, setNewList] = useState(null);
    const DataView = () => {
      if (lista){
        console.log(lista)
        return (
          <div className="d-flex flex-row">
            {lista.map((data) => {
              return (
                  <div className="card col-3" key={data.key}>
                    <img src={data.value.store.Imagen} className="card-img-top rounded" alt="..." />
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
          <div className="d-flex flex-row">
            {newList.map((data) => {
              return (
                
                  <div className="card col-3" key={data.key}>
                    <img src={data.value.store.Imagen} className="card-img-top rounded" alt="..." />
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
    
    const ciudades = ['Bogotá', 'Medellín - Antioquia', 'Cali - Valle del Cauca', 'Barranquilla - Atlántico', 'Cartagena - Bolívar', 'Cúcuta - Norte de Santander', 'Pereira - Risaralda', 'Bucaramanga - Santander', 'Valledupar - Cesar', 'Ibagué - Tolima', 'Villavicencio - Meta', 'Santa Marta - Magdalena', 'Montería - Córdoba', 'Manizales - Caldas', 'Pasto - Nariño', 'Neiva - Huila', 'Armenia - Quindío', 'Popayán - Cauca', 'Sincelejo - Sucre', 'Tunja - Boyacá', 'Yopal - Casanare', 'Ríohacha - La Guajira', 'Florencia - Caquetá', 'Quibdó - Chocó', 'Arauca - Arauca', 'San Andrés - San Andrés y Providencia', 'San José del Guaviare - Guaviare', 'Leticia - Amazonas', 'Mitú - Vaupés', 'Mocoa - Putumayo', 'Inírida - Guainía', 'Puerto Carreño - Vichada'];
      const cityList = ciudades.map((city) => {
          return (
              <option key={city} value={city} className="text-dark">
                  {city}
              </option>
          );
      });
    const categorias = [ "Moda", "Artesanias", "Turismo", "Tecnología", "Comida", "Belleza", "Salud y Bienestar", "Niños y Bebes", "Deportes", "Hogar", "Servicios", "Otros" ];
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
        <div className="d-flex flex-row">
          <div className="col-3 bg-dark">
            <div>
              <form>
                <select onChange={handleSearch} id="categoriaSelect" defaultValue="">
                  <option value="">Ninguna</option>
                  {categoriaList}
                </select>
                <span><button onClick={clearCategoria}>Borrar</button></span>
                <select onChange={handleSearch} id="citySelect" defaultValue="">
                <option value="">Ninguna</option>
                  {cityList}
                </select>
                <span><button onClick={clearCity}>Borrar</button></span>
              </form>
            </div>
          </div>
            <DataViewCategoria />
        </div>
      );
    }
    if (lista){
      return (
        <div className="d-flex flex-row">
          <div className="col-3 bg-dark">
            <div>
              <form>
                <select onChange={handleSearch} id="categoriaSelect" defaultValue="">
                <option value="">Ninguna</option>
                  {categoriaList}
                </select>
                <span><button onClick={clearCategoria}>Borrar</button></span>
                <select onChange={handleSearch} id="citySelect" defaultValue="">
                <option value="">Ninguna</option>
                  {cityList}
                </select>
                <span><button onClick={clearCity}>Borrar</button></span>
              </form>
            </div>
          </div>
            <DataView />
        </div>
      );
    }
};
  export default Stores;