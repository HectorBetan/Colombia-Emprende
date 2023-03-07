export const handleLogout = async (logout) => {
  try {
    await logout();
  } catch (error) {
    return error;
  }
};
export const handleGoogleSignin = async (login) => {
  try {
    await login();
  } catch (error) {
    return { msg: { type: "error", message: error.message } };
  }
};
export const handleResetPassword = async (email, resetPassword) => {
  if (!email)
    return { msg: { type: "error", message: "Error. Ingrese su email." } };
  try {
    await resetPassword(email);
    return { success: true, msg: "Hemos enviado un email, revisa tu correo." };
  } catch (error) {
    return error.message;
  }
};