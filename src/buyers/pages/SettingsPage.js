import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    profilePic: null,
    profilePicUrl: "",
  });
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("jwt");

  // Fetch the buyer profile using /me endpoint
 useEffect(() => {
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/buyer/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text(); // get raw response
      try {
        const data = JSON.parse(text); // try parse JSON
        setProfile({
          username: data.username || "",
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob || "",
          street: data.street || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
          country: data.country || "",
          profilePic: null,
          profilePicUrl: data.profilePicUrl || "",
        });
      } catch (jsonErr) {
        console.error("Invalid JSON response:", text);
      }

    } catch (err) {
      console.log(err);
    }
  };
  fetchProfile();
}, [token]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setProfile((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!token) return;

    const formData = new FormData();
    formData.append(
      "profile",
      new Blob(
        [
          JSON.stringify({
            username: profile.username,
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            dob: profile.dob,
            street: profile.street,
            city: profile.city,
            postalCode: profile.postalCode,
            country: profile.country,
          }),
        ],
        { type: "application/json" }
      )
    );

    if (profile.profilePic) formData.append("profilePic", profile.profilePic);

    try {
      const res = await fetch(
        "http://localhost:8080/api/buyer/profile/update",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile((prev) => ({
        ...prev,
        profilePicUrl: data.profilePicUrl || prev.profilePicUrl,
        profilePic: null,
      }));
      setMessage("Profile saved successfully!");
      setOpen(true);
    } catch (err) {
      setMessage(err.message);
      setOpen(true);
    }
  };

 const SectionDivider = ({ text }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      mt: 6,
      mb: 3,
      gap: 2
    }}
  >
    <Typography
      variant="h4"
      fontWeight={700}
      sx={{ whiteSpace: "nowrap", color: "#14532d" }}
    >
      {text}
    </Typography>
    <Divider sx={{ flexGrow: 1, borderColor: "#14532d" }} />
  </Box>
);

  return (
    <Box sx={{ p: 4, width: "90%", margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          mb: 4,
          borderRadius: "24px",
          background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Complete Your Profile
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          mb: 4,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Avatar
          src={
            profile.profilePic
              ? URL.createObjectURL(profile.profilePic)
              : profile.profilePicUrl
          }
          sx={{ width: 220, height: 220 }}
        />
        <Box sx={{ flex: 1, maxWidth: "500px" }}>
          <TextField
            fullWidth
            label="Username / Display Name"
            name="username"
            value={profile.username}
            onChange={handleChange}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2, background: "#166534" }}
          >
            Upload Picture
            <input
              type="file"
              hidden
              name="profilePic"
              onChange={handleChange}
            />
          </Button>
        </Box>
      </Box>

      <SectionDivider text="Personal Information" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            name="dob"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={profile.dob}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <SectionDivider text="Shipping Address" />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={profile.street}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={profile.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={profile.postalCode}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={profile.country}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        sx={{ background: "#166534", color: "#fff", mt: 3 }}
        onClick={handleSubmit}
      >
        Save Profile
      </Button>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
