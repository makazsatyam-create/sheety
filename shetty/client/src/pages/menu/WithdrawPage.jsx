import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/reducer/authReducer";
import api from "../../redux/api";
import { toast } from "react-toastify";

const WithdrawPage = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth?.userInfo);
  const cashableAmount = (userInfo?.avbalance ?? 0).toFixed(2);

  const [selectedPaymentType, setSelectedPaymentType] = useState("bank");
  const [selectedOption, setSelectedOption] = useState(1);
  const [showEnterDetails, setShowEnterDetails] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0); // seconds remaining before resend
  const otpCooldownIntervalRef = useRef(null);

  // Bank form states
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [otp, setOtp] = useState("");

  // Crypto form states
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [walletAddress, setWalletAddress] = useState("");
  const [cryptoOtp, setCryptoOtp] = useState("");

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (otpCooldownIntervalRef.current) {
        clearInterval(otpCooldownIntervalRef.current);
      }
    };
  }, []);

  const handleAddAccount = () => {
    setShowEnterDetails(true);
  };

  const handleSendOtp = async () => {
    if (sendingOtp || otpCooldown > 0) return;
    setSendingOtp(true);
    try {
      const response = await api.post("/send-withdrawal-otp");
      if (response.data && response.data.message) {
        toast.success(response.data.message);
        if (otpCooldownIntervalRef.current) clearInterval(otpCooldownIntervalRef.current);
        setOtpCooldown(60); // 60 second cooldown
        otpCooldownIntervalRef.current = setInterval(() => {
          setOtpCooldown((prev) => {
            if (prev <= 1) {
              if (otpCooldownIntervalRef.current) {
                clearInterval(otpCooldownIntervalRef.current);
                otpCooldownIntervalRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleAddBank = async () => {
    if (
      !accountNumber ||
      !accountHolderName ||
      !bankName ||
      !ifscCode
    ) {
      toast.error("Please fill all required account details");
      return;
    }
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    if (parseFloat(withdrawalAmount) > parseFloat(cashableAmount)) {
      toast.error("Insufficient balance");
      return;
    }
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setSubmitting(true);
    try {
      const optionStr = `option${selectedOption}`;
      
      const withdrawalData = {
        amount: parseFloat(withdrawalAmount),
        paymentType: "bank",
        option: optionStr,
        accountNumber: accountNumber.trim(),
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        branchName: branchName.trim() || undefined,
        ifscCode: ifscCode.trim().toUpperCase(),
        remark: `Withdrawal via Bank - ${optionStr}`,
        otp: String(otp).trim(),
      };

      const response = await api.post("/withdrawal-request", withdrawalData);

      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully! It will be processed after admin approval.");
        resetBankForm();
        setWithdrawalAmount("");
        dispatch(getUser()); // Refresh user balance
      } else {
        toast.error(response.data.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error(error.response?.data?.message || "Failed to submit withdrawal request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddWallet = async () => {
    if (!selectedCurrency) {
      toast.error("Please select a currency");
      return;
    }
    if (!walletAddress) {
      toast.error("Please enter wallet address");
      return;
    }
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }
    if (parseFloat(withdrawalAmount) > parseFloat(cashableAmount)) {
      toast.error("Insufficient balance");
      return;
    }
    if (!cryptoOtp) {
      toast.error("Please enter OTP");
      return;
    }

    setSubmitting(true);
    try {
      const withdrawalData = {
        amount: parseFloat(withdrawalAmount),
        paymentType: "crypto",
        currency: selectedCurrency,
        walletAddress: walletAddress.trim(),
        remark: `Withdrawal via Crypto - ${selectedCurrency}`,
        otp: String(cryptoOtp).trim(),
      };

      const response = await api.post("/withdrawal-request", withdrawalData);

      if (response.data.success) {
        toast.success("Withdrawal request submitted successfully! It will be processed after admin approval.");
        resetCryptoForm();
        setWithdrawalAmount("");
        dispatch(getUser()); // Refresh user balance
      } else {
        toast.error(response.data.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error(error.response?.data?.message || "Failed to submit withdrawal request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetBankForm = () => {
    setShowEnterDetails(false);
    setAccountNumber("");
    setAccountHolderName("");
    setBankName("");
    setBranchName("");
    setIfscCode("");
    setOtp("");
    setWithdrawalAmount("");
  };

  const resetCryptoForm = () => {
    setShowEnterDetails(false);
    setSelectedCurrency("USDT");
    setWalletAddress("");
    setCryptoOtp("");
    setWithdrawalAmount("");
  };

  const handleCloseEnterDetails = () => {
    setShowEnterDetails(false);
  };

  const renderBankForm = () => (
    <div className="withdraw-enter-details">
      <div className="form-title">Enter Bank Details</div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Withdrawal Amount (INR)</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter amount to withdraw"
          value={withdrawalAmount}
          onChange={(e) => setWithdrawalAmount(e.target.value.replace(/\D/g, ""))}
        />
        <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>
          Available Balance: ₹{cashableAmount}
        </div>
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Account Number</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Account Holder Name</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter Account Holder Name"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
        />
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Bank Name</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
        />
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Branch Name</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter Branch Name"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">IFSC Code</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter IFSC Code"
          value={ifscCode}
          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
        />
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">OTP Verification</label>
        <div className="withdraw-otp-row">
          <div>
            <input
              type="text"
              className="withdraw-form-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
            />
          </div>
          <button
            type="button"
            className="withdraw-send-otp-btn"
            onClick={handleSendOtp}
            disabled={sendingOtp || otpCooldown > 0}
            style={{ opacity: sendingOtp || otpCooldown > 0 ? 0.7 : 1, cursor: sendingOtp || otpCooldown > 0 ? "not-allowed" : "pointer" }}
          >
            {sendingOtp ? "Sending..." : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Send OTP"}
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="withdraw-add-btn"
          onClick={handleAddBank}
          disabled={submitting}
          style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        >
          {submitting ? "Submitting..." : "SUBMIT WITHDRAWAL REQUEST"}
        </button>
        <button
          type="button"
          className="withdraw-close-btn"
          onClick={handleCloseEnterDetails}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderCryptoForm = () => (
    <div className="withdraw-enter-details">
      <div className="form-title">Add Wallet</div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Withdrawal Amount (INR)</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter amount to withdraw"
          value={withdrawalAmount}
          onChange={(e) => setWithdrawalAmount(e.target.value.replace(/\D/g, ""))}
        />
        <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "4px" }}>
          Available Balance: ₹{cashableAmount}
        </div>
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Select Currency</label>
        <select
          className="withdraw-form-input"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          style={{ appearance: "auto" }}
        >
          <option value="USDT">USDT</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="BNB">BNB</option>
          <option value="SOL">SOL</option>
        </select>
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">Enter Wallet Address</label>
        <input
          type="text"
          className="withdraw-form-input"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      </div>

      <div className="withdraw-form-group">
        <label className="withdraw-form-label">OTP Verification</label>
        <div className="withdraw-otp-row">
          <div>
            <input
              type="text"
              className="withdraw-form-input"
              placeholder="Enter OTP"
              value={cryptoOtp}
              onChange={(e) => setCryptoOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
            />
          </div>
          <button
            type="button"
            className="withdraw-send-otp-btn"
            onClick={handleSendOtp}
            disabled={sendingOtp || otpCooldown > 0}
            style={{ opacity: sendingOtp || otpCooldown > 0 ? 0.7 : 1, cursor: sendingOtp || otpCooldown > 0 ? "not-allowed" : "pointer" }}
          >
            {sendingOtp ? "Sending..." : otpCooldown > 0 ? `Resend in ${otpCooldown}s` : "Send OTP"}
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="withdraw-add-btn"
          onClick={handleAddWallet}
          disabled={submitting}
          style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
        >
          {submitting ? "Submitting..." : "SUBMIT WITHDRAWAL REQUEST"}
        </button>
        <button
          type="button"
          className="withdraw-close-btn"
          onClick={handleCloseEnterDetails}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="withdraw-router-ctn">
      <style>{`
        .withdraw-router-ctn {
          width: 100%;
        }
        .withdraw-ctn {
          min-height: 83vh;
          margin: 12px 24px;
          background: #122036;
          padding: 16px 12px;
          border-radius: 15px;
          position: relative;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .withdraw-ctn {
            margin: 10px 8px;
            padding: 12px 8px;
          }
        }
        @media (max-width: 480px) {
          .withdraw-ctn {
            margin: 8px 4px;
            padding: 10px 6px;
            border-radius: 10px;
          }
        }

        .withdraw-header {
          width: 100%;
          background: #212e44;
          border-radius: 15px;
          font-family: "Lato";
          margin-bottom: 20px;
          padding: 12px;
          box-sizing: border-box;
        }

        .withdraw-header .withdraw-img-title {
          height: 42px;
          display: flex;
          align-items: center;
          background: #071123;
          border: 1px solid #04a0e2;
          border-radius: 25px;
          padding: 0 16px;
          margin-bottom: 12px;
        }

        .withdraw-header .withdraw-img-title .withdraw-title {
          color: #fff;
          font-size: 16px;
          text-transform: uppercase;
          font-family: "Lato";
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .withdraw-header .withdraw-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          color: #9ca3af;
          font-size: 13px;
          padding: 0 8px;
        }

        @media (max-width: 480px) {
          .withdraw-header {
            padding: 8px;
            border-radius: 10px;
            margin-bottom: 12px;
          }
          .withdraw-header .withdraw-img-title {
            height: 36px;
            padding: 0 10px;
            margin-bottom: 8px;
          }
          .withdraw-header .withdraw-img-title .withdraw-title {
            font-size: 13px;
          }
          .withdraw-header .withdraw-info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            font-size: 11px;
            padding: 0 4px;
          }
        }

/* Remove the old .withdraw-info-row from outside */

        .withdraw-payment-type-btn {
          min-height: 36px;
          padding: 8px 20px;
          border-radius: 32px;
          font-size: 13px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #fff;
          background: transparent;
          color: #fff;
          margin-right: 6px;
          margin-top: 10px;
        }
        @media (max-width: 480px) {
          .withdraw-payment-type-btn {
            padding: 6px 14px;
            font-size: 12px;
            margin-right: 4px;
            margin-top: 8px;
          }
        }
        .withdraw-payment-type-btn.selected {
          background: #01fafe;
          color: #000;
          border-color: #01fafe;
        }
        .withdraw-payment-type-btn:not(.selected):hover {
          border-color: #fff;
        }

        .withdraw-option-label {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          margin: 20px 0 12px 0;
          display: block;
        }
        @media (max-width: 480px) {
          .withdraw-option-label {
            font-size: 12px;
            margin: 14px 0 8px 0;
          }
        }

        .withdraw-accounts-section {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 24px;
        }
        .withdraw-add-account-card {
          width: 140px;
          height: 140px;
          min-width: 100px;
          min-height: 100px;
          border: 1px dashed #fff;
          border-radius: 10px;
          background: transparent;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #fff;
        }
        
        .withdraw-add-account-card .plus-icon {
          font-size: 32px;
          font-weight: 300;
          line-height: 1;
          margin-bottom: 8px;
        }
        .withdraw-add-account-card span {
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }
        @media (max-width: 768px) {
          .withdraw-add-account-card {
            width: 120px;
            height: 120px;
          }
        }
        @media (max-width: 480px) {
          .withdraw-add-account-card {
            width: 100px;
            height: 100px;
            min-width: 80px;
            min-height: 80px;
          }
          .withdraw-add-account-card .plus-icon {
            font-size: 26px;
          }
          .withdraw-add-account-card span {
            font-size: 11px;
          }
        }

        /* Form styles */
        .withdraw-enter-details {
          margin-top: 24px;
          width: 100%;
          max-width: 100%;
        }
        @media (max-width: 768px) {
          .withdraw-enter-details {
            max-width: 100%;
          }
        }
        
        .withdraw-enter-details .form-title {
          font-family: "Lato", sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 30px;
        }

        .withdraw-enter-details .withdraw-form-group {
          margin-bottom: 30px;
          position: relative;
          color: #fff;
        }
        @media (max-width: 480px) {
          .withdraw-enter-details .withdraw-form-group {
            margin-bottom: 22px;
          }
          .withdraw-enter-details .form-title {
            font-size: 16px;
            margin-bottom: 20px;
          }
        }

        .withdraw-enter-details .withdraw-form-label {
          width: auto;
          max-width: 230px;
          text-transform: capitalize;
          padding: 0 12px 0 15px;
          border-radius: 30px;
          border: 1px solid #008c95;
          background: #071123;
          position: absolute;
          left: 15px;
          top: -12px;
          font-family: "Lato", sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          color: #fff;
          z-index: 2;
          display: inline-block;
          line-height: 24px;
          height: 24px;
          min-width: 120px;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        @media (max-width: 480px) {
          .withdraw-enter-details .withdraw-form-label {
            max-width: 80%;
            font-size: 11px;
            left: 10px;
            min-width: 0;
          }
        }

        .withdraw-enter-details .withdraw-form-input {
          background: #3d4a62;
          border: 1px solid #334155;
          border-radius: 50px;
          padding: 14px 30px;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          width: 100%;
          outline: none;
          font-family: "Lato", sans-serif;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        @media (max-width: 480px) {
          .withdraw-enter-details .withdraw-form-input {
            padding: 12px 16px;
            font-size: 12px;
          }
        }

        .withdraw-enter-details .withdraw-form-input:focus {
          border-color: #008c95;
          box-shadow: 0 0 0 1px rgba(0, 140, 149, 0.3);
        }

        .withdraw-enter-details .withdraw-form-input::placeholder {
          color: #a0aec0;
          font-size: 12px;
        }

        .withdraw-enter-details .withdraw-otp-row {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .withdraw-enter-details .withdraw-otp-row > div {
          flex: 1;
          min-width: 150px;
          position: relative;
          width: 100%;
        }

        .withdraw-enter-details .withdraw-form-group:last-of-type .withdraw-otp-row > div {
          width: auto;
        }

        .withdraw-enter-details .withdraw-send-otp-btn {
          background: transparent;
          border: 1px solid #008c95;
          border-radius: 50px;
          padding: 14px 24px;
          color: #fff;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: "Lato", sans-serif;
          white-space: nowrap;
          transition: all 0.3s ease;
          min-height: 48px;
          letter-spacing: 0.5px;
        }
        @media (max-width: 480px) {
          .withdraw-enter-details .withdraw-send-otp-btn {
            padding: 10px 16px;
            font-size: 12px;
            min-height: 42px;
          }
        }

        .withdraw-enter-details .withdraw-send-otp-btn:hover {
          background: #008c95;
          color: #fff;
        }

        .withdraw-enter-details .withdraw-add-btn {
          background: #00E0FF;
          color: #101826;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          padding: 14px 48px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 16px;
          margin-right: 12px;
          text-transform: uppercase;
          font-family: "Lato", sans-serif;
          letter-spacing: 0.5px;
          min-width: 120px;
        }
        @media (max-width: 480px) {
          .withdraw-enter-details .withdraw-add-btn {
            padding: 12px 20px;
            font-size: 13px;
            min-width: 0;
          }
        }

        .withdraw-enter-details .withdraw-add-btn:hover {
          background: #00b8d4;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 224, 255, 0.3);
        }

        .withdraw-enter-details .withdraw-close-btn {
          background: transparent;
          color: #9ca3af;
          border: 1px solid #6A7488;
          border-radius: 50px;
          padding: 14px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: "Lato", sans-serif;
          min-width: 100px;
        }

        .withdraw-enter-details .withdraw-close-btn:hover {
          color: #fff;
          border-color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .withdraw-enter-details .withdraw-form-group:first-of-type {
          margin-top: 5px;
        }

        .withdraw-enter-details input,
        .withdraw-enter-details select {
          position: relative;
          z-index: 1;
        }

        /* Style for select dropdown */
        .withdraw-enter-details select {
          cursor: pointer;
        }

        .withdraw-enter-details select option {
          background: #122036;
          color: #fff;
        }

        @media (max-width: 480px) {
          .withdraw-enter-details .withdraw-otp-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .withdraw-enter-details .withdraw-otp-row > div {
            min-width: 100%;
          }
          
          .withdraw-enter-details .withdraw-send-otp-btn {
            width: 100%;
          }
          
          .withdraw-enter-details .withdraw-add-btn,
          .withdraw-enter-details .withdraw-close-btn {
            width: 100%;
            margin-right: 0;
            margin-bottom: 10px;
          }
        }
      `}</style>

      <div className="withdraw-ctn">
        <div className="withdraw-header">
          <div className="withdraw-img-title">
            <span className="withdraw-title">Withdraw</span>
          </div>
          <div className="withdraw-info-row">
            <span>Following Payment Withdrawal Information::</span>
            <span>Cashable Amount : ₹{cashableAmount}</span>
          </div>
        </div>

        <div>
          <button
            onClick={() => {
              setSelectedPaymentType("bank");
              setShowEnterDetails(false);
            }}
            className={`withdraw-payment-type-btn ${selectedPaymentType === "bank" ? "selected" : ""}`}
          >
            BANK
          </button>
          <button
            onClick={() => {
              setSelectedPaymentType("crypto");
              setShowEnterDetails(false);
            }}
            className={`withdraw-payment-type-btn ${selectedPaymentType === "crypto" ? "selected" : ""}`}
          >
            CRYPTO
          </button>
        </div>

        {selectedPaymentType === "bank" && (
          <>
            <label className="withdraw-option-label">
              Choose Payment Option
            </label>
            <div>
              <button
                onClick={() => setSelectedOption(1)}
                className={`withdraw-payment-type-btn ${selectedOption === 1 ? "selected" : ""}`}
              >
                OPTION 1
              </button>
              <button
                onClick={() => setSelectedOption(2)}
                className={`withdraw-payment-type-btn ${selectedOption === 2 ? "selected" : ""}`}
              >
                OPTION 2
              </button>
              <button
                onClick={() => setSelectedOption(3)}
                className={`withdraw-payment-type-btn ${selectedOption === 3 ? "selected" : ""}`}
              >
                OPTION 3
              </button>
            </div>
          </>
        )}

        <div className="withdraw-accounts-section">
          <div className="withdraw-add-account-card" onClick={handleAddAccount}>
            <span className="plus-icon">+</span>
            <span>
              {selectedPaymentType === "bank" ? "Add Account" : "Add Wallet"}
            </span>
          </div>
        </div>

        {showEnterDetails &&
          (selectedPaymentType === "bank"
            ? renderBankForm()
            : renderCryptoForm())}
      </div>
    </div>
  );
};

export default WithdrawPage;
