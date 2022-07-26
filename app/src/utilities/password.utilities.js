function Eye (id) {
    const togglePassword = () => {
        var password = document.getElementById(id.passId);
        var eye = document.getElementById(id.eyeId);
        
        if(password.type === "password"){
            password.type = "text";
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
        } else{
            password.type = "password";
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
        }
    };
    return (
        <div 
        style={{ width: '40px', backgroundColor: 'rgb(100, 181, 246)', borderRadius:'0 5px 5px 0'}} 
        className="input-group-addon align-content-center">
            <i 
            style={{transform:'translate(10px,7px)'}} 
            className="fa fa-eye-slash position-relative" 
            aria-hidden="true" 
            id={id.eyeId}
            onClick={togglePassword}
            />
        </div>
    );
};
export default Eye;