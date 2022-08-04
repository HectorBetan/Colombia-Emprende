import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Compressor from 'compressorjs';
import { useMyStore } from "../../../context/MyStoreContext";
import {useAuth} from "../../../context/AuthContext";
import {PhotoProductView, ProductLogo} from '../../../utilities/photoView.utilities';
import {useState} from 'react';
function CreateProduct() {
  const { userStore, createProduct, loadingStore  } = useMyStore();
  const {user, uploadPhoto, getPhotoURL} = useAuth();
  const [cargando, setCargando] = useState(false);
  const [show, setShow] = useState(false);
  const [img, setImg] = useState(null);
  const [imgs, setImgs] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [product, setProduct] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: 0,
    Imagen: "",
    Emprendimiento_id: userStore._id,
  })
  const handleChange = ({ target: { value, name } }) => {setProduct({ ...product, [name]: value })}
  const changeImg = async (e) => {
    e.preventDefault();
    setImg(e.target.files[0]);
    await handleImages(e.target.files)
        .then(res => {
            setImgs(res);
        })
    };
    const handleImages = async (imagen) => {
      let list = [];
      for (let i in imagen) {
          if (imagen[i].size > 10000) {
              let file = imagen[i]
              new Compressor(file, {
                  maxHeight: 500,
                  maxWidth: 500,
                  minHeight: 200,
                  minWidth: 200,
                  success: file => {
                  list.push(file);
                  }
              });
          };
      }
      return list;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true)
    let photosURL  = [];
    let photos = "";
    let name = product.Nombre.toLowerCase().replace(/ /g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (imgs !== null){
      let imgURL;
        for (let i in imgs){
          if (imgs[i].size > 2000){
            if (i < 5){
              imgURL = `emprendimiento/productos/${name}/${i}`;
              try {
                  await uploadPhoto(user.email, imgs[i], imgURL);
              } catch (error) {
                  
              }
              try {
                  await getPhotoURL(user.email, imgURL)
                      .then(url => {
                          photosURL.push(url);
                      }) 
              } catch (error) {
                  
              }
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
      }
      try{
        await createProduct(newProduct);
        
      setProduct({
        Nombre: "",
        Descripcion: "",
        Precio: 0,
        Imagen: "",
        Emprendimiento_id: userStore._id,
      })
      setImg(null);
      setImgs(null);
      handleClose();
      setCargando(false);
      return;
      }
      catch(error){

      }
    } else {
      try{
        await createProduct(product);
        setProduct({
          Nombre: "",
          Descripcion: "",
          Precio: 0,
          Imagen: "",
          Emprendimiento_id: userStore._id,
        })
        setImg(null);
        setImgs(null);
        handleClose();
        setCargando(false);
        return;
      }
      catch(error){
      }
    }
    
  }
  const ProductPhoto = () => {
    if (img) {
      const imgUrl = URL.createObjectURL(img);
      return (
        <PhotoProductView img={imgUrl} s='60px' />
      );
    }
    else {
      return (
        <ProductLogo w="60" h="60" />
      );
    }
  };
  if (cargando || loadingStore) return(
    <div className="spinner-border text-primary text-center align-middle" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
  );
  return (
    <div>
      <Nav.Link className="btn btn-primary m-lg-0 m-md-0 me-sm-5 me-5 text-end d-flex flex-row align-middle align-items-center" 
      role="button"
      onClick={handleShow}>
      <h4 className="align-items-center text-white m-2">Agregar Producto</h4>
      </Nav.Link>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton />
        <Modal.Body>
          <h4>Agregar Producto</h4>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" onChange={handleChange} name="Nombre" value={product.Nombre}
                className="form-control" placeholder="Nombre del Producto" />
              </div>
              <div className="form-group">
                <input type="text" onChange={handleChange} name="Descripcion" value={product.Descripcion}
                className="form-control" placeholder="Descripción del Producto" />
              </div>
              <div className="form-group">
                <input type="text" onChange={handleChange} name="Precio" value={product.Precio}
                className="form-control" placeholder="Valor del Producto" />
              </div>
              <div className="form-group d-flex flex-row">
                <ProductPhoto />
                <input type="file" className="m-1 subirFoto" id='imgs' accept="image/*" onChange={changeImg} multiple></input>
              </div>
              <div className="form-group text-center m-3">
                  <button className="btn btn-primary" type="submit">Crear Producto</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default CreateProduct;