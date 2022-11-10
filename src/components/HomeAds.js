import ley from "../assets/publicidad/ley.png";
import publicidad from "../assets/publicidad/publicidad.jpeg";
import { ModalAd } from "../utilities/loginButton.utilities";
import { useAuth } from "../context/AuthContext";
import { useNavigate  } from "react-router-dom";
function HomeAds() {
    const navigate = useNavigate();
    const fa = false
    const {userData, user, loading} = useAuth();
    if (loading){
        return(
            <div>Cargando...</div>
        )
    }
    if (!user && false){
        return(
            <div>
                <div class="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
                    <div class="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                        <div class="tarjeta-registro-1 card">
                            <img src={publicidad} class="tarjeta-emprendedor-imagen-1 card-img" alt="..." />
                            <div class="tarjeta-emprendedor-1 card-img-overlay">
                                ¿Deseas Registrarte en Colombia Emprende?
                            </div>
                            <div class="tarjeta-emprendedor-oculta-1 card-img-overlay">
                                En Colombia Emprende<br /><p>te ofrecemos un espacio donde puedes conectar con emprendedores y registrar tu emprendimiento. </p>
                            </div>
                        </div>
                        <div class="tarjeta-registro-footer-1 card text-center">
                            <ModalAd />
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
            </div>
        )
    }
    if (!user){
        return(
            <div>
                <div class="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
                    <div class="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                        <div class="tarjeta-registro-2 card">
                            <img src={publicidad} class="tarjeta-emprendedor-imagen-2 card-img" alt="..." />
                            <div class="tarjeta-emprendedor-2 card-img-overlay">
                                ¿Deseas Registrar Tu Emprendimiento?
                            </div>
                            <div class="tarjeta-emprendedor-oculta-2 card-img-overlay">
                                Registra tu Emprendimiento<br /><p>En Colombia Emprende te ofrecemos un espacio donde puedes crear el perfil de tu Emprendimiento. </p>
                            </div>
                        </div>
                        <div class="tarjeta-registro-footer-2 card">
                            <a type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" href='*' onClick={(e) => {e.preventDefault(); navigate("/admin/registrar-emprendimiento");}}>Registrate Aqui</a>
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
            </div>
        )
    }
    if (user && userData && userData.Emprendimiento_id){
        return(
            <div>
                <div class="d-flex flex-row justify-content-center p-2 modulo-emprendedores-responsive">
                    <div class="me-xl-5 me-lg-3 me-md-3 me-0 me-xxl-5">
                        <div class="tarjeta-registro card">
                            <img src={publicidad} class="tarjeta-emprendedor-imagen card-img" alt="..." />
                            <div class="tarjeta-emprendedor card-img-overlay">
                                Gracias por Hacer Parte de Colombia Emprende
                            </div>
                            <div class="tarjeta-emprendedor-oculta card-img-overlay">
                                En Colombia Emprende<p>estamos felices de que pertenezcas a nuestra familia, daremos lo mejor por seguirte apoyando</p>
                            </div>
                        </div>
                        <div class="tarjeta-registro-footer card">
                            <a type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" href='*' onClick={(e) => {e.preventDefault(); navigate("/admin/mi-emprendimiento");}}>Ir a Mi Emprendimiento</a>
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
            </div>
        )
    }
    return (
      <div>
        
        <div class="row justify-content-center p-2 modulo-emprendedores-responsive">
            <div class="col-7">
                <div class="tarjeta-registro card col-12 ">
                    <img src={publicidad} class="tarjeta-emprendedor-imagen card-img" alt="..." />
                    <div class="tarjeta-emprendedor card-img-overlay">
                        ¿Eres un Emprendedor Colombiano?
                    </div>
                    <div class="tarjeta-emprendedor-oculta card-img-overlay">
                        Registrate en Colombia Emprende<br /><p>te ofrecemos un espacio gratuito para crear el perfil de tu Emprendimiento. </p>
                    </div>
                </div>
                <div class="tarjeta-registro-footer card col-12">
                    <a type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" href='*'>Registrate Aqui</a>
                </div> 
            </div>    
            <div class="seccion-noticias card col-3 p-3">
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
      </div>
    );
  }

  export default HomeAds;