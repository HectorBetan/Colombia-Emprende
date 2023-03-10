import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import Compressor from "compressorjs";
import { PhotoStoreView, StoreLogo } from "../../utilities/photoView.utilities";
import Alert from "../../utilities/alert.utilities";
function StoreImgUpdate() {
  const [cargando, setCargando] = useState(true);
  const [disableImg, setDisableImg] = useState(true);
  const [start, setStart] = useState(false);
  const { userStore, updateStoreImage, loadingStore, getMyStore, alert1CreateStoreTrue } =
    useMyStore();
  const { loading, uploadPhoto, getPhotoURL, deletePhoto } = useAuth();
  const [error, setError] = useState("");
  const [emprendimientoImagen, setEmprendimientoImagen] = useState({
    _id: "",
    Imagen: "",
  });
  const [imgs, setImgs] = useState(null);
  const [img, setImg] = useState(null);
  const [borrarImg] = useState([]);
  const changeImg = async (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
    setError("");
    let list = [];
    for (let i in e.target.files) {
      if (i >= 5) {
        break;
      }
      if (e.target.files[i].size > 10000) {
        let file = e.target.files[i];
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
      setImgs(list);
      setDisableImg(false);
    }
  };
  useEffect(() => {
    if (userStore) {
      setStart(true);
    }
  }, [userStore, start]);
  if (start) {
    if (userStore.Imagen) {
      setEmprendimientoImagen({
        _id: userStore._id,
        Imagen: userStore.Imagen,
      });
    }
    setStart(false);
    setCargando(false);
  }
  const handleSubmitImg = async (e) => {
    e.preventDefault();
    alert1CreateStoreTrue();
    setError("");
    setCargando(true);
    if (borrarImg) {
      for (let j in borrarImg) {
        let url = "emprendimiento/perfil/" + borrarImg[j];
        try {
          await deletePhoto(url);
        } catch (error) {}
      }
    }
    borrarImg.length = 0;
    let url;
    let iterator;
    let existImgList = [];
    let existImgPosition = [];
    let existImg = emprendimientoImagen.Imagen;
    if (existImg) {
      existImgList = existImg.split(",");
    }
    if (existImgList) {
      for (let k in existImgList) {
        let existPosition = existImgList[k].search(`%2Fperfil%2F`) + 12;
        existImgPosition.push(
          existImgList[k].slice(existPosition, existPosition + 1)
        );
      }
      iterator = existImgPosition.length;
    } else {
      iterator = 0;
    }
    if (imgs !== null) {
      let photoUrl = 0;
      for (let i in imgs) {
        if (iterator === 5) {
          console.log("No se pueden subir más de 5 imágenes");
        }
        if (iterator < 5) {
          if (existImgList) {
            while (existImgPosition.includes(photoUrl.toString())) {
              photoUrl++;
            }
          }
          url = `emprendimiento/perfil/` + photoUrl;
          try {
            await uploadPhoto(imgs[i], url);
          } catch (error) {
            setError(error.message);
            setCargando(false);
            return;
          }
          try {
            await getPhotoURL(url).then((url) => {
              existImgList.push(url);
            });
          } catch (error) {
            setError(error.message);
            setCargando(false);
          }
          iterator++;
          photoUrl++;
        }
      }
      let photos = existImgList.join(",");
      setEmprendimientoImagen({ ...emprendimientoImagen, Imagen: photos });
      const emprendimientoImg = { Imagen: photos };
      storeUpdate(emprendimientoImg);
    } else {
      setEmprendimientoImagen({
        ...emprendimientoImagen,
        Imagen: emprendimientoImagen.Imagen,
      });
      const emprendimientoImg = { Imagen: emprendimientoImagen.Imagen };
      storeUpdate(emprendimientoImg);
    }
  };
  const storeUpdate = async (imagen) => {
    try {
      await updateStoreImage(imagen);
      window.scroll(0, 0);
      setError({ success: true, msg: "Hemos actualizado tus fotos" });
      borrarImg.length = 0;
      setDisableImg(true);
      setImg(null);
      setImgs(null);
      await getMyStore().then(() => {
        setCargando(false);
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
  const handleProfilePhoto = (e) => {
    e.preventDefault();
    setError("");
    let selected = e.target.value;
    let photoList = emprendimientoImagen.Imagen.split(",");
    let profilePhoto = photoList[selected];
    photoList.splice(selected, 1);
    let list = photoList;
    list.unshift(profilePhoto);
    let newPhotos = list;
    let newPhotosString = newPhotos.join(",");
    setEmprendimientoImagen({
      ...emprendimientoImagen,
      Imagen: newPhotosString,
    });
    setDisableImg(false);
  };
  const ImagesView = () => {
    let photos;
    let f = [];
    let fa = "";
    let aclass = "collapsed";
    let bclass = "";
    if (imgs) {
      aclass = "";
      bclass = "show";
    }
    const [selected, setSelected] = useState(0);
    if (emprendimientoImagen.Imagen) {
      photos = emprendimientoImagen.Imagen.split(",");
      return (
        <div className="d-flex flex-row justify-content-center caja-editar-imgs">
          <div className="d-flex flex-row ms-2 me-2 caja-imgs">
            <img
              className="d-block rounded img-editar"
              src={photos[selected]}
              alt={selected}
            />
            <div className="d-flex flex-column mt-1 ms-2 me-2">
              {photos.map((img, i) => {
                return (
                  <button
                    className="btn btn-ligth p-0"
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelected(i);
                    }}
                  >
                    <img
                      className="d-block rounded  m-1 btn-img-editar"
                      src={img}
                      alt={i}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="caja-button col-edit-imgs">
            <div className="d-flex flex-column ms-2 me-2">
              <button
                className="m-1 btn btn-danger boton-imagen-ppal"
                onClick={(e) => {
                  e.preventDefault();
                  let borrarPosition =
                    photos[selected].search(`%2Fperfil%2F`) + 12;
                  let borrar = photos[selected].slice(
                    borrarPosition,
                    borrarPosition + 1
                  );
                  borrarImg.push(borrar);
                  photos.splice(selected, 1);
                  f = photos;
                  fa = f.join(",");
                  setError("");
                  setEmprendimientoImagen({
                    ...emprendimientoImagen,
                    Imagen: fa,
                  });
                  setDisableImg(false);
                  borrar = "";
                }}
              >
                Borrar esta foto
              </button>
              <button
                className="m-1 btn btn-primary boton-imagen-ppal"
                key={selected}
                value={selected}
                onClick={handleProfilePhoto}
              >
                Seleccionar como foto principal
              </button>
            </div>
            <div className="accordion m-2 rounded " id="accordionSubirImgs">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingSubirImgs">
                  <button
                    className={`accordion-button ${aclass}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSubirImgs"
                    aria-expanded="true"
                    aria-controls="collapseSubirImgs"
                  >
                    Subir más Imágenes
                  </button>
                </h2>
                <div
                  id="collapseSubirImgs"
                  className={`accordion-collapse collapse ${bclass}`}
                  aria-labelledby="headingSubirImgs"
                  data-bs-parent="#accordionSubirImgs"
                >
                  <div className="accordion-body">
                    <div className="text-center">
                      {photos.length < 5 && (
                        <div className="d-flex flex-row nuevas-imgs justify-content-center">
                          <StorePhoto />
                          <input
                            type="file"
                            className="m-1 ms-2 subir-foto"
                            accept="image/*"
                            multiple
                            onChange={changeImg}
                            id="image-input"
                          ></input>
                        </div>
                      )}
                      {photos.length >= 5 && (
                        <div className="texto-001">
                          Actualmente tienes el máximo de imágenes permitidas
                          (5); por favor elimina alguna imágen para subir nuevas
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-1 mt-lg-3">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={disableImg}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      );
    } else
      return (
        <div className="text-center">
          <h4>No has subido ninguna foto</h4>
          <div className="mt-3">
            <h5 className="">Subir Imágenes</h5>
            <div className="d-flex flex-row text-center justify-content-center">
              <StorePhoto />
              <input
                type="file"
                className="m-1 subir-foto"
                accept="image/*"
                multiple
                onChange={changeImg}
                id="image-input"
              ></input>
            </div>
          </div>
          <div className="text-center mt-1 mt-lg-3">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={disableImg}
              >
                Guardar Cambios
              </button>
            </div>
        </div>
      );
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 3500);
  }
  if (cargando || loading || loadingStore)
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
    <div className="m-2">
      {error && <Alert message={error} />}
      <div>
        <form onSubmit={handleSubmitImg}>
          <div className="">
            <ImagesView />
          </div>
        </form>
      </div>
    </div>
  );
}
export default StoreImgUpdate;