const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

router.post('/apply', loanController.applyGoldLoan);
router.get('/list', loanController.getLoans);
router.post('/repay', loanController.repayLoan);

module.exports = router;
