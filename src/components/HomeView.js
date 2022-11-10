import '../styles/Carousel.style.css';
import Carousel from 'react-bootstrap/Carousel';
import Banner1 from "../assets/bannerHome/banner1.jpg";
import Banner2 from "../assets/bannerHome/banner3.jpg";
import Banner3 from "../assets/bannerHome/banner4.jpg";
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