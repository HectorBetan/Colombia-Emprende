function PhotoView (img) {
    if (img.img) {
        return (<div><img style={{maxWidth:'60px', maxHeight: '60px', minWidth:'60px', 
        minHeight: '60px', borderRadius:"30px", objectFit: 'cover'}} src={img.img} alt="profile" /></div>);
    }
    else {
        return (
            <div>
                <i className="fa-solid fa-circle-user fa-3x m-1"></i>
            </div>
        );
    }
};
export default PhotoView;