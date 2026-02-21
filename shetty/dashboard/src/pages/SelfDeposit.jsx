import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../redux/api';
import { FaCheckCircle, FaTimesCircle, FaEye, FaSpinner } from 'react-icons/fa';

const SelfDeposit = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isSuperAdmin = userInfo?.role === 'supperadmin';
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchRequests();
    }
  }, [isSuperAdmin]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await api.get('/deposit-requests', { params: {} });
      if (response.data.success) {
        setRequests(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching deposit requests:', error);
      toast.error('Failed to fetch deposit requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this deposit request?')) {
      return;
    }

    setProcessingId(requestId);
    try {
      const response = await api.put(`/deposit-requests/${requestId}/approve`);
      if (response.data.success) {
        toast.success('Deposit request approved successfully');
        fetchRequests();
        if (showDetailsModal) {
          setShowDetailsModal(false);
          setSelectedRequest(null);
        }
      } else {
        toast.error(response.data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving deposit request:', error);
      toast.error(error.response?.data?.message || 'Failed to approve deposit request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessingId(selectedRequest._id);
    try {
      const response = await api.put(`/deposit-requests/${selectedRequest._id}/reject`, {
        rejectionReason,
      });
      if (response.data.success) {
        toast.success('Deposit request rejected successfully');
        fetchRequests();
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setSelectedRequest(null);
        setRejectionReason('');
      } else {
        toast.error(response.data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting deposit request:', error);
      toast.error(error.response?.data?.message || 'Failed to reject deposit request');
    } finally {
      setProcessingId(null);
    }
  };

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-500 text-white',
      approved: 'bg-green-500 text-white',
      rejected: 'bg-red-500 text-white',
    };
    return badges[status] || 'bg-gray-500 text-white';
  };

  const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  if (!isSuperAdmin) {
    return (
      <>
        <Navbar />
        <div className="px-3.5 md:px-7.5 py-5">
          <div className="rounded-sm border border-gray-300 bg-white p-5">
            <div className="py-12 text-center">
              <h2 className="mb-4 text-2xl font-bold text-red-600">Access Denied</h2>
              <p className="text-gray-600">Only Super Admin can access this page.</p>
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
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Self Deposit Requests</h1>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-3 border-b border-gray-200">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 font-semibold transition-colors capitalize ${
                  filterStatus === status
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {status} (
                  {
                    requests.filter((r) =>
                      status === 'all' ? true : r.status === status
                    ).length
                  }
                )
              </button>
            ))}
          </div>

          {/* Requests Table */}
          {loading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No {filterStatus === 'all' ? '' : filterStatus} deposit requests found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Payment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {request.userName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        ₹{request.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 capitalize">
                        {request.paymentType} {request.option && `(${request.option})`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openDetailsModal(request)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(request._id)}
                                disabled={processingId === request._id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title="Approve"
                              >
                                {processingId === request._id ? (
                                  <FaSpinner className="animate-spin" />
                                ) : (
                                  <FaCheckCircle />
                                )}
                              </button>
                              <button
                                onClick={() => openRejectModal(request)}
                                disabled={processingId === request._id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Reject"
                              >
                                <FaTimesCircle />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Deposit Request Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle className="text-2xl" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRequest.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900">₹{selectedRequest.amount?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedRequest.paymentType}</p>
                </div>
                {selectedRequest.option && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Option</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.option}</p>
                  </div>
                )}
                {selectedRequest.paymentMethod && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.paymentMethod}</p>
                  </div>
                )}
                {selectedRequest.bonusType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bonus Type</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.bonusType}</p>
                  </div>
                )}
                {selectedRequest.referenceId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reference ID/UTR</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.referenceId}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(
                      selectedRequest.status
                    )}`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created At</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                </div>
                {selectedRequest.remark && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Remark</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.remark}</p>
                  </div>
                )}
                {selectedRequest.image && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Payment Screenshot</label>
                    <img
                      src={selectedRequest.image}
                      alt="Payment screenshot"
                      className="mt-2 max-w-md rounded border"
                    />
                  </div>
                )}
                {selectedRequest.approvedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Approved By</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.approvedBy}</p>
                  </div>
                )}
                {selectedRequest.rejectedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rejected By</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.rejectedBy}</p>
                  </div>
                )}
                {selectedRequest.rejectionReason && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="mt-1 text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                  </div>
                )}
              </div>
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedRequest._id)}
                    disabled={processingId === selectedRequest._id}
                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {processingId === selectedRequest._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      openRejectModal(selectedRequest);
                    }}
                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Reject Deposit Request</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                rows="4"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={processingId === selectedRequest._id || !rejectionReason.trim()}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {processingId === selectedRequest._id ? 'Processing...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelfDeposit;
