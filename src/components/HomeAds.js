import ley from "../assets/publicidad/ley.png";
import publicidad from "../assets/publicidad/publicidad.jpeg";
import { useAuth } from "../context/AuthContext";
function HomeAds() {
    const {userData, user, loading} = useAuth();
    if (loading){
        return(
            <div>Cargando...</div>
        )
    }
    if (!user){
        return(
            <div>
                Registrate
            </div>
        )
    }
    if (user && userData && !userData.Emprendimiento_id){
        return(
            <div>Publicidad1</div>
        )
    }
    if (user && userData && userData.Emprendimiento_id){
        return(
            <div>Ya registrado</div>
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