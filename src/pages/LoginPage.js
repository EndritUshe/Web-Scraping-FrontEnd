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
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import SellIcon from '@mui/icons-material/Sell';

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

      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("userRole", data.roles[0]);
      localStorage.setItem("userPlan", data.plan);

      setSuccess("Login successful!");
      setOpen(true);

      setTimeout(() => {
        if (data.roles.includes("ROLE_ADMIN")) navigate("/admin-dashboard");
        else if (data.roles.includes("ROLE_SELLER")) navigate("/seller-dashboard");
        else if (data.roles.includes("ROLE_BUYER")) navigate("/buyer-dashboard");
        else navigate("/dashboard");
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
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(135% 120% at 50% -20%, #f7faff 0%, #eef2ff 45%, #dee7ff 100%)",
        padding: 3,
      }}
    >
      <Box
        sx={{
          width: "min(960px, 100%)",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "0 32px 120px rgba(15, 23, 42, 0.18)",
          backgroundColor: "#fff",
        }}
      >
        {/* LEFT BRAND SECTION */}
        <Box
          sx={{
            background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
            color: "#e2e8f0",
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 64,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SellIcon sx={{ fontSize: 40, color: "#fff" }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#f8fafc" }}>
                  Compare.al
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "rgba(226,232,240,0.65)" }}>
                  Search. Compare. Save.
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                mt: 3,
                fontSize: "1rem",
                color: "rgba(226,232,240,0.85)",
                lineHeight: 1.6,
              }}
            >
              With this app, you can search for any product and instantly compare its prices across
              multiple websites — helping you find the best deal with just one click.
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "0.85rem", color: "rgba(226,232,240,0.65)" }}>
            @Copyright 2025 Compare.al. All rights reserved.
          </Typography>
        </Box>

        {/* RIGHT LOGIN CARD */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#ffffff",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#0f172a" }}>
            Welcome Back!
          </Typography>
          <Typography sx={{ mb: 3, color: "#64748b", fontSize: "0.95rem" }}>
            Sign in with your credentials to continue as a seller or buyer.
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: "#f5f7ff",
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background: "#f5f7ff",
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 16px 30px rgba(37,99,235,0.28)",
                "&:hover": {
                  boxShadow: "0 20px 40px rgba(37,99,235,0.3)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(1px)",
                  boxShadow: "0 12px 24px rgba(37,99,235,0.35)",
                },
              }}
            >
              Login
            </Button>

            {/* Keep the rest exactly as before */}
            <Typography align="center" sx={{ mt: 2, color: "#64748b", fontSize: "0.85rem" }}>
              Don’t have an account?{" "}
              <Link href="/signup" underline="hover" sx={{ color: "#2563eb" }}>
                Sign Up
              </Link>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography sx={{ mx: 2, color: "gray" }}>OR</Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/")}
              sx={{
                py: 1.5,
                borderColor: "#2563eb",
                color: "#2563eb",
                fontWeight: "bold",
                borderRadius: "14px",
                "&:hover": { backgroundColor: "#E3F2FD" },
              }}
            >
              Continue as Guest
            </Button>
          </Box>
        </Paper>
      </Box>

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
