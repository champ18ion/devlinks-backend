const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const authMiddleware = require('../middleware/auth');

// Create a new link
router.post('/', authMiddleware, linkController.createLink);

// Get all links for the authenticated user
router.get('/', authMiddleware, linkController.getAllLinks);

// Get links by category
router.get('/category/:category', authMiddleware, linkController.getLinksByCategory);

// Get public links
router.get('/public', authMiddleware, linkController.getPublicLinks);

// Update a link
router.put('/:linkId', authMiddleware, linkController.updateLink);

// Delete a link
router.delete('/:linkId', authMiddleware, linkController.deleteLink);

router.post('/:linkId/upvote/', authMiddleware, linkController.upvoteLink);

router.post('/:linkId/downvote/',authMiddleware,linkController.downvoteLink);

router.post('/upvote-status/', authMiddleware, linkController.upvoteStatus);

module.exports = router;
