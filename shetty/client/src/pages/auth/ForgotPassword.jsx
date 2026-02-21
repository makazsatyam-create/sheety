import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../../redux/api";

const vars = {
  loginBackground: "linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 30%, #071123 70%, #090909 100%)",
  ionBackgroundColor: "#071123",
  formCtnBorder: "#04a0e2",
  tealBtn: "#01fafe",
  tealBtnDark: "#008c95",
};
const white = "#FFFFFF";
const subtitleColor = "#e0e0e0";
const redAsterisk = "#EF4444";
const signUpPurple = "#BD34FE";

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
  color: white,
  fontSize: 16,
  fontWeight: 600,
  lineHeight: "150%",
  display: "flex",
  alignItems: "center",
  marginBottom: "7px",
};

function ForgotPassword() {
  const navigate = useNavigate();
  const [otpMode, setOtpMode] = useState("mobile"); // mobile | email
  const [countryCode] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setOtpError("");
    const digits = mobile.replace(/\D/g, "").slice(0, 10);
    if (digits.length !== 10) {
      setOtpError("Enter a valid 10-digit mobile number");
      return;
    }
    setSendOtpLoading(true);
    try {
      await api.get("/send-otp", { params: { mobile: digits } });
      setOtpSent(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to send OTP";
      setOtpError(msg);
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp.trim()) {
      setError("Enter OTP");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setResetLoading(true);
    try {
      await api.post("/forgot-password/reset", {
        mobile: mobile.replace(/\D/g, "").slice(0, 10),
        otp: otp.trim(),
        newPassword,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Reset failed. Please try again or contact support.";
      setError(msg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Box
      className="forgot-ctn"
      sx={{
        background: vars.loginBackground,
        backgroundRepeat: "no-repeat !important",
        width: "100%",
        minHeight: "100%",
        position: "fixed",
        top: 0,
        left: 0,
        overflowY: "scroll",
        backgroundSize: "cover",
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
      {/* Logo */}
      <Box
        className="title-row"
        sx={{
          textAlign: "center",
          cursor: "pointer",
          flexShrink: 0,
          paddingTop: "20px",
          paddingBottom: "10px",
        }}
        onClick={() => navigate("/login")}
      >
        <span style={{ fontSize: "22px", fontWeight: "bold", color: "#04a0e2" }}>
          shetty777.online
        </span>
      </Box>

      {/* Form card */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
          width: "100%",
          maxWidth: 480,
          px: 2,
          pb: 4,
        }}
      >
        <Box
          component="form"
          autoComplete="off"
          onSubmit={otpSent ? handleResetPassword : handleSendOtp}
          sx={{
            width: "100%",
            display: "flex",
            padding: "20px 24px 24px",
            flexDirection: "column",
            background: vars.ionBackgroundColor,
            borderRadius: "16px",
            border: `2px solid ${vars.formCtnBorder}`,
            boxSizing: "border-box",
          }}
        >
          {/* Back */}
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
              marginBottom: "16px",
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 22, color: "#fff" }} />
            <span style={{ marginLeft: "6px", fontSize: "14px", fontWeight: 600 }}>
              Back
            </span>
          </Box>

          <Typography
            sx={{
              color: white,
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: "1.2",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            Forgot Username/Password?
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "21.6px",
              textAlign: "center",
              color: subtitleColor,
              marginBottom: "24px",
            }}
          >
            We'll send OTP on your registered number associated with username.
          </Typography>

          {!otpSent ? (
            <>
              {/* Mobile / Email dropdown + country code + input */}
              <Box sx={{ display: "flex", gap: 1, alignItems: "stretch", marginBottom: 2 }}>
                <FormControl
                  variant="outlined"
                  sx={{
                    minWidth: 100,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #04a0e2",
                      height: "48px",
                      "& fieldset": { border: "none" },
                    },
                  }}
                >
                  <Select
                    value={otpMode}
                    onChange={(e) => setOtpMode(e.target.value)}
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      color: "#333",
                      fontWeight: 600,
                      "& .MuiSelect-select": { py: 1.5 },
                    }}
                  >
                    <MenuItem value="mobile">Mobile</MenuItem>
                    <MenuItem value="email" disabled>Email</MenuItem>
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "80px",
                    flexShrink: 0,
                    height: "48px",
                    borderRadius: "8px",
                    border: "1px solid #04a0e2",
                    backgroundColor: "#ffffff",
                    padding: "0 10px",
                    color: "#333",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ marginRight: 6 }}>🇮🇳</span> +91
                </Box>
                <TextField
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  variant="outlined"
                  sx={{
                    flex: "1 1 0",
                    minWidth: 0,
                    ...inputSx,
                  }}
                  inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
                />
              </Box>

              {otpError && (
                <Typography sx={{ color: "#F87171", fontSize: 14, mb: 1 }}>
                  {otpError}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={sendOtpLoading}
                sx={{
                  height: "44px",
                  borderRadius: "100px",
                  background: vars.tealBtn,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "16px",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { background: vars.tealBtnDark, color: white },
                }}
              >
                {sendOtpLoading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ marginBottom: 2 }}>
                <Typography sx={labelSx}>Enter OTP</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  variant="outlined"
                  sx={inputSx}
                  inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
                />
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography sx={labelSx}>Enter New Password</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="outlined"
                  sx={inputSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword((p) => !p)}
                          edge="end"
                          sx={{ color: "#9ca3af" }}
                        >
                          {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
                />
              </Box>
              <Box sx={{ marginBottom: 2 }}>
                <Typography sx={labelSx}>Enter confirm password</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  sx={inputSx}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          edge="end"
                          sx={{ color: "#9ca3af" }}
                        >
                          {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ sx: { height: "48px", boxSizing: "border-box" } }}
                />
              </Box>

              {error && (
                <Typography sx={{ color: "#F87171", fontSize: 14, mb: 1 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={resetLoading}
                sx={{
                  height: "44px",
                  borderRadius: "100px",
                  background: vars.tealBtn,
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "16px",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { background: vars.tealBtnDark, color: white },
                }}
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}

          {/* Footer link */}
          <Typography
            sx={{
              textAlign: "center",
              color: subtitleColor,
              fontSize: "14px",
              marginTop: "24px",
            }}
          >
            Don't have account?{" "}
            <Link
              to="/signup"
              style={{
                color: signUpPurple,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
