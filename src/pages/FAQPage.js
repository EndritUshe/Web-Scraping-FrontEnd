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
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fetchFAQs = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/faqs/public");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFaqs(data);
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
      const res = await fetch("http://localhost:8080/api/faqs/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (!res.ok) throw new Error();

      setFaqs([{ question: newQuestion, answer: null }, ...faqs]);
      setNewQuestion("");
      setSubmitted(true);
      setError("");

      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError("There was an error submitting your question. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
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
          {/* Page Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 5 }}>
            <Divider sx={{ flex: 1, borderColor: "#1f2937", borderBottomWidth: 2, mr: 2 }} />
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              FAQ
            </Typography>
            <Divider sx={{ flex: 1, borderColor: "#1f2937", borderBottomWidth: 2, ml: 2 }} />
          </Box>

          <Grid container spacing={4} alignItems="flex-start">

            {/* FAQ LIST */}
            <Grid item xs={12} md={8}>
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Browse the common questions or ask a new one:
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Accordion
                    sx={{
                      backgroundColor: "#ffffff",
                      color: "#1f2937",
                      mb: 2,
                      borderRadius: "12px",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#1f2937" }} />}>
                      <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                        {faq.question}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ opacity: 0.9 }}>
                        {faq.answer || "Waiting for an answer..."}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              ))}

              {/* Ask Question Form */}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
                {submitted && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Alert severity="success">Your question has been submitted!</Alert>
                  </motion.div>
                )}

                <TextField
                  label="Ask a Question"
                  value={newQuestion}
                  multiline
                  rows={3}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  sx={{ backgroundColor: "white", borderRadius: "12px" }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "40%",
                    borderRadius: "14px",
                    py: 1.2,
                    bgcolor: "#2563eb",
                    color: "#fff",
                    "&:hover": { bgcolor: "#1e3a8a" },
                  }}
                >
                  Submit Question
                </Button>
              </Box>
            </Grid>

            {/* RIGHT SIDE INFORMATION */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: "#1f2937",
                    color: "white",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Quick Tips
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: "#ffffff" }} />
                  <Typography sx={{ mb: 1 }}>• Use search terms like brand or product type.</Typography>
                  <Typography sx={{ mb: 1 }}>• Your question might help others!</Typography>
                  <Typography sx={{ mb: 1 }}>• We respond as fast as we can.</Typography>
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

export default FAQPage;
