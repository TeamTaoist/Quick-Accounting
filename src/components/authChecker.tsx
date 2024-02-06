import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export default function AuthChecker() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { setAuthData, clearAuth } = useAuthStore();
  const { address, isConnected } = useAccount();

  const handlePath = () => {
    console.log(
      !pathname.includes("/share"),
      pathname.startsWith("/workspace/")
    );
    if (
      (!pathname.includes("/share") && pathname.startsWith("/workspace/")) ||
      pathname.includes("/user")
    ) {
      console.log(pathname);
      navigate("/login");
    }
  };

  useEffect(() => {
    const str = localStorage.getItem("qa-user") || "";
    try {
      const data = JSON.parse(str);
      if (Date.now() > data.token_expired * 1000) {
        localStorage.removeItem("qa-user");
        return;
      }
      // check if match address
      if (!address || !isConnected || data.wallet !== address) {
        localStorage.removeItem("qa-user");
        clearAuth();
        handlePath();
        return;
      }
      setAuthData(data);
    } catch (error) {
      console.error(error);
      handlePath();
    }
  }, [address, isConnected]);

  return null;
}
