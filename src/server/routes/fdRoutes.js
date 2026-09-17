const express = require('express');
const router = express.Router();
const fdController = require('../controllers/fdController');

router.post('/create', fdController.createFD);
router.get('/list', fdController.getFDs);

module.exports = router;
