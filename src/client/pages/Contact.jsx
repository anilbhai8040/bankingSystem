import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title">Contact <span className="gradient-text">Nova Crest Support</span></h1>
        <p className="page-subtitle">We are here to assist you 24/7. Get in touch with our customer care & financial advisors.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Info Cards */}
        <div className="contact-info-section">
          <div className="glass-card contact-info-card">
            <div className="info-icon icon-emerald"><FaPhoneAlt /></div>
            <div>
              <h3>Toll-Free Customer Care</h3>
              <p className="font-mono text-cyan">+1 (800) 555-NOVA / +91 1800-200-8040</p>
              <span className="info-subtext">Available 24 hours a day, 7 days a week</span>
            </div>
          </div>

          <div className="glass-card contact-info-card">
            <div className="info-icon icon-cyan"><FaEnvelope /></div>
            <div>
              <h3>Email & Digital Support</h3>
              <p className="font-mono text-purple">support@novacrestbank.com</p>
              <span className="info-subtext">Average response time: &lt; 15 minutes</span>
            </div>
          </div>

          <div className="glass-card contact-info-card">
            <div className="info-icon icon-purple"><FaMapMarkerAlt /></div>
            <div>
              <h3>Corporate Headquarters</h3>
              <p>Nova Crest Tower, Financial District, Cyber City, NY 10001</p>
              <span className="info-subtext">Global Operations Center</span>
            </div>
          </div>

          <div className="glass-card contact-info-card">
            <div className="info-icon icon-amber"><FaClock /></div>
            <div>
              <h3>Banking & Branch Hours</h3>
              <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
              <span className="info-subtext">Net Banking & Mobile App accessible 24/7</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card contact-form-card">
          <h2>Send Us a Message</h2>
          <p className="form-desc">Have questions regarding accounts, loans, or virtual cards? Drop us a line.</p>

          {submitted ? (
            <div className="alert-box alert-success font-mono my-4">
              <FaCheckCircle />
              <div>
                <strong>Message Delivered!</strong>
                <p>Thank you for reaching out. Our support representative will contact you shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form mt-3">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Inquiry about Fixed Deposits"
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Type your query or message here..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full mt-2">
                <FaPaperPlane /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
