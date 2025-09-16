import Joi from 'joi';
import { typeList } from '../constants/contact-constants.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Title must be exist',
    'string.base': 'Title must be string',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in format: +xxxxxxxxxxxx',
    }),
  email: Joi.string()
    .min(6)
    .max(30)
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
      'string.min': 'Email must be at least 6 characters long',
      'string.max': 'Email must not exceed 30 characters',
      'string.pattern.base': 'Email must be in format: user@example.com',
    }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .min(3)
    .max(20),
  photo: Joi.string(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().pattern(/^\+\d{12}$/),
  email: Joi.string().min(3).max(30),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeList)
    .min(3)
    .max(20),
  photo: Joi.string(),
});
