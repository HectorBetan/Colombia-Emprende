import { useState, useEffect } from "react";
import { useMyStore } from "../../context/MyStoreContext";
import { useAuth } from "../../context/AuthContext";
import { cityList } from "../../utilities/citys.utilities";
import { categoryList } from "../../utilities/categorys.utilities";
import Alert from "../../utilities/alert.utilities";
function StoreInfoUpdate() {
  const [cargando, setCargando] = useState(true);
  const [start, setStart] = useState(false);
  const [disable, setDisable] = useState(true);
  const { findPath } = useAuth();
  const { userStore, updateStore, loadingStore, getMyStore, alert1CreateStoreTrue } = useMyStore();
  const [error, setError] = useState("");
  const [emprendimiento, setEmprendimiento] = useState({
    _id: "",
    Nombre: "",
    Email: "",
    Celular: "",
    Telefono: "",
    Ciudad: "",
    Direccion: "",
    Categoria: "",
    Imagen: "",
    Facebook: "",
    Instagram: "",
    Web: "",
    Descripcion: "",
    Recoger: "",
  });
  const [tel2CLass, setTel2Class] = useState("d-none");
  const [tel2BtnCLass, settel2BtnCLass] = useState(" ");
  const handleChange = ({ target: { value, name } }) => {
    setDisable(false);
    setEmprendimiento({ ...emprendimiento, [name]: value });
  };
  const getEmprendimiento = () => {
    if (userStore.Telefono) {
      setTel2Class(" ");
      settel2BtnCLass("d-none");
    }
    setCargando(false);
    setStart(false);
  };
  useEffect(() => {
    if (userStore) {
      setStart(true);
    }
  }, [userStore, start]);
  if (start) {
    if (userStore) {
      setEmprendimiento({
        ...emprendimiento,
        _id: userStore._id,
        Nombre: userStore.Nombre,
        Email: userStore.Email,
        Celular: userStore.Celular,
        Telefono: userStore.Telefono,
        Ciudad: userStore.Ciudad,
        Direccion: userStore.Direccion,
        Categoria: userStore.Categoria,
        Facebook: userStore.Facebook,
        Instagram: userStore.Instagram,
        Web: userStore.Web,
        Descripcion: userStore.Descripcion,
        Recoger: userStore.Recoger,
      });
      getEmprendimiento();
    }
  }
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
  const handleRecoger = (e) => {
    if (e.target.checked) {
      setEmprendimiento({ ...emprendimiento, Recoger: true });
    }
    if (!e.target.checked) {
      setEmprendimiento({ ...emprendimiento, Recoger: false });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert1CreateStoreTrue();
    setError("");
    setCargando(true);
    let name = emprendimiento.Nombre;
    let pathName = name
      .toLowerCase()
      .replace(/ /g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    let storeName = camelize(name);
    let newPath = "";
    await findPath(pathName)
      .then((res) => {
        if (res.data.length > 0) {
          let ciudad = emprendimiento.Ciudad.toLowerCase();
          newPath = `${pathName}-${ciudad}`;
        } else {
          newPath = pathName;
        }
      })
      .catch((err) => {});
    if (newPath !== pathName) {
      await findPath(newPath)
        .then((res) => {
          if (res.data.length > 0) {
            newPath = `${newPath}-${emprendimiento.Celular}`;
          } else {
            newPath = pathName;
          }
        })
        .catch((err) => {});
    }
    setEmprendimiento({ ...emprendimiento, Nombre: storeName });
    const data = {
      Nombre: storeName,
      Email: emprendimiento.Email,
      Celular: emprendimiento.Celular,
      Telefono: emprendimiento.Telefono,
      Ciudad: emprendimiento.Ciudad,
      Direccion: emprendimiento.Direccion,
      Categoria: emprendimiento.Categoria,
      Facebook: emprendimiento.Facebook,
      Instagram: emprendimiento.Instagram,
      Web: emprendimiento.Web,
      Descripcion: emprendimiento.Descripcion,
      Recoger: emprendimiento.Recoger,
      Path: newPath,
    };
    setCargando(true);
    try {
      await update(data);
    } catch (error) {
      setError(error.message);
      setCargando(false);
    }
  };
  const update = async (emprendimiento) => {
    try {
      await updateStore(emprendimiento).then(
        setError({
          success: true,
          msg: "Se actualizó correctamente tu emprendimiento",
        })
      );
    } catch (error) {
      setError(error.message);
      setCargando(false);
    }
    window.scroll(0, 0);
    setDisable(true);
    await getMyStore().then(() => {
      setCargando(false);
    });
  };
  const handleNewPhone = (e) => {
    e.preventDefault();
    let phoneButton = document.getElementById("add-tel");
    let newPhone = document.getElementById("new-phone");
    phoneButton.style.display = "none";
    newPhone.classList.remove("d-none");
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 3500);
  }
  if (cargando || loadingStore)
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
    <div  className="m-1 mt-3 m-md-3 p-lg-1 p-xl-2 p-0">
      <form onSubmit={handleSubmit}>
        {error && <Alert message={error} />}
        <div
          className="col-12 pe-0 ps-0 pe-lg-2 ps-lg-2 pe-xl-3 ps-xl-3 pe-md-0 ps-md-0"
          style={{ maxHeight: "320px", overflow: "auto" }}
        >
          <div className="info-update-admin">
            <div className="d-flex flex-row justify-content-evenly mb-3 update-store-box">
              <div className="form-group col-5">
                <label className="m-1">Nombre</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Nombre"
                  className="form-control h-50"
                  placeholder="Ingrese el Nombre de su Emprendimiento"
                  value={emprendimiento.Nombre}
                />
              </div>
              <div className="form-group col-5">
                <label className="m-1">Email</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Email"
                  className="form-control"
                  placeholder="Ingrese el E-mail de su Emprendimiento"
                  value={emprendimiento.Email}
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-evenly  update-store-box">
              <div className="form-group col-5 m-1">
                <div className="d-flex flex-row">
                  <h6 className="bg-secondary rounded p-2 text-white mt-1 me-2">
                    Celular:
                  </h6>
                  <input
                    type="text"
                    id="telefono1"
                    name="Celular"
                    className="form-control mt-1 mb-1"
                    placeholder="Ingrese aqui el número"
                    onChange={handleChange}
                    value={emprendimiento.Celular}
                  />
                </div>
              </div>
              <div className={"col-5 " + tel2BtnCLass} id="add-tel">
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleNewPhone}
                >
                  Agregar telefono fijo
                </button>
              </div>
              <div
                className={"form-group col-5 m-1 " + tel2CLass}
                id="new-phone"
              >
                <div className="d-flex flex-row">
                  <h6 className="bg-secondary rounded p-2 text-white mt-1 me-2">
                    Telefono:
                  </h6>
                  <input
                    type="text"
                    name="Telefono"
                    onChange={handleChange}
                    value={emprendimiento.Telefono}
                    className="form-control mt-1 mb-1"
                    placeholder="Ingrese aqui el número"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-evenly flex-cambio">
              <div className="col-11 ps-sm-2 pe-sm-2 flex-pad">
                <label className="m-1">Dirección</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Direccion"
                  className="form-control"
                  placeholder="Dirección Emprendimiento"
                  value={emprendimiento.Direccion}
                />
              </div>
            </div>
            {emprendimiento.Direccion && 
            <h5 className="d-flex flex-row justify-content-center m-3 font-store-reg font-store-up">
            <input
              className="form-check-input mt-1em"
              type="checkbox"
              id="emailCheck"
              onChange={handleRecoger}
              checked={emprendimiento.Recoger}
            />
            <span className="color-rec">
              Habilitar la opción de recoger en tienda.
            </span>
          </h5>
            }
            <div className="d-flex flex-row justify-content-evenly mt-2  update-store-box1">
              <div className="form-group col-5 mb-1 mb-sm-0">
                <label className="m-1">Ciudad</label>
                <select
                  onChange={handleChange}
                  name="Ciudad"
                  className="form-select"
                  value={emprendimiento.Ciudad}
                >
                  {cityList}
                </select>
              </div>
              <div className="form-group col-5">
                <label className="m-1">Categoria</label>
                <select
                  onChange={handleChange}
                  name="Categoria"
                  className="form-select"
                  value={emprendimiento.Categoria}
                >
                  {categoryList}
                </select>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center me-sm-2 ms-sm-2 mt-2  flex-cambio">
              <div className="form-group mb-1 col-11">
                <label className="m-1">Facebook</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Facebook"
                  id="facebook"
                  className="form-control "
                  placeholder="Ingresa el link de Facebook"
                  value={emprendimiento.Facebook}
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center me-sm-2 ms-sm-2 mt-2  flex-cambio">
              <div className="form-group mb-1 col-11">
                <label className="m-1">Instagram</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Instagram"
                  id="instagram"
                  className="form-control "
                  placeholder="Ingresa el link de Instagram"
                  value={emprendimiento.Instagram}
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center me-sm-2 ms-sm-2  flex-cambio">
              <div className="form-group mb-1 col-11">
                <label className="m-1">Página Web</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Web"
                  id="web"
                  className="form-control"
                  placeholder="Ingresa el link de la página web"
                  value={emprendimiento.Web}
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center me-sm-2 ms-sm-2 flex-cambio">
              <div className="form-group col-11">
                <label className="m-1">Descripción</label>
                <textarea
                  onChange={handleChange}
                  type="text-area"
                  name="Descripcion"
                  className="form-control"
                  placeholder="Ingrese aqui la descripción de su emprendimiento"
                  value={emprendimiento.Descripcion}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group text-center m-3">
          <button className="btn btn-primary" type="submit" disabled={disable}>
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
export default StoreInfoUpdate;