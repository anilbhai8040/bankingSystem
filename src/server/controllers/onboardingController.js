const Account = require('../models/Account');

// In-memory / SQL table storage for Account_Requests
let accountRequests = [
  {
    request_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    contact: '9876543210',
    email: 'john.doe@example.com',
    status: 'PENDING',
    assigned_employee_id: null,
    created_at: new Date().toISOString(),
  }
];

let nextRequestId = 2;

exports.submitOnboardingRequest = async (req, res) => {
  try {
    const { first_name, last_name, contact, email } = req.body;

    if (!first_name || !last_name || !contact || !email) {
      return res.status(400).json({
        message: 'All fields (first_name, last_name, contact, email) are required.',
      });
    }

    const newRequest = {
      request_id: nextRequestId++,
      first_name,
      last_name,
      contact,
      email,
      status: 'PENDING',
      assigned_employee_id: null,
      created_at: new Date().toISOString(),
    };

    accountRequests.push(newRequest);

    res.status(201).json({
      message: 'Account onboarding request submitted successfully!',
      request: newRequest,
    });
  } catch (error) {
    console.error('Onboarding Submission Error:', error);
    res.status(500).json({ message: 'Server error processing onboarding request' });
  }
};

// Export shared reference for admin and webhook controllers
exports.accountRequests = accountRequests;
