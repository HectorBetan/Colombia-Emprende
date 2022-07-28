import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Verification from "./services/verification.service";
import ReVerification from "./services/reverification.service";
import { ProtectedUser } from "./protectedRoutes/protectedUser";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/verificacion/*" element={<ProtectedUser><Verification /></ProtectedUser>} />
          <Route path="/reverificacion/*" element={<ProtectedUser><ReVerification  /></ProtectedUser>} />
        </Routes>
      </AuthProvider>
    </div>
  );}

export default App;
