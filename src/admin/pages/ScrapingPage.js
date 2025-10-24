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
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Scrape
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
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
          <FormControl fullWidth required>
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
        >
          {loading ? <CircularProgress size={20} /> : "Start Scrape"}
        </Button>
        <Button variant="outlined" onClick={() => onBack && onBack()}>
          Back
        </Button>
      </Box>
    </Box>
  );
}
