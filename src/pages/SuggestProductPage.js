import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion"; // ✅ Import Framer Motion

const SuggestProductPage = () => {
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    productLink: "",
    email: "",
    comments: ""
  });

  const [categories, setCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:8080/api/categories/active");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/suggested-products/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      setForm({
        productName: "",
        brand: "",
        category: "",
        productLink: "",
        email: "",
        comments: ""
      });

    } catch (err) {
      setError("Failed to submit suggestion. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />

      {/* ✅ Animate whole container fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            width: "80%",
            mx: "auto",
            my: 6,
            background: "#f5f7ff",
            borderRadius: "26px",
            boxShadow: "0 26px 70px rgba(19,32,62,0.14)",
            p: { xs: 3, md: 5 },
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
            <Divider sx={{ flex: 1, borderColor: "#1f2937", borderBottomWidth: 2, mr: 2 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              Suggest a Product
            </Typography>
            <Divider sx={{ flex: 1, borderColor: "#1f2937", borderBottomWidth: 2, ml: 2 }} />
          </Box>

          <Grid container spacing={4} alignItems="flex-start">

            {/* ✅ Animated form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Paper elevation={3} sx={{ p: 3, borderRadius: "16px" }}>
                  <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
                    Please fill out the form below to suggest a new product.
                  </Typography>

                  {submitted && <Alert severity="success" sx={{ mb: 2 }}>Thank you! Your suggestion has been sent.</Alert>}
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                  <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <TextField label="Product Name" name="productName" value={form.productName}
                      onChange={handleChange} required fullWidth />

                    <TextField label="Brand / Seller (Optional)" name="brand"
                      value={form.brand} onChange={handleChange} fullWidth />

                    <TextField
                      select
                      label="Category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      fullWidth
                    >
                      {loadingCategories ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : categories.length > 0 ? (
                        categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No categories available</MenuItem>
                      )}
                    </TextField>

                    <TextField label="Product Link (Optional)" name="productLink"
                      value={form.productLink} onChange={handleChange} fullWidth />

                    <TextField label="Your Email (Optional)" name="email" type="email"
                      value={form.email} onChange={handleChange} fullWidth />

                    <TextField label="Comments / Notes" name="comments" multiline rows={3}
                      value={form.comments} onChange={handleChange} fullWidth />

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>

                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          width: "48%",
                          borderRadius: "14px",
                          py: 1.2,
                          bgcolor: "#2563eb",
                          color: "#fff",
                          "&:hover": { bgcolor: "#1e3a8a" },
                        }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        sx={{
                          width: "48%",
                          borderRadius: "14px",
                          py: 1.2,
                          borderColor: "#2563eb",
                          color: "#2563eb",
                          "&:hover": { borderColor: "#1e3a8a", color: "#1e3a8a" },
                        }}
                      >
                        Back
                      </Button>


                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* ✅ Animated right info panel */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper elevation={3} sx={{ p: 3, borderRadius: "16px", backgroundColor: "#1f2937", color: "white" }}>
                  <Typography variant="h5" fontWeight="bold">Why Suggest a Product?</Typography>
                  <Divider sx={{ my: 2, borderColor: "#ffffff" }} />
                  <Typography sx={{ mb: 1, opacity: 0.9 }}>
                    • You help improve our database and comparisons.
                  </Typography>
                  <Typography sx={{ mb: 1, opacity: 0.9 }}>
                    • All submissions are reviewed before publishing.
                  </Typography>
                  <Typography sx={{ mb: 1, opacity: 0.9 }}>
                    • Thanks for helping Compare.al grow!
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>

      <Footer />
    </>
  );
};

export default SuggestProductPage;
