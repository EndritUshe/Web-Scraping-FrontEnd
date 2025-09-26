import React from "react";
import { Box, Typography, Button } from "@mui/material";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  handleRetry = () => {
    // Reset error state to try rendering again
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 4,
            bgcolor: "error.light",
            color: "error.contrastText",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Something went wrong in this section.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            {this.state.error?.message || "Unknown error"}
          </Typography>
          <Button variant="contained" color="secondary" onClick={this.handleRetry}>
            Retry
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
