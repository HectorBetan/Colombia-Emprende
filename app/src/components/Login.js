import Button from "react-bootstrap/Button";
import Eye from "../utilities/password.utilities";
import Alert from "../utilities/alert.utilities";
import {useState} from 'react';
function Login (){
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState("");
    const handleChange = ({ target: { value, name } }) => setUser({ ...user, [name]: value });
    return(
        <div>
            <div className="d-flex flex-wrap justify-content-center mt-1 mb-2">
                {error && <Alert message={error} />}
            </div>
            <form >
                <div className="form-group mb-3 me-5 ms-5 pe-3 ps-3">
                    <label className="m-1">Email</label>
                    <input 
                    className="form-control" 
                    name="email"
                    type="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                    title="Ingrese un Email valido. ejemplo colombia0emprende@gmail.com"
                    onChange={handleChange}
                    required
                    />
                </div>
                <div className="form-group mb-3 me-5 ms-5 pe-3 ps-3">
                    <label className="m-1">Contraseña</label>
                    <div className="input-group">
                        <input 
                        className="form-control" 
                        name="password"
                        type="password" 
                        id="passwordLogin" 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"                        
                        title="Ingresa un contraseña válida. Esta contiene al menos 1 número, una letra mayuscula y una minuscula, y mas de 8 caracteres"
                        onChange={handleChange}
                        required
                        />
                        <Eye passId="passwordLogin" eyeId="login"/>
                    </div>
                </div>
                <div className="text-center">
                    <a
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    href="#!"
                    
                    >
                        Olvidaste tu contraseña?
                    </a>
                </div>
                <div className="d-grid mt-4 mb-3 me-5 ms-5 ps-4">
                    <Button variant="primary" type="submit" className="me-4 mb-1 mt-1">
                        Aceptar
                    </Button>
                </div>
            </form>
        </div>
    )
}
export default Login;