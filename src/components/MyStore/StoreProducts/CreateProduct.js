import Modal from "react-bootstrap/Modal";
import Compressor from "compressorjs";
import { useMyStore } from "../../../context/MyStoreContext";
import { useAuth } from "../../../context/AuthContext";
import {
  PhotoProductView,
  ProductLogo,
} from "../../../utilities/photoView.utilities";
import { useState, useEffect } from "react";
import Alert from "../../../utilities/alert.utilities";
function CreateProduct() {
  const { userStore, createProduct } = useMyStore();
  const { uploadPhoto, getPhotoURL, userData } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [img, setImg] = useState(null);
  const [imgs, setImgs] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [product, setProduct] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: 0,
    Imagen: "",
    ImgRoute: "",
    Emprendimiento_id: "",
    User_id: "",
  });
  useEffect(() => {
    const create = () => {
      setProduct({ ...product, Emprendimiento_id: userStore._id, User_id: userData._id });
    };
    if (userData && userStore) {
      if (!product.Emprendimiento_id || !product.User_id){return () => {
        create();
      };}
    }
  }, [userData, userStore, product]);
  const handleChange = ({ target: { value, name } }) => {
    setProduct({ ...product, [name]: value });
  };
  const changeImg = async (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
    await handleImages(e.target.files).then((res) => {
      setImgs(res);
    });
  };
  const handleImages = async (imagen) => {
    let list = [];
    for (let i in imagen) {
      if (imagen[i].size > 10000) {
        let file = imagen[i];
        new Compressor(file, {
          maxHeight: 500,
          maxWidth: 500,
          minHeight: 200,
          minWidth: 200,
          success: (file) => {
            list.push(file);
          },
        });
      }
    }
    return list;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    let photosURL = [];
    let photos = "";
    let name = product.Nombre.toLowerCase()
      .replace(/ /g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (imgs !== null) {
      let imgURL;
      for (let i in imgs) {
        if (imgs[i].size > 2000) {
          if (i < 5) {
            imgURL = `emprendimiento/productos/${name}/${i}`;
            try {
              await uploadPhoto(imgs[i], imgURL);
            } catch (error) {}
            try {
              await getPhotoURL(imgURL).then((url) => {
                photosURL.push(url);
              });
            } catch (error) {}
            i++;
          }
        }
      }
      photos = photosURL.join(",");
      let newProduct = {
        Nombre: product.Nombre,
        Descripcion: product.Descripcion,
        Precio: product.Precio,
        Imagen: photos,
        ImgRoute: name,
      };
      try {
        await createProduct(newProduct);
        window.scroll(0, 0);
        setProduct({
          Nombre: "",
          Descripcion: "",
          Precio: 0,
          Imagen: "",
          Emprendimiento_id: userStore._id,
        });
        setImg(null);
        setImgs(null);
        handleClose();
        setCargando(false);
        return;
      } catch (error) {
        setError(error.message);
      }
    } else {
      try {
        let newProduct = {
          Nombre: product.Nombre,
          Descripcion: product.Descripcion,
          Precio: product.Precio,
          Imagen: photos,
          ImgRoute: name,
        };
        await createProduct(newProduct);
        window.scroll(0, 0);
        setProduct({
          Nombre: "",
          Descripcion: "",
          Precio: 0,
          Imagen: "",
          Emprendimiento_id: userStore._id,
        });
        setImg(null);
        setImgs(null);
        handleClose();
        setError({ success: true, msg: "Producto creado correctamente" });
        setCargando(false);
        return;
      } catch (error) {
        setError(error.message);
      }
    }
  };
  const ProductPhoto = () => {
    if (img) {
      const imgUrl = URL.createObjectURL(img);
      return <PhotoProductView img={imgUrl} s="55px" />;
    } else {
      return <ProductLogo w="55" h="55" />;
    }
  };
  if (error) {
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  if (cargando)
    return (
      <div
        className="spinner-border text-primary text-center align-middle"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  return (
    <div className="text-center mb-3 d-flex justify-content-center">
      {error.success && <Alert message={error} />}
      <button
        className="btn btn-primary d-flex flex-row justify-content-center"
        onClick={handleShow}
      >
        <i className="fa fa-plus-circle fa-2x" aria-hidden="true"></i>

        <h5 className="align-items-center text-white m-1 ms-2">
          Nuevo Producto
        </h5>
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton />
        <Modal.Body>
          <h4 className="text-center">
            <i className="fa fa-plus-circle me-2" aria-hidden="true"></i>Agregar
            Producto
          </h4>
          <div className="p-2 m-2">
            {error && <Alert message={error} />}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label className="m-1">Nombre del Producto</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="Nombre"
                  value={product.Nombre}
                  className="form-control"
                  placeholder="Ingrese el Nombre del Producto"
                  required
                />
              </div>
              <div className="form-group mb-2">
                <label className="m-1">Descripción del Producto</label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="Descripcion"
                  value={product.Descripcion}
                  className="form-control"
                  placeholder="Ingrese Descripción del Producto"
                />
              </div>
              <div className="form-group mb-2">
                <label className="m-1">Precio del Producto</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="Precio"
                  className="form-control"
                  placeholder="Ingrese Valor del Producto"
                  required
                />
              </div>
              <label className="m-1">
                Agregar Imágenes <span>(máximo 5 imágenes)</span>
              </label>
              <div className="form-group d-flex flex-row m-2">
                <ProductPhoto />
                <input
                  type="file"
                  className="m-2 subirFoto"
                  id="imgs"
                  accept="image/*"
                  onChange={changeImg}
                  multiple
                ></input>
              </div>
              <div className="form-group text-center m-3">
                <button className="btn btn-primary" type="submit">
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default CreateProduct;