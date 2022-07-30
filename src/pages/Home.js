import Navigation from "../components/Navigation";
import HomeView from "../components/HomeView";
import Stores from "../components/Stores";
import Footer from "../components/Footer";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/logos/logo-colombia.png";
import Admin from "./Admin";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginButton, UserButton } from "../utilities/loginButton.utilities";
function Home() {
    const { user, loading } = useAuth();
    const SetButton = () => {
        if (loading) return (
            <div style={{width:"239.61px", minHeight:"80px"}} className="text-end me-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> 
        );
        if (user) {
            return (
                <div className="d-none d-lg-block d-xl-block d-xxl-block">
                    <UserButton />
                </div>
            )
        }
        else {
            return (
                <div className="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
                    <LoginButton />
                </div>
            )
        }
    } 
    return (
        <div>
            <Navbar className="d-none d-md-flex d-lg-flex d-xl-flex d-xxl-flex flex-md-row flex-lg-row flex-xl-row flex-xxl-row justify-content-between mt-2 me-2 ms-2 p-2">
                <Navbar.Brand href="/" className="ms-3"><img style={{ maxHeight: '75px' }} src={Logo} alt="Logo Colombia Emprende" /></Navbar.Brand>
                <SetButton />   
            </Navbar>
            <Navigation />    
            <Routes>
                <Route path="/"  element={<HomeView />}/>
                <Route path="/emprendimientos"  element={<Stores />}/>^
                <Route path="/admin/*" element={<Admin />} />
            </Routes>
            <Footer />
        </div>
    );
}
export default Home;