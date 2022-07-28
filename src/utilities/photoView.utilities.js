export const UserLogo = (size) => {
    return (
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" width={size.w} height={size.h} fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
            </svg>
        </div>
    );
};
export const PhotoView = (img) => {
    if (img.img) {
        return (<div><img style={{maxWidth:'60px', maxHeight: '60px', minWidth:'60px', 
        minHeight: '60px', borderRadius:"30px", objectFit: 'cover'}} src={img.img} alt="profile" className="me-2" /></div>);
    }
    else {
        return (
            <UserLogo w="60" h="60" />
        );
    }
};

