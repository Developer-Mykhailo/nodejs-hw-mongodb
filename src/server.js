import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import ContactsColectioin from './db/models/Contacts.js';

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
    const data = await ContactsColectioin.find();

    res.json({
      status: 200,
      message: 'Successfully find contacts',
      data,
    });
  });

  app.get('/contacts/:id', async (req, res) => {
    const { id } = req.params;
    const data = await ContactsColectioin.findById(id);

    if (!data) {
      return res.status(404).json({
        status: 404,
        message: `Contact with id ${id} not found`,
      });
    }

    res.json({
      status: 200,
      message: `Successfully find contact with id=${id}`,
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
