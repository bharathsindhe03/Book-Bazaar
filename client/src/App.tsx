import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import Animation from "./Components/Animation/Animation";
// Lazy-loaded components
const Home = lazy(() => import("./Pages/Home/Home"));
const Cart = lazy(() => import("./Pages/Cart/Cart"));
const Signup = lazy(() => import("./Pages/SignUp/Signup"));
const Login = lazy(() => import("./Pages/Login/Login"));

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop
        />
        <div className="content">
          <Suspense fallback={<Animation />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} /> 
              <Route path="/register" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
