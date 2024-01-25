import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPopup from "./pages/auth/login/LoginPopup";
import UserDashboard from "./pages/userDashboard/UserDashboard";
import WorkSpaceForm from "./pages/workspace/WorkSpaceForm";
import NewPaymentRequest from "./pages/workspaceDashboard/newPaymentRequest/NewPaymentRequest";
import Assets from "./pages/workspaceDashboard/assets/Assets";
import Category from "./pages/workspace/category/Category";
import PaymentRequest from "./pages/workspace/paymentRequest/PaymentRequest";
import Settings from "./pages/workspace/settings/Settings";
import Queue from "./pages/workspace/queue/Queue";
import Bookkeeping from "./pages/workspace/bookkeeping/Bookkeeping";
import ShareWorkspacePaymentRequest from "./pages/workspace/share/ShareWorkspacePaymentRequest";
import PaymentRequestPreview from "./pages/workspace/share/PaymentRequestPreview";
import Reports from "./pages/workspace/reports/Reports";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WorkspaceIndex from "./pages/workspace";

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
        {/* TODO convert to the dialog */}
        <Route path="/create-workspace" element={<WorkSpaceForm />} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/workspace/:id" element={<WorkspaceIndex />}>
          <Route path="assets" element={<Assets />} />
          <Route path="category" element={<Category />} />
          <Route path="payment-request" element={<PaymentRequest />} />
          <Route path="settings" element={<Settings />} />
          <Route path="queue" element={<Queue />} />
          <Route path="bookkeeping" element={<Bookkeeping />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route
          path="/workspace/:id/new-workspace-payment-request"
          element={<ShareWorkspacePaymentRequest />}
        />
        <Route
          path="/payment-request-preview"
          element={<PaymentRequestPreview />}
        />
      </Routes>
    </Router>
  );
};

export default RouterLink;
