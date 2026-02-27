import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import api from "../../redux/api";

const vars = {
  loginBackground: "#090909",
  ionBackgroundColor: "#071123",
  formCtnBorder: "#04a0e2",
};
const white = "#FFFFFF";
const subtitleColor = "#e0e0e0";
const redAsterisk = "#EF4444";
const tealBtn = "#008c95";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [campaignCode, setCampaignCode] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);
  const RESEND_COOLDOWN_SEC = 120; // 2 min

  useEffect(() => {
    if (resendSecondsLeft <= 0) return;
    const t = setInterval(
      () => setResendSecondsLeft((s) => (s <= 0 ? 0 : s - 1)),
      1000
    );
    return () => clearInterval(t);
  }, [resendSecondsLeft]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone.trim() || phone.length !== 10) return;
    setOtpError("");
    setOtpLoading(true);
    try {
      await api.get("/send-otp", { params: { mobile: phone } });
      setOtpSent(true);
      setResendSecondsLeft(RESEND_COOLDOWN_SEC);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to send OTP";
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !username.trim() ||
      !password ||
      !phone.trim() ||
      phone.length !== 10 ||
      !otp.trim()
    ) {
      setError("Please fill username, password, phone, and OTP.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/register", {
        userName: username.trim(),
        password,
        campaignCode: campaignCode.trim() || undefined,
        phone,
        otp: otp.trim(),
      });
      navigate("/login", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const labelSx = {
    color: subtitleColor,
    fontSize: { xs: "14px", sm: "16px" },
    fontWeight: 600,
    lineHeight: "150%",
    display: "flex",
    alignItems: "center",
    marginBottom: "7px",
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
          {/* Mobile logo */}
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
          {/* Desktop logo */}
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

        {/* Form Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleSignUp}
            sx={{
              width: "100%",
              background: vars.ionBackgroundColor,
              borderRadius: "16px 16px 0 0",
              border: `2px solid ${vars.formCtnBorder}`,
              borderBottom: "none",
              p: { xs: "16px", sm: "24px" },
            }}
          >
            {/* Back Button */}
            <Box
              component="button"
              type="button"
              onClick={() => navigate(-1)}
              sx={{
                display: "flex",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                color: white,
                mb: 2,
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 20 }} />
              <span
                style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 600 }}
              >
                Back
              </span>
            </Box>

            <Typography
              sx={{
                color: white,
                fontSize: { xs: "28px", sm: "32px" },
                fontWeight: 700,
                textAlign: "center",
                mb: 1,
              }}
            >
              Sign Up
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
              Create your account by following these simple steps.
            </Typography>

            {/* Username */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={labelSx}>
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
                    border: "1px solid #04a0e2",
                    height: { xs: "44px", sm: "48px" },
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                  "& .MuiOutlinedInput-input": {
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "14px", sm: "16px" },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={labelSx}>
                Password{" "}
                <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Password"
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
                    border: "1px solid #04a0e2",
                    height: { xs: "44px", sm: "48px" },
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                  "& .MuiOutlinedInput-input": {
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "14px", sm: "16px" },
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
                          color: "#9ca3af",
                          mr: 0.5,
                          "&:hover": { color: vars.formCtnBorder },
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

            {/* Campaign Code */}
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={labelSx}>Campaign Code</Typography>
              <TextField
                fullWidth
                placeholder="Enter Campaign Code"
                value={campaignCode}
                onChange={(e) => setCampaignCode(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: white,
                    borderRadius: "8px",
                    border: "1px solid #04a0e2",
                    height: { xs: "44px", sm: "48px" },
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                  "& .MuiOutlinedInput-input": {
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "14px", sm: "16px" },
                  },
                }}
              />
            </Box>

            {/* Phone Number */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>
                Phone Number / WhatsApp
                <WhatsAppIcon
                  sx={{
                    fontSize: 18,
                    color: "#25D366",
                    marginLeft: "6px",
                    verticalAlign: "middle",
                  }}
                />
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minWidth: { xs: "70px", sm: "80px" },
                      height: { xs: "44px", sm: "48px" },
                      borderRadius: "8px",
                      border: "1px solid #04a0e2",
                      backgroundColor: white,
                      padding: "0 8px",
                      color: "#333",
                      fontSize: { xs: "14px", sm: "16px" },
                      flex: { xs: 1, sm: "0 0 auto" },
                    }}
                  >
                    <span style={{ marginRight: 4 }}>🇮🇳</span> +91
                  </Box>

                  <TextField
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      flex: { xs: 1, sm: "1 1 120px" },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: white,
                        borderRadius: "8px",
                        border: "1px solid #04a0e2",
                        height: { xs: "44px", sm: "48px" },
                        "& fieldset": { border: "none" },
                        "&:hover fieldset": { border: "none" },
                        "&.Mui-focused fieldset": { border: "none" },
                      },
                      "& .MuiOutlinedInput-input": {
                        px: { xs: 1.5, sm: 2 },
                        fontSize: { xs: "14px", sm: "16px" },
                      },
                    }}
                    inputProps={{ maxLength: 10 }}
                  />
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSendOtp}
                  disabled={
                    !phone.trim() ||
                    phone.length < 10 ||
                    otpLoading ||
                    resendSecondsLeft > 0
                  }
                  sx={{
                    background: tealBtn,
                    color: "#fff !important",
                    borderRadius: "8px",
                    width: { xs: "100%", sm: "120px" },
                    height: { xs: "44px", sm: "48px" },
                    fontWeight: 600,
                    fontSize: { xs: "14px", sm: "14px" },
                    textTransform: "none",
                    "&:hover": { background: "#007a82" },
                    "&.Mui-disabled": {
                      color: "#fff !important",
                      opacity: 1,
                      background: tealBtn,
                    },
                  }}
                >
                  {(() => {
                    if (otpLoading) return "Sending…";
                    if (resendSecondsLeft > 0) {
                      const m = Math.floor(resendSecondsLeft / 60);
                      const s = resendSecondsLeft % 60;
                      return `Resend ${m}:${String(s).padStart(2, "0")}`;
                    }
                    return otpSent ? "Resend" : "Send";
                  })()}
                </Button>
              </Box>

              {otpError && (
                <Typography
                  sx={{ color: "#EF4444", fontSize: "13px", mt: 0.5 }}
                >
                  {otpError}
                </Typography>
              )}
            </Box>

            {/* OTP */}
            <Box sx={{ mb: 2 }}>
              <Typography sx={labelSx}>
                OTP <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: white,
                    borderRadius: "8px",
                    border: "1px solid #04a0e2",
                    height: { xs: "44px", sm: "48px" },
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                  "& .MuiOutlinedInput-input": {
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "14px", sm: "16px" },
                  },
                }}
                inputProps={{ maxLength: 4 }}
              />
            </Box>

            {error && (
              <Typography
                sx={{
                  color: "#EF4444",
                  fontSize: { xs: "13px", sm: "14px" },
                  mb: 2,
                }}
              >
                {error}
              </Typography>
            )}

            {/* SIGN UP button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !otp.trim()}
              sx={{
                height: { xs: "44px", sm: "48px" },
                fontSize: { xs: "14px", sm: "16px" },
                borderRadius: "50px",
                background: tealBtn,
                color: white,
                fontWeight: 700,
                boxShadow: "none",
                textTransform: "uppercase",
                mb: 2,
                "&:hover": { background: "#007a82" },
                "&.Mui-disabled": {
                  background: tealBtn,
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
                      border: "2px solid #fff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Typography component="span" sx={{ fontSize: "14px" }}>
                    SIGNING UP...
                  </Typography>
                </Box>
              ) : (
                "SIGN UP"
              )}
            </Button>
          </Box>

          {/* Bottom Card Footer */}
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
                fontWeight: 600,
              }}
            >
              Already have an account?{" "}
            </Typography>
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/login")}
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
              Sign in
            </Link>
          </Box>

          {/* WhatsApp Channel */}
          <Box sx={{ mt: 2, width: "100%", textAlign: "center" }}>
            <Button
              component="a"
              href="https://www.whatsapp.com/channel/0029Vb6K7XdJ93wXnxIeoW3o"
              target="_blank"
              rel="noopener noreferrer"
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
          <Box sx={{ mt: 2, width: "100%", px: 1 }}>
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

export default SignUp;
