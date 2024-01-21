import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Navbar from "./components/layout/navbar/Navbar";
import Home from "./pages/homePage/Home";
import LoginPopup from "./pages/auth/login/LoginPopup";
import UserDashboard from "./pages/userDashboard/UserDashboard";
import WorkSpaceForm from "./pages/workspace/WorkSpaceForm";
import WorkspaceDashboard from "./pages/workspaceDashboard/WorkspaceDashboard";
import NewPaymentRequest from "./pages/workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import Assets from "./pages/workspaceDashboard/assets/Assets";
import Category from "./pages/workspace/category/Category";
import Archived from "./pages/workspace/category/Archived";
import PaymentRequest from "./pages/workspace/paymentRequest/PaymentRequest";
import Settings from "./pages/workspace/settings/Settings";
import PaymentRequestDetails from "./pages/workspace/paymentRequest/PaymentRequestDetails";
import SignPaymentRequest from "./pages/workspace/paymentRequest/SignPaymentRequest";
import Queue from "./pages/workspace/queue/Queue";
import Bookkeeping from "./pages/workspace/bookkeeping/Bookkeeping";
import BookkeepingTransferDetails from "./pages/workspace/bookkeeping/BookkeepingTransferDetails";
import ShareWorkspacePaymentRequest from "./pages/workspace/share/ShareWorkspacePaymentRequest";
import PaymentRequestPreview from "./pages/workspace/share/PaymentRequestPreview";
import Reports from "./pages/workspace/reports/Reports";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RouterLink = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/create-workspace" element={<WorkSpaceForm />} />
        {/* <Route path="/workspace" element={<WorkspaceDashboard />} /> */}
        <Route
          path="/workspace/:id/new-payment-request"
          element={<NewPaymentRequest />}
        ></Route>
        <Route path="/workspace/:id/assets" element={<Assets />} />
        <Route path="/workspace/:id/category" element={<Category />} />
        <Route path="/archived" element={<Archived />} />
        <Route
          path="/workspace/:id/payment-request"
          element={<PaymentRequest />}
        />
        <Route path="/workspace/:id/settings" element={<Settings />} />
        <Route path="/sign-payment" element={<SignPaymentRequest />} />
        <Route path="/workspace/:id/queue" element={<Queue />} />
        <Route path="/workspace/:id/bookkeeping" element={<Bookkeeping />} />
        <Route
          path="/bookkeeping/:id"
          element={<BookkeepingTransferDetails />}
        />
        <Route
          path="/new-workspace-payment-request"
          element={<ShareWorkspacePaymentRequest />}
        />
        <Route
          path="/payment-request-preview"
          element={<PaymentRequestPreview />}
        />
        <Route path="/workspace/:id/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
};

export default RouterLink;
