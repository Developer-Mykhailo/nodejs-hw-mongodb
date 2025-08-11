# Contacts REST API

This project is a simple backend service for managing contacts, built with **Node.js**, **Express**, and **MongoDB** using **Mongoose** as the ODM.  
The API supports retrieving all contacts and fetching a specific contact by its ID.

## Features

- REST API with JSON responses
- MongoDB integration via Mongoose
- Logging with `pino`
- CORS enabled
- Automatic timestamps for created and updated records

## Endpoints

- `GET /contacts` – Get all contacts
- `GET /contacts/:contactId` – Get a specific contact by ID

## Technologies

- Node.js
- Express
- MongoDB + Mongoose
- pino for HTTP logging
- CORS middleware
