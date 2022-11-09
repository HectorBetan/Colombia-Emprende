import '../styles/Carousel.style.css';
import Carousel from 'react-bootstrap/Carousel';
import Banner1 from "../assets/bannerHome/banner1.jpg";
import Banner2 from "../assets/bannerHome/banner3.jpg";
import Banner3 from "../assets/bannerHome/banner4.jpg";
import ley from "../assets/publicidad/ley.png";
import publicidad from "../assets/publicidad/publicidad.jpeg";
import HomeAds from './HomeAds';

import HomeStores from './HomeStores';

function HomeView() {

    
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
          <br />
          <h1 className="text-center">Nuevos emprendimientos</h1>
          <HomeStores />
        </div>
        <div className='text-center m-5'>
          <h2>En Colombia Emprende</h2>
          <h3>Apoyamos a los Emprendedores</h3>
          <h1>Colombianos</h1>
        </div>
        <HomeAds />
        <div class="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
            <div class="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                <div class="tarjeta-registro card">
                    <img src={publicidad} class="tarjeta-emprendedor-imagen card-img" alt="..." />
                    <div class="tarjeta-emprendedor card-img-overlay">
                        ¿Eres un Emprendedor Colombiano?
                    </div>
                    <div class="tarjeta-emprendedor-oculta card-img-overlay">
                        Registrate en Colombia Emprende<br /><p>te ofrecemos un espacio gratuito para crear el perfil de tu Emprendimiento. </p>
                    </div>
                </div>
                <div class="tarjeta-registro-footer card">
                    <a type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" href='*'>Registrate Aqui</a>
                </div> 
            </div>    
            <div class="seccion-noticias card col-3 p-3 d-none d-lg-block d-xl-block d-xxl-block">
                <img src={ley} class="imagen-seccion-noticias card-img-top" alt="..." />
                <div class="card-body">
                    <h5 class="card-title">Noticias</h5>
                    <p class="card-text">Conoce la nueva <b>Ley de Emprendimiento 2020</b> creada para ayudar a los emprendedores colombianos.</p>
                </div>
                <div class="card-footer text-center">
                    <a href="https://dapre.presidencia.gov.co/normativa/normativa/LEY%202069%20DEL%2031%20DE%20DICIEMBRE%20DE%202020.pdf"  target="_blank" rel='noreferrer'>
                    Ver Documento
                    </a>
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