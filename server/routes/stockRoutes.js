const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', stockController.register);
router.get('/current_stock', authMiddleware, stockController.getCurrentStock);
//router.post('/register', stockController.register);

module.exports = router;