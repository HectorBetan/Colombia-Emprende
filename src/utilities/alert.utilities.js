function Alert({ message }) {
  if (message === "Firebase: Error (auth/network-request-failed).") {
    message = "No hay conexión a internet.";
  }
  if (message === "Firebase: Error (auth/internal-error).") {
    message = "Ocurrio un error interno. Intente nuevamente.";
  }
  if (message === "Firebase: Error (auth/email-already-in-use).") {
    message = "Error. Email ya registrado.";
  }
  if (message === "Firebase: Error (auth/email-already-exists).") {
    message = "Error. Email ya registrado.";
  }
  if (message === "Firebase: Error (auth/user-not-found).") {
    message = "Error. Email no registrado.";
  }
  if (message === "Firebase: Error (auth/wrong-password).") {
    message = "Error. Contraseña incorrecta.";
  }
  if (
    message ===
    "Firebase: Error (auth/account-exists-with-different-credential)."
  ) {
    message = "Error. Este usuario ya esta registrado.";
  }
  if (message === "Firebase: Error (auth/popup-closed-by-user).") {
    message = "Error. Cerraste la ventana de Inicio de Sesión.";
  }
  if (message.success) {
    return (
      <div
        className="text-center border border-green-400 p-2 rounded bg-ligth ms-4 me-4"
        role="alert"
        id="alerta"
      >
        <i className="fa-solid fa-circle-check me-1 text-success"></i>
        <span className="sm:inline block text-success">{message.msg}</span>
      </div>
    );
  } else {
    return (
      <div
        className="text-center border border-red-400 p-2 rounded bg-light ms-5 me-5"
        role="alert"
        id="alerta"
      >
        <i className="fa-solid fa-circle-xmark me-1 text-danger"></i>
        <span className="sm:inline block text-danger">{message}</span>
      </div>
    );
  }
}
export default Alert;
