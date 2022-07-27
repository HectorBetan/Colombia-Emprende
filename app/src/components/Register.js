import {useState} from 'react';
import Alert from '../utilities/alert.utilities'
import Button from 'react-bootstrap/Button';
import Eye from '../utilities/password.utilities'
import PolicyModal from '../utilities/policyModal.utilities';
import {PhotoView, UserLogo} from '../utilities/photoView.utilities';
import { useAuth } from "../context/AuthContext";
import {cityList} from '../utilities/citys.utilities';
import Compressor from "compressorjs";
import { useNavigate, useLocation } from "react-router-dom";
function Register () {
    const location = useLocation();
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    
    const {signup, updatePhotoURL, updateName, uploadPhoto, 
        emailVerification, getPhotoURL, createUser, loading } = useAuth();
    const [img, setImg] = useState(null);
    const [imgResult, setImgResult] = useState(null);
    const [msg, setMsg] = useState("");
    const [user, setUser] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        city: "",
    });
    const changeImg = (e) => {
        setImg(e.target.files[0])
        const file = e.target.files[0];
        reduceUserImg(file)
    };
    const reduceUserImg = (file) => {
        new Compressor(file, {
            maxHeight: 300,
            maxWidth: 300,
            minHeight: 150,
            minWidth: 150,
            success: file => {
                setImgResult(file);
            }
        });
    }
    function camelize(str) {
        const palabras = str.split(" ");
        for (let i = 0; i < palabras.length; i++) {
            palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substr(1).toLowerCase();
        }
        return palabras.join(" ");
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setCargando(true);
        let dName = user.firstName + " " + user.lastName;
        let uid;
        try {
            await signup(user.email, user.password)
            .then(res => {
                uid = res.user.uid;
            })
        } catch (error) {
            return ({msg: {type: "error", message: error.message}});
        }
        try {
            
            dName = camelize(dName);
            console.log(dName);
            await updateName(dName);
            const newUser = {
                Uid: uid,
                Email: user.email,
                Nombre: dName,
                Celular: user.phoneNumber,
                Ciudad: user.city,
            }
            await createUser(newUser);       
        } catch (error) {
            return ({msg: {type: "error", message: error.message}});
        }
        if (img !== null) {
            try {
                await uploadPhoto(user.email, imgResult, "/perfil/profilePhoto"); 
            } catch (error) {
                console.log(error);
                return ({msg: {type: "error", message: error.message}});
            }
            try {
                console.log("va a tomar la foto");
                const url = "/perfil/profilePhoto"
                await getPhotoURL(user.email, url)
                .then((url) => { 
                updatePhotoURL(url)
                })
            } catch (error) {
                console.log(error);
                return ({msg: {type: "error", message: error.message}});
            }
            try {
                    sessionStorage.setItem("location", location.pathname);
                    await emailVerification()
                    .then(
                    navigate(`/verificacion`, { replace: true })
                    )
            } catch (error) {
                return ({msg: {type: "error", message: error.message}});
            }
        }
        else {
            sessionStorage.setItem("location", location.pathname);
            try {
                await emailVerification().then(navigate(`../verificacion`, { replace: true }));
            } catch (error) {
                return ({msg: {type: "error", message: error.message}});
            }
        };
    }
    const ProfilePhoto = () => {
        if (img) {
            const imgUrl = URL.createObjectURL(img);
            return (
                <PhotoView img={imgUrl} />
            );
        }
        else {
            return (
                <UserLogo w="60" h="60" />
            );
        }
    };
    if (msg){
        setTimeout(() => {
            setMsg("");
        }, 5000);
    }
    const handleChange = ({ target: { value, name } }) => setUser({ ...user, [name]: value });
    if (cargando || loading){
        return(
            <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="d-flex flex-wrap justify-content-center mt-1 mb-2">
                {msg && <Alert message={msg} />}
            </div>
            <form onSubmit={handleRegister}>
                <div className="form-group d-flex flex-row justify-content-between mb-1 me-3 ms-3">
                    <div className="d-flex flex-column me-2">
                        <label className="m-1">Nombre</label>
                        <input name="firstName" 
                        className="form-control" type="name" 
                        onChange={handleChange} pattern="[A-Za-z. ]{1,}" 
                        title="Ingrese un Nombre valido" required/>
                    </div>
                        <div className="d-flex flex-column">
                        <label className="m-1">Apellido</label>
                        <input name="lastName" 
                        className="form-control" type="name" 
                        onChange={handleChange} pattern="[A-Za-z. ]{1,}" 
                        title="Ingrese un Apellido valido" required/>
                    </div>
                </div>
                <div className="form-group d-flex flex-row justify-content-between mb-1 me-3 ms-3">
                    <div className="d-flex flex-column me-2">
                        <label className="m-1">Celular(opcional)</label>
                        <input name="phoneNumber" className="form-control" 
                        type="tel" id="celular" 
                        onChange={handleChange} pattern="[3]{1}[0-9]{9}"
                        title="Ingrese un Celular valido para Colombia. Ej: 3185733093"/>
                    </div>
                    <div className="d-flex flex-column  col-7">
                        <label className="m-1">Ciudad</label>
                        <select onChange={handleChange} name="city" className="form-select" defaultValue={"default"} required>
                            <option value="default" disabled>Selecciona la ciudad</option>
                            {cityList}
                        </select>
                    </div>
                </div>
                <div className="form-group d-flex flex-row justify-content-between  me-3 ms-3">
                    <div className="d-flex flex-column col-6 me-2">
                        <label className="m-1">Email</label>
                        <input name="email" className="form-control" type="email" 
                        onChange={handleChange} 
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
                        title="Ingrese un Email valido. ejemplo colombia0emprende@gmail.com" required/>  
                    </div>
                    <div className="d-flex flex-column mb-1">
                        <label className="m-1">Contraseña</label>
                        <div className="input-group" id="show_hide_password">
                        <input name="password" className="form-control" 
                        type="password" id="passwordRegister" 
                        onChange={handleChange} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                        title="Debe contener al menos 1 número, una letra mayuscula y una minuscula, y mas de 8 caracteres"
                        required/>
                        <Eye passId="passwordRegister" eyeId="password" />
                        </div>
                    </div>
                </div>
                <div className="justify-content-start mb-1 me-3 ms-3 mt-3">
                    <label className="d-block m-1 mt-2 me-2">Foto de Perfil(opcional):</label>
                    <div className="d-flex flex-row">
                        <ProfilePhoto />
                        <input type="file" className="m-1 mt-3 subirFoto" onChange={changeImg} accept="image/*"></input>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-start mb-1 me-3 ms-3 mt-3" style={{fontSize:'15px'}}>
                    <input type="checkbox" className="form-check-input me-1 ms-1" required/>
                    <p>Acepto las&nbsp;</p>
                    <PolicyModal />
                </div>
                <div className="d-grid mt-3 mb-3 me-3 ms-5 ps-1 pe-3">
                    <Button variant="primary" type="submit" className="me-4 mb-1 mt-1">
                    Aceptar
                    </Button>
                </div>
            </form>
        </div>
    );
}
export default Register;