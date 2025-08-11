import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import ContactsCollection from './db/models/Contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const data = await ContactsCollection.find();

    res.json({
      status: 200,
      message: 'Successfully find contacts',
      data,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
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
  });

  //404
  app.use((req, res) => {
    res.status(404).json({
      message: 'not found',
    });
  });

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
