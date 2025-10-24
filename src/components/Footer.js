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
        background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
        color: "white",
        borderRadius: "26px",
        boxShadow: "0 26px 70px rgba(19,32,62,0.14)",
        py: 7, // slightly more vertical padding
        px: { xs: 3, md: 6 },
        mx: { xs: 2, md: 3 },
        mt: 6,
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Grid container spacing={3} justifyContent="space-between">
          {/* --- Column 1: About --- */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: "1.35rem" }}>
              Compare.al
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: "1.1rem", mt: 1 }}>
              Shop smarter: compare prices across top sellers and get the best deal every time. <br/>
              Discover new products, save money, and make informed buying decisions with Compare.al. <br/>
              Join thousands of users who trust us to simplify their shopping experience.
            </Typography>
          </Grid>

          {/* --- Column 2: Quick Links --- */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: "1.35rem" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
              <Link href="/" color="inherit" underline="hover" sx={{ fontSize: "1.05rem" }}>
                Home
              </Link>
              <Link href="/faq" color="inherit" underline="hover" sx={{ fontSize: "1.05rem" }}>
                FAQ
              </Link>
              <Link href="/suggest-product" color="inherit" underline="hover" sx={{ fontSize: "1.05rem" }}>
                Suggest a Product
              </Link>
            </Box>
          </Grid>

          {/* --- Column 3: Contact --- */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: "1.35rem" }}>
              Contact
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>
              Email: support@hrvm.com
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>
              Phone: +355 68 123 4567
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.05rem" }}>
              Tirana, Albania
            </Typography>

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
          <Typography variant="body1" sx={{ fontSize: "1.0rem" }}>
            © {new Date().getFullYear()} Compare.al — All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
