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
import { PublicProvider } from "./context/PublicContext";
import Pay from './services/Pay';
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <PublicProvider>
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/pago/*" element={<Pay />} />
            <Route path="/verificacion/*" element={<ProtectedUser><Verification /></ProtectedUser>} />
            <Route path="/reverificacion/*" element={<ProtectedUser><ReVerification  /></ProtectedUser>} />
          </Routes>
        </PublicProvider>
      </AuthProvider>
    </div>
  );}

export default App;
