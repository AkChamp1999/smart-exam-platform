import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

export const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/login");
};
