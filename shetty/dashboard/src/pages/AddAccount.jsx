import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import api from '../redux/api';
import { FaEdit, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

const AddAccount = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isSuperAdmin = userInfo?.role === 'supperadmin';
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'list'
  const [accountType, setAccountType] = useState('bank'); // 'bank', 'upi', 'crypto'
  const [selectedOption, setSelectedOption] = useState('option1'); // For bank and upi
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Bank form data
  const [bankFormData, setBankFormData] = useState({
    accountNumber: '',
    accountHolder: '',
    bankName: '',
    branchName: '',
    ifscCode: '',
  });

  // UPI form data
  const [upiFormData, setUpiFormData] = useState({
    qrCode: '',
    upiId: '',
  });
  const [qrCodePreview, setQrCodePreview] = useState(null);

  // Crypto form data
  const [cryptoFormData, setCryptoFormData] = useState({
    currency: '',
    walletAddress: '',
  });

  // Fetch all accounts
  const fetchAccounts = async () => {
    setFetchLoading(true);
    try {
      const response = await api.get('/account/list');
      if (response.data.success) {
        setAccounts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Get available options for Bank/UPI accounts
  const getAvailableOptions = (type) => {
    const existingAccounts = accounts.filter(
      (acc) => acc.type === type && (!editingAccount || acc._id !== editingAccount._id)
    );
    const usedOptions = existingAccounts.map((acc) => acc.option).filter(Boolean);
    const allOptions = ['option1', 'option2', 'option3'];
    return allOptions.filter((opt) => !usedOptions.includes(opt));
  };

  // Get taken options for Bank/UPI accounts
  const getTakenOptions = (type) => {
    const existingAccounts = accounts.filter(
      (acc) => acc.type === type && (!editingAccount || acc._id !== editingAccount._id)
    );
    return existingAccounts.map((acc) => acc.option).filter(Boolean);
  };

  // Check if account type has reached max limit (3 for bank/upi)
  const hasReachedMaxLimit = (type) => {
    if (type === 'crypto') return false; // No limit for crypto
    const existingAccounts = accounts.filter(
      (acc) => acc.type === type && (!editingAccount || acc._id !== editingAccount._id)
    );
    return existingAccounts.length >= 3;
  };

  // Auto-select first available option when account type changes
  useEffect(() => {
    if ((accountType === 'bank' || accountType === 'upi') && !editingAccount) {
      const availableOptions = getAvailableOptions(accountType);
      if (availableOptions.length > 0) {
        setSelectedOption(availableOptions[0]);
      } else {
        setSelectedOption('option1'); // Default if all taken
      }
    }
  }, [accountType, accounts, editingAccount]);

  // Reset form
  const resetForms = () => {
    setBankFormData({
      accountNumber: '',
      accountHolder: '',
      bankName: '',
      branchName: '',
      ifscCode: '',
    });
    setUpiFormData({
      qrCode: '',
      upiId: '',
    });
    setCryptoFormData({
      currency: '',
      walletAddress: '',
    });
    setQrCodePreview(null);
    setSelectedOption('option1');
    setEditingAccount(null);
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();

    // Validate option availability for new accounts
    if (!editingAccount) {
      const takenOptions = getTakenOptions('bank');
      if (takenOptions.includes(selectedOption)) {
        toast.error(`Option ${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} is already taken. Please select another option.`);
        return;
      }
      if (hasReachedMaxLimit('bank')) {
        toast.error('Maximum 3 bank accounts allowed. Please delete an existing account first.');
        return;
      }
    }

    setLoading(true);

    try {
      const data = {
        type: 'bank',
        option: selectedOption,
        ...bankFormData,
      };

      let response;
      if (editingAccount) {
        response = await api.put(`/account/${editingAccount._id}`, data);
      } else {
        response = await api.post('/account/add', data);
      }

      if (response.data.success) {
        toast.success(
          editingAccount
            ? 'Bank account updated successfully!'
            : 'Bank account added successfully!'
        );
        resetForms();
        fetchAccounts();
        setActiveTab('list');
      } else {
        toast.error(response.data.message || 'Failed to save bank account');
      }
    } catch (error) {
      console.error('Error saving bank account:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to save bank account. Please check your connection.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpiSubmit = async (e) => {
    e.preventDefault();

    if (!upiFormData.qrCode) {
      toast.error('Please upload QR code image or enter image URL');
      return;
    }

    if (!upiFormData.upiId) {
      toast.error('Please enter UPI ID');
      return;
    }

    // Validate option availability for new accounts
    if (!editingAccount) {
      const takenOptions = getTakenOptions('upi');
      if (takenOptions.includes(selectedOption)) {
        toast.error(`Option ${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} is already taken. Please select another option.`);
        return;
      }
      if (hasReachedMaxLimit('upi')) {
        toast.error('Maximum 3 UPI accounts allowed. Please delete an existing account first.');
        return;
      }
    }

    // Validate option availability for new accounts
    if (!editingAccount) {
      const takenOptions = getTakenOptions('upi');
      if (takenOptions.includes(selectedOption)) {
        toast.error(`Option ${selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)} is already taken. Please select another option.`);
        return;
      }
      if (hasReachedMaxLimit('upi')) {
        toast.error('Maximum 3 UPI accounts allowed. Please delete an existing account first.');
        return;
      }
    }

    setLoading(true);

    try {
      const data = {
        type: 'upi',
        option: selectedOption,
        ...upiFormData,
      };

      let response;
      if (editingAccount) {
        response = await api.put(`/account/${editingAccount._id}`, data);
      } else {
        response = await api.post('/account/add', data);
      }

      if (response.data.success) {
        toast.success(
          editingAccount
            ? 'UPI account updated successfully!'
            : 'UPI account added successfully!'
        );
        resetForms();
        fetchAccounts();
        setActiveTab('list');
      } else {
        toast.error(response.data.message || 'Failed to save UPI account');
      }
    } catch (error) {
      console.error('Error saving UPI account:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to save UPI account. Please check your connection.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle QR code image upload
  const handleQrCodeImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setUpiFormData({ ...upiFormData, qrCode: base64String });
        setQrCodePreview(base64String);
      };
      reader.onerror = () => {
        toast.error('Error reading image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrCodeTextChange = (e) => {
    const value = e.target.value;
    setUpiFormData({ ...upiFormData, qrCode: value });
    if (!value.startsWith('data:image')) {
      setQrCodePreview(null);
    }
  };

  const handleRemoveQrCode = () => {
    setUpiFormData({ ...upiFormData, qrCode: '' });
    setQrCodePreview(null);
  };

  const handleCryptoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        type: 'crypto',
        ...cryptoFormData,
      };

      let response;
      if (editingAccount) {
        response = await api.put(`/account/${editingAccount._id}`, data);
      } else {
        response = await api.post('/account/add', data);
      }

      if (response.data.success) {
        toast.success(
          editingAccount
            ? 'Crypto account updated successfully!'
            : 'Crypto account added successfully!'
        );
        resetForms();
        fetchAccounts();
        setActiveTab('list');
      } else {
        toast.error(response.data.message || 'Failed to save crypto account');
      }
    } catch (error) {
      console.error('Error saving crypto account:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to save crypto account. Please check your connection.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Edit account
  const handleEdit = (account) => {
    setEditingAccount(account);
    setAccountType(account.type);
    setSelectedOption(account.option || 'option1');

    if (account.type === 'bank') {
      setBankFormData({
        accountNumber: account.accountNumber || '',
        accountHolder: account.accountHolder || '',
        bankName: account.bankName || '',
        branchName: account.branchName || '',
        ifscCode: account.ifscCode || '',
      });
    } else if (account.type === 'upi') {
      setUpiFormData({
        qrCode: account.qrCode || '',
        upiId: account.upiId || '',
      });
      if (account.qrCode && account.qrCode.startsWith('data:image')) {
        setQrCodePreview(account.qrCode);
      }
    } else if (account.type === 'crypto') {
      setCryptoFormData({
        currency: account.currency || '',
        walletAddress: account.walletAddress || '',
      });
    }

    setActiveTab('add');
  };

  // Delete account
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/account/${id}`);
      if (response.data.success) {
        toast.success('Account deleted successfully!');
        fetchAccounts();
        setDeleteConfirm(null);
      } else {
        toast.error(response.data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(
        error.response?.data?.message || 'Failed to delete account'
      );
    }
  };

  // Show access denied if not superadmin
  if (!isSuperAdmin) {
    return (
      <>
        <Navbar />
        <div className="px-3.5 md:px-7.5 py-5">
          <div className="rounded-sm border border-gray-300 bg-white p-5">
            <div className="py-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-red-600">
                Access Denied
              </h2>
              <p className="text-gray-600">
                Only Super Admin can create, edit, or delete accounts.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-3.5 md:px-7.5 py-5">
        <div className="rounded-sm border border-gray-300 bg-white p-5">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            {editingAccount ? 'Edit Account' : 'Add Account'}
          </h1>

          {/* Tabs */}
          <div className="mb-6 flex gap-3 border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('add');
                if (!editingAccount) resetForms();
              }}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'add'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {editingAccount ? 'Edit' : 'Add Account'}
            </button>
            <button
              onClick={() => {
                setActiveTab('list');
                resetForms();
              }}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'list'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              View Accounts ({accounts.length})
            </button>
          </div>

          {/* Add/Edit Form */}
          {activeTab === 'add' && (
            <>
              {/* Account Type Selection */}
              <div className="mb-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setAccountType('bank');
                    resetForms();
                  }}
                  className={`rounded-md px-6 py-2 font-semibold transition-colors ${
                    accountType === 'bank'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Bank
                  {!editingAccount && hasReachedMaxLimit('bank') && (
                    <span className="ml-2 text-xs">(Max: 3)</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setAccountType('upi');
                    resetForms();
                  }}
                  className={`rounded-md px-6 py-2 font-semibold transition-colors ${
                    accountType === 'upi'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  UPI
                  {!editingAccount && hasReachedMaxLimit('upi') && (
                    <span className="ml-2 text-xs">(Max: 3)</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setAccountType('crypto');
                    resetForms();
                  }}
                  className={`rounded-md px-6 py-2 font-semibold transition-colors ${
                    accountType === 'crypto'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Crypto
                </button>
              </div>

              {/* Bank Form */}
              {accountType === 'bank' && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Bank Account Details
                  </h2>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Select Option
                    </label>
                    <div className="flex gap-3">
                      {['option1', 'option2', 'option3'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelectedOption(option)}
                          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            selectedOption === option
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleBankSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankFormData.accountNumber}
                          onChange={(e) =>
                            setBankFormData({
                              ...bankFormData,
                              accountNumber: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter account number"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Account Holder Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankFormData.accountHolder}
                          onChange={(e) =>
                            setBankFormData({
                              ...bankFormData,
                              accountHolder: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter account holder name"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankFormData.bankName}
                          onChange={(e) =>
                            setBankFormData({
                              ...bankFormData,
                              bankName: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter bank name"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Branch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankFormData.branchName}
                          onChange={(e) =>
                            setBankFormData({
                              ...bankFormData,
                              branchName: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter branch name"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bankFormData.ifscCode}
                          onChange={(e) =>
                            setBankFormData({
                              ...bankFormData,
                              ifscCode: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter IFSC code"
                          maxLength={11}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      {editingAccount && (
                        <button
                          type="button"
                          onClick={() => {
                            resetForms();
                            setActiveTab('list');
                          }}
                          className="rounded-md bg-gray-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {loading
                          ? 'Saving...'
                          : editingAccount
                          ? 'Update Bank Account'
                          : 'Add Bank Account'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* UPI Form */}
              {accountType === 'upi' && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    UPI Account Details
                  </h2>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Select Option
                      {!editingAccount && hasReachedMaxLimit('upi') && (
                        <span className="ml-2 text-xs text-red-500">
                          (Maximum 3 accounts reached)
                        </span>
                      )}
                    </label>
                    <div className="flex gap-3">
                      {['option1', 'option2', 'option3'].map((option) => {
                        const takenOptions = getTakenOptions('upi');
                        const isTaken = takenOptions.includes(option);
                        const isSelected = selectedOption === option;
                        const isDisabled = !editingAccount && (isTaken || hasReachedMaxLimit('upi'));

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => !isDisabled && setSelectedOption(option)}
                            disabled={isDisabled}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : isDisabled
                                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            title={
                              isTaken
                                ? `${option.charAt(0).toUpperCase() + option.slice(1)} is already taken`
                                : ''
                            }
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                            {isTaken && !isSelected && (
                              <span className="ml-1 text-xs">(Taken)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!editingAccount && (
                      <p className="mt-2 text-xs text-gray-500">
                        Available options: {getAvailableOptions('upi').map(opt => opt.charAt(0).toUpperCase() + opt.slice(1)).join(', ') || 'None'}
                      </p>
                    )}
                  </div>

                  <form onSubmit={handleUpiSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          QR Code <span className="text-red-500">*</span>
                        </label>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <label className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                              <svg
                                className="mr-2 h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Upload Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleQrCodeImageUpload}
                                className="hidden"
                              />
                            </label>
                            {qrCodePreview && (
                              <button
                                type="button"
                                onClick={handleRemoveQrCode}
                                className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          {qrCodePreview && (
                            <div className="relative">
                              <img
                                src={qrCodePreview}
                                alt="QR Code Preview"
                                className="h-48 w-full rounded-md border border-gray-300 object-contain"
                              />
                            </div>
                          )}

                          <div>
                            <label className="mb-1 block text-xs text-gray-500">
                              Or enter image URL
                            </label>
                            <input
                              type="text"
                              value={
                                upiFormData.qrCode &&
                                !upiFormData.qrCode.startsWith('data:image')
                                  ? upiFormData.qrCode
                                  : ''
                              }
                              onChange={handleQrCodeTextChange}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Enter image URL (optional)"
                            />
                          </div>

                          {!upiFormData.qrCode && (
                            <p className="text-xs text-red-500">
                              Please upload an image or enter an image URL
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={upiFormData.upiId}
                          onChange={(e) =>
                            setUpiFormData({
                              ...upiFormData,
                              upiId: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter UPI ID (e.g., name@paytm)"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      {editingAccount && (
                        <button
                          type="button"
                          onClick={() => {
                            resetForms();
                            setActiveTab('list');
                          }}
                          className="rounded-md bg-gray-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {loading
                          ? 'Saving...'
                          : editingAccount
                          ? 'Update UPI Account'
                          : 'Add UPI Account'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Crypto Form */}
              {accountType === 'crypto' && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Crypto Account Details
                  </h2>

                  <form onSubmit={handleCryptoSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Select Currency <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={cryptoFormData.currency}
                          onChange={(e) =>
                            setCryptoFormData({
                              ...cryptoFormData,
                              currency: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select currency</option>
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="BNB">Binance Coin (BNB)</option>
                          <option value="SOL">Solana (SOL)</option>
                          <option value="XRP">Ripple (XRP)</option>
                          <option value="ADA">Cardano (ADA)</option>
                          <option value="DOGE">Dogecoin (DOGE)</option>
                          <option value="TRX">Tron (TRX)</option>
                          <option value="MATIC">Polygon (MATIC)</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Wallet Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={cryptoFormData.walletAddress}
                          onChange={(e) =>
                            setCryptoFormData({
                              ...cryptoFormData,
                              walletAddress: e.target.value,
                            })
                          }
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter wallet address"
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      {editingAccount && (
                        <button
                          type="button"
                          onClick={() => {
                            resetForms();
                            setActiveTab('list');
                          }}
                          className="rounded-md bg-gray-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {loading
                          ? 'Saving...'
                          : editingAccount
                          ? 'Update Crypto Account'
                          : 'Add Crypto Account'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}

          {/* Accounts List */}
          {activeTab === 'list' && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  All Accounts ({accounts.length})
                </h2>
                <button
                  onClick={fetchAccounts}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>

              {fetchLoading ? (
                <div className="py-8 text-center text-gray-500">Loading...</div>
              ) : accounts.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No accounts found. Add your first account!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">
                          Type
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">
                          Option
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">
                          Details
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="border border-gray-300 p-3 text-left text-sm font-semibold">
                          Created
                        </th>
                        <th className="border border-gray-300 p-3 text-center text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((account) => (
                        <tr key={account._id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3">
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                              {account.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-3 text-sm">
                            {account.option
                              ? account.option.charAt(0).toUpperCase() +
                                account.option.slice(1)
                              : '-'}
                          </td>
                          <td className="border border-gray-300 p-3 text-sm">
                            {account.type === 'bank' && (
                              <div>
                                <div>
                                  <strong>Account:</strong> {account.accountNumber}
                                </div>
                                <div>
                                  <strong>Holder:</strong> {account.accountHolder}
                                </div>
                                <div>
                                  <strong>Bank:</strong> {account.bankName}
                                </div>
                                <div>
                                  <strong>IFSC:</strong> {account.ifscCode}
                                </div>
                              </div>
                            )}
                            {account.type === 'upi' && (
                              <div>
                                <div>
                                  <strong>UPI ID:</strong> {account.upiId}
                                </div>
                                {account.qrCode && (
                                  <div className="mt-2">
                                    <img
                                      src={account.qrCode}
                                      alt="QR Code"
                                      className="h-24 w-24 rounded border object-contain"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            {account.type === 'crypto' && (
                              <div>
                                <div>
                                  <strong>Currency:</strong> {account.currency}
                                </div>
                                <div className="break-all">
                                  <strong>Wallet:</strong> {account.walletAddress}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="border border-gray-300 p-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                account.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {account.status || 'active'}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-3 text-xs text-gray-600">
                            {new Date(account.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 p-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(account)}
                                className="rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(account._id)}
                                className="rounded-md bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to delete this account? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="rounded-md bg-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="rounded-md bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddAccount;
