import React from "react";
import Navigation from "../components/Navigation";
import HomeView from "../components/HomeView";
import Stores from "../components/Stores";
import Footer from "../components/Footer";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/logos/logo-colombia.png";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginButton, UserButton } from "../utilities/headerButton.utilities";
function Home() {
    const { user } = useAuth();
    const SetButton = () => {
        if (user) {
            return <UserButton />;
        }
        else {
            return <LoginButton />;
        }
    } 
    return (
        <div>
            <Navbar className="flex-lg-row flex-md-row flex-sm-column flex-column justify-content-between mt-2 me-2 ms-2 p-2" expand="lg">
                <Navbar.Brand href="/" className="ms-3"><img style={{ maxHeight: '75px' }} src={Logo} alt="Logo Colombia Emprende" /></Navbar.Brand>
                <SetButton />   
            </Navbar>
            <Navigation />
            <Routes>
                <Route path="/"  element={<HomeView />}/>
                <Route path="/emprendimientos"  element={<Stores />}/>
            </Routes>
            <Footer />
        </div>
    );
}

export default Home;