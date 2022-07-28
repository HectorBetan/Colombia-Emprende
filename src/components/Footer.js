function Footer() {
    return (
        <div>
            <footer className="d-flex flex-row justify-content-between bg-dark text-white p-3">
                <div className="d-flex flex-column ms-5">En colaboracion con:
                    <div className="d-flex flex-row">
                        <div>MinTic</div>
                        <div>MinComercio</div>
                        <div>UTP</div>
                    </div>
                </div>
                <div className="d-flex flex-column">Siguenos en
                    <div className="d-flex flex-row">
                        <div>Facebook</div>
                        <div>Twitter</div>
                        <div>Instagram</div>
                    </div>
                </div>
                <div className="d-flex flex-column me-5 ">Acerca de:
                    <div className="d-flex flex-row">
                        <div>Colombia Emprende</div>
                        <div>Hector Betancourt</div>
                    </div>
                </div>
            </footer>
            <footer>
                <div className="d-flex flex-row justify-content-center bg-primary text-white p-2">
                    Copyright © 2022  |  Todos los derechos reservados&nbsp;&nbsp;|&nbsp;&nbsp; 
                    <div>Desarrollado por: Hector Betancourt</div>&nbsp;&nbsp;|&nbsp;&nbsp;
                    <div> Política de privacidad y tratamiento de datos</div>
                </div>
            </footer>
        </div>
    );
}
export default Footer;