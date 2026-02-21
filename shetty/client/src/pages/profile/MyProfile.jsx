import React, { useState, useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, changePasswordBySelf } from "../../redux/reducer/authReducer";
import { toast } from "react-toastify";
import api from "../../redux/api";
import {
  FiUser,
  FiLock,
  FiShield,
  FiCreditCard,
  FiArrowDownCircle,
  FiGift,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import "./MyProfile.css";

const DepositPage = lazy(() => import("../menu/DepositPage"));
const WithdrawPage = lazy(() => import("../menu/WithdrawPage"));
const CheckBonuses = lazy(() => import("./CheckBonuses"));

const navItems = [
  { id: "personal", label: "Personal Info", icon: FiUser },
  { id: "password", label: "Change Password", icon: FiLock },
  { id: "deposit", label: "Deposit", icon: FiCreditCard },
  { id: "withdraw", label: "Withdraw", icon: FiArrowDownCircle },
  { id: "bonuses", label: "Check Bonuses", icon: FiGift },
];

const MyProfile = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const authLoading = useSelector((state) => state.auth?.loading);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setForm({
        fullName: userInfo.name || userInfo.userName || "",
        email: userInfo.email || "",
        address: userInfo.address || "",
        city: userInfo.city || "",
        pincode: userInfo.pincode || "",
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => {
    if (userInfo) {
      setForm({
        fullName: userInfo.name || userInfo.userName || "",
        email: userInfo.email || "",
        address: userInfo.address || "",
        city: userInfo.city || "",
        pincode: userInfo.pincode || "",
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.post(
        "/update/user-profile",
        {
          email: form.email,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(getUser());
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePwReset = () => {
    setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handlePwSave = async () => {
    if (!pwForm.oldPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const result = await dispatch(
      changePasswordBySelf({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      })
    );

    if (changePasswordBySelf.fulfilled.match(result)) {
      toast.success(
        result.payload?.message || "Password changed successfully!"
      );
      handlePwReset();
    } else {
      toast.error(result.payload?.message || "Failed to change password");
    }
  };

  const displayName = userInfo?.name || userInfo?.userName || "User";
  const phone = userInfo?.phone || userInfo?.mobile || "";
  const username = userInfo?.userName || userInfo?.username || "";
  const exposure = (userInfo?.exposure ?? 0).toFixed(0);
  const balance = (userInfo?.avbalance ?? 0).toFixed(0);
  const bonus = (userInfo?.bonus ?? 0).toFixed(0);

  return (
    <div className="profile-page">
      {/* Left Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <div className="profile-avatar-placeholder">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <div className="profile-username">{displayName}</div>

        <div className="profile-stats">
          <div className="profile-stat-box">
            <div className="profile-stat-value">{exposure}</div>
            <div className="profile-stat-label">Exposure Credited</div>
          </div>
          <div className="profile-stat-box">
            <div className="profile-stat-value">{balance}</div>
            <div className="profile-stat-label">Available Balance</div>
          </div>
          <div className="profile-stat-box">
            <div className="profile-stat-value">{bonus}</div>
            <div className="profile-stat-label">Bonus Rewarded</div>
          </div>
        </div>

        <div className="profile-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`profile-nav-item ${item.id === activeTab ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content */}
      <div className="profile-content">
        {activeTab === "personal" && (
          <>
            <div className="profile-header">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="profile-header-title">My Profile</span>
            </div>

            <div className="profile-form">
              <div className="profile-field">
                <div className="profile-field-label">Full Name</div>
                <input
                  type="text"
                  className="profile-field-input"
                  value={form.fullName}
                  disabled
                />
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Username</div>
                <input
                  type="text"
                  className="profile-field-input"
                  value={username}
                  disabled
                />
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Phone Number</div>
                <input
                  type="text"
                  className="profile-field-input"
                  value={phone}
                  disabled
                />
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Email Address</div>
                <input
                  type="email"
                  name="email"
                  className="profile-field-input"
                  placeholder="Enter"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Address</div>
                <input
                  type="text"
                  name="address"
                  className="profile-field-input"
                  placeholder="Enter"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <div className="profile-field-label">City</div>
                <input
                  type="text"
                  name="city"
                  className="profile-field-input"
                  placeholder="Enter"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Pincode</div>
                <input
                  type="text"
                  name="pincode"
                  className="profile-field-input"
                  placeholder="Enter"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="profile-buttons">
                <button className="profile-btn-reset" onClick={handleReset}>
                  Reset
                </button>
                <button
                  className="profile-btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "password" && (
          <>
            <div className="profile-header">
              <FiLock style={{ width: 18, height: 18, color: "#04a0e2" }} />
              <span className="profile-header-title">Change Password</span>
            </div>

            <div className="profile-form">
              <div className="profile-field">
                <div className="profile-field-label">Old Password</div>
                <div className="profile-pw-wrapper">
                  <input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    className="profile-field-input profile-pw-input"
                    placeholder="Enter old password"
                    value={pwForm.oldPassword}
                    onChange={handlePwChange}
                  />
                  <button
                    type="button"
                    className="profile-pw-toggle"
                    onClick={() => setShowOld((v) => !v)}
                  >
                    {showOld ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <div className="profile-field-label">New Password</div>
                <div className="profile-pw-wrapper">
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    className="profile-field-input profile-pw-input"
                    placeholder="Enter new password"
                    value={pwForm.newPassword}
                    onChange={handlePwChange}
                  />
                  <button
                    type="button"
                    className="profile-pw-toggle"
                    onClick={() => setShowNew((v) => !v)}
                  >
                    {showNew ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="profile-field">
                <div className="profile-field-label">Confirm New Password</div>
                <div className="profile-pw-wrapper">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    className="profile-field-input profile-pw-input"
                    placeholder="Re-enter new password"
                    value={pwForm.confirmPassword}
                    onChange={handlePwChange}
                  />
                  <button
                    type="button"
                    className="profile-pw-toggle"
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="profile-buttons">
                <button className="profile-btn-reset" onClick={handlePwReset}>
                  Reset
                </button>
                <button
                  className="profile-btn-save"
                  onClick={handlePwSave}
                  disabled={authLoading}
                >
                  {authLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "deposit" && (
          <Suspense
            fallback={
              <div className="profile-tab-loader">
                <div className="profile-spinner" />
              </div>
            }
          >
            <DepositPage />
          </Suspense>
        )}

        {activeTab === "withdraw" && (
          <Suspense
            fallback={
              <div className="profile-tab-loader">
                <div className="profile-spinner" />
              </div>
            }
          >
            <WithdrawPage />
          </Suspense>
        )}

        {activeTab === "bonuses" && (
          <Suspense
            fallback={
              <div className="profile-tab-loader">
                <div className="profile-spinner" />
              </div>
            }
          >
            <CheckBonuses />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
