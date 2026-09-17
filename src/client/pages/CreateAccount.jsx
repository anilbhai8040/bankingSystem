import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaIdCard, FaUsers, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import './CreateAccount.css';

const CreateAccount = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    fname: '',
    father: '',
    surname: '',
    dob: '',
    mobile: '',
    email: '',
    address: '',
    gender: 'male',
    aadhaar: '',
    pan: '',
    nt1: '',
    nt2: '',
    nt3: '',
    nt4: 'Son',
    nt5: '',
    initialDeposit: '500',
  });

  const [files, setFiles] = useState({
    signature: null,
    photo: null,
    aadhaar_doc: null,
    pan_doc: null,
  });

  const [previews, setPreviews] = useState({
    signature: null,
    photo: null,
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const { changeActiveAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      setFiles((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews((prev) => ({ ...prev, [name]: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const depositVal = Number(formData.initialDeposit);
    if (!depositVal || depositVal < 500) {
      setMessage({ 
        text: 'Minimum opening deposit of ₹500 is required to open an account with Nova Crest Bank.', 
        type: 'error' 
      });
      setActiveTab('nominee');
      return;
    }

    setLoading(true);

    try {
      const postData = new FormData();
      Object.keys(formData).forEach((key) => {
        postData.append(key, formData[key]);
      });

      if (files.signature) postData.append('signature', files.signature);
      if (files.photo) postData.append('photo', files.photo);
      if (files.aadhaar_doc) postData.append('aadhaar_doc', files.aadhaar_doc);
      if (files.pan_doc) postData.append('pan_doc', files.pan_doc);

      const res = await axios.post('http://localhost:5000/api/account/create', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.accountNumber) {
        changeActiveAccount(res.data.accountNumber);
        setMessage({ 
          text: `Account Successfully Opened! Account Number: ${res.data.accountNumber} with ₹${depositVal.toLocaleString()} Initial Balance`, 
          type: 'success' 
        });

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Account Creation Error:', error);
      const errText = error.response?.data?.message || 'Error creating account. Minimum ₹500 opening deposit required.';
      setMessage({ text: errText, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title">Open a New <span className="gradient-text">Savings Account</span></h1>
        <p className="page-subtitle">Instant account opening with minimum ₹500 initial deposit requirement.</p>
      </div>

      <div className="wizard-card glass-card">
        {/* Navigation Tabs */}
        <div className="wizard-tabs">
          <button 
            type="button"
            className={`tab-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FaUser /> 1. Personal Info
          </button>
          <button 
            type="button"
            className={`tab-item ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc')}
          >
            <FaIdCard /> 2. KYC & Uploads
          </button>
          <button 
            type="button"
            className={`tab-item ${activeTab === 'nominee' ? 'active' : ''}`}
            onClick={() => setActiveTab('nominee')}
          >
            <FaUsers /> 3. Nominee & Deposit
          </button>
        </div>

        {message.text && (
          <div className={`alert-box alert-${message.type} m-4`}>
            {message.type === 'error' && <FaExclamationCircle />} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="wizard-form">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div className="tab-pane">
              <h3 className="section-subtitle"><FaUser /> Personal Information</h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" name="fname" className="form-input" placeholder="e.g. Alex" value={formData.fname} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Father's Name *</label>
                  <input type="text" name="father" className="form-input" placeholder="e.g. Robert" value={formData.father} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Surname *</label>
                  <input type="text" name="surname" className="form-input" placeholder="e.g. Morgan" value={formData.surname} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input type="text" name="mobile" className="form-input" placeholder="10-digit Mobile" maxLength="10" value={formData.mobile} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" className="form-input" placeholder="name@example.com" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select name="gender" className="form-input" value={formData.gender} onChange={handleInputChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Permanent Residential Address *</label>
                <input type="text" name="address" className="form-input" placeholder="Street, City, Pin Code" value={formData.address} onChange={handleInputChange} required />
              </div>

              <div className="wizard-actions">
                <button type="button" className="btn-primary" onClick={() => setActiveTab('kyc')}>Next: KYC Details →</button>
              </div>
            </div>
          )}

          {/* TAB 2: KYC & UPLOADS */}
          {activeTab === 'kyc' && (
            <div className="tab-pane">
              <h3 className="section-subtitle"><FaIdCard /> Identification & KYC Documents</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Aadhaar Card Number (12 Digits) *</label>
                  <input type="text" name="aadhaar" className="form-input" placeholder="123456789012" maxLength="12" value={formData.aadhaar} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>PAN Card Number (10 Alphanumeric) *</label>
                  <input type="text" name="pan" className="form-input" placeholder="ABCDE1234F" maxLength="10" value={formData.pan} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="upload-grid">
                <div className="upload-card">
                  <label><FaUpload /> Upload Photo (Passport Size)</label>
                  <input type="file" accept="image/*" name="photo" onChange={handleFileChange} />
                  {previews.photo && <img src={previews.photo} alt="Photo Preview" className="upload-preview" />}
                </div>

                <div className="upload-card">
                  <label><FaUpload /> Upload Signature</label>
                  <input type="file" accept="image/*" name="signature" onChange={handleFileChange} />
                  {previews.signature && <img src={previews.signature} alt="Signature Preview" className="upload-preview" />}
                </div>
              </div>

              <div className="wizard-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveTab('personal')}>← Back</button>
                <button type="button" className="btn-primary" onClick={() => setActiveTab('nominee')}>Next: Nominee & Deposit →</button>
              </div>
            </div>
          )}

          {/* TAB 3: NOMINEE & MINIMUM ₹500 DEPOSIT */}
          {activeTab === 'nominee' && (
            <div className="tab-pane">
              <h3 className="section-subtitle"><FaUsers /> Nominee & Opening Deposit</h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Nominee First Name</label>
                  <input type="text" name="nt1" className="form-input" placeholder="First Name" value={formData.nt1} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Nominee Father's Name</label>
                  <input type="text" name="nt2" className="form-input" placeholder="Father's Name" value={formData.nt2} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Nominee Surname</label>
                  <input type="text" name="nt3" className="form-input" placeholder="Surname" value={formData.nt3} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Relationship</label>
                  <select name="nt4" className="form-input" value={formData.nt4} onChange={handleInputChange}>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Wife">Wife</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                  </select>
                </div>

                <div className="form-group highlight-deposit-field">
                  <label className="text-emerald font-bold">Initial Account Opening Deposit (Min ₹500) *</label>
                  <input 
                    type="number" 
                    name="initialDeposit" 
                    className="form-input font-mono text-lg deposit-input-highlight" 
                    min="500" 
                    placeholder="Minimum 500" 
                    value={formData.initialDeposit} 
                    onChange={handleInputChange} 
                    required 
                  />
                  <span className="deposit-hint">* Opening account requires at least ₹500 deposit</span>
                </div>
              </div>

              <div className="form-group">
                <label>Nominee Address</label>
                <input type="text" name="nt5" className="form-input" placeholder="Nominee Address" value={formData.nt5} onChange={handleInputChange} />
              </div>

              <div className="wizard-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveTab('kyc')}>← Back</button>
                <button type="submit" className="btn-primary btn-submit-account" disabled={loading}>
                  {loading ? 'Submitting...' : <><FaCheckCircle /> Open Account (₹{formData.initialDeposit || 500} Deposit)</>}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
