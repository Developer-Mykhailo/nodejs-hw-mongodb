import ContactsCollection from '../db/models/Contacts.js';

export const getContactsController = async (req, res) => {
  const data = await ContactsCollection.find();

  res.json({
    status: 200,
    message: 'Successfully find contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await ContactsCollection.findById(contactId);

  if (!data) {
    return res.status(404).json({
      status: 404,
      message: `Contact with id ${contactId} not found`,
    });
  }

  res.json({
    status: 200,
    message: `Successfully find contact with id=${contactId}`,
    data,
  });
};
