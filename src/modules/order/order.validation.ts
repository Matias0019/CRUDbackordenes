import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { IOrder } from './order.interfaces';

const createOrderBody: Record<keyof IOrder, any> = {
  carts: Joi.array(),
  user: Joi.string().custom(objectId),
};

export const createOrder = {
  body: Joi.object().keys(createOrderBody),
};

export const getOrders = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

export const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      carts: Joi.array(),
    })
    .min(1),
};

export const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};
