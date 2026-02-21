import React, { useState, useEffect } from "react";
import api from "../../redux/api";
import { toast } from "react-toastify";

const DepositPage = () => {
  const [amount, setAmount] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("IMPS");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageBase64, setImageBase64] = useState("");
  const [step, setStep] = useState(1); // Step 1: Amount Entry, Step 2: Details Entry
  const [selectedPaymentType, setSelectedPaymentType] = useState("bank"); // bank, upi, crypto, whatsapp
  const [selectedOption, setSelectedOption] = useState(1); // 1, 2, 3
  const [selectedBonus, setSelectedBonus] = useState("ftd500"); // bonus type
  const [accounts, setAccounts] = useState({
    bank: null,
    upi: null,
    crypto: null,
  });
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch accounts based on payment type and option
  useEffect(() => {
    const fetchAccounts = async () => {
      if (selectedPaymentType === "whatsapp") return; // Skip for whatsapp

      setLoadingAccounts(true);
      try {
        const optionStr = `option${selectedOption}`;
        const type = selectedPaymentType === "bank" ? "bank" : selectedPaymentType === "upi" ? "upi" : "crypto";
        
        const response = await api.get("/account/public/list", {
          params: {
            type: type,
            option: optionStr,
          },
        });

        if (response.data.success && response.data.data.length > 0) {
          const account = response.data.data[0]; // Get first matching account
          setAccounts((prev) => ({
            ...prev,
            [type]: account,
          }));
        } else {
          setAccounts((prev) => ({
            ...prev,
            [type]: null,
          }));
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts((prev) => ({
          ...prev,
          [selectedPaymentType]: null,
        }));
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [selectedPaymentType, selectedOption]);

  const handlePresetClick = (value) => {
    setAmount(value.replace("+", ""));
  };

  const handleClear = () => {
    setAmount("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageName(file.name);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (amount && amount !== "0") {
      setStep(2);
    } else {
      alert("Please enter an amount to proceed");
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleConfirm = async () => {
    // Validation
    if (!amount || amount === "0" || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (selectedPaymentType === "bank" && !referenceId.trim()) {
      toast.error("Please enter Reference ID/UTR");
      return;
    }

    setSubmitting(true);
    try {
      const optionStr = `option${selectedOption}`;
      
      const depositData = {
        amount: parseFloat(amount),
        paymentType: selectedPaymentType,
        option: optionStr,
        referenceId: referenceId.trim() || undefined,
        paymentMethod: selectedPaymentType === "bank" ? selectedMethod : undefined,
        bonusType: selectedBonus,
        image: imageBase64 || undefined,
        remark: `Deposit via ${selectedPaymentType.toUpperCase()} - ${optionStr}`,
      };

      const response = await api.post("/deposit-request", depositData);

      if (response.data.success) {
        toast.success("Deposit request submitted successfully! It will be processed after admin approval.");
        
        // Reset form
        setAmount("");
        setReferenceId("");
        setSelectedImage(null);
        setImageName("");
        setImageBase64("");
        setStep(1);
        setSelectedPaymentType("bank");
        setSelectedOption(1);
        setSelectedBonus("ftd500");
        setSelectedMethod("IMPS");
      } else {
        toast.error(response.data.message || "Failed to submit deposit request");
      }
    } catch (error) {
      console.error("Error submitting deposit request:", error);
      toast.error(error.response?.data?.message || "Failed to submit deposit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard!"));
  };

  return (
    <div className="router-ctn">
      <style>{`
        .router-ctn {
          width: 100%;
        }
        
        .deposit-ctn-new {
          background: #122036;
          margin: 12px 24px;
          min-height: 80vh;
          border-radius: 15px;
          padding: 12px 16px;
          position: relative;
        }

        /* Report Header Styles */
        .report-header {
          width: 100%;
          background: #212e44;
          height: fit-content;
          border-radius: 15px;
          font-family: "Lato";
        }

        .report-header .report-img-title {
          justify-content: space-between;
          height: 32px;
          display: flex;
          align-items: center;
          background: #071123;
          border: 1px solid #04a0e2;
          border-radius: 25px;
        }

        .report-header .report-img-div-title {
          display: flex;
          align-items: center;
        }

        .report-header .report-img-div-title .report-img-div {
          background: var(--reports-header-icon-bg-color);
          height: 20px;
          width: 20px;
          margin: 6px;
          border-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .report-header .report-img-div-title .report-img-div .report-img {
          height: 12px;
          width: 12px;
          filter: var(--reports-header-icon-color);
        }

        .report-header .report-img-div-title .report-title {
          color: #fff;
          font-size: 13px;
          text-transform: uppercase;
          font-family: var(--headers-font-family);
          font-weight: 900;
          margin-left: 5px;
          letter-spacing: 0.5px;
        }

        .report-header .report-img-title .tab-btns {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        /* Report Filters */
        .deposit-ctn-new .report-header .report-filters {
          justify-content: flex-start;
          align-items: center;
          font-family: "Lato";
        }

        .deposit-ctn-new .report-header .report-filters .deposit-header-text {
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          margin: 9px 32px;
          text-transform: capitalize;
        }

        /* Disclaimer - grey, smaller font per design */
        .deposit-form-ctn .disclaimer-msg {
          color: #9ca3af;
          font-size: 12px;
          font-style: normal;
        }

        .deposit-form-ctn .disclaimer-msg, 
        .deposit-form-ctn .pg-down-msg {
          display: block;
          padding: 0;
          line-height: normal;
          word-wrap: break-word;
          overflow-wrap: break-word;
          margin: 8px auto;
        }

        /* Payment type buttons - BANK (cyan when selected), UPI/CRYPTO (white border), WHATSAPP (green when selected) */
        .deposit-payment-type-btn {
          min-height: 36px;
          padding: 6px 12px;
          border-radius: 32px;
          font-size: 0.875rem;
          line-height: 1.75;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.02857em;
          cursor: pointer;
          transition: all 0.2s ease;
          border:1px solid #fff;
          background: transparent;
          margin-right:6px;
          height:auto !important;
          min-width:160px;
          margin-top:10px;
          color: #fff;
        }
        .deposit-payment-type-btn:hover {
          border-color: #fff;
        }
        .deposit-payment-type-btn.selected-bank {
          background: #01fafe;
          font-weight: bolder;
          color: #000;
          border:0;
          border-color: #00d4ff;
        }
        /* For WhatsApp button when selected */
        .deposit-payment-type-btn.selected-whatsapp {
          padding: 5px 9px !important;
          background: #22c55e !important;
          color: #fff !important;
          min-width: 72px !important;
          border: 1px solid #fff !important;
          animation: blink-btn 1s infinite;
        }

        /* For WhatsApp button in normal state (always animated) */
        .deposit-payment-type-btn.whatsapp-normal {
          padding: 5px 9px !important;
          min-width: 72px !important;
          animation: blink-btn 1s infinite;
          background: transparent;
          color: #fff;
          border: 1px solid #fff;
        }

        @keyframes blink-btn {
          0% { opacity: 1; }
          50% { opacity: 0.7; background: #16a34a; }
          100% { opacity: 1; }
        }
        .deposit-payment-type-btn.selected-upi,
        .deposit-payment-type-btn.selected-crypto {
          background: #01fafe;
          font-weight: bolder;
          color: #000;
          border-color: 0;
        }

        /* Option buttons - OPTION 1 (cyan), OPTION 2/3 (white border) */
        .deposit-option-btn {
           min-height: 36px;
          padding: 6px 12px;
          border-radius: 32px;
          font-size: 0.875rem;
          line-height: 1.75;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-transform: uppercase;
          letter-spacing: 0.02857em;
          cursor: pointer;
          transition: all 0.2s ease;
          border:1px solid #fff;
          background: transparent;
          margin-right:6px;
          height:auto !important;
          min-width:160px;
          margin-top:0px;
          color: #fff;
          font-weight: bolder;
        }
        .deposit-option-btn.selected {
          background: #01fafe;
          color: #000;
          border-color: #fff;
          font-weight: bolder;
        }
        .deposit-option-btn:not(.selected):hover {
          border-color: #fff;
        }

        /* Amount Buttons - grey background, white text, rounded */
        .deposit-form-ctn .amount-btn {
          margin-top: 5px;
          flex: 1;
          width: calc(33% - 5px);
          min-width: calc(33% - 8px);
          box-sizing: border-box;
          border-radius: 100px;
          font-family: "Lato", var(--headers-font-family), sans-serif;
          font-style: normal;
          text-transform: capitalize;
          font-size: 10px;
          font-weight: 400;
          line-height: 13.5px;
          text-align: center;
          background: #212e44;
          color: #fff;
          padding: 10px 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 0px;
          margin-bottom: 4px;
        }
        .deposit-form-ctn .amount-btn:hover {
          background: #3a4a5e;
        }

        /* UPI QR Section */
        /* UPI QR Section */
.deposit-upi-section {
  margin: 24px 0;
  padding: 20px;
  background: #1a2639;
  border-radius: 12px;
  border: 1px solid #04a0e2;
}

.deposit-upi-section .upi-instruction-banner {
  background: #00b8d4;
  border: 1px solid #fff;
  border-radius: 12px;
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  padding: 12px 16px;
  margin: 16px 0 20px 0;
  text-align: center;
  line-height: 1.5;
}

.deposit-upi-section .upi-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.deposit-upi-section .upi-qr {
  width: 140px;
  height: 140px;
  background: #fff;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.deposit-upi-section .upi-qr img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.deposit-upi-section .upi-details {
  flex: 1;
}

.deposit-upi-section .upi-id-label {
  color: #fff;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.deposit-upi-section .upi-id-value {
  background: #00E0FF;
  color: #101826;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.deposit-upi-section .upi-copy-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  color: #101826;
  margin-left: 4px;
}

.deposit-upi-section .upi-copy-btn:hover {
  opacity: 0.8;
}

.deposit-upi-section .upi-copy-btn svg {
  width: 18px;
  height: 18px;
}

        .payment-method-btn {
          padding: 6px 18px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
          cursor: pointer;
          border: 1.5px solid #04a0e2;
          min-height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .payment-method-btn.active {
          background: #04a0e2;
          color: white;
        }
        
        .payment-method-btn.inactive {
          background: transparent;
          color: #fff;
          border-color: rgba(4, 160, 226, 0.5);
        }
        
        .payment-method-btn.inactive:hover {
          border-color: #04a0e2;
          color: #04a0e2;
        }

        /* Step Indicator Styles */
        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 15px 0 5px 0;
          gap: 8px;
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3a4a5e;
          transition: all 0.3s ease;
        }

        .step-dot.active {
          background: #04a0e2;
          width: 24px;
          border-radius: 12px;
        }

        .next-btn {
          background: #3d4a62;
          color: #000000;
          font-size:16px;
          border: 1px solid #fff;
          padding: 12px 40px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 120px;
          margin-top: 20px;
          border-radius: 100px;
          margin:5px;
        }

        .next-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: #fff;
        }

        /* Note - orange/yellow text */
        .deposit-note {
          color: orange;
          font-size: small;
          display: block;
          padding: 0;
          margin: 8px 0;
          line-height: normal;
        }

        /* Amount input field */
        .deposit-amount-input-ctn {
          margin-top: 16px;
        }
        .deposit-amount-label {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          display: block;
          margin-bottom: 8px;
        }
        .deposit-amount-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .deposit-amount-input {
          flex: 1;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 14px;
          outline: none;
        }
        .deposit-amount-input::placeholder {
          color: #64748b;
        }
        .deposit-amount-input:focus {
          border-color: #00d4ff;
        }
        .deposit-clear-btn {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .deposit-clear-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .back-btn {
          background: transparent;
          color: #04a0e2;
          border: 1px solid #04a0e2;
          padding: 8px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 12px;
        }
        .zenpay-ctn .input-template {
          margin: 20px 0 !important;
          position: relative;
          color: #fff;
        }

        .zenpay-ctn .input-template .it-label {
          width: 320px;
          text-transform: capitalize;
          padding: 0 0 0 15px;
          border-radius: 30px;
          border: 1px solid #008c95;
          background: #071123;
          position: absolute;
          left: 15px;
          top: -10px;
          font-family: Lato;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          color: #fff;
          z-index: 1;
        }

        .zenpay-ctn .account-inputs .amount-input {
          position: relative;
          width: 100%;
        }

        .zenpay-ctn .account-inputs .amount-input .clear-row {
          width: -webkit-fit-content;
          width: -moz-fit-content;
          width: fit-content;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-family: "Lato";
          font-style: normal;
          font-weight: 400;
          font-size: 12px;
          line-height: 12px;
          position: absolute;
          bottom: 16px;
          color: #fff;
          right: 14px;
          z-index: 1;
        }

        .zenpay-ctn .account-inputs .amount-input .clear-row button {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 400;
          font-family: "Lato";
          padding: 0;
        }

        .zenpay-ctn .account-inputs .amount-input .clear-row button:hover {
          opacity: 0.8;
        }
        .back-btn:hover {
          background: rgba(4, 160, 226, 0.1);
        }

        .button-group {
          display: flex;
          align-items: center;
          margin-top: 20px;
        }

        /* Step 2 section - appears below Step 1 on same page */
        .deposit-step2-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Step 2 - Select Bonus type */
        .deposit-step2 .bonus-label {
          color: #00E0FF;
          font-weight: 600;
          font-size: 16px;
          display: block;
          margin-bottom: 8px;
        }
        .deposit-step2 .bonus-dropdown {
          background: #1A2234;
          color: #E0E0E0;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          padding: 8px 12px;
          font-size: 14px;
          width: 100%;
          max-width: 280px;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23E0E0E0' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }

        /* Step 2 - Account Details */
        .deposit-step2 .account-heading {
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          margin: 24px 0 16px 0;
        }
        .deposit-step2 .account-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .deposit-step2 .account-label {
          color: #E0E0E0;
          font-weight: 400;
          font-size: 14px;
          min-width: 180px;
        }
        .deposit-step2 .account-value {
          background: #01fafe;
          color: #000;
          font-weight: 700;
          border-radius: 4px;
          padding: 2px 10px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          margin-left: 10px;
        }
        .deposit-step2 .copy-btn {
          background: transparent;
          padding: 4px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          color: #000;
        }
        .deposit-step2 .copy-btn:hover {
          opacity: 0.8;
        }

        /* Step 2 - Reference ID/UTR input */
        .deposit-step2 .ref-label {
          color: #E0E0E0;
          font-size: 14px;
          margin-bottom: 8px;
          display: block;
        }
        .deposit-step2 .ref-input {
          background: #2B354C;
          border: none;
          border-radius: 25px;
          padding: 12px 20px;
          color: #fff;
          font-size: 14px;
          width: 100%;
          outline: none;
        }
        .deposit-step2 .ref-input::placeholder {
          color: #A0A0A0;
        }
        .deposit-step2 .ref-input:focus {
          box-shadow: 0 0 0 1px #00E0FF;
        }

        /* Step 2 - Payment Method Radio */
        .deposit-step2 .payment-radio-group {
          display: flex;
          align-items: center;
          gap: 24px;
          margin: 20px 0;
        }
        .deposit-step2 .payment-radio-item {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #E0E0E0;
          font-size: 14px;
        }
        .deposit-step2 .payment-radio-item input {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #6A7488;
          border-radius: 50%;
          cursor: pointer;
          position: relative;
        }
        .deposit-step2 .payment-radio-item input:checked {
          border-color: #FF0066;
          background: radial-gradient(circle at center, #FF0066 0% 35%, transparent 35%);
        }

        /* Step 2 - Action Buttons */
        .deposit-step2 .upload-btn {
          background: #01fafe;
          color: #000;
          font-weight: 700;
          border: none;
          border-radius: 30px;
          border:1px #fff;
          padding: 12px 24px;
          font-size: 14px;
          text-transform: uppercase;
          cursor: pointer;
          margin:10px 10px 10px 0;
        }
        .deposit-step2 .upload-btn:hover {
          background: #00b8d4;
          color: #101826;
        }
        .deposit-step2 .confirm-btn {
          background: #00E0FF;
          color: #101826;
          font-weight: 700;
          border: none;
          border-radius: 25px;
          padding: 12px 24px;
          font-size: 14px;
          cursor: pointer;
        }
        .deposit-step2 .confirm-btn:hover {
          background: #00b8d4;
          color: #101826;
        }

        /* Step 2 - Buttons: UPLOAD IMAGE on first line, Confirm Payment on next line */
        .deposit-step2-buttons {
          margin-top: 24px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .deposit-step2-buttons .upload-btn {
          align-self: flex-start;
        }
        .deposit-step2-buttons .confirm-btn {
          align-self: flex-start;
        }
      `}</style>

      <div className="deposit-ctn-new">
        {/* Report Header */}
        <div className="report-header">
          <div className="report-img-title">
            <div className="report-img-div-title">
              <div className="report-img-div">
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E"
                  alt="info"
                  className="report-img"
                />
              </div>
              <div className="report-title">Deposit</div>
            </div>
            <div className="tab-btns"></div>
          </div>
          <div className="report-filters">
            <div className="deposit-header-text">
              Please Select Deposit Method:
            </div>
          </div>
        </div>

        {/* Step 1: Amount Entry - always visible */}
        <div>
          {/* Disclaimer - grey, below header */}
          <div className="px-4 pt-4 deposit-form-ctn">
            <p className="disclaimer-msg">
              Disclaimer: For faster and more reliable payments, please use the
              bank transfer option.
            </p>
          </div>

          {/* Payment Type Row: BANK (5% BONUS), UPI, CRYPTO, WHATSAPP DEPOSIT */}
          <div className="px-4 mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedPaymentType("bank")}
              className={`deposit-payment-type-btn ${selectedPaymentType === "bank" ? "selected-bank" : ""}`}
            >
              BANK (5% BONUS)
            </button>
            <button
              onClick={() => setSelectedPaymentType("upi")}
              className={`deposit-payment-type-btn ${selectedPaymentType === "upi" ? "selected-upi" : ""}`}
            >
              UPI
            </button>
            <button
              onClick={() => setSelectedPaymentType("crypto")}
              className={`deposit-payment-type-btn ${selectedPaymentType === "crypto" ? "selected-crypto" : ""}`}
            >
              CRYPTO
            </button>
            <button
              onClick={() => setSelectedPaymentType("whatsapp")}
              className={`deposit-payment-type-btn ${selectedPaymentType === "whatsapp" ? "selected-whatsapp" : "whatsapp-normal"}`}
            >
              WHATSAPP DEPOSIT
            </button>
          </div>

          {/* Option Row: OPTION 1, OPTION 2, OPTION 3 */}
          <div className="px-4 mt-3 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedOption(1)}
              className={`deposit-option-btn ${selectedOption === 1 ? "selected" : ""}`}
            >
              OPTION 1
            </button>
            <button
              onClick={() => setSelectedOption(2)}
              className={`deposit-option-btn ${selectedOption === 2 ? "selected" : ""}`}
            >
              OPTION 2
            </button>
            <button
              onClick={() => setSelectedOption(3)}
              className={`deposit-option-btn ${selectedOption === 3 ? "selected" : ""}`}
            >
              OPTION 3
            </button>
          </div>

          {/* Amount Options - 3x3 grid */}
          <div className="px-4 mt-4 deposit-form-ctn flex flex-wrap">
            {[
              "+500",
              "+1000",
              "+5000",
              "+10000",
              "+25000",
              "+50000",
              "+100000",
              "+500000",
              "+1000000",
            ].map((val) => (
              <button
                key={val}
                onClick={() => handlePresetClick(val)}
                className="amount-btn"
              >
                {val}
              </button>
            ))}
          </div>

          {/* Note - orange/yellow */}
          <div className="px-4 deposit-note">
            Note : Please allow 30mins for deposit amount to credit, in case of
            any further delay reach out to customer care.
          </div>

          {/* Enter Amount (INR) - input field with Clear button */}
          <div className="px-4 deposit-amount-input-ctn zenpay-ctn">
            <div className="input-template">
              <div className="it-label">Enter Amount (INR)</div>
              <div className="account-inputs">
                <div className="amount-input">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter Amount To Be Deposited"
                    style={{
                      background: "#3d4a62",
                      border: "1px solid #334155",
                      borderRadius: "50px",
                      padding: "12px 30px",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "600",
                      lineHeight: "16.2px",
                      width: "100%",
                      outline: "none",
                    }}
                  />
                  <div className="clear-row">
                    <button
                      onClick={handleClear}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "400",
                        fontFamily: "Lato",
                        bottom: "16px",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Button - only show when step 1 */}
          {step === 1 && (
            <div className="px-4 mt-4 pb-4">
              <button onClick={handleNext} className="next-btn">
                Next
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Details Entry - expands below Step 1 on same page */}
        {step >= 2 && (
          <div className="deposit-step2-section deposit-step2 px-4">
            {/* Select Bonus type */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <label
                style={{
                  fontWeight: "500",
                  color: "#01fafe",
                  whiteSpace: "nowrap",
                }}
              >
                Select Bonus type
              </label>
              <select
                style={{
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "20px",
                  backgroundColor: "#f3f4f6",
                  color: "#1f2937",
                  fontSize: "0.875rem",
                  minWidth: "200px",
                  cursor: "pointer",
                  outline: "none",
                }}
                value={selectedBonus}
                onChange={(e) => setSelectedBonus(e.target.value)}
              >
                <option value="ftd500">FTD 500% Bonus</option>
                <option value="imps5">5% IMPS Deposit</option>
              </select>
            </div>

            {/* UPI QR Code & UPI ID - show after bonus selection when UPI is selected */}
            {selectedPaymentType === "upi" && (
              <div className="deposit-upi-section">
                <h2 className="account-heading">Account Details</h2>
                {loadingAccounts ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
                    Loading account details...
                  </div>
                ) : accounts.upi ? (
                  <>
                    <div className="upi-instruction-banner">
                      If Payment declined due To Security Reasons, Please Scan this
                      below Qr Code
                    </div>
                    <div className="upi-content">
                      {accounts.upi.qrCode && (
                        <div className="upi-qr">
                          <img
                            src={accounts.upi.qrCode}
                            alt="UPI QR Code"
                          />
                        </div>
                      )}
                      <div className="upi-details">
                        <div className="upi-id-label">UPI ID:</div>
                        <div className="upi-id-value">
                          {accounts.upi.upiId || "N/A"}
                          <button
                            type="button"
                            className="upi-copy-btn"
                            onClick={() =>
                              copyToClipboard(accounts.upi.upiId || "")
                            }
                            title="Copy UPI ID"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#ff6b6b" }}>
                    No UPI account found for Option {selectedOption}
                  </div>
                )}
              </div>
            )}
            {/* Bank Account Details */}
            {selectedPaymentType === "bank" && (
              <>
                <h2 className="account-heading">Account Details</h2>
                {loadingAccounts ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
                    Loading account details...
                  </div>
                ) : accounts.bank ? (
                  <>
                    <div className="account-row">
                      <span className="account-label">Account Holder Name:</span>
                      <span className="account-value">
                        {accounts.bank.accountHolder || "N/A"}
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(accounts.bank.accountHolder || "");
                          }}
                          title="Copy"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">Account Number:</span>
                      <span className="account-value">
                        {accounts.bank.accountNumber || "N/A"}
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(accounts.bank.accountNumber || "");
                          }}
                          title="Copy"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">IFSC Code:</span>
                      <span className="account-value">
                        {accounts.bank.ifscCode || "N/A"}
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(accounts.bank.ifscCode || "");
                          }}
                          title="Copy"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">Bank Name:</span>
                      <span className="account-value">
                        {accounts.bank.bankName || "N/A"}
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(accounts.bank.bankName || "");
                          }}
                          title="Copy"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </span>
                    </div>
                    {accounts.bank.branchName && (
                      <div className="account-row">
                        <span className="account-label">Branch Name:</span>
                        <span className="account-value">
                          {accounts.bank.branchName}
                          <button
                            type="button"
                            className="copy-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(accounts.bank.branchName || "");
                            }}
                            title="Copy"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#ff6b6b" }}>
                    No bank account found for Option {selectedOption}
                  </div>
                )}
              </>
            )}

            {/* Crypto Account Details */}
            {selectedPaymentType === "crypto" && (
              <>
                <h2 className="account-heading">Account Details</h2>
                {loadingAccounts ? (
                  <div style={{ textAlign: "center", padding: "20px", color: "#fff" }}>
                    Loading account details...
                  </div>
                ) : accounts.crypto ? (
                  <>
                    <div className="account-row">
                      <span className="account-label">Currency:</span>
                      <span className="account-value">
                        {accounts.crypto.currency || "N/A"}
                      </span>
                    </div>
                    <div className="account-row">
                      <span className="account-label">Wallet Address:</span>
                      <span className="account-value" style={{ wordBreak: "break-all", maxWidth: "400px" }}>
                        {accounts.crypto.walletAddress || "N/A"}
                        <button
                          type="button"
                          className="copy-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(accounts.crypto.walletAddress || "");
                          }}
                          title="Copy"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px", color: "#ff6b6b" }}>
                    No crypto account found
                  </div>
                )}
              </>
            )}

            {/* Enter Reference ID/UTR */}
            <div style={{ marginTop: "24px" }}>
              <label className="ref-label">
                Enter Reference ID/UTR (Re-Verify For Correctness)
              </label>
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter Reference ID/UTR"
                className="ref-input"
              />
            </div>

            {/* Payment Method Radio - IMPS NEFT RTGS (hidden when UPI or Crypto selected) */}
            {selectedPaymentType === "bank" && (
              <div className="payment-radio-group">
                <label className="payment-radio-item">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="IMPS"
                    checked={selectedMethod === "IMPS"}
                    onChange={() => setSelectedMethod("IMPS")}
                  />
                  IMPS
                </label>
                <label className="payment-radio-item">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="NEFT"
                    checked={selectedMethod === "NEFT"}
                    onChange={() => setSelectedMethod("NEFT")}
                  />
                  NEFT
                </label>
                <label className="payment-radio-item">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RTGS"
                    checked={selectedMethod === "RTGS"}
                    onChange={() => setSelectedMethod("RTGS")}
                  />
                  RTGS
                </label>
              </div>
            )}

            {/* Upload Image & Confirm Buttons */}
            <div className="deposit-step2-buttons">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="upload-btn"
                style={{ cursor: "pointer" }}
              >
                UPLOAD IMAGE
              </label>
              {imageName && (
                <span
                  style={{
                    color: "#E0E0E0",
                    fontSize: "12px",
                    marginLeft: "8px",
                  }}
                >
                  {imageName}
                </span>
              )}
              <button 
                onClick={handleConfirm} 
                className="confirm-btn"
                disabled={submitting}
                style={{ opacity: submitting ? 0.6 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting ? "Submitting..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;
