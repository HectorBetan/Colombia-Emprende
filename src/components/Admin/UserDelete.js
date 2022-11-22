import React from "react";
import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import Button from "react-bootstrap/Button";
import Eye from '../../utilities/password.utilities'
import { handleResetPassword } from "../../services/user.service";
import Alert from "../../utilities/alert.utilities";
function UserDelete() {
    const [cargando, setCargando] = useState(false);
    const { resetPassword, user, emailAuth, reAuthenticate, reAuthenticateGoogle, deleteEmprendimiento, userData,
    deleteUserDoc, delUser, deletePhoto, emprendimientos, userEmprendimiento } = useAuth();
    const [error, setError] = useState("");
    const [provider, setProvider] = useState("");
    const [emprendimientoImg, setEmprendimientoImg] = useState(null); 
    const handleChange = ({ target: { value, name } }) => setUser({ ...usuario, [name]: value });
    const [usuario, setUser] = useState({
        email: "",
        password: "",
    });
    useEffect(() => {
        if (userEmprendimiento){
            if (userEmprendimiento.Imagen) {
            setEmprendimientoImg(userEmprendimiento.Imagen);
        }
    }
    }, [userEmprendimiento, emprendimientos]);
    useEffect(() => {
        if (user.providerData.length > 1) {
            for (let providers in user.providerData) {
                if (user.providerData[providers].providerId === "password") 
                {
                    setProvider("password");
                }
            }
        }
        else{
            setProvider(user.providerData[0].providerId);
        };
    }, [user.providerData, provider]); 
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("¿Realmente desea eliminar su cuenta?")){
            if (provider === "password") {
                try {
                    let credential = emailAuth(usuario.email, usuario.password);
                    await reAuthenticate(credential);
                } catch (error) {
                    setError(error.message);
                }
            }
            if (provider === "google.com"){
                try {
                    await reAuthenticateGoogle();
                } catch (error) {
                    setError(error.message);
                }
            }
            if (userData.Emprendimiento_id) {
                try {
                    await deleteEmprendimiento(userData.Emprendimiento_id);
                } catch (error) {
                    setError(error.message);         
                }
                if (emprendimientoImg){
                    let url = `/emprendimiento/perfil/`;
                    let fotos = emprendimientoImg.split(",");
                    for (let i = 0; i < fotos.length; i++) {
                        try {
                            deletePhoto(url+i);
                        } catch (error) {
                                        
                        }
                    }
                }
            };
            await deleteUserDoc(userData._id);
            try {
                let userPhoto = `/perfil/profilePhoto`;
                await deletePhoto(userPhoto);
            } catch (error) {
            
            }
            delUser();
            setCargando(false);
        }
    };
    const ResolveProvider = () => {
        if (provider === "password") {
            return (
                <div className="form-group">
                    <p>Para eliminar su cuenta ingrese su email y su contraseña.
        </p>
                    <div className="form-group mb-3 ms-5 pe-3 ps-3">
                        <label className="m-1">Ingrese su email actual</label>
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
                    <div className="form-group mb-3 me-5 pe-3 ps-3">
                        <label className="m-1">Ingrese su contraseña</label>
                        <div className="input-group">
                            <input 
                            className="form-control" 
                            name="password"
                            type="password" 
                            id="userDelete"
                            onChange={handleChange}
                            required
                            />
                            <Eye passId="userDelete" eyeId="userDeleteEye" />
                        </div>
                    </div>
                    <div className="form-group mb-3  ms-5 pe-3 text-center">
                    <a
                            className="inline-block align-middle font-bold text-sm text-blue-500 hover:text-blue-800"
                            href="#!"
                            onClick={(e)=>{e.preventDefault();handleResetPassword(user.email, resetPassword)}}
                    > 
                            Olvidaste tu contraseña?
                    </a>
                </div>
                </div>
            );
        }
    }
if (error){
    setTimeout(() => {
        setError("");
    }, 5000);
}
if (cargando) {return(
    <div className="spinner-border text-primary text-center align-middle" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
    );}
if (provider === "password")
    {return (
      <div>
        {error && <Alert message={error} />}
        <div className="text-center">
          <h1>Eliminar Cuenta </h1>
          <p>Estas a punto de eliminar tu cuenta, eliminaras todos tus dtos de usuario y demas datos
            de la plataforma.
          </p>
        
        <form  className="d-flex flex-column justify-content-center">
            <ResolveProvider />
                <div className="mt-4 mb-3 me-5 ms-5 ps-4  text-center">
                <Button onClick={handleSubmit} variant="danger" type="submit" className="me-4 mb-1 mt-1">
                    Eliminar Cuenta
                </Button>
                </div>
          </form>
        </div>
      </div>)}
    if (provider === "google.com")
    {return (
        <div>
          {error && <Alert message={error} />}
          <div className="text-center">
            <h1>Eliminar Cuenta</h1>
            <p>Estas a punto de eliminar tu cuenta, eliminaras todos tus dtos de usuario y demas datos
              de la plataforma.
            </p>
          
                  <div className="mt-4 mb-3   text-center">
                  <Button variant="danger" size="lg" type="submit" className="mb-1 mt-1" onClick={handleSubmit}>
                      Eliminar Cuenta
                  </Button>
                  </div>
            
          </div>
        </div>
    )};
  }

  export default UserDelete;