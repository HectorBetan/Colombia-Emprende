import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useMyStore } from '../../context/MyStoreContext';
import Compressor from 'compressorjs';
import {PhotoStoreView, StoreLogo} from '../../utilities/photoView.utilities';
function StoreImgUpdate() {
    const [cargando, setCargando] = useState(true);
    const [disableImg, setDisableImg] = useState(true);
    const [start, setStart] = useState(false);
    const { userStore, updateStore, loadingStore } = useMyStore();
    const { user, loading, uploadPhoto,
    getPhotoURL, deletePhoto  } = useAuth();
    const [error, setError] = useState("");
    const [emprendimientoImagen, setEmprendimientoImagen] = useState({ Imagen: "",}); 
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
        if (userStore){
            setStart(true);
        }
    }, [userStore, start]);
    if (start) {
        if (userStore.Imagen){
            setEmprendimientoImagen({
                Imagen: userStore.Imagen,
            });
        }
        setStart(false);
        setCargando(false);
    }
    const handleSubmitImg = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);
        if (borrarImg){
            for (let j in borrarImg){
                let url = "emprendimiento/perfil/"+borrarImg[j];
                try {
                    await deletePhoto(user.email, url)
                } catch (error) {
                    
                }
            }
        }
        borrarImg.length = 0;
        let url;
        let iterator;
        let existImgList = [];
        let existImgPosition = [];
        let existImg = emprendimientoImagen.Imagen;
        if (existImg){
            existImgList = existImg.split(",");
        }
        if (existImgList){
            for (let k in existImgList){
                let existPosition = existImgList[k].search(`%2Fperfil%2F`)+12;
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
                    console.log("No se pueden subir más de 5 imágenes");
                }
                if (iterator < 5){
                    if (existImgList){
                    while (existImgPosition.includes(photoUrl.toString())){
                        photoUrl++;
                    }
                }
                    url = `emprendimiento/perfil/`+photoUrl;
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
            storeUpdate(emprendimientoImg);
        } else {
            const emprendimientoImg = {Imagen: emprendimientoImagen.Imagen};
            storeUpdate(emprendimientoImg);
        }      
    }
    const storeUpdate = async (imagen) => {
        console.log(imagen);
        try {
            await updateStore(imagen);
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
    const StorePhoto = () => {
        if (img) {
            const imgUrl = URL.createObjectURL(img);
            return (
                <PhotoStoreView img={imgUrl} s='70px' />
            );
        }
        else {
            return (
                <StoreLogo w="70" h="70" />
            );
        }
    };
    const handleProfilePhoto = (e) => {
        e.preventDefault();
        setError("");
        let selected = e.target.value;
        let photoList = emprendimientoImagen.Imagen.split(",");
        let profilePhoto = photoList[selected];
        photoList.splice(selected,1);
        let list = photoList;
        list.unshift(profilePhoto);
        let newPhotos = list;
        let newPhotosString = newPhotos.join(",");;
        setEmprendimientoImagen({ ...emprendimientoImagen, Imagen: newPhotosString });
        setDisableImg(false);
    }
    const ImagesView = () => {
        let photos;
        let f = [] 
        let fa = ""
        const [selected, setSelected] = useState(0);
        if (emprendimientoImagen.Imagen) {
            photos = emprendimientoImagen.Imagen.split(",");
            return (
                <div>
                <div className="d-flex flex-row">
                    <img
                    className="d-block  rounded"
                    style={{ maxHeight: "325px", width: "100vh", objectFit: "cover" }}
                    src={photos[selected]}
                    alt={selected}
                    />
                    
                    <div className="d-flex flex-column mt-1">
                    {photos.map((img, i) => {
                        return (
                                <button key={i} onClick={(e) => {e.preventDefault(); setSelected(i)}}>
                                    <img
                                    className="d-block rounded m-1"
                                    style={{ maxHeight: "50px", maxWidth: "50px", objectFit: "cover" }}
                                    src={img}
                                    alt={i}
                                    />
                                </button>
                            
                        )
                    })}
                    </div>
                </div>
                <div className="d-flex flex-row">
                <button onClick={(e) => {e.preventDefault(); 
                let borrarPosition = photos[selected].search(`%2Fperfil%2F`)+12;
                let borrar = photos[selected].slice(borrarPosition, borrarPosition+1);
                borrarImg.push(borrar);
                photos.splice(selected,1); f=photos; fa=f.join(","); setError(""); 
                setEmprendimientoImagen({...emprendimientoImagen, Imagen:fa});
                setDisableImg(false); borrar=""}}>
                    Borrar esta foto
                </button>
                <button key={selected} value={selected} onClick={handleProfilePhoto}>Seleccionar como foto principal</button>
                
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
                    <div className="d-flex flex-row">
                        <ImagesView />
                    </div>
                    <div>
                        <label className="d-block m-1 mt-2 me-2">Foto de Perfil de emprendimiento:</label>
                        <div className="d-flex flex-row">
                            <StorePhoto />
                            <input type="file" className="m-1 subirFoto" accept="image/*" multiple
                            onChange={changeImg} id="image-input"></input>
                        </div>
                    </div>
                    <div className="text-center m-3">
                        <button className="btn btn-primary" type="submit" disabled={disableImg}>Guardar Cambios</button>
                    </div>
                </form>  
            </div>
        </div>    
    );
}
export default StoreImgUpdate;