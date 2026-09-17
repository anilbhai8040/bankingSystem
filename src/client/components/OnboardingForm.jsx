import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './OnboardingForm.css';

/**
 * OnboardingForm Component
 * Guest-facing form to submit name and contact info to request an account.
 */
const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact: '',
    email: '',
  });

  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ text: '', type: '' });
    setSubmittedRequest(null);

    if (!formData.first_name || !formData.last_name || !formData.contact || !formData.email) {
      setStatusMessage({ text: 'Please complete all required fields.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/onboarding/request', formData);

      setStatusMessage({
        text: 'Account onboarding application submitted successfully! Your application is in PENDING review.',
        type: 'success',
      });
      setSubmittedRequest(response.data.request);
      setFormData({ first_name: '', last_name: '', contact: '', email: '' });
    } catch (error) {
      console.error('Onboarding Submission Error:', error);
      const errMsg = error.response?.data?.message || 'Error submitting application. Please try again.';
      setStatusMessage({ text: errMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-form-wrapper glass-card">
      <div className="onboarding-header text-center">
        <h2>Request a New Bank Account</h2>
        <p className="subtitle">Submit your personal details to initiate customer onboarding with Nova Crest Bank.</p>
      </div>

      {statusMessage.text && (
        <div className={`alert-box alert-${statusMessage.type}`}>
          {statusMessage.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="onboarding-form">
        <div className="form-row">
          <div className="form-group">
            <label><FaUser /> First Name *</label>
            <input
              type="text"
              name="first_name"
              className="form-input"
              placeholder="e.g. John"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaUser /> Last Name *</label>
            <input
              type="text"
              name="last_name"
              className="form-input"
              placeholder="e.g. Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label><FaPhone /> Contact Number *</label>
            <input
              type="text"
              name="contact"
              className="form-input font-mono"
              placeholder="e.g. 9876543210"
              maxLength="10"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaEnvelope /> Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="e.g. john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Submitting Application...' : <><FaPaperPlane /> Submit Account Request</>}
        </button>
      </form>

      {submittedRequest && (
        <div className="submitted-receipt-card glass-card mt-4">
          <div className="receipt-status-header">
            <span className="badge badge-amber">PENDING REVIEW</span>
            <span className="font-mono text-dim">Request ID: #{submittedRequest.request_id}</span>
          </div>
          <div className="receipt-details font-mono">
            <p><strong>Name:</strong> {submittedRequest.first_name} {submittedRequest.last_name}</p>
            <p><strong>Contact:</strong> {submittedRequest.contact}</p>
            <p><strong>Email:</strong> {submittedRequest.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingForm;
