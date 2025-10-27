import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
} from "@mui/material";

const endpoints = [
  { label: "German", value: "german" },
  { label: "Black355", value: "black355" },
  { label: "Fejzo", value: "fejzo" },
  { label: "Shpresa", value: "shpresa" },
  { label: "Celular", value: "celular" },
  { label: "Neptun", value: "neptun" },
];

export default function ScrapeForm({ onBack }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("german");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories/all");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!query || !category) {
      alert("Please fill in both query and category");
      return;
    }

    setLoading(true);

    try {
      const url = `http://localhost:8080/admin/${apiEndpoint}?query=${encodeURIComponent(
        query
      )}&category=${encodeURIComponent(category)}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Scrape failed (${res.status})${text ? ": " + text : ""}`);
      }

      alert("Scrape request sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Error scraping: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "80%",
        mx: "auto",
        p: 4,
        background: "linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%)",
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 4, fontWeight: 700, color: "#d32f2f" }}
        gutterBottom
      >
        Admin Scrape
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            required
            sx={{ minWidth: 200, background: "#fff", borderRadius: 1 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            required
            sx={{ minWidth: 200, background: "#fff", borderRadius: 1 }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id ?? cat.name} value={cat.name ?? cat}>
                  {cat.name ?? cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl
            fullWidth
            required
            sx={{ minWidth: 200, background: "#fff", borderRadius: 1 }}
          >
            <InputLabel>Scraper</InputLabel>
            <Select
              value={apiEndpoint}
              label="Scraper"
              onChange={(e) => setApiEndpoint(e.target.value)}
            >
              {endpoints.map((ep) => (
                <MenuItem key={ep.value} value={ep.value}>
                  {ep.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            background: "linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)",
            color: "#fff",
            fontWeight: 600,
            minWidth: 150,
            "&:hover": {
              background: "linear-gradient(135deg, #b71c1c 0%, #d32f2f 100%)",
            },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Start Scrape"}
        </Button>

        <Button
          variant="outlined"
          onClick={() => onBack && onBack()}
          sx={{
            minWidth: 150,
            fontWeight: 600,
            borderColor: "#d32f2f",
            color: "#d32f2f",
            "&:hover": { background: "rgba(211, 47, 47, 0.08)" },
          }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
}
