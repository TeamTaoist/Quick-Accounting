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

const RouterLink = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPopup />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/create-workspace" element={<WorkSpaceForm />} />
        <Route path="/workspace" element={<WorkspaceDashboard />} />
        <Route
          path="/new-payment-request"
          element={<NewPaymentRequest />}
        ></Route>
        <Route path="/assets" element={<Assets />} />
        <Route path="/category" element={<Category />} />
        <Route path="/archived" element={<Archived />} />
        <Route path="/payment-request" element={<PaymentRequest />} />
        <Route
          path="/payment-request/:id"
          element={<PaymentRequestDetails />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sign-payment" element={<SignPaymentRequest />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/bookkeeping" element={<Bookkeeping />} />
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
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
};

export default RouterLink;
