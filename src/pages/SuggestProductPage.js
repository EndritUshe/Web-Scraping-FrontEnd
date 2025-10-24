// src/pages/SuggestProductPage.js
import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = ["Electronics", "Fashion", "Home & Kitchen", "Sports", "Books", "Other"];

const SuggestProductPage = () => {
  const [form, setForm] = useState({
    productName: "",
    brand: "",
    category: "",
    productLink: "",
    email: "",
    comments: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:8080/api/suggested-products/submit", form);
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
      console.error(err);
      setError("Failed to submit suggestion. Please try again later.");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "80%",
          mx: "auto",
          my: 6,
          background: "#f5f7ff",
          color: "#1f2937",
          borderRadius: "26px",
          boxShadow: "0 26px 70px rgba(19,32,62,0.14)",
          
          p: { xs: 3, md: 5 },
        }}
      >
        {/* Heading */}
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

        {/* Grid: Form + Intro Box */}
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left: Form (like FAQ form box) */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: "16px",
                backgroundColor: "#ffffff",
                color: "#1f2937",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                textAlign="center"
              >
                Product Suggestion Form
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Thank you! Your product suggestion has been successfully submitted.
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="Product Name"
                  name="productName"
                  value={form.productName}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                />
                <TextField
                  label="Brand / Seller (Optional)"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                />
                <TextField
                  select
                  label="Category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Product Link (Optional)"
                  name="productLink"
                  value={form.productLink}
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                />
                <TextField
                  label="Your Email (Optional)"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                />
                <TextField
                  label="Comments / Notes"
                  name="comments"
                  multiline
                  rows={3}
                  value={form.comments}
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "12px", backgroundColor: "#fff" }}
                />

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <Button variant="outlined" onClick={() => navigate(-1)} sx={{ width: "48%" }}>
                    Back
                  </Button>
                  <Button type="submit" variant="contained" sx={{ width: "48%" }}>
                    Submit
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right: Intro Box (like FAQ Quick Tips) */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: "16px",
                backgroundColor: "#1f2937",
                color: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Why Suggest a Product?
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "#ffffff" }} />
              <Typography sx={{ mb: 1, opacity: 0.9 }}>
                • By suggesting a product that is not yet listed, you help us improve our database
                and provide a more complete comparison experience.
              </Typography>
              <Typography sx={{ mb: 1, opacity: 0.9 }}>
                • Each submission will be carefully reviewed for inclusion.
              </Typography>
              <Typography sx={{ mb: 1, opacity: 0.9 }}>
                • Thank you for helping Compare.al grow!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default SuggestProductPage;
