// src/pages/FAQPage.js
import React, { useState, useEffect } from "react";
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, Button, Box, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch visible FAQs from backend
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

  // Handle question submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await axios.post("http://localhost:8080/api/faqs/submit", { question: newQuestion });

      // Optimistically add to the list
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
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>

        {/* Back button */}
        <Button 
          variant="outlined" 
          sx={{ mb: 3 }} 
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Browse the existing questions or ask a new one below.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* FAQ list */}
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{faq.answer || "Waiting for answer..."}</Typography>
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
          />
          <Button type="submit" variant="contained">Submit Question</Button>
        </Box>
      </Container>
      <Footer/>
    </>
  );
};

export default FAQPage;
