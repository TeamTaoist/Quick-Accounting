import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const getLocalUserData = () => {
    const userData = localStorage.getItem("qa-user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user?.token;
      } catch (error) {}
    }
    return null;
  };
  const token = getLocalUserData();
  return (
    <div>
      {token ? (
        children
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )}
    </div>
  );
};

export default PrivateRoute;
