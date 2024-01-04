import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./components/layout/navbar/Navbar";
import Home from "./pages/homePage/Home";
import Register from "./pages/auth/register/Register";

const RouterLink = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </Router>
  );
};

export default RouterLink;
