import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/auth";
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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [userType, setUserType] = useState("ROLE_BUYER");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const roleArray =
        userType === "ROLE_SELLER" ? ["ROLE_SELLER"] : ["ROLE_BUYER"];

      console.log("Signup data being sent:", {
        email,
        password,
        roles: roleArray,
      });

      const data = await signupUser(email, password, roleArray);

      console.log("Signup response from backend:", data);

      setSuccess("Account created! Redirecting to login...");
      setOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
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
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 8,
        background: "linear-gradient(to bottom, #B3E5FC, #4A90E2, #007AFF)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          width: "100%",
          maxWidth: 480,
          backgroundColor: "rgba(238, 251, 255, 1)",
          borderRadius: 3,
          minHeight: 550,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#4B0082", fontWeight: "bold" }}
        >
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSignup} sx={{ mt: 1 }}>
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

          {/* User Type Selection */}
          <Typography
            variant="h6"
            align="center"
            sx={{ mt: 4, mb: 2, color: "#4B0082", fontWeight: "bold" }}
          >
            Choose your account type
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Buyer Box */}
            <Paper
              elevation={userType === "ROLE_BUYER" ? 8 : 2}
              onClick={() => setUserType("ROLE_BUYER")}
              sx={{
                p: 3,
                flex: 1,
                minWidth: 140,
                cursor: "pointer",
                textAlign: "center",
                border:
                  userType === "ROLE_BUYER"
                    ? "2px solid #007AFF"
                    : "1px solid #ccc",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 40, color: "#007AFF" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                Buyer
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Browse and purchase products.
              </Typography>
            </Paper>

            {/* Seller Box */}
            <Paper
              elevation={userType === "ROLE_SELLER" ? 8 : 2}
              onClick={() => setUserType("ROLE_SELLER")}
              sx={{
                p: 3,
                flex: 1,
                minWidth: 140,
                cursor: "pointer",
                textAlign: "center",
                border:
                  userType === "ROLE_SELLER"
                    ? "2px solid #007AFF"
                    : "1px solid #ccc",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <StoreIcon sx={{ fontSize: 40, color: "#007AFF" }} />
              <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                Seller
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Post and manage your products.
              </Typography>
            </Paper>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 4,
              py: 1.5,
              background: "linear-gradient(to right, #8bbaefff, #007AFF)",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(to right, #8bbaefff, #007AFF)",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>

        <Typography
          align="center"
          sx={{ mt: 3, color: "#4B0082", fontWeight: 500 }}
        >
          Already have an account?{" "}
          <Link href="/login" underline="hover" sx={{ color: "#1542f8ff" }}>
            Login
          </Link>
        </Typography>

        {/* Divider OR and Continue as Guest */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography sx={{ mx: 2, color: "gray" }}>OR</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 2,
            textTransform: "none",
          }}
        >
          CONTINUE AS GUEST
        </Button>
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
