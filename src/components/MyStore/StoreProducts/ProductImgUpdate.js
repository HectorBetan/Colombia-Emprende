import { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { useMyStore } from '../../../context/MyStoreContext';
import Compressor from 'compressorjs';
import {PhotoProductView, ProductLogo} from '../../../utilities/photoView.utilities';
function ProductImgUpdate(userProduct) {
    const [cargando, setCargando] = useState(true);
    const [disableImg, setDisableImg] = useState(true);
    const [start, setStart] = useState(false);
    const { updateProduct, loadingStore } = useMyStore();
    const { user, loading, uploadPhoto,
    getPhotoURL, deletePhoto  } = useAuth();
    const [error, setError] = useState("");
    const [product, setProduct] = useState({ 
        Imagen: "",
        _id: "",
        User_id: "",
    }); 
    const [imgs, setImgs] = useState(null);
    const [img, setImg] = useState(null);
    const [ borrarImg ] = useState([]);
    const changeImg = async (e) => {
        e.preventDefault();
        setImg(e.target.files[0]);
        setError("");
        let list = [];
        for (let i in e.target.files) {
            if (i >= 5){
                break;
            }
            if (e.target.files[i].size > 10000) {
            let file = e.target.files[i]
            new Compressor(file, {
                maxHeight: 800,
                maxWidth: 800,
                minHeight: 300,
                minWidth: 300,
                success: file => {
                    list.push(file);
                }
            });
        };
        setImgs(list);
        setDisableImg(false);
        }   
    }
    useEffect(() => {
        if (userProduct.product){
            setStart(true);
        }
    }, [userProduct, start]);
    if (start) {
        if (userProduct.product.Imagen){
            setProduct({
                _id: userProduct.product._id,
                Imagen: userProduct.product.Imagen,
                User_id: userProduct.product.User_id,
            });
        }
        setStart(false);
        setCargando(false);
    }
    const handleSubmitImg = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);
        const name = userProduct.product.ImgRoute;
        
        if (borrarImg){
            for (let j in borrarImg){
                let url = "emprendimiento/productos/"+name+"/"+borrarImg[j];
                try {
                    await deletePhoto(url)
                } catch (error) {
                 
                }
            }
        }
        borrarImg.length = 0;
        let url;
        let iterator;
        let existImgList = [];
        let existImgPosition = [];
        let existImg = product.Imagen;
        if (existImg){
            existImgList = existImg.split(",");
        }
        if (existImgList){
            for (let k in existImgList){
                let existPosition = existImgList[k].search(`alt=media`)-2;
                existImgPosition.push(existImgList[k].slice(existPosition, existPosition+1));
            }
            iterator = existImgPosition.length;
        } else{
            iterator = 0;
        }
        if (imgs !== null){
            let photoUrl = 0;
            for (let i in imgs){
                if (iterator === 5){
                }
                if (iterator < 5){
                    if (existImgList){
                    while (existImgPosition.includes(photoUrl.toString())){
                        photoUrl++;
                    }
                }
                    url = `emprendimiento/productos/`+name+"/"+photoUrl;
                    try {
                        await uploadPhoto(user.email, imgs[i], url);
                    } catch (error) {
                        setError(error.message);
                        setCargando(false);
                        return
                    }
                    try {
                        await getPhotoURL(user.email, url)
                            .then(url => {
                                existImgList.push(url);
                            }) 
                    } catch (error) {
                        setError(error.message);
                        setCargando(false);
                    }
                    iterator++;
                    photoUrl++;
                }
            }
            let photos = existImgList.join(",");
            const emprendimientoImg = {Imagen: photos};
            productUpdate(emprendimientoImg);
        } else {
            const emprendimientoImg = {Imagen: product.Imagen};
            productUpdate(emprendimientoImg);
        }      
    }
    const productUpdate = async (imagen) => {
        console.log(imagen);
        try {
            await updateProduct(imagen);
            setError({error: "SiEmail", msg : 'Hemos actualizado tus fotos'});
            borrarImg.length = 0;
            document.getElementById("image-input").value = "";
            setDisableImg(true);
            setImg(null);
            setImgs(null)
            setCargando(false);
        } catch (error) {
            setError(error.message);
            setCargando(false);
        }
    }
    const ProductPhoto = () => {
        if (img) {
            const imgUrl = URL.createObjectURL(img);
            return (
                <PhotoProductView img={imgUrl} s='50px' />
            );
        }
        else {
            return (
                <ProductLogo w="50" h="50" />
            );
        }
    };
    const handleProfilePhoto = (e) => {
        e.preventDefault();
        setError("");
        let selected = e.target.value;
        let photoList = product.Imagen.split(",");
        let profilePhoto = photoList[selected];
        photoList.splice(selected,1);
        let list = photoList;
        list.unshift(profilePhoto);
        let newPhotos = list;
        let newPhotosString = newPhotos.join(",");;
        setProduct({ ...product, Imagen: newPhotosString });
        setDisableImg(false);
    }
    const ImagesView = () => {
        let photos;
        let f = [] 
        let fa = ""
        const [selected, setSelected] = useState(0);
        if (product.Imagen) {
            photos = product.Imagen.split(",");
            return (
                <div className=''>
                <div className="d-flex flex-row justify-content-center mb-2">
                    <img
                    className="d-block  rounded"
                    style={{ maxHeight: "315px", width: "100%", objectFit: "cover" }}
                    src={photos[selected]}
                    alt={selected}
                    />
                    
                    <div className="d-flex flex-column mt-1">
                    {photos.map((img, i) => {
                        return (
                                <button className='btn btn-ligth p-0' key={i} onClick={(e) => {e.preventDefault(); setSelected(i)}}>
                                    <img
                                    className="d-block rounded m-1 "
                                    style={{ maxHeight: "50px", maxWidth: "50px", objectFit: "cover" }}
                                    src={img}
                                    alt={i}
                                    />
                                </button>
                            
                        )
                    })}
                    </div>
                </div>
                <div className="d-flex flex-row justify-content-center botones-edit-img-prod">
                <button className='btn btn-danger m-1' onClick={(e) => {e.preventDefault(); 
                let borrarPosition = photos[selected].search(`alt=media`)-2;
                let borrar = photos[selected].slice(borrarPosition, borrarPosition+1);
                borrarImg.push(borrar);
                photos.splice(selected,1); f=photos; fa=f.join(","); setError(""); 
                setProduct({...product, Imagen:fa});
                setDisableImg(false); borrar=""}}>
                    Borrar esta foto
                </button>
                <button key={selected} value={selected} className='btn btn-primary m-1' onClick={handleProfilePhoto}>Seleccionar como foto principal</button>
                
                </div> 
                <div className="accordion m-2 rounded " id="accordionSubirImgs">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingSubirImgs">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSubirImgs" aria-expanded="true" aria-controls="collapseSubirImgs">
                            Subir más Imágenes
                            </button>
                        </h2>
                        <div id="collapseSubirImgs" class="accordion-collapse collapse" aria-labelledby="headingSubirImgs" data-bs-parent="#accordionSubirImgs">
                            <div className="accordion-body">
                                <div className='text-center'>
                                    {photos.length < 5 && <div className="d-flex flex-row nuevas-imgs justify-content-center">
                                        <ProductPhoto />
                                        <input type="file" className="m-1 ms-2 subir-foto" accept="image/*" multiple
                                        onChange={changeImg} id="image-input"></input>
                                    </div>}
                                    {photos.length >= 5 && <div className='texto-001'>
                                        Actualmente tienes el máximo de imágenes permitidas (5); por favor elimina alguna imágen para subir nuevas
                                    </div>}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
                
                </div> 
            )
        } else return (
            <div>
                No has subido ninguna foto
            </div>
        )
    }
    if (error){
        setTimeout(() => {
            setError("");
        }, 5000);
    }
    if (cargando || loading || loadingStore) return(
        <div className="spinner-border text-primary text-center align-middle" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    );
    return (
        <div>
            <div>
                <form onSubmit={handleSubmitImg}>
                    <div className="d-flex flex-row justify-content-center">
                        <ImagesView />
                    </div>
                    
                    <div className="text-center m-3">
                        <button className="btn btn-primary" type="submit" disabled={disableImg}>Guardar Cambios</button>
                    </div>
                </form>  
            </div>
        </div>    
    );
}
export default ProductImgUpdate;