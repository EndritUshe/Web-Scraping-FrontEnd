import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RotateRightIcon from "@mui/icons-material/RotateRight";

export default function PriceComparison() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productsBySource, query } = location.state || {};

  // Track current index of products per shop for rotation
  const [currentIndexes, setCurrentIndexes] = useState(
    Object.keys(productsBySource || {}).reduce((acc, shop) => {
      acc[shop] = 0;
      return acc;
    }, {})
  );

  const handleNextProduct = (shop) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [shop]: (prev[shop] + 1) % productsBySource[shop].length,
    }));
  };

  // Rows to display in table
  const rows = [
    { label: "Name", key: "name" },
    { label: "Starting Price", key: "priceStart" },
    { label: "Discount Price", key: "priceEnd" },
    { label: "Visit Product", key: "productUrl" },
  ];

  // Build current products row per shop
  const currentProducts = Object.keys(productsBySource || {}).map(
    (shop) => productsBySource[shop][currentIndexes[shop]]
  );

  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 4, width: "95%", mx: "auto" }} maxWidth={false}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 28px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
            color: "#f5f7ff",
            mb: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
             {query || "Results"} is just one click away!
          </Typography>
          <Box>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: "transparent",
                border: "1px solid #f8fafc",
                color: "#f8fafc",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              ← Back
            </button>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
        >
          <Table>
            <TableHead>
              {/* Header: Images */}
              <TableRow>
                <TableCell></TableCell>
                {currentProducts.map((product, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{ padding: 2, backgroundColor: "#f5f5f5" }}
                  >
                    <img
                      src={product.imgUrl}
                      alt={product.name}
                      style={{
                        maxWidth: 140,
                        maxHeight: 180,
                        objectFit: "contain",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>

              {/* Rotation arrow row */}
              <TableRow>
                <TableCell></TableCell>
                {Object.keys(productsBySource).map((shop, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{ backgroundColor: "#fafafa" }}
                  >
                    {productsBySource[shop].length > 1 && (
                      <IconButton
                        onClick={() => handleNextProduct(shop)}
                        size="large"
                        sx={{ color: "#0f172a" }} // dark blue
                      >
                        <RotateRightIcon fontSize="large" />
                      </IconButton>
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Shop name row */}
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    backgroundColor: "#e3f2fd",
                    color: "#0f172a",
                  }}
                >
                  Shop
                </TableCell>
                {Object.keys(productsBySource).map((shop, idx) => (
                  <TableCell
                    key={idx}
                    align="center"
                    sx={{
                      backgroundColor: "#e3f2fd",
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    {shop}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, idx) => (
                <TableRow
                  key={idx}
                  sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      backgroundColor: "#f5f5f5",
                      color: "#0f172a",
                      fontSize: 16,
                    }}
                  >
                    {row.label}
                  </TableCell>
                  {currentProducts.map((product, colIdx) => (
                    <TableCell
                      key={colIdx}
                      align="center"
                      sx={{
                        maxWidth: 200,
                        wordWrap: "break-word",
                        whiteSpace: row.key === "name" ? "normal" : "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: 16,
                        color:
                          row.key === "priceStart" || row.key === "priceEnd"
                            ? "#0f172a"
                            : "inherit",
                        fontWeight:
                          row.key === "priceStart" || row.key === "priceEnd"
                            ? 700
                            : "normal",
                      }}
                    >
                      {row.key === "productUrl" ? (
                        <a
                          href={product[row.key]}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#1976d2",
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                        >
                          Visit
                        </a>
                      ) : row.key === "priceStart" || row.key === "priceEnd" ? (
                        product[row.key] === 0 ? "-" : `${product[row.key]} ALL`
                      ) : (
                        product[row.key]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </div>
  );
}
