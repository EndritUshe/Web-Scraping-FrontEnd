import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import {

  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await loginUser(email, password);

      // Save JWT and role in localStorage
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("userRole", data.roles[0]);
      localStorage.setItem("userPlan", data.plan);
      console.log("User plan:", data.plan);
      setSuccess("Login successful!");
      setOpen(true);

      // Navigate based on role
      setTimeout(() => {
        if (data.roles.includes("ROLE_SELLER")) {
          navigate("/seller-dashboard");
        } else if (data.roles.includes("ROLE_BUYER")) {
          navigate("/buyer-dashboard");
        } else {
          navigate("/dashboard"); // fallback
        }
      }, 1000);
    } catch (err) {
      setError(err.message || "Invalid credentials");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start", // top of page
        justifyContent: "center",
        paddingTop: 8, // spacing from top
        background: "linear-gradient(to bottom, #B3E5FC, #4A90E2, #007AFF)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          width: "100%",
          maxWidth: 450,
          backgroundColor: "rgba(238, 251, 255, 1)",
          borderRadius: 3, // rounded corners
          minHeight: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#4B0082", fontWeight: "bold" }} // dark purple
        >
          Login
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "rgba(255, 250, 240, 0.8)",
                borderRadius: 1,
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "rgba(255, 250, 240, 0.8)",
                borderRadius: 1,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              background: "linear-gradient(to right, #8bbaefff, #007AFF)",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(to right, #8bbaefff, #007AFF)",
              },
            }}
          >
            Login
          </Button>
        </Box>

        <Typography
          align="center"
          sx={{ mt: 3, color: "#4B0082", fontWeight: 500 }}
        >
          Don’t have an account?{" "}
          <Link href="/signup" underline="hover" sx={{ color: "#001a82ff" }}>
            Sign Up
          </Link>
        </Typography>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
