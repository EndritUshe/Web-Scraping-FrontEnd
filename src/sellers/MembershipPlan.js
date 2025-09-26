import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";

const PLANS = [
  {
    id: "FREE",
    title: "Free",
    subtitle: "Startup Plan",
    price: 0,
    cadence: "Monthly",
    accentIcon: <StarRoundedIcon fontSize="small" />,
    features: [
      { label: "Popular Products", value: 4 },
      { label: "Banners", value: 0 },
      { label: "Basic support" },
    ],
  },
  {
    id: "BASIC",
    title: "Basic",
    subtitle: "Enhanced Access",
    price: 20,
    cadence: "Monthly",
    accentIcon: <WorkspacePremiumRoundedIcon fontSize="small" />,
    features: [
      { label: "Popular Products", value: 10 },
      { label: "Banners", value: 2 },
      { label: "Email support" },
    ],
  },
  {
    id: "PREMIUM",
    title: "Premium",
    subtitle: "Professional Suite",
    price: 40,
    cadence: "Monthly",
    accentIcon: <WorkspacePremiumRoundedIcon fontSize="small" />,
    features: [
      { label: "Popular Products", value: 25 },
      { label: "Banners", value: 6 },
      { label: "Premium support" },
    ],
  },
];

function PriceTag({ price, cadence, isCurrent }) {
  return (
    <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
      <Typography variant="h5" fontWeight={800} color={isCurrent ? "#ffffff" : "inherit"}>
        €{price}
      </Typography>
      <Typography variant="body2" color={isCurrent ? "#ffffff" : "text.secondary"}>
        {cadence}
      </Typography>
    </Stack>
  );
}

function FeatureRow({ label, value, muted }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.5 }}>
      <CheckCircleRoundedIcon sx={{ color: muted ? "#ffffff" : "success.main" }} fontSize="small" />
      <Typography variant="body2" sx={{ flexGrow: 1, color: muted ? "#ffffff" : "inherit" }}>
        {label}
      </Typography>
      {value !== undefined && (
        <Chip
          label={value}
          size="small"
          variant={muted ? "filled" : "outlined"}
          sx={{
            bgcolor: muted ? "rgba(255,255,255,0.2)" : undefined,
            color: muted ? "#ffffff" : undefined,
            borderColor: muted ? "rgba(255,255,255,0.4)" : undefined,
          }}
        />
      )}
    </Stack>
  );
}

export default function MembershipPlans({ onSelect }) {
  const [currentPlan, setCurrentPlan] = React.useState(null);

  // Fetch plan from localStorage on mount
  React.useEffect(() => {
    const plan = localStorage.getItem("userPlan") || "FREE"; // fallback to FREE
    setCurrentPlan(plan);
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 4,
        boxShadow: 3,
        bgcolor: "#fafafa",
      }}
    >
      <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Membership Plans
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose the best featured plans
        </Typography>
      </Stack>

      <Grid container spacing={3} justifyContent="center">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const primary = isCurrent ? "#2E7CF6" : "#ffffff";
          const borderColor = isCurrent ? "transparent" : "divider";

          return (
            <Grid key={plan.id} item xs={12} sm={10} md={4}>
              <Card
                elevation={isCurrent ? 8 : 3}
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  border: 1,
                  borderColor,
                  bgcolor: primary,
                  color: isCurrent ? "#ffffff" : "inherit",
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color={isCurrent ? "#ffffff" : "inherit"}
                      >
                        {plan.title}
                      </Typography>
                      <Typography variant="caption" color={isCurrent ? "#ffffff" : "text.secondary"}>
                        {plan.subtitle}
                      </Typography>
                    </Box>
                    <Chip
                      icon={plan.accentIcon}
                      label=""
                      variant={isCurrent ? "filled" : "outlined"}
                      sx={{
                        borderRadius: 2,
                        bgcolor: isCurrent ? "#1F5ED6" : "transparent",
                        color: isCurrent ? "#ffffff" : "inherit",
                      }}
                    />
                  </Stack>

                  <PriceTag price={plan.price} cadence={plan.cadence} isCurrent={isCurrent} />

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 3,
                      bgcolor: isCurrent ? "#1F5ED6" : "#F5F7FB",
                    }}
                  >
                    <Stack spacing={1}>
                      {plan.features.map((f) => (
                        <FeatureRow key={f.label} label={f.label} value={f.value} muted={isCurrent} />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                <Divider sx={{ opacity: isCurrent ? 0.2 : 1 }} />
                <CardActions sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 3,
                      bgcolor: isCurrent ? "#0F3FA4" : "#7C4DFF",
                      color: "#ffffff !important",
                      ":hover": { bgcolor: isCurrent ? "#0D3690" : "#6A3DE6" },
                    }}
                    disabled={isCurrent}
                    onClick={() => onSelect && onSelect(plan.id)}
                  >
                    {isCurrent ? "Current Plan" : "Choose Plan"}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
