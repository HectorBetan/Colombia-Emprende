import React from "react";
import '../styles/Carousel.style.css';
import Carousel from 'react-bootstrap/Carousel';
import Banner1 from "../assets/bannerHome/banner1.jpg";
import Banner2 from "../assets/bannerHome/banner3.jpg";
import Banner3 from "../assets/bannerHome/banner4.jpg";


function HomeView() {
    return (
      <div>
        <Carousel fade controls={false} className="mb-2">
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
          <div>
            <div className="card">
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