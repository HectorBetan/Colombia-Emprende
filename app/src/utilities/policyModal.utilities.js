import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
function PolicyModal() {
    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    function handleShow (breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
    };
    const [fullscreen, setFullscreen] = useState(true);
    return (
        <div>
            <span role="button" type="button" onClick={handleShow}>
                politicas de privacidad y tratamiento de datos
            </span>
            <Modal className="fade h-100" show={show} fullscreen={fullscreen} onHide={handleClose}
            tabIndex="-1" aria-labelledby="modalPoliticasLabel" size="lg" centered>
                <div className="modal-dialog-scrollable">
                    <div className="modal-content">
                        <Modal.Header closeButton >
                            <h3 className="modal-title" id="modalPoliticasLabel">Politicas de Privacidad y Tratamiento de Datos</h3>
                        </Modal.Header>
                        <div className="modal-body">
                            <div className="accordion accordion-flush" id="#acordionPoliticas">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-1">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse1" 
                                        aria-expanded="false" aria-controls="flush-collapse1">
                                            1. Definiciones
                                        </button>
                                    </h2>
                                    <div id="flush-collapse1" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-1" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                                Para facilitar la comprensión de estas Condiciones de Uso del Sitio Web, se hace necesario aclarar el significado de las siguientes palabras: <br />
                                                a. Contenidos. Implican todas las formas de información o datos que se divulgan en la página web, entre los que se encuentran: textos, imágenes, fotos, logos, diseños, animaciones. <br />
                                                b. Derechos de Propiedad Intelectual. incluye lo relativo a marcas, nombres comerciales, logos, enseñas, lemas, nombres de dominio, secretos empresariales, saber-hacer, diseños industriales, patentes, modelos de utilidad y derecho de autor. <br />
                                                c. Foro. Servicio automatizado de mensajes, a menudo moderado por un propietario, a través del cual los suscriptores reciben mensajes dejados por otros suscriptores por un tema dado. Los mensajes se envían por correo electrónico. <br />
                                                d. Internet. Herramienta de comunicación con decenas de miles de redes de computadoras unidas por el protocolo TCP/IP. Sobre esta red se pueden utilizar múltiples servicios como por ejemplo correos electrónicos, www, etc. <br />
                                                e. Página web. Resultado en hipertexto o hipermedia que proporciona un navegador del www después de obtener la información solicitada. Su contenido puede ir desde un texto corto a un voluminoso conjunto de textos, gráficos estáticos o en movimiento, sonido, etc. <br />
                                                f. Publicar. Hacer que un documento sea visible desde el Sitio Web. <br />
                                                g. Servicios. Son las ayudas en línea que la MINTIC provee actualmente o que piensa proveer en el futuro a los usuarios, por medio de esta página web, como publicación de noticias o actividades propias de la gestión institucional; trámites en línea; consultas; foros y buzón de quejas y reclamos, entre otros. <br />
                                                h. Usuario. Es toda persona que ingresa al Sitio Web. Puede registrarse en caso de que requiera realizar un trámite o recibir un servicio de la entidad; o para poner una queja mediante el uso del buzón de Quejas y Reclamos, creado para este efecto. <br />
                                                i. Vínculo (link en inglés). Apuntadores hipertexto que sirven para saltar de una información a otra, o de un servidor web a otro, cuando se navega por Internet. <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-2">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse2" 
                                        aria-expanded="false" aria-controls="flush-collapse2">
                                            2. Aceptación de Términos
                                        </button>
                                    </h2>
                                    <div id="flush-collapse2" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-2" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                                Se presume que cuando un usuario accede al sitio Web lo hace bajo su total responsabilidad y que, por tanto, acepta plenamente y sin reservas el contenido de los términos y condiciones de uso del sitio Web. MINTIC se reserva, en todos los sentidos, el derecho de actualizar y modificar en cualquier momento y de cualquier forma, de manera unilateral y sin previo aviso, las presentes condiciones de uso, políticas de privacidad y los contenidos de la página. <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-3">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse3" 
                                        aria-expanded="false" aria-controls="flush-collapse3">
                                            3. Contenidos del Sitio Web
                                        </button>
                                    </h2>
                                    <div id="flush-collapse3" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-3" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                                El sitio Web tiene por finalidad brindar al usuario todo tipo de información relacionada con la gestión de la entidad en todos los planes, programas y consejerías, por medio de boletines, cifras, noticias. En ningún caso esta información deberá considerarse como exhaustiva, completa o que de cualquier forma satisfaga todas las necesidades del Usuario. <br />
                                                El Sitio Web puede tener enlaces a otros sitios de interés o a documentos localizados en otras páginas web de propiedad de otras entidades, personas u organizaciones diferentes a MINTIC. Solamente por el hecho de que el usuario acceda a otro sitio web o a un documento individual localizado en otra página, a través de un link o un vínculo establecido en el Sitio Web, el usuario deberá someterse a las condiciones de uso y a la política de privacidad de la página web a la que envía el link. <br />
                                                El establecimiento de un vínculo (link) con el sitio web de otra empresa, entidad o programa no implica necesariamente la existencia de relaciones entre MINTIC y el propietario del sitio o página Web vinculada, ni la aceptación o aprobación por parte de MINTIC de sus contenidos o servicios. Aquellas personas que se propongan establecer un vinculo (link) se asegurarán de que el mismo únicamente permita el acceso a la página de inicio Web. <br />
                                                Así mismo, MINTIC no se hace responsable respecto a la información que se halle fuera de este Sitio Web y no sea gestionada directamente por el administrador del Sitio Web. Los vínculos (links) que aparecen en el Sitio Web tienen como propósito informar al Usuario sobre la existencia de otras fuentes susceptibles de ampliar los contenidos que ofrece el Sitio Web, o que guardan relación con aquéllos. MINTIC no garantiza ni se responsabiliza del funcionamiento o accesibilidad de las páginas web enlazadas; ni sugiere, invita o recomienda la visita a las mismas, por lo que tampoco será responsable del resultado obtenido. Por lo tanto, el acceso a las mismas a través del Sitio Web tampoco implica que MINTIC recomiende o apruebe sus contenidos. <br />
                                                Por otra parte, la prestación del servicio del Sitio Web es de carácter libre y gratuito para los usuarios. <br />
                                                El Sitio Web contiene artículos u obras de carácter literario y científico (en adelante, Información) elaborados por MINTIC o por terceros, con fines informativos, y divulgativos. MINTIC puede modificar o retirar la Información en cualquier momento y sin aviso previo. Las opiniones vertidas en los comentarios realizados por los Usuarios no reflejan necesariamente los puntos de vista de MINTIC. <br />
                                                Queda expresamente prohibido el uso del Sitio Web que de cualquier forma sobrecarguen, dañen o inutilicen las redes, servidores y demás equipos informáticos o productos y aplicaciones informáticas de MINTIC o de terceros. <br />
                                                MINTIC no se hace responsable del servicio ininterrumpido o libre de error de la página. MINTIC hace sus mejores esfuerzos para que el contenido suministrado sea de óptima calidad, y en tal sentido el Usuario acepta utilizar el servicio. <br />
                                                El Usuario no puede emplear los contenidos y, en particular, la información de cualquier otra clase obtenida a través de MINTIC o de los servicios, para emitir publicidad. <br />
                                                El Usuario del Sitio Web no alterará, bloqueará o realizará cualquier otro acto que impida mostrar o acceder a cualquier contenido, información o servicios del Sitio Web o que estén incorporados en las páginas web vinculadas. <br />
                                            </p>
                                            <h5>3.1. Responsabilidad por la información contenida</h5>
                                            <p>
                                                Debido a que en la actualidad los medios técnicos no permiten garantizar la absoluta falta de injerencia de la acción de terceras personas en el Sitio Web, MINTIC de ninguna manera asegura la exactitud y/o veracidad de todo o parte de la información contenida en su página, ni su actualización, ni que dicha información haya sido alterada o modificada en todo o en parte, luego de haber sido publicada en la página, ni cualquier otro aspecto o característica de lo publicado en el sitio o en los enlaces, respectivamente. <br />
                                                MINTIC no controla ni garantiza la ausencia de virus ni de otros elementos en los contenidos que puedan producir alteraciones en su sistema informático (software y hardware) o en los documentos electrónicos y ficheros almacenados en su sistema informático. <br />
                                                En consecuencia con lo anterior, MINTIC no se hará responsable de ningún daño ocasionado en virtud de cualquier alteración que se haya efectuado a los materiales o archivos de descarga suministrados directamente por la entidad. <br />
                                                El Usuario no enviará o transmitirá en el Sitio Web o hacia el mismo, a otros usuarios usuarios o a cualquier persona, cualquier información de contenido obsceno, difamatorio, injuriante, calumniante o discriminatorio contra cualquier persona, o contra MINTIC, sus filiales o entidades adscritas, sus funcionarios o contra los responsables de la administración del Sitio Web. <br />
                                                En ningún caso se aceptarán contenidos que pueden ser considerados como ofensivos, sexistas, racistas, discriminatorios, obscenos, en la medida que contenidos ofensivos atentan contra derechos fundamentales de los particulares. <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-4">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse4" 
                                        aria-expanded="false" aria-controls="flush-collapse4">
                                            4. Propiedad intelectual
                                        </button>
                                    </h2>
                                    <div id="flush-collapse4" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-4" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                                La propiedad intelectual sobre los contenidos del Sitio Web o bien hacen parte del patrimonio de MINTIC o, en su caso, su titularidad es de terceros que autorizaron el uso de los mismos en el Sitio Web o es información pública que se rige por las leyes de acceso a la información pública colombianas. <br />
                                                Los textos y elementos gráficos que constituyen la página Web, así como su presentación y montaje, o son titularidad exclusiva de MINTIC o ésta ostenta los derechos de explotación necesarios. Sin perjuicio de lo anterior, los nombres comerciales, marcas o signos distintivos que aparecen o a los que se hace alusión en el Sitio Web, pertenecen a sus respectivos propietarios y se encuentran protegidos por la legislación vigente al respecto. <br />
                                                Se prohíbe cualquier uso, transformación o explotación de los contenidos incluidos en el Sitio Web con finalidades comerciales o promocionales salvo autorización previa de MINTIC; en cualquier caso se prohíbe cualquier uso contrario a la ley y del Sitio Web para uso personal y no comercial, siempre y cuando se haga expresa mención de la propiedad en cabeza del autor del contenido. <br />
                                                Todos los logotipos y marcas de la página Web son de propiedad de MINTIC o su uso ha sido autorizado por sus titulares a MINTIC, siendo, en todo caso, los titulares los responsables de cualquier posible controversia que pudiera darse respecto de ellos. Los titulares de dichas marcas y logotipos se reservan el derecho de entablar las acciones legales que consideren convenientes para hacer valer sus derechos tanto en Colombia como en el exterior. <br />
                                                El Usuario acepta que los contenidos generados y subidos por él serán de propiedad de MINTIC, conservando el Usuario los derechos morales sobre dichos contenidos. <br />
                                                En caso de reclamaciones que pudieran interponerse por los usuarios o por terceros en relación con posibles incumplimientos de los derechos de propiedad intelectual sobre cualquiera de los contenidos del Sitio Web deberán dirigirse a la siguiente dirección de correo electrónico: usoweb@mintic.gov.co Una vez notificado a este correo, dicho contenido será automáticamente eliminado del Sitio Web hasta que quien haya publicado el contenido en disputa haya resuelto el conflicto con quien envía la reclamación. <br />
                                                i. Vínculo (link en inglés). Apuntadores hipertexto que sirven para saltar de una información a otra, o de un servidor web a otro, cuando se navega por Internet. <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-5">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse5" 
                                        aria-expanded="false" aria-controls="flush-collapse5">
                                            5. Privacidad
                                        </button>
                                    </h2>
                                    <div id="flush-collapse5" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-5" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                                Se entiende por información personal aquella suministrada por el Usuario para el registro, la cual incluye datos como nombre, identificación, edad, género, dirección, correo electrónico y teléfono. <br />
                                                El almacenamiento, y uso de la información personal se rige por las Políticas de Privacidad del Sitio Web. <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-6">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse6" 
                                        aria-expanded="false" aria-controls="flush-collapse6">
                                            6. Ley aplicable y jurisdicción
                                        </button>
                                    </h2>
                                    <div id="flush-collapse6" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-6" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                                a. Estas condiciones de uso del Sitio Web serán rigen por las leyes de la República de Colombia. <br />
                                                b. Si cualquier disposición de estas condiciones pierde validez o fuerza obligatoria, por cualquier razón, todas las demás disposiciones, conservan su fuerza obligatoria, carácter vinculante y generarán todos sus efectos. <br />
                                                c. Para cualquier efecto legal o judicial, el lugar de las presentes condiciones es la ciudad de Bogotá, República de Colombia, y cualquier controversia que surja de su interpretación o aplicación se someterá a los jueces de la República de Colombia. <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="politicas-titulo-7">
                                        <button className="accordion-button collapsed" type="button" 
                                        data-bs-toggle="collapse" data-bs-target="#flush-collapse7" 
                                        aria-expanded="false" aria-controls="flush-collapse7">
                                            7. Participación dentro del Sitio Web
                                        </button>
                                    </h2>
                                    <div id="flush-collapse7" className="accordion-collapse collapse" 
                                    aria-labelledby="politicas-titulo-7" data-bs-parent="#acordionPoliticas">
                                        <div className="accordion-body">
                                            <p>
                                            - Negar el registro a cualquier persona, en cualquier momento y por cualquier razón. <br />
                                            - Incluir o no en el Sitio Web el material recibido de los usuarios a su criterio. En el caso de incluirlo, podrá mantener en el Sitio Web dicho material por el lapso que considere pertinente o modificarlo. <br />
                                            - Remover, sin que sea obligatorio, contenidos que a juicio de MINTIC sean ilegales, ofensivos, difamatorios o que de cualquier otra forma violen éstos Condiciones de Uso. Así mismo, podrán ser retirados los contenidos que violen derechos de propiedad intelectua, a solicitud de éste. <br />
                                            - Utilizar la información personal y/o contenidos suministrados por los Usuarios de acuerdo con las Condiciones de Uso del Sitio Web y la Política de Privacidad . <br />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default PolicyModal
