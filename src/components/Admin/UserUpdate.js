import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Compressor from "compressorjs";
import Button from "react-bootstrap/Button";
import Alert from "../../utilities/alert.utilities";
import { PhotoView } from "../../utilities/photoView.utilities";
import { cityList } from "../../utilities/citys.utilities";
function UserUpdate() {
  const [error, setError] = useState("");
  const [disable, setDisable] = useState(true);
  const [imgResult, setImgResult] = useState(null);
  const [cargando, setCargando] = useState(false);
  const {
    user,
    updatePhotoURL,
    updateName,
    uploadPhoto,
    updateUser,
    userData,
    getPhotoURL,
    loading,
  } = useAuth();
  const handleChange = ({ target: { value, name } }) => {
    setDisable(false);
    setUser({ ...usuario, [name]: value });
  };
  function camelize(str) {
    const palabras = str.split(" ");
    for (let i = 0; i < palabras.length; i++) {
      if (palabras[i].length > 0) {
        palabras[i] =
          palabras[i][0].toUpperCase() + palabras[i].substr(1).toLowerCase();
      } else {
        palabras.splice(i, 1);
      }
    }
    return palabras.join(" ");
  }
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
  };
  function reduceFile(file) {
    new Compressor(file, {
      maxHeight: 300,
      maxWidth: 300,
      minHeight: 150,
      minWidth: 150,
      success: (file) => {
        setImgResult(file);
      },
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (usuario.Nombre.length < 4) {
      return setError("Ingresa un nombre valido");
    }
    const dName = camelize(usuario.Nombre);
    setUser({ ...usuario, Nombre: dName });
    try {
      await updateName(dName);
    } catch (error) {
      setError(error.message);
      setCargando(false);
      return;
    }
    try {
      await updateUser(usuario);
    } catch (error) {
      setError(error.message);
      setCargando(false);
      return;
    }
    if (imgResult !== null) {
      try {
        await uploadPhoto(imgResult, "perfil/profilePhoto");
      } catch (error) {
        setError(error.message);
        setCargando(false);
      }
      try {
        await getPhotoURL("perfil/profilePhoto").then((url) => {
          updatePhotoURL(url);
          setError({ success: true, msg: "Hemos actualizado tus datos" });
          setCargando(false);
        });
      } catch (error) {
        setError(error.message);
        setCargando(false);
      }
    }
    setError({ success: true, msg: "Hemos actualizado tus datos" });
    setCargando(false);
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  if (cargando || loading)
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return (
    <div>
      {error && <Alert message={error} />}
      <form onSubmit={handleSubmit}>
        <div
          className="form-group d-column d-lg-flex flex-lg-row d-xl-flex 
                flex-xl-row d-xxl-flex flex-xxl-row justify-content-evenly mb-1 me-1 ms-1 me-sm-3 ms-sm-3 me-md-3 ms-md-3 me-lg-3 ms-lg-3 me-xl-3 ms-xl-3 me-xxl-3 ms-xxl-3"
        >
          <div className="d-flex flex-column me-2 w-100">
            <label className="m-1 text-center text-lg-start text-xl-start text-xxl-start">
              Nombre Completo
            </label>
            <input
              name="Nombre"
              className="form-control"
              type="name"
              onChange={handleChange}
              pattern="[A-Za-zñáéíóú. ]{1,}[ ]{1,}[A-Za-zñáéíóú. ]{1,}"
              title="Ingrese un Nombre valido"
              value={usuario.Nombre}
              required
            />
          </div>
          <div className="d-flex flex-column me-2 w-100">
            <label className="m-1 text-center text-lg-start text-xl-start text-xxl-start">
              Celular
            </label>
            <input
              className="form-control"
              type="tel"
              name="Celular"
              onChange={handleChange}
              pattern="[3]{1}[0-9]{9}"
              value={usuario.Celular}
              placeholder=""
              title="Ingrese un Celular valido para Colombia. Ej: 3185733093"
            />
          </div>
        </div>
        <div
          className="form-group d-column d-lg-flex flex-lg-row d-xl-flex 
                flex-xl-row d-xxl-flex flex-xxl-row justify-content-evenly mb-1 me-1 ms-1 me-md-3 ms-md-3 me-lg-3 ms-lg-3 me-xl-3 ms-xl-3 me-xxl-3 ms-xxl-3"
        >
          <div className="d-flex flex-column me-2 w-100">
            <label className="m-1 text-center text-lg-start text-xl-start text-xxl-start">
              Dirección
            </label>
            <input
              className="form-control"
              type="tel"
              name="Direccion"
              onChange={handleChange}
              value={usuario.Direccion}
              placeholder=""
              title="Ingrese un Celular valido para Colombia. Ej: 3185733093"
            />
          </div>
          <div className="d-flex flex-column me-2 w-100">
            <label className="m-1 text-center text-lg-start text-xl-start text-xxl-start">
              Ciudad
            </label>
            <select
              onChange={handleChange}
              name="Ciudad"
              className="form-select"
              value={usuario.Ciudad}
            >
              <option value="" disabled>
                Ninguna
              </option>
              {cityList}
            </select>
          </div>
        </div>
        <div className="d-block text-center d-sm-flex flex-row justify-content-center mt-3">
          <PhotoView img={img} s="80px" />
          <div className="d-flex flex-row justify-content-start mb-1 me-3 ms-3 mt-3">
            <label className="d-none d-lg-block m-1 mt-2 me-2">
              Foto de Perfil:
            </label>
            <input
              type="file"
              className="w-100 m-1 subirFoto"
              onChange={changeImg}
              accept="image/*"
            ></input>
          </div>
        </div>
        <div className="mt-4 mb-3 text-center">
          <Button
            variant="primary"
            type="submit"
            className="mb-1 mt-1"
            disabled={disable}
          >
            Guardar Cambios
          </Button>
        </div>
      </form>
      <div className="flex-wrap justify-content-center mt-1 mb-2"></div>
    </div>
  );
}
export default UserUpdate;