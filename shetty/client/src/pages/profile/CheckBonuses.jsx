import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../redux/api";
import { FiSearch } from "react-icons/fi";

const CheckBonuses = () => {
  const [couponCode, setCouponCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [bonuses, setBonuses] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setSearching(true);
    try {
      const response = await api.post(
        "/redeem/bonus",
        { couponCode: couponCode.trim() },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Coupon redeemed successfully!");
        setCouponCode("");
      } else {
        toast.error(response.data.message || "Invalid coupon code");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to redeem coupon code"
      );
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="check-bonuses-ctn">
      <div className="bonus-redeem-card">
        <h3 className="bonus-redeem-title">Redeem bonus with coupon code</h3>
        <div className="bonus-redeem-row">
          <input
            type="text"
            className="bonus-coupon-input"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bonus-search-btn"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? "..." : "SEARCH"}
          </button>
        </div>
      </div>

      <div className="bonus-pending-section">
        {bonuses.length === 0 && (
          <p className="bonus-empty-msg">No pending bonus to claim</p>
        )}

        {bonuses.map((b, i) => (
          <div key={i} className="bonus-card">
            <span className="bonus-card-type">{b.type}</span>
            <span className="bonus-card-amount">{b.amount}</span>
            <span className="bonus-card-status">{b.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckBonuses;
