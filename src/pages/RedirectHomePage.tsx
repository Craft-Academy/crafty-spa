import { selectIsUserAuthenticated } from "@/lib/auth/reducer";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const RedirectHomePage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsUserAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [navigate, isAuthenticated]);

  return null;
};
