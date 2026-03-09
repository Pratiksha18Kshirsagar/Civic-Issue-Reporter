const express = require('express');
const { createUser, loginUser, adminLogin } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.get('/me/stats', require('../middleware/auth').authenticate, require('../controllers/userController').getUserStats);

module.exports = router;
