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
  Container,
} from "@mui/material";
import MobileLogo from "../../assets/shetty-logo-mobile.png";
import DesktopLogo from "../../assets/shetty-logo-desktop.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import api from "../../redux/api";

const vars = {
  loginBackground:
    "linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 30%, #071123 70%, #090909 100%)",
  ionBackgroundColor: "#071123",
  formCtnBorder: "#04a0e2",
  tealBtn: "#01fafe",
  tealBtnDark: "#008c95",
};
const white = "#FFFFFF";
const subtitleColor = "#e0e0e0";
const redAsterisk = "#EF4444";
const signUpPurple = "#BD34FE";

const labelSx = {
  color: white,
  fontSize: { xs: "14px", sm: "16px" },
  fontWeight: 600,
  lineHeight: "150%",
  display: "flex",
  alignItems: "center",
  marginBottom: "7px",
};

function ForgotPassword() {
  const navigate = useNavigate();
  const [otpMode, setOtpMode] = useState("mobile");
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
      const msg =
        err.response?.data?.message || err.message || "Failed to send OTP";
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
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Reset failed. Please try again or contact support.";
      setError(msg);
    } finally {
      setResetLoading(false);
    }
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
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
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
            onSubmit={otpSent ? handleResetPassword : handleSendOtp}
            sx={{
              width: "100%",
              background: vars.ionBackgroundColor,
              borderRadius: "16px",
              border: `2px solid ${vars.formCtnBorder}`,
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
                fontSize: { xs: "24px", sm: "28px" },
                fontWeight: 700,
                lineHeight: 1.2,
                textAlign: "center",
                mb: 1,
              }}
            >
              Forgot Username/Password?
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
              We'll send OTP on your registered number.
            </Typography>

            {!otpSent ? (
              <>
                {/* Mobile Input Section - Responsive */}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={labelSx}>Mobile Number *</Typography>

                  {/* Mobile input with country code */}
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
                      <FormControl
                        variant="outlined"
                        sx={{
                          minWidth: { xs: "100px", sm: "120px" },
                          flex: { xs: 1, sm: "0 0 auto" },
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
                            fontSize: { xs: "14px", sm: "16px" },
                            "& .MuiSelect-select": {
                              py: 1.5,
                              px: { xs: 1.5, sm: 2 },
                            },
                          }}
                        >
                          <MenuItem value="mobile">Mobile</MenuItem>
                          <MenuItem value="email" disabled>
                            Email
                          </MenuItem>
                        </Select>
                      </FormControl>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: { xs: "70px", sm: "80px" },
                          height: "48px",
                          borderRadius: "8px",
                          border: "1px solid #04a0e2",
                          backgroundColor: "#ffffff",
                          padding: "0 8px",
                          color: "#333",
                          fontSize: { xs: "14px", sm: "16px" },
                          fontWeight: 600,
                          flex: { xs: 1, sm: "0 0 auto" },
                        }}
                      >
                        <span style={{ marginRight: 4 }}>🇮🇳</span> +91
                      </Box>
                    </Box>

                    <TextField
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      variant="outlined"
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: "1px solid #04a0e2",
                          height: "48px",
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
                </Box>

                {otpError && (
                  <Typography
                    sx={{
                      color: "#F87171",
                      fontSize: { xs: "13px", sm: "14px" },
                      mb: 2,
                    }}
                  >
                    {otpError}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  disabled={sendOtpLoading}
                  sx={{
                    height: { xs: "44px", sm: "48px" },
                    borderRadius: "50px",
                    background: vars.tealBtn,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "16px" },
                    textTransform: "none",
                    boxShadow: "none",
                    mt: 1,
                    "&:hover": { background: vars.tealBtnDark, color: white },
                    "&.Mui-disabled": {
                      background: vars.tealBtn,
                      opacity: 0.7,
                    },
                  }}
                >
                  {sendOtpLoading ? "Sending..." : "Send OTP"}
                </Button>
              </>
            ) : (
              <>
                {/* OTP and Password Fields */}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={labelSx}>Enter OTP *</Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
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

                <Box sx={{ mb: 2 }}>
                  <Typography sx={labelSx}>New Password *</Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter new password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
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
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                            size="small"
                            sx={{ color: "#9ca3af", mr: 0.5 }}
                          >
                            {showNewPassword ? (
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

                <Box sx={{ mb: 2 }}>
                  <Typography sx={labelSx}>Confirm Password *</Typography>
                  <TextField
                    fullWidth
                    placeholder="Confirm new password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#fff",
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
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            size="small"
                            sx={{ color: "#9ca3af", mr: 0.5 }}
                          >
                            {showConfirmPassword ? (
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

                {error && (
                  <Typography
                    sx={{
                      color: "#F87171",
                      fontSize: { xs: "13px", sm: "14px" },
                      mb: 2,
                    }}
                  >
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  disabled={resetLoading}
                  sx={{
                    height: { xs: "44px", sm: "48px" },
                    borderRadius: "50px",
                    background: vars.tealBtn,
                    color: "#000",
                    fontWeight: 700,
                    fontSize: { xs: "14px", sm: "16px" },
                    textTransform: "none",
                    boxShadow: "none",
                    mt: 1,
                    "&:hover": { background: vars.tealBtnDark, color: white },
                    "&.Mui-disabled": {
                      background: vars.tealBtn,
                      opacity: 0.7,
                    },
                  }}
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </>
            )}

            {/* Footer Link */}
            <Typography
              sx={{
                textAlign: "center",
                color: subtitleColor,
                fontSize: { xs: "13px", sm: "14px" },
                mt: 3,
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: signUpPurple,
                  fontWeight: 600,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
