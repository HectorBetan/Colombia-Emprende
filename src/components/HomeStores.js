import '../styles/Carousel.style.css';
import { usePublic } from "../context/PublicContext";
import { useState, useEffect } from 'react';
import imgStore from "../assets/img-store.jpg"
import { Link } from 'react-router-dom';
function HomeStores() {
    const { sixStores } = usePublic();
      const [cargando, setCargando] = useState(true);
      const [start, setStart] = useState(true);
      const [storesHome, setStoresHome] = useState(null)
      const [w, setW] = useState(window.innerWidth)

      const handleResize = () => {
        setW(window.innerWidth);
        setStart(true)
      };
      useEffect(() => {
        
        window.addEventListener("resize", handleResize);
        console.log("tamaño")
        return () => {
          
          window.removeEventListener("resize", handleResize);
          
        };
      }, []);
      useEffect(()=>{
        const setI = () =>{
          if (start && sixStores){
            console.log(w)
            let lista = [];
            let tiendas = [];
            let m = 0;
            let t = 0;
            if (w > 900){
                m = 3;
                t = 2;
            }
            else if (w <= 900){
                m = 2;
                t = 1;
            }

            for (let i in sixStores){
                lista.push(sixStores[i])
                console.log(i%1)
                console.log(i%2)
                console.log(i%3)
                if (i%m === t){
                    tiendas.push(lista);
                    lista = [];
                }
            }
            setStoresHome(tiendas)
            setStart(false)
            setCargando(false)
            console.log(sixStores)
          }
        }
        setI();
      },[start, sixStores, w]);
      if (cargando){
        return(
          <div>
            <div className="d-flex justify-content-center m-5 p-5">
              <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )
      }
      if (sixStores && !cargando && storesHome){
        return (
          <div className="d-flex justify-content-evenly">
            <div>
                {storesHome.map((group, s)=>{
                    return(
                        <div key={s} className="d-flex justify-content-evenly">{
                        group.map((store,i)=>{
                            let img;
                            if (!store.Imagen){
                                img = imgStore;
                            }
                            else {
                                img = store.Imagen
                            }
                            console.log(store.Nombre.length)
                            let p = "...";
                            let nombre = "";
                            let fin;
                            if (store.Nombre.length > 21){
                                if (w < 400){
                                    fin = 16
                                } else{
                                    fin = 20
                                }
                                let y = store.Nombre.length - fin;
                                let newNom = store.Nombre.slice(0,-y);
                                nombre = newNom.concat(p)
                            }

                            return(
                              <div key={i} className="stores-home">
                                <div className="card">
                                  <div className="card-body">
                                  {!nombre && <h5 className="card-title">
                                                {store.Nombre}
                                            </h5>}  
                                            {nombre && <h5 className="card-title">
                                                {nombre}
                                            </h5>} 
                                    <div className='d-flex  justify-content-evenly'>
                                    <div className="">
                                      <img src={img} className="card-img-top rounded" alt="..." />
                                    </div>
                                        <div className='m-lg-2 m-xl-2 m-xxl-2 m-md-2 m-1'>
                                            <span className='stores-home-text d-flex'>
                                                <p>Ciudad:</p>
                                                <h5 className=" text-start">
                                                    {store.Ciudad}
                                                </h5>
                                            </span>
                                            <span className='stores-home-text d-flex'>
                                                <p>Celular:</p>
                                                <h5 className=" text-start">
                                                    {store.Celular}
                                                </h5>
                                            </span>
                                            <span className='stores-home-categoria d-flex'>
                                                <p>Categoria:</p>
                                                <h6 className=" text-start">
                                                    {store.Categoria}
                                                </h6>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    
                                    
                                  </div>
                                  <div className="card-footer text-center">
                                    
                                    <Link  to={`/emprendimientos/${store.Path}`}  data={store} className="btn btn-primary">
                                    Ir a la tienda
                      </Link>
                                  </div>
                                </div>
                              </div>
                            )
                        })
                    }</div>
                    )
                })}
            </div>
            
          </div>
        )
      }
    

  }

  export default HomeStores;