import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  Button,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PopularProductsByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = `http://localhost:8080/api/popular-products/filter?category=${encodeURIComponent(
    category
  )}`;

  useEffect(() => {
    const controller = new AbortController();

    console.log("Fetching products for category:", category, "URL:", baseUrl);

    fetch(baseUrl, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching products:", err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [baseUrl, category]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box textAlign="center" mt={6}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>
        <Typography variant="h6" color="text.secondary">
          No products found in "{category}".
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: 4 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        <Typography variant="h5" gutterBottom>
          There are {products.length} products found in "{category}"
        </Typography>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} key={product.id}>
              <Card
                sx={{
                  display: "flex",
                  minHeight: 180,
                  maxWidth: 500,
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea
                  sx={{ display: "flex" }}
                  onClick={() =>
                    navigate(`/popular-products/${encodeURIComponent(product.id)}`)
                  }
                >
                  {/* Left half: image */}
                  <CardMedia
                    component="img"
                    sx={{ width: "40%", objectFit: "contain", p: 1 }}
                    image={product.imgUrl}
                    alt={product.title}
                  />

                  {/* Right half: details */}
                  <CardContent
                    sx={{
                      width: "60%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
                        {product.title}
                      </Typography>
                      <Typography variant="body1" sx={{ marginY: 1 }}>
                        Price: {product.newPrice} Lek
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        From: {product.store}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer/>
    </>
  );
};

export default PopularProductsByCategory;
