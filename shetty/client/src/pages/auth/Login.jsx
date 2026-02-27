import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Container,
} from "@mui/material";
import MobileLogo from "../../assets/shetty-logo-mobile.png";
import DesktopLogo from "../../assets/shetty-logo-desktop.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AndroidIcon from "@mui/icons-material/Android";
import GetAppIcon from "@mui/icons-material/GetApp";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { loginUser } from "../../redux/reducer/authReducer";

// CSS variables mapping
const vars = {
  loginBackground: "#090909",
  ionBackground: "#000000",
  ionBackgroundColor: "#071123",
  formCtnBorder: "#04a0e2",
  customBtnBgVariant2: "#01fafe",
  activeTextColor: "#000000",
  customBtnTextVariant2: "#000000",
  customBtnBorderVariant2: "#04a0e2",
};
const white = "#FFFFFF";
const subtitleColor = "#e0e0e0";
const placeholderGrey = "#9CA3AF";
const redAsterisk = "#EF4444";
const downloadApkBg = "#66bb6a";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth ?? {});

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ userName: username, password }))
      .unwrap()
      .then(() => navigate("/home", { replace: true }))
      .catch(() => {});
  };

  const handleDemoLogin = () => {
    const demoUsername = "demo";
    const demoPassword = "demo1234";

    setUsername(demoUsername);
    setPassword(demoPassword);

    dispatch(loginUser({ userName: demoUsername, password: demoPassword }))
      .unwrap()
      .then(() => navigate("/home", { replace: true }))
      .catch(() => {});
  };

  return (
    <Box
      sx={{
        background: vars.loginBackground,
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Lato", sans-serif',
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 0 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: { xs: 0, sm: 2 },
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 2, sm: 3 },
            width: "100%",
          }}
        >
          {/* Mobile logo - visible on mobile */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <img
              src={MobileLogo}
              alt="shetty777.online"
              style={{
                height: "50px",
                width: "auto",
                objectFit: "contain",
                margin: "0 auto",
              }}
            />
          </Box>
          {/* Desktop logo - visible on desktop */}
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <img
              src={DesktopLogo}
              alt="shetty777.online"
              style={{
                height: "60px",
                width: "auto",
                objectFit: "contain",
                margin: "0 auto",
              }}
            />
          </Box>
        </Box>

        {/* Main Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          {/* Form Card */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: "100%",
              background: vars.ionBackgroundColor,
              borderRadius: "16px 16px 0 0",
              border: `2px solid ${vars.formCtnBorder}`,
              borderBottom: "none",
              p: { xs: "16px 12px", sm: "20px 24px" },
            }}
          >
            {/* Header with Back and Demo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => navigate(-1)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  color: white,
                  cursor: "pointer",
                  p: 0.5,
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 20, mr: 0.5 }} />
                <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
                  Back
                </Typography>
              </Box>

              <Button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                sx={{
                  background: "#008c95",
                  color: white,
                  py: 0.5,
                  px: 2,
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "none",
                  minWidth: "auto",
                  "&:hover": {
                    background: "#006d75",
                  },
                }}
              >
                Demo login
              </Button>
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                color: white,
                fontSize: { xs: "28px", sm: "32px" },
                fontWeight: 700,
                textAlign: "center",
                mb: 1,
              }}
            >
              Sign in
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 600,
                textAlign: "center",
                color: subtitleColor,
                mb: 3,
              }}
            >
              Please enter your login details here.
            </Typography>

            {/* Username Field */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  color: subtitleColor,
                  fontSize: { xs: "14px", sm: "16px" },
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                Username{" "}
                <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: white,
                    borderRadius: "8px",
                    height: { xs: "44px", sm: "48px" },
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    px: 2,
                  },
                }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  color: subtitleColor,
                  fontSize: { xs: "14px", sm: "16px" },
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                Password{" "}
                <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: white,
                    borderRadius: "8px",
                    height: { xs: "44px", sm: "48px" },
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    px: 2,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{
                          color: placeholderGrey,
                          mr: 0.5,
                        }}
                      >
                        {showPassword ? (
                          <VisibilityIcon fontSize="small" />
                        ) : (
                          <VisibilityOffIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: "right", mb: 2 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  color: white,
                  fontSize: { xs: "12px", sm: "14px" },
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Forgot Username/Password?
              </Link>
            </Box>

            {/* Error Message */}
            {error?.message && (
              <Box
                sx={{
                  bgcolor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  p: 1.5,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "#F87171",
                    fontSize: { xs: "13px", sm: "14px" },
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {error.message}
                </Typography>
              </Box>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                background: "#008c95",
                color: white,
                height: { xs: "44px", sm: "48px" },
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 700,
                borderRadius: "50px",
                textTransform: "uppercase",
                mb: 2,
                "&:hover": {
                  background: "#006d75",
                },
                "&.Mui-disabled": {
                  background: "#008c95",
                  opacity: 0.7,
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: "2px solid #ffffff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Typography component="span">LOGGING IN...</Typography>
                </Box>
              ) : (
                "LOGIN"
              )}
            </Button>
          </Box>

          {/* Sign Up Section */}
          <Box
            sx={{
              width: "100%",
              background: vars.ionBackgroundColor,
              border: `2px solid ${vars.formCtnBorder}`,
              borderTop: `1px solid ${vars.formCtnBorder}`,
              borderRadius: "0 0 16px 16px",
              p: { xs: 1.5, sm: 2 },
              textAlign: "center",
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#a4d4d4",
                fontSize: { xs: "13px", sm: "14px" },
              }}
            >
              Don't have an account?{" "}
            </Typography>
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/signup")}
              sx={{
                color: white,
                fontSize: { xs: "13px", sm: "14px" },
                fontWeight: 600,
                textDecoration: "underline",
                cursor: "pointer",
                background: "none",
                border: "none",
                "&:hover": {
                  color: vars.formCtnBorder,
                },
              }}
            >
              Sign Up
            </Link>
          </Box>

          {/* Download APK Button */}
          <Box sx={{ mt: 2, width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: downloadApkBg,
                height: { xs: "44px", sm: "48px" },
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                "&:hover": {
                  backgroundColor: "#5cb860",
                },
              }}
            >
              <AndroidIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <Typography
                sx={{
                  color: white,
                  fontWeight: 700,
                  fontSize: { xs: "14px", sm: "16px" },
                }}
              >
                Download .apk
              </Typography>
              <GetAppIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </Button>
          </Box>

          {/* WhatsApp Channel */}
          <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
            <Button
              component="a"
              href="https://www.whatsapp.com/channel/0029Vb6K7XdJ93wXnxIeoW3o"
              target="_blank"
              sx={{
                color: white,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                textTransform: "none",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <Typography
                sx={{
                  fontSize: { xs: "11px", sm: "12px" },
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                FOLLOW ON WHATSAPP
              </Typography>
            </Button>
          </Box>

          {/* Disclaimer */}
          <Box sx={{ mt: 3, width: "100%", px: 1 }}>
            <Typography
              sx={{
                color: "#ece7f1",
                fontSize: { xs: "11px", sm: "12px" },
                fontWeight: 600,
                lineHeight: 1.5,
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              <strong>Disclaimer:</strong> Please note that Gambling involves a
              financial risk and could be addictive over time if not practised
              within limits. Only 18+ people should use the services and should
              use it responsibly.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
