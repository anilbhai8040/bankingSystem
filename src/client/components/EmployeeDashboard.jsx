import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCheck, FaQrcode, FaSync, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';
import './EmployeeDashboard.css';

/**
 * EmployeeDashboard Component
 * Secure Bank Employee portal listing pending requests with "Approve & Generate QR" button.
 */
const EmployeeDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState({ text: '', type: '' });
  const [approvedPayment, setApprovedPayment] = useState(null);
  const [webhookResult, setWebhookResult] = useState(null);

  const fetchPendingRequests = async () => {
    setLoading(true);
    setActionMessage({ text: '', type: '' });
    try {
      const res = await axios.get('http://localhost:5000/api/admin/requests');
      setPendingRequests(res.data.requests || []);
    } catch (error) {
      console.error('Fetch Pending Requests Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to fetch pending requests. RBAC permission check failed.';
      setActionMessage({ text: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleApprove = async (requestId) => {
    setActionMessage({ text: '', type: '' });
    setApprovedPayment(null);
    setWebhookResult(null);

    try {
      const res = await axios.post(`http://localhost:5000/api/admin/requests/${requestId}/approve`);
      
      setActionMessage({
        text: `Request #${requestId} approved! Mock QR Payment Reference generated.`,
        type: 'success',
      });
      setApprovedPayment(res.data);
      fetchPendingRequests();
    } catch (error) {
      console.error('Approval Error:', error);
      const errMsg = error.response?.data?.message || 'Error approving request.';
      setActionMessage({ text: errMsg, type: 'error' });
    }
  };

  const handleSimulatePaymentWebhook = async (qrReferenceCode) => {
    try {
      const res = await axios.post('http://localhost:5000/api/webhooks/payment', {
        qr_reference_code: qrReferenceCode,
      });

      setWebhookResult(res.data);
      setApprovedPayment(null);
      fetchPendingRequests();
    } catch (error) {
      console.error('Webhook Simulation Error:', error);
      const errMsg = error.response?.data?.message || 'Webhook payment simulation failed.';
      setActionMessage({ text: errMsg, type: 'error' });
    }
  };

  return (
    <div className="employee-dashboard-container glass-card">
      <div className="dashboard-header-flex">
        <div>
          <h2><FaShieldAlt className="text-purple" /> Bank Employee Onboarding Dashboard</h2>
          <p className="subtitle">Review, verify, and approve pending customer account requests.</p>
        </div>
        <button onClick={fetchPendingRequests} className="btn-secondary btn-refresh">
          <FaSync /> Refresh Requests
        </button>
      </div>

      {actionMessage.text && (
        <div className={`alert-box alert-${actionMessage.type} my-3`}>
          {actionMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Generated Approved QR Reference Widget */}
      {approvedPayment && (
        <div className="qr-modal-card glass-card">
          <div className="qr-modal-header">
            <FaQrcode className="qr-icon" />
            <div>
              <h3>APPROVED FOR PAYMENT</h3>
              <p className="font-mono">Request ID: #{approvedPayment.request?.request_id}</p>
            </div>
            <span className="badge badge-cyan">₹500.00 Opening Deposit</span>
          </div>

          <div className="qr-body font-mono">
            <p><strong>Customer Name:</strong> {approvedPayment.request?.first_name} {approvedPayment.request?.last_name}</p>
            <p><strong>QR Reference Code:</strong> <span className="highlight-code">{approvedPayment.qr_reference_code}</span></p>
          </div>

          <button
            onClick={() => handleSimulatePaymentWebhook(approvedPayment.qr_reference_code)}
            className="btn-primary w-full mt-3"
          >
            Simulate Successful QR Payment Webhook →
          </button>
        </div>
      )}

      {/* Webhook Result Alert */}
      {webhookResult && (
        <div className="alert-box alert-success my-3 font-mono">
          <FaCheckCircle />
          <div>
            <strong>Atomic Transaction Completed!</strong>
            <p>Account Created: {webhookResult.account_number} | Customer Username: {webhookResult.username} | Role Assigned: Retail_Customer</p>
          </div>
        </div>
      )}

      {/* Pending Requests Table */}
      <div className="table-responsive mt-4">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading pending applications...</td>
              </tr>
            ) : pendingRequests.length > 0 ? (
              pendingRequests.map((req) => (
                <tr key={req.request_id}>
                  <td className="font-mono">#{req.request_id}</td>
                  <td><strong>{req.first_name} {req.last_name}</strong></td>
                  <td className="font-mono">{req.contact}</td>
                  <td>{req.email}</td>
                  <td><span className="badge badge-amber">{req.status}</span></td>
                  <td>
                    <button
                      onClick={() => handleApprove(req.request_id)}
                      className="btn-primary btn-sm btn-approve"
                    >
                      <FaQrcode /> Approve & Generate QR
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  No pending onboarding requests awaiting employee review.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
