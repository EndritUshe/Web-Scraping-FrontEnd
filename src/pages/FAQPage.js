// src/pages/FAQPage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Alert,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fetchFAQs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/faqs/public");
      setFaqs(response.data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/faqs/submit", { question: newQuestion });
      setFaqs([{ question: newQuestion, answer: "Waiting for answer..." }, ...faqs]);
      setNewQuestion("");
      setSubmitted(true);
      setError("");
    } catch (err) {
      console.error("Error submitting question:", err);
      setError("There was an error submitting your question. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "75%",
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
            Frequently Asked Questions
          </Typography>
          <Divider sx={{ flex: 1, borderColor: "#1f2937", borderBottomWidth: 2, ml: 2 }} />
        </Box>

        {/* Row layout: FAQ + Quick Tips */}
        <Grid container spacing={4} alignItems="flex-start">
          {/* Left: FAQ Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
              Browse the existing questions or ask a new one below.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {faqs.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                  mb: 2,
                  borderRadius: "12px",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#1f2937" }} />}>
                  <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ fontSize: "1rem", opacity: 0.9 }}>
                    {faq.answer || "Waiting for answer..."}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Ask a question form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {submitted && <Alert severity="success">Thanks! Your question has been submitted.</Alert>}
              <TextField
                label="Ask a Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                multiline
                rows={3}
                sx={{ backgroundColor: "white", borderRadius: "12px" }}
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
                Submit Question
              </Button>
            </Box>
          </Grid>

          {/* Right: Quick Tips */}
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
                Quick Tips
              </Typography>
              <Divider sx={{ mb: 2, borderColor: "#ffffff" }} />
              <Typography sx={{ mb: 1 }}>
                • Check our comparison tables to find the best deals quickly.
              </Typography>
              <Typography sx={{ mb: 1 }}>• Check our FAQ regularly for updates.</Typography>
              <Typography sx={{ mb: 1 }}>• Be specific when submitting your question.</Typography>
              <Typography sx={{ mb: 1 }}>• Include details like product names or categories for faster help.</Typography>
              <Typography sx={{ mb: 1 }}>• Browse top-rated stores for verified sellers.</Typography>
              <Typography sx={{ mb: 1 }}>• Check our FAQ regularly for updates.</Typography>
              <Typography sx={{ mb: 1 }}>• Be specific when submitting your question.</Typography>
              <Typography sx={{ mb: 1 }}>• Include details like product names or categories for faster help.</Typography>
              <Typography sx={{ mb: 1 }}>• Browse top-rated stores for verified sellers.</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
};

export default FAQPage;
