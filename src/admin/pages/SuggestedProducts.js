import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Grid, Box, CircularProgress } from "@mui/material";
import axios from "axios";

const SuggestedProducts = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all suggestions
    axios.get("http://localhost:8080/api/suggested-products/admin", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    })
    .then(res => {
      // Reverse order by id (highest first)
      const reversed = res.data.sort((a, b) => b.id - a.id);
      setSuggestions(reversed);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching suggestions:", err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Suggested Products
      </Typography>
      <Grid container spacing={3}>
        {suggestions.map((s) => (
          <Grid item xs={12} md={6} key={s.id}>
            <Card sx={{ backgroundColor: "#fef9f9" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {s.productName} {s.brand && `- ${s.brand}`}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Category:</strong> {s.category || "Not specified"}
                </Typography>
                {s.productLink && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Link:</strong>{" "}
                    <a href={s.productLink} target="_blank" rel="noopener noreferrer">
                      {s.productLink}
                    </a>
                  </Typography>
                )}
                {s.email && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {s.email}
                  </Typography>
                )}
                {s.comments && (
                  <Typography variant="body2">
                    <strong>Comments:</strong> {s.comments}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SuggestedProducts;
