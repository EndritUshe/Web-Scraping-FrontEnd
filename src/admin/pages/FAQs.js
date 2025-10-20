import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [answers, setAnswers] = useState({}); // store admin answers
  const [visibility, setVisibility] = useState({}); // store visibility toggle

  const fetchFAQs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/faqs/admin", {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      });
      setFaqs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleVisibleChange = (id, checked) => {
    setVisibility((prev) => ({ ...prev, [id]: checked }));
  };

  const submitAnswer = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/api/faqs/${id}/answer`,
        {
          answer: answers[id] || "",
          visible: visibility[id] || false,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` } }
      );
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? res.data : f))
      );
      alert("Answer updated!");
    } catch (err) {
      console.error(err);
      alert("Error updating answer");
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage FAQs
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
            <TableCell>Visible</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {faqs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>{faq.question}</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={answers[faq.id] ?? faq.answer ?? ""}
                  onChange={(e) => handleAnswerChange(faq.id, e.target.value)}
                />
              </TableCell>
              <TableCell>
                <FormControlLabel
                  control={
                    <Switch
                      checked={visibility[faq.id] ?? faq.visible ?? false}
                      onChange={(e) => handleVisibleChange(faq.id, e.target.checked)}
                    />
                  }
                  label={visibility[faq.id] ?? faq.visible ? "Yes" : "No"}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => submitAnswer(faq.id)}
                >
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FAQs;
