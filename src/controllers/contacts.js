import ContactsCollection from '../db/models/Contacts.js';
import { notFoudHandler } from '../middlewares/notFoundHandler.js';

export const getContactsController = async (req, res) => {
  // throw new Error('Database request error');
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
    return notFoudHandler(req, res);
  }

  res.json({
    status: 200,
    message: `Successfully find contact with id=${contactId}`,
    data,
  });
};
