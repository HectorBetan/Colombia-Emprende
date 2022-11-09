import '../styles/Carousel.style.css';
import Carousel from 'react-bootstrap/Carousel';
import Banner1 from "../assets/bannerHome/banner1.jpg";
import Banner2 from "../assets/bannerHome/banner3.jpg";
import Banner3 from "../assets/bannerHome/banner4.jpg";
import { usePublic } from "../context/PublicContext";
import { useState, useEffect } from 'react';
import HomeStores from './HomeStores';

function HomeView() {
    const { sixStores } = usePublic();
    const NuevasTiendas = () => {
      const [cargando, setCargando] = useState(true);
      const [start, setStart] = useState(true);
      useEffect(()=>{
        const setI = () =>{
          if (start && sixStores){
            setStart(false)
            setCargando(false)
            console.log(sixStores)
          }
        }
        setI();
      },[start]);
      if (cargando){
        return(
          <div>
            Cargando
          </div>
        )
      }
      if (sixStores && !cargando){
        return (
          <div className="d-flex justify-content-evenly">
            {sixStores.map((store,i)=>{
                return(
                  <div key={i} className="stores-home">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title">
                          {store.Nombre}
                        </div>
                        <div className="card-img">
                          <img src={store.Imagen} className="card-img-top rounded" alt="..." />
                        </div>
                        <div className="card-text">
                          {store.Email}
                        </div>
                        <div className="card-footer">
                          {store.Celular}
                        </div>
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
        )
      }
    }
    return (
      <div>
        <Carousel fade controls={false}>
            <Carousel.Item interval={4000}>
              <img className="d-block w-100 img-carousel-center" src={Banner1} alt="..." />
            </Carousel.Item>
            <Carousel.Item interval={4000}>
              <img className="d-block w-100 img-carousel-left" src={Banner2} alt="..." />
            </Carousel.Item>
            <Carousel.Item interval={4000}>
              <img className="d-block w-100 img-carousel-center" src={Banner3} alt="..." />
            </Carousel.Item>
        </Carousel>
        <div>
          <h4 className="text-center">Nuevos emprendimientos</h4>
          <HomeStores />
        </div>
        <div className="d-flex flex-row justify-content-evenly">
            <div className="card col-7">
              <div className="card-body">
                <div className="card-title">
                  Titulo
                </div>
                <div className="card-img">
                  Aqui va imagen
                </div>
                <div className="card-text">
                  Texto de la tarjeta
                </div>
                <div className="card-footer">
                  Footer de tarjeta
                </div>
              </div>
            </div>
            <div className="card col-4">
              <div className="card-body">
                <div className="card-title">
                  Titulo
                </div>
                <div className="card-img">
                  Aqui va imagen
                </div>
                <div className="card-text">
                  Texto de la tarjeta
                </div>
                <div className="card-footer">
                  Footer de tarjeta
                </div>
              </div>
            </div>
        </div>
        <div>
          <div className="text-center">Paginas Relacionadas</div>
          <div className="d-flex flex-row justify-content-evenly">
            <div>Pag 1</div>
            <div>Pag 2</div>
            <div>Pag 3</div>
            <div>Pag 4</div>
            <div>Pag 5</div>
          </div>
        </div>
      </div>
    );
  }

  export default HomeView;