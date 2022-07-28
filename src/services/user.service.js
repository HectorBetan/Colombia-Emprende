export const handleLogin = async (login, usuario) => {
    try {
        await login(usuario.email, usuario.password);
    } catch (error) {
        return ({msg: {type: "error", message: error.message}});
    }
};
export const handleLogout = async (logout) => {
    try {
        await logout();
    } catch (error) {
        return error;
    }
};
export const handleGoogleSignin = async (login) => {
    try {
        await login()
    } catch (error) {
        return ({msg: {type: "error", message: error.message}});
    }
};
export const handleResetPassword = async (email, resetPassword) => {
    if (!email) return ({msg : {type:"error", message:"Error. Ingrese su email."}});
    try {
        await resetPassword(email);
        return ({msg: {type: "success", message: 'Hemos enviado un email, revisa tu correo.'}});
    } catch (error) {
        return ({msg: {type: "error", message: error.message}});
    }
};