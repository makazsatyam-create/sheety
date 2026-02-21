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
} from "@mui/material";
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

    // Optional: show credentials in input fields
    setUsername(demoUsername);
    setPassword(demoPassword);

    dispatch(loginUser({ userName: demoUsername, password: demoPassword }))
      .unwrap()
      .then(() => navigate("/home", { replace: true }))
      .catch(() => {});
  };

  return (
    <Box
      className="login-ctn"
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
      {/* 1st: .title-row - logo above the card */}
      <Box
        className="title-row"
        sx={{
          textAlign: "center",
          cursor: "pointer",
          flexShrink: 0,
          paddingTop: "20px",
        }}
      >
        <span
          style={{ fontSize: "22px", fontWeight: "bold", color: "#04a0e2" }}
        >
          shetty777.online
        </span>
      </Box>

      {/* 2nd: .login-card - sits below logo in flow */}
      <Box
        className="login-card"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {/* .login-form-page - flex column wrapper */}
        <Box
          className="login-form-page"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <form class="login-form-ctn"> - form element with card styling */}
          <Box
            component="form"
            className="login-form-ctn"
            autoComplete="off"
            onSubmit={handleLogin}
            sx={{
              width: "400px",
              display: "flex",
              padding: "10x 14px 5px",
              flexDirection: "column",
              background: "#071123",
              borderRadius: "16px 16px 0 0",
              border: `2px solid #04a0e2`,
              borderBottom: "none",
              boxSizing: "border-box",
            }}
          >
            {/* .back-icon */}
            <Box
              className="back-icon"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",

                color: "#ffffff",
              }}
            >
              <Box
                className="back"
                component="button"
                onClick={() => navigate(-1)}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ArrowBackIcon
                  sx={{
                    fontSize: 22,
                    color: "#fff",
                    width: ".7em",
                  }}
                />
                <span
                  style={{
                    marginLeft: "3px",
                    fontSize: "14px",
                    textAlign: "center",
                    display: "flex",
                    lineHeight: "18.9px",
                    fontWeight: 600,
                    alignItems: "center",
                  }}
                >
                  Back
                </span>
              </Box>
              <Button
                className="login-form-btn-demo"
                onClick={handleDemoLogin}
                disabled={loading}
                sx={{
                  background: "#008c95",
                  color: "#000000",
                  marginTop: "0px",
                  padding: "6px 12px",
                  borderRadius: "16px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Demo login
              </Button>
            </Box>

            {/* .card-title */}
            <Typography
              className="card-title"
              sx={{
                color: white,
                fontSize: "32px",
                fontWeight: 700,
                lineHeight: "43.2px",
                textAlign: "center",
              }}
            >
              Sign in
            </Typography>

            {/* .card-login-here */}
            <Typography
              className="card-login-here"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "21.6px",
                textAlign: "center",
                color: "#e0e0e0;",
              }}
            >
              Please enter your login details here.
            </Typography>

            {/* .usr-input - UPDATED */}
            {/* .usr-input - UPDATED */}
            <Box
              className="usr-input"
              sx={{ display: "inline-grid", marginTop: "5px", width: "100%" }}
            >
              <Typography
                sx={{
                  color: "#e0e0e0",
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: "150%",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "7px",
                }}
              >
                Username{" "}
                <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                variant="outlined"
                sx={{
                  maxWidth: "100%",
                  "& .MuiOutlinedInput-root": {
                    height: "48px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none", // Remove border completely
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // No border on focus
                      },
                    },
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none", // No border on hover
                      },
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    outline: "none",
                    padding: "16.5px 14px", // Adjust padding as needed
                  },
                }}
              />
            </Box>

            {/* .pwd-input - UPDATED */}
            <Box
              className="pwd-input"
              sx={{ display: "inline-grid", marginBottom: "10px" }}
            >
              <Typography
                sx={{
                  color: "#e0e0e0",
                  marginTop: "10px",
                  marginBottom: "7px",
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: "150%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Password{" "}
                <span style={{ color: redAsterisk, marginLeft: 4 }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "48px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden", // 🔥 important
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  },
                  "& .MuiInputAdornment-root": {
                    marginRight: 0, // 🔥 remove extra spacing
                  },
                  "& .MuiIconButton-root": {
                    padding: "8px", // cleaner alignment
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "14px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((p) => !p)}
                        edge="end"
                        sx={{
                          color: "#9ca3af",
                          "&:hover": {
                            color: vars.formCtnBorder,
                            background: "transparent", // 🔥 prevent grey hover bg
                          },
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
              />
            </Box>

            {/* .forgot-pwd */}
            {/* .forgot-pwd - UPDATED */}
            <Box
              className="forgot-pwd"
              sx={{
                textAlign: "right",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: "18.9px",
                fontWeight: 600,
                color: "#fff",
                margin: "12px 0",
                "& a": {
                  textDecoration: "none",
                  border: "none",
                  outline: "none",
                },
              }}
            >
              <Link
                component={RouterLink}
                to="/forgot-password"
                sx={{
                  textDecoration: "none",
                  color: "#fff",
                  border: "none",
                  outline: "none",
                  "&:hover": {
                    textDecoration: "underline", // Optional: add underline only on hover
                    border: "none",
                    outline: "none",
                  },
                  "&:focus": {
                    border: "none",
                    outline: "none",
                  },
                  "&:visited": {
                    border: "none",
                    outline: "none",
                  },
                }}
              >
                Forgot Username/Password?
              </Link>
            </Box>

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
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {error.message}
                </Typography>
              </Box>
            )}

            {/* .login-form-btn */}
            <Button
              type="submit"
              className="login-form-btn"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "15px",
                marginBottom: "20px",
                height: "44px",
                width: "48%",
                fontSize: "16px",
                borderRadius: "100px",
                background: "#008c95",
                color: "#ffffff",
                fontWeight: 700,
                border: "1px #fff",
                boxShadow: "none",
                textTransform: "uppercase",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: "2px solid #000",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                  <Typography component="span">Logging in...</Typography>
                </Box>
              ) : (
                <Typography
                  component="span"
                  sx={{
                    color: "#fff",
                    fontSize: "16px",
                    lineHeight: "21.6px",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  LOGIN
                </Typography>
              )}
            </Button>
          </Box>

          {/* .account-SignUp - connects to card with rounded bottom */}
          <Box
            className="account-SignUp"
            sx={{
              width: "400px",
              background: vars.ionBackgroundColor,
              padding: "10px 0",
              border: `2px solid #04a0e2`,
              borderTop: `1px solid #04a0e2`,
              marginTop: "-2px",
              borderRadius: "0 0 16px 16px",
              fontFamily: '"Lato", sans-serif',
              fontSize: 13,
              fontWeight: 600,
              lineHeight: "17.55px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#a4d4d4",
              }}
            >
              Don't have account?
            </Typography>
            <Link
              component="button"
              type="button"
              onClick={() => navigate("/signup")}
              sx={{
                color: "#fff",
                marginLeft: "3px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Sign Up
            </Link>
          </Box>

          {/* .download-apk - direct child of .login-form-page */}
          <Box
            className="download-apk"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#66bb6a",
                cursor: "pointer",
                width: "400px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#5cb860" },
                marginTop: "0px",
              }}
            >
              <AndroidIcon
                className="android-icon"
                sx={{
                  color: white,
                  width: 20,
                  height: 20,
                  marginRight: "10px",
                }}
              />
              <span
                className="donwload-txt"
                style={{ color: white, fontWeight: 700 }}
              >
                Download .apk
              </span>
              <GetAppIcon
                className="donwload-icon"
                sx={{
                  color: white,
                  width: "10px",
                  height: "20px",
                  marginLeft: "10px",
                }}
              />
            </Button>
          </Box>

          {/* .socialMedia-login - direct child of .login-form-page */}
          <Box
            className="socialMedia-login"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "5px",
            }}
          >
            <Box
              className="sm-new-ctn"
              sx={{
                background: "none",
                border: "none",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                padding: "5px 0 10px",
              }}
            >
              <Box
                className="sm-new-links"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "0px",
                }}
              >
                <Button
                  className="sm-new-link"
                  component="a"
                  href="https://www.whatsapp.com/channel/0029Vb6K7XdJ93wXnxIeoW3o"
                  target="_blank"
                  variant="text"
                  disableElevation
                  startIcon={
                    <WhatsAppIcon sx={{ color: white, fontSize: 20 }} />
                  }
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
                    className="sm-text"
                    style={{
                      color: white,
                      textTransform: "uppercase",
                      fontSize: "10px",
                      padding: "5px",
                      fontFamily: "Satoshi, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    FOLLOW ON WHATSAPP
                  </span>
                </Button>
              </Box>
            </Box>
          </Box>

          {/* .disclaimer-ctn-text - direct child of .login-form-page */}
          <Box
            className="disclaimer-ctn-text"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Typography
              className="disclaimer-width"
              component="p"
              sx={{
                color: "#ece7f1",
                width: "60%",
                fontFamily: "General Sans, sans-serif",
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

export default Login;
