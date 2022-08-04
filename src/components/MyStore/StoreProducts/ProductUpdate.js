import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Compressor from 'compressorjs';
import { useMyStore } from "../../../context/MyStoreContext";
import {useState} from 'react';
function ProductUpdate(userProduct) {
    const { updateProduct } = useMyStore();
    const [show, setShow] = useState(false);
    const [img, setImg] = useState(null);
    const [start, setStart] = useState(true);
    const [imgs, setImgs] = useState(null);
    const handleUpdateClose = () => setShow(false);
    const handleUpdateShow = () => setShow(true);
    const [existProduct, setExistProduct] = useState({
        Nombre: "",
        Descripcion: "",
        Precio: "",
        Imagen: "",
        Otros: "",
    })
    if (start) {
        if(userProduct.product){
            setExistProduct({...existProduct,
                Nombre: userProduct.product.Nombre,
                Descripcion: userProduct.product.Descripcion,
                Precio: userProduct.product.Precio,
                Imagen: userProduct.product.Imagen,
                Otros: userProduct.product.Otros,
                })
            setStart(false);
        }
        
    }
    const handleUpdateChange = ({ target: { value, name } }) => {setExistProduct({ ...existProduct, [name]: value })}
    const changeUpdateImg = async (e) => {
        e.preventDefault();
        setImg(e.target.files[0]);
        let list = [];
        for (let i in e.target.files) {
            if (e.target.files[i].size > 10000) {
            let file = e.target.files[i]
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
        setImgs(list);
        }   
    }
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try{
        await updateProduct(existProduct);
        }
        catch(error){
        console.log(error);
        }
    }
    const EmprendimientoUpdatePhoto = () => {
        if (img) return (<div><img style={{maxWidth:'70px', maxHeight: '70px', minWidth:'70px', 
        minHeight: '70px', borderRadius:"15px", objectFit: 'cover'}} 
        src={URL.createObjectURL(img)} alt="emprendimiento" className="m-2" /></div>);
        else return (
            
                <i className="fa-solid fa-box-archive fa-3x m-3"></i>
        );
    };
    if(userProduct.product){
        return (
            <div>
                <Nav.Link className="m-lg-0 m-md-0 me-sm-5 me-5 text-end d-flex flex-row align-middle align-items-center" 
                role="button"
                onClick={handleUpdateShow}>
                    <h4 className="align-items-center m-2">Editar Producto</h4>
                </Nav.Link>
                <Modal show={show} onHide={handleUpdateClose}>
                    <Modal.Header closeButton />
                    <Modal.Body>
                        <h4>Editar Producto</h4>
                        <div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="form-group">
                            <input type="text" onChange={handleUpdateChange} name="Nombre"
                            className="form-control" placeholder="Nombre del Producto" value={existProduct.Nombre} />
                            </div>
                            <div className="form-group">
                            <input type="text" onChange={handleUpdateChange} name="Descripcion"
                            className="form-control" placeholder="Descripción del Producto" value={existProduct.Descripcion}/>
                            </div>
                            <div className="form-group">
                            <input type="text" onChange={handleUpdateChange} name="Precio"
                            className="form-control" placeholder="Valor del Producto" value={existProduct.Precio}/>
                            </div>
                            <div className="form-group d-flex flex-row">
                            <EmprendimientoUpdatePhoto />
                            <input type="file" className="m-1 subirFoto" accept="image/*" onChange={changeUpdateImg} multiple></input>
                            </div>
                            <div className="form-group text-center m-3">
                                <button className="btn btn-primary" type="submit">Registrar Emprendimiento</button>
                            </div>
                        </form>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
export default ProductUpdate;