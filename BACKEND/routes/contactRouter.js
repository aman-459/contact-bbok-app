const express = require('express');
const contactRouter = express.Router();
const { getContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController.js');
const { protect } = require('../middleware/authMiddleware');

contactRouter.get('/', protect, getContacts);
contactRouter.post('/', protect, createContact);
contactRouter.put('/:id', protect, updateContact);
contactRouter.delete('/:id', protect, deleteContact);

// router.route('/').get(protect, getContacts).post(protect, createContact);
// router.route('/:id').put(protect, updateContact).delete(protect, deleteContact);

module.exports = contactRouter;