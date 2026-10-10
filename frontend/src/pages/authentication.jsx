import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const defaultTheme = createTheme({
  palette: {
    primary: { main: "#0D9488" },
    secondary: { main: "#102A43" },
  },
});

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("student");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = async (event) => {
    event.preventDefault();
    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions and Privacy Policy.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password, role);

        setMessage(result || "Registration successful!");
        setOpen(true);
        setName("");
        setUsername("");
        setPassword("");
        setRole("student");
        setFormState(0);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Grid container component="main" sx={{ minHeight: "100vh" }}>
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            p: 7,
            color: "white",
            background: `
  radial-gradient(circle at 75% 15%, rgba(45, 212, 191, 0.18), transparent 35%),
  radial-gradient(circle at 15% 85%, rgba(20, 184, 166, 0.13), transparent 30%),
  linear-gradient(135deg, #071C27 0%, #102A43 55%, #064E4B 100%)
`,
          }}
        >
          <Typography variant="h3" fontWeight={800} gutterBottom>
            Welcome to MockMate
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.8 }}>
            Practise with experienced seniors, get honest feedback, and prepare
            confidently for your next interview.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          component={Paper}
          elevation={0}
          square
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              mx: "auto",
              p: { xs: 3, sm: 5 },
            }}
          >
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                width: 52,
                height: 52,
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Typography
              variant="h4"
              align="center"
              fontWeight={800}
              color="secondary.main"
            >
              {formState === 0 ? "Welcome back" : "Create account"}
            </Typography>

            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              {formState === 0
                ? "Sign in to continue to MockMate"
                : "Join MockMate as a student or mentor"}
            </Typography>

            <Box sx={{ display: "flex", mb: 3 }}>
              <Button
                fullWidth
                variant={formState === 0 ? "contained" : "outlined"}
                onClick={() => {
                  setFormState(0);
                  setError("");
                }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => {
                  setFormState(1);
                  setError("");
                }}
                sx={{ ml: 1 }}
              >
                Sign Up
              </Button>
            </Box>

            <Box component="form" onSubmit={handleAuth}>
              {formState === 1 && (
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <TextField
                    select
                    margin="normal"
                    required
                    fullWidth
                    label="I want to join as a"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value="student">Student — Find mentors</MenuItem>
                    <MenuItem value="mentor">
                      Mentor — Conduct interviews
                    </MenuItem>
                  </TextField>
                </>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete={
                  formState === 0 ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                sx={{
                  mt: 2,
                  alignItems: "flex-start",
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.85rem",
                    color: "text.secondary",
                  },
                }}
                control={
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <span>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noreferrer">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </span>
                }
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.4,
                  fontWeight: 700,
                }}
              >
                {loading
                  ? "Please wait..."
                  : formState === 0
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </Box>

            <Button fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setOpen(false)}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
