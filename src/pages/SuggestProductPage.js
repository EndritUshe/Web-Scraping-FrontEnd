// src/pages/SuggestProductPage.js
import React, { useState } from "react";
import { Container, Typography, TextField, Button, MenuItem, Box, Alert, Paper } from "@mui/material";
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
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        
        {/* Intro text box */}
        <Paper 
          elevation={1}
          sx={{ 
            p: 3, mb: 4, border: "1px solid #ccc", borderRadius: 3, 
            backgroundColor: "#f9f9f9", textAlign: "center" 
          }}
        >
          <Typography variant="body1" sx={{ color: "primary.main", fontWeight: 500 }}>
            Suggest a Product — Compare.al thanks you for your contribution. By suggesting a product that is not yet listed, you help us improve our database and offer a more complete comparison experience. Each submission will be carefully reviewed for inclusion.
          </Typography>
        </Paper>

        {/* Form container */}
        <Paper 
          elevation={2} 
          sx={{ p: 4, border: "1px solid #ddd", borderRadius: 3, boxShadow: "0 3px 8px rgba(0,0,0,0.05)" }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
            Suggest a Product
          </Typography>

          {submitted && <Alert severity="success" sx={{ mb: 3 }}>Thank you! Your product suggestion has been successfully submitted.</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product Name"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Brand / Seller (Optional)"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Product Link (Optional)"
              name="productLink"
              value={form.productLink}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Your Email (Optional)"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Comments / Notes"
              name="comments"
              multiline
              rows={3}
              value={form.comments}
              onChange={handleChange}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate(-1)} sx={{ width: "48%" }}>
                Back
              </Button>
              <Button type="submit" variant="contained" sx={{ width: "48%" }}>
                Submit Suggestion
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer/>
    </>
  );
};

export default SuggestProductPage;
