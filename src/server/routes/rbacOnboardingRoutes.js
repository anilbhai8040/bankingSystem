const express = require('express');
const router = express.Router();

const onboardingController = require('../controllers/onboardingController');
const adminRequestsController = require('../controllers/adminRequestsController');
const webhookController = require('../controllers/webhookController');
const { verifyToken } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbacMiddleware');

// 1. Guest Onboarding Submission: POST /api/onboarding/request
router.post('/onboarding/request', onboardingController.submitOnboardingRequest);

// 2. Bank Employee Pending Requests Query: GET /api/admin/requests (Protected by 'view_pending_requests')
router.get('/admin/requests', verifyToken, requirePermission('view_pending_requests'), adminRequestsController.getPendingRequests);

// 3. Bank Employee Approve Request: POST /api/admin/requests/:id/approve (Protected by 'approve_account_request')
router.post('/admin/requests/:id/approve', verifyToken, requirePermission('approve_account_request'), adminRequestsController.approveRequest);

// 4. Payment Webhook: POST /api/webhooks/payment (Simulates QR payment & executes atomic transaction)
router.post('/webhooks/payment', webhookController.handlePaymentWebhook);

module.exports = router;
