import ContactsCollection from '../db/models/Contacts.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({ page, perPage }) => {
  const skip = (page - 1) * perPage;
  const data = await ContactsCollection.find().skip(skip).limit(perPage);
  const totalItems = await ContactsCollection.countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = async (id) => ContactsCollection.findById(id);

export const addContact = async (payload) => ContactsCollection.create(payload);

//---------------------------------------------------------------

export const patchContactById = async (_id, payload) => {
  const result = await ContactsCollection.findOneAndUpdate({ _id }, payload, {
    new: true,
    includeResultMetadata: true,
  });

  return result;
};

//---------------------------------------------------------------

export const deleteContactById = (id) =>
  ContactsCollection.findByIdAndDelete(id);
