import "../styles/Carousel.style.css";
import Carousel from "react-bootstrap/Carousel";
import Banner1 from "../assets/bannerHome/banner1.jpg";
import Banner2 from "../assets/bannerHome/banner3.jpg";
import Banner3 from "../assets/bannerHome/banner4.jpg";
import artesanias from "../assets/related/artesanias-de-colombia.png";
import compra from "../assets/related/compra-lo-nuestro.jpg";
import productiva from "../assets/related/colombia-productiva.png";
import fondoemprender from "../assets/related/fondo-emprender.png";
import impulsa from "../assets/related/impulsa.jpg";
import HomeAds from "./HomeAds";
import HomeStores from "./HomeStores";
import { Link } from "react-router-dom";
function HomeView() {
  return (
    <div>
      <Carousel fade controls={false}>
        <Carousel.Item interval={4000}>
          <img
            className="d-block w-100 img-carousel-center"
            src={Banner1}
            alt="..."
          />
        </Carousel.Item>
        <Carousel.Item interval={4000}>
          <img
            className="d-block w-100 img-carousel-left"
            src={Banner2}
            alt="..."
          />
        </Carousel.Item>
        <Carousel.Item interval={4000}>
          <img
            className="d-block w-100 img-carousel-center"
            src={Banner3}
            alt="..."
          />
        </Carousel.Item>
      </Carousel>
      <div>
        <br />
        <h1 className="text-center">Nuevos emprendimientos</h1>
        <HomeStores />
        <div className="text-center mt-2 mb-4">
          <Link to={"/Emprendimientos"} className="btn btn-lg btn-primary">
            Ver Todos Los Emprendimientos
          </Link>
        </div>
      </div>
      <div className="text-center fondo-publi-home pt-3 pb-3">
        <h2>¡En Colombia Emprende</h2>
        <h3>Apoyamos a los Emprendedores</h3>
        <h1>Colombianos!</h1>
      </div>
      <br />
      <HomeAds />
      <br />
      <div className="related-pages-fondo p-3">
        <div className="related-titulo"> Páginas Relacionadas</div>
        <div className="related-pages-cajas p-2">
          <div className="related-pages p-2">
            <div className="m-2 p-1 clase-related">
              <div className="text-center paginas-relacionadas-footer">
                <a
                  className="text-decoration-none"
                  target="_blank"
                  href="https://artesaniasdecolombia.com.co/PortalAC/General/template_index.jsf"
                  rel="noreferrer"
                >
                  <img
                    src={artesanias}
                    className="aliados card-img-top"
                    alt="..."
                  />
                  <div className="d-md-none d-lg-none d-xl-none d-xxl-none related-title">
                    Artesanias de Colombia
                  </div>
                </a>
              </div>
              <div className="text-center paginas-relacionadas-footer">
                <a
                  className="text-decoration-none"
                  target="_blank"
                  href="https://compralonuestro.co/"
                  rel="noreferrer"
                >
                  <img
                    src={compra}
                    className="aliados card-img-top"
                    alt="..."
                  />
                  <div className="d-md-none d-lg-none d-xl-none d-xxl-none related-title">
                    Compra lo Nuestro
                  </div>
                </a>
              </div>
              <div className="text-center paginas-relacionadas-footer">
                <a
                  className="text-decoration-none"
                  target="_blank"
                  href="https://innpulsacolombia.com/"
                  rel="noreferrer"
                >
                  <img
                    src={impulsa}
                    className="aliados card-img-top"
                    alt="..."
                  />
                  <div className="d-md-none d-lg-none d-xl-none d-xxl-none related-title">
                    Innpulsa Colombia
                  </div>
                </a>
              </div>
              <div className="text-center paginas-relacionadas-footer">
                <a
                  className="text-decoration-none"
                  target="_blank"
                  href="https://www.colombiaproductiva.com/"
                  rel="noreferrer"
                >
                  <img
                    src={productiva}
                    className="aliados card-img-top"
                    alt="..."
                  />
                  <div className="d-md-none d-lg-none d-xl-none d-xxl-none related-title">
                    Colombia Productiva
                  </div>
                </a>
              </div>
              <div className="text-center paginas-relacionadas-footer">
                <a
                  className="text-decoration-none"
                  target="_blank"
                  href="https://www.fondoemprender.com//SitePages/Home.aspx#"
                  rel="noreferrer"
                >
                  <img
                    src={fondoemprender}
                    className="aliados card-img-top"
                    alt="..."
                  />
                  <div className="d-md-none d-lg-none d-xl-none d-xxl-none related-title">
                    Fondo Emprender
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomeView;