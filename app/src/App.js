import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

import { Provider } from "./context/appContext";


function App() {
  return (
    <div className="App">
      <Provider>
        <Routes>
          <Route path="/*" element={<Home />} />
        </Routes>
      </Provider>
    </div>
  );}

export default App;
