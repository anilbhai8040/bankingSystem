const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

const cpUpload = upload.fields([
  { name: 'signature', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'aadhaar_doc', maxCount: 1 },
  { name: 'pan_doc', maxCount: 1 }
]);

router.post('/create', verifyToken, cpUpload, accountController.createAccount);
router.get('/all', accountController.getAllAccounts);
router.get('/balance/:account_number', accountController.getBalance);
router.get('/details/:account_number', accountController.getAccountDetails);
router.delete('/delete/:account_number', verifyToken, accountController.deleteAccount);

module.exports = router;
