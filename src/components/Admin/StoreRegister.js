import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Compressor from "compressorjs";
import { PhotoStoreView, StoreLogo } from "../../utilities/photoView.utilities";
import { cityList } from "../../utilities/citys.utilities";
import { categoryList } from "../../utilities/categorys.utilities";
import Alert from "../../utilities/alert.utilities";
function StoreRegister() {
  const { getMyStore, createStore, alert1CreateStoreTrue } = useMyStore();
  const [cargando, setCargando] = useState(false);
  const { user, uploadPhoto, getPhotoURL,  findPath } = useAuth();
  const [emprendimiento, setEmprendimiento] = useState({
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
    Calificacion: [],
    Path: "",
    Recoger: false,
  });
  const [required, setRequired] = useState(true);
  const [img, setImg] = useState(null);
  const [imgs, setImgs] = useState(null);
  const changeImg = async (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
    await handleImages(e.target.files).then((res) => {
      setImgs(res);
    });
  };
  const handleChange = ({ target: { value, name } }) => {
    setEmprendimiento({ ...emprendimiento, [name]: value });
  };
  const handleNewPhone = (e) => {
    e.preventDefault();
    let phoneButton = document.getElementById("new-phone-register-btn");
    let newPhone = document.getElementById("new-phone-register");
    phoneButton.style.display = "none";
    newPhone.classList.remove("d-none");
  };
  const handleFacebook = (e) => {
    e.preventDefault();
    let facebook = document.getElementById("facebook-register");
    let btnFacebook = document.getElementById("facebook-register-btn");
    btnFacebook.style.display = "none";
    facebook.classList.remove("d-none");
  };
  const handleInstagram = (e) => {
    e.preventDefault();
    let instagram = document.getElementById("instagram-register");
    let btnInstagram = document.getElementById("instagram-register-btn");
    btnInstagram.style.display = "none";
    instagram.classList.remove("d-none");
  };
  const handleWeb = (e) => {
    e.preventDefault();
    let web = document.getElementById("web-register");
    let btnWeb = document.getElementById("web-register-btn");
    btnWeb.style.display = "none";
    web.classList.remove("d-none");
  };
  const handleImages = async (imagen) => {
    let list = [];
    for (let i in imagen) {
      if (imagen[i].size > 10000) {
        let file = imagen[i];
        new Compressor(file, {
          maxHeight: 800,
          maxWidth: 800,
          minHeight: 300,
          minWidth: 300,
          success: (file) => {
            list.push(file);
          },
        });
      }
    }
    return list;
  };
  const [error, setError] = useState("");
  const handleEmailChange = (e) => {
    if (e.target.checked) {
      setRequired(false);
      document.getElementById("email").value = "";
      setEmprendimiento({ ...emprendimiento, Email: user.email });
    }
    if (!e.target.checked) {
      setRequired(true);
      setEmprendimiento({ ...emprendimiento, Email: e.target.value });
    }
  };
  const handleRecoger = (e) => {
    if (e.target.checked) {
      setEmprendimiento({ ...emprendimiento, Recoger: true });
    }
    if (!e.target.checked) {
      setEmprendimiento({ ...emprendimiento, Recoger: false });
    }
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    alert1CreateStoreTrue();
    window.scroll(0, 0);
    setError("");
    setCargando(true);
    let photosURL = [];
    let photos = "";
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
    if (imgs !== null) {
      let imgURL;
      for (let i in imgs) {
        if (imgs[i].size > 2000) {
          if (i < 5) {
            imgURL = `emprendimiento/perfil/` + i;
            try {
              await uploadPhoto(imgs[i], imgURL);
            } catch (error) {
              setError(error.message);
              setCargando(false);
            }
            try {
              await getPhotoURL(imgURL).then((url) => {
                photosURL.push(url);
              });
            } catch (error) {
              setError(error.message);
              setCargando(false);
            }
            i++;
          }
        }
      }
      photos = photosURL.join(",");
      try {
        await create(storeName, photos, newPath);
        setCargando(false);
      } catch (error) {
        setError(error.message);
        setCargando(false);
      }
    } else {
      try {
        await create(storeName, photos, newPath);
        setCargando(false);
      } catch (error) {
        setError(error.message);
        setCargando(false);
      }
    }
    
  };
  const create = async (storeName, photos, path) => {
    try {
      await createStore(emprendimiento, storeName, photos, path).then((res) => {
        console.log(res)
        getMyStore();
      });
    } catch (error) {
      setError(error.message);
      setCargando(false);
    }
  };
  const StorePhoto = () => {
    if (img) {
      const imgUrl = URL.createObjectURL(img);
      return <PhotoStoreView img={imgUrl} s="60px" />;
    } else {
      return <StoreLogo w="60" h="60" />;
    }
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  if (cargando)
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
      <div
        className="store-register-admin col-12 pe-4 ps-4"
        style={{ maxHeight: "375px", overflow: "auto" }}
      >
        <h4 className="text-center m-3">Registra tu emprendimiento</h4>
        <form onSubmit={handleSubmit}>
          <div className="">
            <div className="d-flex flex-row justify-content-evenly store-register-input-1  mb-2">
              <div className="form-group col-5">
                <label className="m-1">Nombre:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Nombre"
                  className="form-control"
                  pattern="[A-Za-z.,0-9áéíóú ]{1,}"
                  placeholder="Ingrese el Nombre de su Emprendimiento"
                  required
                />
              </div>
              <div className="form-group col-5">
                <label className="m-1">Email:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Email"
                  className="form-control"
                  placeholder="Ingrese el E-mail de su Emprendimiento"
                  id="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  required={required}
                />
                <h5 className="d-flex flex-row m-1 font-store-reg font-store-reg-1">
                  <input
                    className="form-check-input mt-1em"
                    type="checkbox"
                    id="emailCheck"
                    onClick={handleEmailChange}
                    value={user.email}
                  />
                  <span className="color-rec">
                    Usar el mismo email de mi cuenta.
                  </span>
                </h5>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-evenly store-register-input-1">
              <div className="form-group col-5 m-1">
                <div className="d-flex flex-row">
                  <h6 className="bg-secondary rounded p-2 text-white mt-1 me-2">
                    Celular:
                  </h6>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="Celular"
                    id="telefono1"
                    className="form-control mt-1 mb-1"
                    pattern="[3]{1}[0-9]{9}"
                    placeholder="Ingrese aqui el número"
                    title="Ingrese un Celular valido para Colombia. Ej: 3125733093"
                    required
                  />
                </div>
              </div>
              <div className="col-5" id="new-phone-register-btn">
                <button
                  className="btn btn-primary mt-2"
                  onClick={handleNewPhone}
                >
                  Agregar telefono fijo
                </button>
              </div>
              <div
                className="form-group col-5 d-none m-1"
                id="new-phone-register"
              >
                <div className="d-flex flex-row">
                  <h6 className="bg-secondary rounded p-2 text-white mt-1 me-2">
                    Telefono:
                  </h6>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="Telefono"
                    className="form-control mt-1 mb-1"
                    pattern="[0-9]{7,}"
                    placeholder="Ingrese aqui el número"
                    title="Ingrese un Telefono valido para Colombia. Ej: 6025733093"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center m-2">
              <div className="form-group col-11">
                <label className="m-1">Dirección:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  name="Direccion"
                  className="form-control"
                  placeholder="Dirección Emprendimiento"
                />
              </div>
            </div>
            {emprendimiento.Direccion && 
            <h5 className="d-flex flex-row justify-content-center m-3 font-store-reg">
            <input
              className="form-check-input mt-1em"
              type="checkbox"
              id="check"
              onClick={handleRecoger}
              value=""
            />
            <span className="color-rec">
              Habilitar la opción de recoger en tienda.
            </span>
          </h5>
            }
            <div className="d-flex flex-row justify-content-evenly city-cat">
              <div className="form-group col-5 m-1">
                <label className="m-1">Categoria:</label>
                <select
                  onChange={handleChange}
                  name="Categoria"
                  className="form-select"
                  defaultValue={"default"}
                  required
                >
                  <option value="default" disabled>
                    Selecciona una categoria
                  </option>
                  {categoryList}
                </select>
              </div>
              <div className="form-group col-5 m-1">
                <label className="m-1">Ciudad:</label>
                <select
                  onChange={handleChange}
                  name="Ciudad"
                  className="form-select"
                  defaultValue={"default"}
                  required
                >
                  <option value="default" disabled>
                    Selecciona la ciudad
                  </option>
                  {cityList}
                </select>
              </div>
            </div>
            <div className="m-2  mt-3">
              <div className="d-flex flex-row justify-content-center botones-redes-regstore">
                <button
                  className="btn btn-primary me-2 ms-2 mt-1 mb-3"
                  id="facebook-register-btn"
                  onClick={handleFacebook}
                >
                  Agregar Facebook
                </button>
                <button
                  className="btn btn-primary me-2 ms-2 mt-1 mb-3"
                  id="instagram-register-btn"
                  onClick={handleInstagram}
                >
                  Agregar Instagram
                </button>
                <button
                  className="btn btn-primary me-2 ms-2 mt-1 mb-3"
                  id="web-register-btn"
                  onClick={handleWeb}
                >
                  Agregar Página Web
                </button>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center redes-register">
              <div className="form-group col-4 ms-5 ps-3 asd">
                <div
                  className="form-group d-none me-3 sa"
                  id="facebook-register"
                >
                  <label className="m-1">Facebook:</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="Facebook"
                    className="form-control"
                    placeholder="Ingresa el link de Facebook"
                  />
                </div>
              </div>
              <div className="form-group col-3  asd">
                <div
                  className="form-group d-none me-3 sa"
                  id="instagram-register"
                >
                  <label className="m-1">Instagram:</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="Instagram"
                    className="form-control"
                    placeholder="Ingresa el link de Instagram"
                  />
                </div>
              </div>
              <div className="form-group col-4 me-5 pe-3  asd">
                <div className="form-group d-none sa" id="web-register">
                  <label className="m-1">Página web:</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="Web"
                    className="form-control"
                    placeholder="Ingresa el link de la página web"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center me-4 ms-4 mt-2">
              <div className="form-group col-12">
                <label className="m-1">Descripción:</label>
                <textarea
                  onChange={handleChange}
                  type="text-area"
                  name="Descripcion"
                  className="form-control"
                  placeholder="Ingrese aqui la descripción de su emprendimiento"
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-center me-3 ms-3 mt-3">
              <div className="form-group imagenes-store-regs text-center">
                <div className="mt-2 me-3">
                  <StorePhoto />
                </div>
                <label className="d-block m-1 mt-2 me-2">
                  Sube fotos de tu emprendimiento: (máximo 5 imágenes)
                </label>
                <div className="d-flex flex-row justify-content-center est">
                  <input
                    type="file"
                    className="m-1 subirFoto"
                    accept="image/*"
                    onChange={changeImg}
                    multiple
                  ></input>
                </div>
              </div>
            </div>
            <div className="form-group text-center m-4">
              <button className="btn btn-primary" type="submit">
                Registrar Emprendimiento
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default StoreRegister;