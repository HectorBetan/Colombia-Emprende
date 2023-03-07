import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useMyStore } from "../../../context/MyStoreContext";
import ProductImgUpdate from "./ProductImgUpdate";
import { useState } from "react";
function ProductUpdate(userProduct) {
  const { updateProduct } = useMyStore();
  const [show, setShow] = useState(false);
  const [start, setStart] = useState(true);
  const [key, setKey] = useState("login");
  const handleUpdateClose = () => setShow(false);
  const handleUpdateShow = () => setShow(true);
  const [existProduct, setExistProduct] = useState({
    _id: "",
    Nombre: "",
    Descripcion: "",
    Precio: "",
    Imagen: "",
    User_id: "",
  });
  if (start) {
    if (userProduct.product) {
      setExistProduct({
        ...existProduct,
        _id: userProduct.product._id,
        Nombre: userProduct.product.Nombre,
        Descripcion: userProduct.product.Descripcion,
        Precio: userProduct.product.Precio,
        Imagen: userProduct.product.Imagen,
        User_id: userProduct.product.User_id,
      });
      setStart(false);
    }
  }
  const handleUpdateChange = ({ target: { value, name } }) => {
    setExistProduct({ ...existProduct, [name]: value });
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(existProduct);
      window.scroll(0, 0);
    } catch (error) {
      console.log(error);
    }
  };
  if (userProduct.product) {
    return (
      <div>
        <Nav.Link
          className="btn btn-primary text-white p-2 m-1 btn-editar-product"
          role="button"
          onClick={handleUpdateShow}
        >
          Editar Producto
        </Nav.Link>
        <Modal show={show} onHide={handleUpdateClose}>
          <Modal.Header closeButton />
          <Modal.Body>
            <Tabs
              justify
              id="login-tab"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-1 d-flex flex-row justify-content-center"
            >
              <Tab
                eventKey="login"
                title="Editar Producto"
                className="ms-4 me-4 mt-2 mb-2"
              >
                <form onSubmit={handleUpdateSubmit}>
                  <div className="form-group">
                    <label className="m-1">Nombre del Producto</label>
                    <input
                      type="text"
                      onChange={handleUpdateChange}
                      name="Nombre"
                      className="form-control"
                      placeholder="Nombre del Producto"
                      value={existProduct.Nombre}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="m-1">Precio del Producto</label>
                    <input
                      type="number"
                      onChange={handleUpdateChange}
                      name="Precio"
                      className="form-control"
                      placeholder="Valor del Producto"
                      value={existProduct.Precio}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="m-1">Descripción del Producto</label>
                    <textarea
                      type="text"
                      onChange={handleUpdateChange}
                      name="Descripcion"
                      className="form-control"
                      placeholder="Descripción del Producto"
                      value={existProduct.Descripcion}
                    />
                  </div>
                  <div className="form-group text-center m-3">
                    <button className="btn btn-primary" type="submit">
                      Actualizar Producto
                    </button>
                  </div>
                </form>
              </Tab>
              <Tab
                eventKey="singup"
                title="Editar Imágenes"
                className="ms-4 me-4 mt-2 mb-2"
              >
                <ProductImgUpdate product={userProduct.product} />
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default ProductUpdate;