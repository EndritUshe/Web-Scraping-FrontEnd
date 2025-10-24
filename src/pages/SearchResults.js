import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  LinearProgress,
  Box,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { WEBSITE_MAP, STORE_ENDPOINT_MAP } from "./constants/constants";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query } = location.state || {};

  const [productsBySource, setProductsBySource] = useState({});
  const [countsBySource, setCountsBySource] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Assign source based on productUrl
  const assignSource = (products) => {
    return products.map((product) => {
      const source = Object.keys(WEBSITE_MAP).find((baseUrl) => {
        const baseDomain = baseUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
        const productDomain = product.productUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
        return productDomain.startsWith(baseDomain);
      });
      return {
        ...product,
        source: source ? WEBSITE_MAP[source] : "Unknown",
      };
    });
  };

  // Group products by source
  const groupBySource = (products) => {
    return products.reduce((acc, product) => {
      const src = product.source || "Unknown";
      if (!acc[src]) acc[src] = [];
      acc[src].push(product);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setProgress(20);

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/scrape/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        const productsWithSource = assignSource(data);
        const grouped = groupBySource(productsWithSource);

        Object.keys(grouped).forEach((key) => {
          grouped[key] = grouped[key].slice(0, 4);
        });
        setProductsBySource(grouped);

        const countPromises = Object.entries(WEBSITE_MAP).map(([url, name]) => {
          const endpoint = STORE_ENDPOINT_MAP[name];
          if (!endpoint) return Promise.resolve([name, 0]);
          return fetch(
            `http://localhost:8080/api/scrape/${endpoint}/count?query=${encodeURIComponent(query)}`
          )
            .then((res) => res.json())
            .then((count) => [name, count]);
        });

        const countsArray = await Promise.all(countPromises);
        const countsMap = {};
        countsArray.forEach(([name, count]) => (countsMap[name] = count));
        setCountsBySource(countsMap);

        setProgress(100);
        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error("Error fetching search products:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Render a single store group
  const renderProductGroup = (products, sourceName) => {
    const endpoint = STORE_ENDPOINT_MAP[sourceName] || null;

    return (
      <Container
        key={sourceName}
        maxWidth={false}
        sx={{ marginTop: 4, width: "95%", mx: "auto" }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid rgba(148, 163, 184, 0.24)",
            boxShadow: "0 26px 60px rgba(15, 23, 42, 0.18)",
            padding: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              {countsBySource[sourceName] || 0} Products Found from {sourceName} for {query}
            </Typography>
            {endpoint && (
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/products-by-shop", { state: { store: endpoint, query } })
                }
              >
                See All Products
              </Button>
            )}
          </Box>

          {products.length > 0 ? (
            <Grid container spacing={3} justifyContent="flex-start">
              {products.map((product, idx) => (
                <Grid item xs={12} sm={6} key={idx} display="flex" justifyContent="center">
                  <Card
                    sx={{
                      display: "flex",
                      minHeight: 180,
                      maxWidth: 500,
                      width: "100%",
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      borderRadius: "16px",
                      background: "linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 14px 28px rgba(0,0,0,0.18)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: "40%", objectFit: "contain", p: 1 }}
                      image={product.imgUrl}
                      alt={product.name}
                    />
                    <CardContent
                      sx={{
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <Typography
                          variant="h6"
                          sx={{ wordWrap: "break-word", color: "#1e3a8a", fontWeight: 700 }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body1" sx={{ my: 1, fontWeight: 500 }}>
                          Price: {product.priceEnd} Lek
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          From: {sourceName}
                        </Typography>
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ m: 1, alignSelf: "flex-start" }}
                        onClick={() => window.open(product.productUrl, "_blank")}
                      >
                        Visit Product
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              No products found from {sourceName}.
            </Typography>
          )}
        </Box>
      </Container>
    );
  };

  return (
    <div>
      <Navbar />
      <Container sx={{ marginTop: 4, minHeight: "60vh", width: "95%", mx: "auto" }} maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            padding: "24px 28px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
            color: "#f5f7ff",
            boxShadow: "0 28px 64px rgba(15, 23, 42, 0.35)",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="h5" fontWeight={700}>
              Results for {query}
            </Typography>
            <Typography variant="body2" color="#f8fafc">
              Browse products from all sources.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ borderColor: "#f8fafc", color: "#f8fafc", alignSelf: { xs: "flex-end", sm: "auto" } }}
          >
            ← Back
          </Button>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              textAlign: "center",
            }}
          >
            <CircularProgress size={60} thickness={4} color="primary" />
            <Typography variant="h6" sx={{ mt: 3 }}>
              Fetching results for "{query}"...
            </Typography>
            <Box sx={{ width: "60%", mt: 4 }}>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 5 }} />
            </Box>
          </Box>
        ) : Object.keys(productsBySource).length > 0 ? (
          Object.entries(productsBySource).map(([sourceName, products]) =>
            renderProductGroup(products, sourceName)
          )
        ) : (
          <Typography variant="h6" color="text.secondary" textAlign="center" mt={10}>
            No results found for "{query}".
          </Typography>
        )}
      </Container>
      <Footer />
    </div>
  );
}
