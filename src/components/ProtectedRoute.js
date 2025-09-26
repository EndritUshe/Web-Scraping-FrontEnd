import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwtToken");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  let isValid = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        isValid = true;
      } else {
        localStorage.removeItem("jwtToken");
      }
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("jwtToken");
    }
  }

  useEffect(() => {
    if (!isValid) {
      setOpen(true);
      const timer = setTimeout(() => navigate("/login"), 1500);
      return () => clearTimeout(timer);
    }
  }, [isValid, navigate]);

  if (!isValid) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={1500}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          You need to login or signup first to access this page!
        </Alert>
      </Snackbar>
    );
  }

  return children;
}
