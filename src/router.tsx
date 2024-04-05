import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/login/Login";
import WorkSpaceForm from "./pages/workspace/WorkSpaceForm";
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
import AuthChecker from "./components/authChecker";
import UserDashboardIndex from "./pages/userDashboard";
import UserPaymentRequest from "./pages/userDashboard/userPaymentRequest/UserPaymentRequest";
import MyPayment from "./pages/userDashboard/MyPayment";
import WorkspaceList from "./pages/userDashboard/WorkspaceList";
import styled from "@emotion/styled";

const Toast = styled(ToastContainer)`
  .Toastify__toast {
    border: 1px solid #e2e8f0;
    font-weight: 500;
    color: #000000;
    text-align: center;
    box-shadow: none;
    background-color: #f1f5f9;
  }
  .Toastify__close-button {
    display: none;
  }
`;

const RouterLink = () => {
  return (
    <Router>
      <Toast
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
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
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserDashboardIndex />}>
          <Route path="payment-request" element={<UserPaymentRequest />} />
          <Route path="my-payments" element={<MyPayment />} />
          <Route path="workspaces" element={<WorkspaceList />} />
        </Route>
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
          path="/share/:shareId"
          element={<ShareWorkspacePaymentRequest />}
        />
        <Route
          path="/payment-request-preview"
          element={<PaymentRequestPreview />}
        />
      </Routes>
      <AuthChecker />
    </Router>
  );
};

export default RouterLink;
