import { Link } from "react-router-dom";
function NavigationBar() {
    return (
        <div>
            <nav className='navbar navbar-dark bg-dark navbar-expand-lg'>
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse " id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item ms-4">
                                <Link to={"/"} className="nav-link me-4 ms-2">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/Emprendimientos"} className="nav-link ms-2 me-4">Emprendimientos</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>   
    );
}
export default NavigationBar;