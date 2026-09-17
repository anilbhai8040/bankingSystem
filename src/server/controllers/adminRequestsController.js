const { accountRequests } = require('./onboardingController');

// In-memory / SQL table storage for Opening_Payments
let openingPayments = [];
let nextPaymentId = 1;

exports.getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = accountRequests.filter((r) => r.status === 'PENDING');
    res.json({
      count: pendingRequests.length,
      requests: pendingRequests,
    });
  } catch (error) {
    console.error('Fetch Pending Requests Error:', error);
    res.status(500).json({ message: 'Server error fetching pending requests' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const requestId = Number(req.params.id);
    const requestIndex = accountRequests.findIndex((r) => r.request_id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({ message: `Account request ID ${requestId} not found.` });
    }

    const targetRequest = accountRequests[requestIndex];

    if (targetRequest.status !== 'PENDING') {
      return res.status(400).json({
        message: `Request ID ${requestId} is already in '${targetRequest.status}' status.`,
      });
    }

    // 1. Update status to APPROVED_FOR_PAYMENT
    targetRequest.status = 'APPROVED_FOR_PAYMENT';
    targetRequest.assigned_employee_id = req.user ? req.user.id : 1;

    // 2. Generate Mock QR Reference Code
    const qrReferenceCode = `QR_PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment = {
      payment_id: nextPaymentId++,
      request_id: requestId,
      amount: 500.00, // Minimum ₹500 opening deposit
      qr_reference_code: qrReferenceCode,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    openingPayments.push(newPayment);

    res.json({
      message: `Request ID ${requestId} approved for payment successfully!`,
      request: targetRequest,
      payment: newPayment,
      qr_reference_code: qrReferenceCode,
    });
  } catch (error) {
    console.error('Approve Request Error:', error);
    res.status(500).json({ message: 'Server error approving request' });
  }
};

exports.openingPayments = openingPayments;
