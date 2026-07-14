const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  if(!name || !phone) {
    return res.status(400).json({ message: 'Name and Phone number is required' });
  }
  try {
    const contact = await Contact.create({
            user: req.user._id,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email || '',
            tag: req.body.tag || 'Personal',
            notes: req.body.notes || ''
        });
    res.status(201).json(contact);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  if(contact.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User unauthorized '});
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedContact);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
}

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

  if(contact.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User unauthorized '});  
  }
  const deletedContact = await contact.deleteOne();
  res.json({ message: 'Contact deleted' }, deletedContact);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
}

// module.exports = { getContacts, createContact, updateContact, deleteContact };