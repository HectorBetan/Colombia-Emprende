import ley from "../assets/publicidad/ley.png";
import publicidad from "../assets/publicidad/publicidad.jpeg";
import { ModalAd } from "../utilities/loginButton.utilities";
import { useAuth } from "../context/AuthContext";
import { useNavigate  } from "react-router-dom";
function HomeAds() {
    const navigate = useNavigate();
    const {userData, user, loading} = useAuth();
    if (loading){
        return(
            <div>
            <div className="d-flex justify-content-center m-5">
              <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        )
    }
    if (!user){
        return(
            <div>
                <div className="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
                    <div className="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                        <div className="tarjeta-registro-1 card">
                            <img src={publicidad} className="tarjeta-emprendedor-imagen-1 card-img" alt="..." />
                            <div className="tarjeta-emprendedor-1 card-img-overlay">
                                ¿Deseas Registrarte en Colombia Emprende?
                            </div>
                            <div className="tarjeta-emprendedor-oculta-1 card-img-overlay">
                                En Colombia Emprende<br /><p>te ofrecemos un espacio donde puedes conectar con emprendedores y registrar tu emprendimiento. </p>
                            </div>
                        </div>
                        <div className="tarjeta-registro-footer-1 card text-center">
                            <ModalAd />
                        </div> 
                    </div>    
                    <div className="seccion-noticias card col-3 p-3 d-none d-lg-block d-xl-block d-xxl-block">
                        <img src={ley} className="imagen-seccion-noticias card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Noticias</h5>
                            <p className="card-text">Conoce la nueva <b>Ley de Emprendimiento 2020</b> creada para ayudar a los emprendedores colombianos.</p>
                        </div>
                        <div className="card-footer text-center">
                            <a href="https://dapre.presidencia.gov.co/normativa/normativa/LEY%202069%20DEL%2031%20DE%20DICIEMBRE%20DE%202020.pdf"  target="_blank" rel='noreferrer'>
                            Ver Documento
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (user && userData && !userData.Emprendimiento_id){
        return(
            <div>
                <div className="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
                    <div className="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                        <div className="tarjeta-registro-2 card">
                            <img src={publicidad} className="tarjeta-emprendedor-imagen-2 card-img" alt="..." />
                            <div className="tarjeta-emprendedor-2 card-img-overlay">
                                ¿Deseas Registrar Tu Emprendimiento?
                            </div>
                            <div className="tarjeta-emprendedor-oculta-2 card-img-overlay">
                                Registra tu Emprendimiento<br /><p>En Colombia Emprende te ofrecemos un espacio donde puedes crear el perfil de tu Emprendimiento. </p>
                            </div>
                        </div>
                        <div className="tarjeta-registro-footer-2 card">
                            <a type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" href='*' onClick={(e) => {e.preventDefault(); navigate("/admin/registrar-emprendimiento");}}>Registrate Aqui</a>
                        </div> 
                    </div>    
                    <div className="seccion-noticias card col-3 p-3 d-none d-lg-block d-xl-block d-xxl-block">
                        <img src={ley} className="imagen-seccion-noticias card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Noticias</h5>
                            <p className="card-text">Conoce la nueva <b>Ley de Emprendimiento 2020</b> creada para ayudar a los emprendedores colombianos.</p>
                        </div>
                        <div className="card-footer text-center">
                            <a href="https://dapre.presidencia.gov.co/normativa/normativa/LEY%202069%20DEL%2031%20DE%20DICIEMBRE%20DE%202020.pdf"  target="_blank" rel='noreferrer'>
                            Ver Documento
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    if (user && userData && userData.Emprendimiento_id){
        return(
            <div>
                <div className="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
                    <div className="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                        <div className="tarjeta-registro card">
                            <img src={publicidad} className="tarjeta-emprendedor-imagen card-img" alt="..." />
                            <div className="tarjeta-emprendedor card-img-overlay">
                                Gracias por Hacer Parte de Colombia Emprende
                            </div>
                            <div className="tarjeta-emprendedor-oculta card-img-overlay">
                                En Colombia Emprende<p>estamos felices de que pertenezcas a nuestra familia, daremos lo mejor por seguirte apoyando</p>
                            </div>
                        </div>
                        <div className="tarjeta-registro-footer card">
                            <a type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" href='*' onClick={(e) => {e.preventDefault(); navigate("/admin/mi-emprendimiento");}}>Ir a Mi Emprendimiento</a>
                        </div> 
                    </div>    
                    <div className="seccion-noticias card col-3 p-3 d-none d-lg-block d-xl-block d-xxl-block">
                        <img src={ley} className="imagen-seccion-noticias card-img-top" alt="..." />
                        <div className="card-body">
                            <h5 className="card-title">Noticias</h5>
                            <p className="card-text">Conoce la nueva <b>Ley de Emprendimiento 2020</b> creada para ayudar a los emprendedores colombianos.</p>
                        </div>
                        <div className="card-footer text-center">
                            <a href="https://dapre.presidencia.gov.co/normativa/normativa/LEY%202069%20DEL%2031%20DE%20DICIEMBRE%20DE%202020.pdf"  target="_blank" rel='noreferrer'>
                            Ver Documento
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
  }

  export default HomeAds;