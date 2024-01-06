import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./components/layout/navbar/Navbar";
import Home from "./pages/homePage/Home";
import LoginPopup from "./pages/auth/login/LoginPopup";
import UserDashboard from "./pages/userDashboard/UserDashboard";
import WorkSpaceForm from "./pages/workspace/WorkSpaceForm";
import WorkspaceDashboard from "./pages/workspaceDashboard/WorkspaceDashboard";
import NewPaymentRequest from "./pages/workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import Assets from "./pages/workspaceDashboard/assets/Assets";

const RouterLink = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<LoginPopup />}></Route>
        <Route path="/user" element={<UserDashboard />}></Route>
        <Route path="/create-workspace" element={<WorkSpaceForm />}></Route>
        <Route path="/workspace" element={<WorkspaceDashboard />}></Route>
        <Route path="/payment-request" element={<NewPaymentRequest />}></Route>
        <Route path="/assets" element={<Assets />}></Route>
      </Routes>
    </Router>
  );
};

export default RouterLink;
