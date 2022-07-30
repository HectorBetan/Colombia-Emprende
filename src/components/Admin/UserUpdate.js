import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import Compressor from 'compressorjs';
import Button from "react-bootstrap/Button";
import {PhotoView} from '../../utilities/photoView.utilities';
import {cityList} from '../../utilities/citys.utilities';
function UserUpdate() {
    const [error, setError] = useState("");
    const [disable, setDisable] = useState(true);
    const [imgResult, setImgResult] = useState(null);
    const [cargando, setCargando] = useState(false);
    const { user, updatePhotoURL, updateName, uploadPhoto, updateUser, userData, getPhotoURL, loading } = useAuth();
    const handleChange = ({ target: { value, name } }) => {setDisable(false); setUser({ ...usuario, [name]: value });}
    function camelize(str) {
        const palabras = str.split(" ");
        for (let i = 0; i < palabras.length; i++) {
            if (palabras[i].length > 0) palabras[i] = palabras[i][0].toUpperCase() + palabras[i].substr(1).toLowerCase();
        }
        return palabras.join(" ");
    };
    const [img, setImg] = useState(user.photoURL);
    const [usuario, setUser] = useState({
        Nombre: "",
        Celular: "",
        Ciudad: "",
        Direccion: "",
    });
    useEffect(() => {
        if (!userData) {
            setCargando(true);
        } else {
            
            setUser(userData);
            setCargando(false);
        }
    }, [userData]);
    const changeImg = (e) => {
        e.preventDefault();
            setImg(URL.createObjectURL(e.target.files[0]));
            reduceFile(e.target.files[0]);
            setDisable(false);
    }
    function reduceFile(file) {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (usuario.Nombre.length < 4) {return setError("Ingresa un nombre valido");};
        if (window.confirm("¿Realmente desea actualizar sus datos?")) {
            setCargando(true);
            const dName = camelize(usuario.Nombre);
            setUser({ ...usuario, Nombre: dName });
            try {
                await updateName(dName)
            } catch (error) {
                console.log(error);
                setError(error.message);
                setCargando(false);
                return
            }
            try{
                await updateUser(usuario);
            }catch (error) {
                setError(error.message);
                setCargando(false);
                console.log(error);
                return
            }
            if (imgResult !== null) {
                try {
                    await uploadPhoto(user.email, imgResult, "perfil/profilePhoto");
                } catch (error) {
                    setError(error.message);
                    setCargando(false);
                }
                try {
                    await getPhotoURL(user.email, "perfil/profilePhoto")
                    .then((url) => { 
                        updatePhotoURL(url);
                        setError({error: "SiEmail", msg : 'Hemos actualizado tus datos'});
                        setCargando(false);
                    })
                } catch (error) {
                    setError(error.message);
                    setCargando(false);
                }
            }
            setCargando(false);
        }
    };
    if (error){
        setTimeout(() => {
            setError("");
        }, 5000);
    }
    if (cargando || loading) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div> 
        );
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="d-flex flex-row justify-content-evenly">
                    <div className="form-group w-50">
                        <label className="m-1">Nombre Completo</label>
                        <input name="Nombre" 
                        className="form-control" type="name" 
                        onChange={handleChange} pattern="[A-Za-z. ]{1,}[ ]{1}[A-Za-z. ]{1,}" 
                        title="Ingrese un Nombre valido" value={usuario.Nombre} required/>
                    </div>
                    <div className="form-group">
                        <label className="m-1">Celular</label>
                        <input  className="form-control" 
                        type="tel"  name="Celular"
                        onChange={handleChange} pattern="[3]{1}[0-9]{9}"
                        value={usuario.Celular} placeholder=""
                        title="Ingrese un Celular valido para Colombia. Ej: 3185733093"/>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-evenly">
                    <div className="form-group w-50">
                        <label className="m-1">Dirección</label>
                        <input  className="form-control" 
                        type="tel"   name="Direccion"
                        onChange={handleChange} 
                        value={usuario.Direccion} placeholder=""
                        title="Ingrese un Celular valido para Colombia. Ej: 3185733093"/>
                    </div>
                    <div className="d-flex flex-column">
                        <label className="m-1 text-center text-lg-start text-xl-start text-xxl-start">Ciudad</label>
                        <select onChange={handleChange} name="Ciudad" className="form-select" value={usuario.Ciudad} required>
                        <option value="" disabled>Ninguna</option>
                            {cityList}
                        </select>
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center mt-3">
                    <PhotoView img={img} s='80px' />
                    <div className="d-flex flex-row justify-content-start mb-1 me-3 ms-3 mt-3">
                        <label className="d-block m-1 mt-2 me-2">Foto de Perfil:</label>
                        <input type="file" className="m-1 subirFoto" onChange={changeImg} accept="image/*"></input>
                    </div>
                </div>
                <div className="mt-4 mb-3 me-5 ms-5 ps-4 text-center">
                    <Button variant="primary" type="submit" className="me-4 mb-1 mt-1" disabled={disable}>
                        Guardar Cambios
                    </Button>
                </div>
            </form>
            <div className="flex-wrap justify-content-center mt-1 mb-2">
            </div>
        </div>
    );
}

export default UserUpdate;