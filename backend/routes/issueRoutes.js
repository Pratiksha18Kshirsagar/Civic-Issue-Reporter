const express = require('express');
const router = express.Router();
const multer = require('multer');
const issueController = require('../controllers/issueController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Use multer memory storage — file buffer is passed to uploadToS3() in the controller
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max
    }
});

// Public routes
router.get('/nearby', issueController.getNearbyIssues);

// Customer routes (auth required)
router.post('/', authenticate, upload.single('image'), issueController.createIssue);
router.put('/:id/upvote', authenticate, issueController.upvoteIssue);

// Admin routes (auth + admin required)
router.get('/', authenticate, isAdmin, issueController.getAllOpenIssues);
router.put('/:id/resolve', authenticate, isAdmin, upload.single('image'), issueController.resolveIssue);

module.exports = router;
