import React from "react";
import { Box, Typography, Link, Grid, IconButton, Container } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(to right, #1976d2, #42a5f5)",
        color: "white",
        py: 7,
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* --- Column 1: About --- */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: '1.2rem' }}>
              Compare.al
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '1rem', mt: 1 }}>
              Shop smarter: compare prices across top sellers and get the best deal every time.
            </Typography>
          </Grid>

          {/* --- Column 2: Quick Links --- */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: '1.2rem' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '1rem' }}>
                Home
              </Link>
              <Link href="/faq" color="inherit" underline="hover" sx={{ fontSize: '1rem' }}>
                FAQ
              </Link>
              <Link href="/suggest-product" color="inherit" underline="hover" sx={{ fontSize: '1rem' }}>
                Suggest a Product
              </Link>
            </Box>
          </Grid>

          {/* --- Column 3: Contact --- */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: '1.2rem' }}>
              Contact
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>Email: support@hrvm.com</Typography>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>Phone: +355 68 123 4567</Typography>
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>Tirana, Albania</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <IconButton
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener"
                sx={{ color: "white", "&:hover": { color: "#bbdefb" } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener"
                sx={{ color: "white", "&:hover": { color: "#bbdefb" } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                href="mailto:support@hrvm.com"
                sx={{ color: "white", "&:hover": { color: "#bbdefb" } }}
              >
                <EmailIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* --- Bottom Text --- */}
        <Box mt={6} textAlign="center" sx={{ opacity: 0.85 }}>
          <Typography variant="body1" sx={{ fontSize: '0.95rem' }}>
            © {new Date().getFullYear()} Compare.al — All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
