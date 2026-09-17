const express = require('express');
const router = express.Router();
const virtualCardController = require('../controllers/virtualCardController');

router.get('/details', virtualCardController.getCard);
router.post('/status', virtualCardController.updateCardStatus);
router.post('/change-pin', virtualCardController.changePin);

module.exports = router;
