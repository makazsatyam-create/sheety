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
} from "@mui/material";
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
    const t = setInterval(() => setResendSecondsLeft((s) => (s <= 0 ? 0 : s - 1)), 1000);
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
      const msg = err.response?.data?.message || err.message || "Failed to send OTP";
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password || !phone.trim() || phone.length !== 10 || !otp.trim()) {
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
      const msg = err.response?.data?.message || err.message || "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    maxWidth: "100%",
    borderRadius: "8px",
    border: "1px solid #04a0e2",
    backgroundColor: "#ffffff",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#04a0e2",
        borderWidth: "1px",
      },
      boxShadow: "none",
    },
  };

  const labelSx = {
    color: subtitleColor,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: "150%",
    display: "flex",
    alignItems: "center",
    marginBottom: "7px",
  };

  return (
    <Box
      className="signup-ctn"
      sx={{
        background: vars.loginBackground,
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "scroll",
        overflowX: "hidden",
        paddingBottom: "40px",
        fontFamily: '"Lato", sans-serif !important',
        fontWeight: 500,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& div, & h1, & h2, & p, & span": {
          fontFamily: '"Lato", sans-serif !important',
          fontWeight: 500,
        },
      }}
    >
      <Box
        className="title-row"
        sx={{
          textAlign: "center",
          flexShrink: 0,
          paddingTop: "24px",
          paddingBottom: "12px",
        }}
      >
        <span style={{ fontSize: "22px", fontWeight: "bold", color: "#04a0e2" }}>
          shetty777.online
        </span>
      </Box>

      <Box
        className="signup-card"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <Box
          className="signup-form-page"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "520px",
            flexShrink: 0,
            px: 1,
          }}
        >
          <Box
            component="form"
            className="signup-form-ctn"
            autoComplete="off"
            onSubmit={handleSignUp}
            sx={{
              width: "100%",
              maxWidth: "520px",
              display: "flex",
              padding: { xs: "16px 16px 24px", sm: "16px 24px 24px" },
              flexDirection: "column",
              background: "#071123",
              borderRadius: "16px 16px 0 0",
              border: `2px solid ${vars.formCtnBorder}`,
              borderBottom: "none",
              boxSizing: "border-box",
            }}
          >
            <Box
              className="back-icon"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                color: white,
                marginBottom: "8px",
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => navigate(-1)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 22, color: "#fff" }} />
                <span
                  style={{
                    marginLeft: "3px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Back
                </span>
              </Box>
            </Box>

            <Typography
              sx={{
                color: white,
                fontSize: "32px",
                fontWeight: 700,
                lineHeight: "43.2px",
                textAlign: "center",
              }}
            >
              Sign Up
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "21.6px",
                textAlign: "center",
                color: subtitleColor,
                marginTop: "4px",
                marginBottom: "20px",
              }}
            >
              Create your account by following these simple steps.
            </Typography>

            {/* Username */}
            <Box
              sx={{
                display: "inline-grid",
                width: "100%",
                marginBottom: "10px",
              }}
            >
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
                sx={inputSx}
                inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
              />
            </Box>

            {/* Password */}
            <Box
              sx={{
                display: "inline-grid",
                width: "100%",
                marginBottom: "10px",
              }}
            >
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
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        sx={{
                          color: "#9ca3af",
                          mr: 1,
                          "&:hover": { color: vars.formCtnBorder },
                        }}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
              />
            </Box>

            {/* Campaign Code */}
            <Box
              sx={{
                display: "inline-grid",
                width: "100%",
                marginBottom: "10px",
              }}
            >
              <Typography sx={labelSx}>Campaign Code</Typography>
              <TextField
                fullWidth
                placeholder="Enter Campaign Code"
                value={campaignCode}
                onChange={(e) => setCampaignCode(e.target.value)}
                variant="outlined"
                sx={inputSx}
                inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
              />
            </Box>

            {/* Phone Number / WhatsApp */}
            <Box
              sx={{
                display: "inline-grid",
                width: "100%",
                marginBottom: "16px",
              }}
            >
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
                  alignItems: "stretch",
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "72px",
                    flexShrink: 0,
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #04a0e2",
                    backgroundColor: "#ffffff",
                    padding: "0 8px",
                    color: "#333",
                    fontSize: 14,
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
                  sx={{
                    flex: "1 1 120px",
                    minWidth: 0,
                    ...inputSx,
                  }}
                  inputProps={{
                    sx: { height: "48px", boxSizing: "border-box" },
                    maxLength: 10,
                  }}
                />
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
                    minWidth: "120px",
                    flexShrink: 0,
                    height: "48px",
                    fontWeight: 600,
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
                      return `Resend in ${m}:${String(s).padStart(2, "0")}`;
                    }
                    return otpSent ? "Resend OTP" : "Send OTP";
                  })()}
                </Button>
              </Box>
              {otpError && (
                <Typography sx={{ color: "#EF4444", fontSize: 13, marginTop: 0.5 }}>
                  {otpError}
                </Typography>
              )}
            </Box>

            {/* OTP */}
            <Box
              sx={{
                display: "inline-grid",
                width: "100%",
                marginBottom: "16px",
              }}
            >
              <Typography sx={labelSx}>
                OTP <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                variant="outlined"
                sx={inputSx}
                inputProps={{
                  sx: { height: "48px", boxSizing: "border-box" },
                  maxLength: 4,
                }}
              />
            </Box>

            {error && (
              <Typography sx={{ color: "#EF4444", fontSize: 14, marginBottom: 1 }}>
                {error}
              </Typography>
            )}

            {/* Have an account? Sign in */}
            <Box
              sx={{
                textAlign: "center",
                marginBottom: "16px",
                fontSize: "14px",
                color: subtitleColor,
              }}
            >
              <Typography component="span" sx={{ color: subtitleColor }}>
                Have an account?{" "}
              </Typography>
              <Link
                component="button"
                type="button"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#04a0e2",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sign in
              </Link>
            </Box>

            {/* SIGN UP button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !otp.trim()}
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "44px",
                fontSize: "16px",
                borderRadius: "100px",
                background: tealBtn,
                color: white,
                fontWeight: 700,
                boxShadow: "none",
                textTransform: "uppercase",
                "&:hover": { background: "#007a82" },
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
                  <Typography
                    component="span"
                    sx={{ color: "#fff", fontSize: 14 }}
                  >
                    Signing up...
                  </Typography>
                </Box>
              ) : (
                "SIGN UP"
              )}
            </Button>
          </Box>

          {/* Bottom bar - matches Login card foot */}
          <Box
            className="signup-card-footer"
            sx={{
              width: "100%",
              maxWidth: "520px",
              background: vars.ionBackgroundColor,
              padding: "14px 0",
              border: `2px solid ${vars.formCtnBorder}`,
              borderTop: "1px solid #04a0e2",
              marginTop: "-2px",
              borderRadius: "0 0 16px 16px",
              textAlign: "center",
            }}
          >
            <Typography
              component="span"
              sx={{ color: "#a4d4d4", fontSize: 13, fontWeight: 600 }}
            >
              Already have an account?{" "}
            </Typography>
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/login")}
              sx={{
                color: "#fff",
                marginLeft: "3px",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Sign in
            </Link>
          </Box>

          {/* Follow on WhatsApp - footer */}
          <Box
            className="signup-footer-whatsapp"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "10px",
              width: "100%",
            }}
          >
            <Button
              component="a"
              href="https://www.whatsapp.com/channel/0029Vb6K7XdJ93wXnxIeoW3o"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              disableElevation
              startIcon={<WhatsAppIcon sx={{ color: white, fontSize: 20 }} />}
              sx={{
                marginBottom: "0px",
                backgroundColor: "transparent",
                display: "flex",
                flexDirection: "row",
                maxWidth: "100%",
                border: 0,
                color: white,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
              }}
            >
              <span
                style={{
                  color: white,
                  textTransform: "uppercase",
                  fontSize: "10px",
                  padding: "5px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                FOLLOW ON WHATSAPP
              </span>
            </Button>
          </Box>

          {/* Disclaimer - footer */}
          <Box
            className="signup-disclaimer"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: "8px",
            }}
          >
            <Typography
              component="p"
              sx={{
                color: "#ece7f1",
                width: "100%",
                maxWidth: "480px",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "17.56px",
                textAlign: "center",
                marginTop: "0px",
              }}
            >
              <strong>Disclaimer:</strong> Please note that Gambling involves a
              financial risk and could be addictive over time if not practised
              within limits. Only 18+ people should use the services and should
              use it responsibly. Players should be aware of any financial risk
              and govern themselves accordingly.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;
