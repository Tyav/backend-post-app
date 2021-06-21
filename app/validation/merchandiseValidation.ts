import { Joi, Segments } from 'celebrate';

export const create = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    qty: Joi.string().min(1).required(),
    size: Joi.string(),
    price: Joi.number().min(100).required(),
    tags: Joi.array().items(Joi.string()),
    category: Joi.string()
      .regex(/^[a-f0-9]{24}$/i)
      .required(),
  }),
};

export const update = {
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    urls: Joi.array().items(Joi.string()),
    qty: Joi.string().min(1),
    size: Joi.string(),
    price: Joi.number().min(100),
    tags: Joi.array().items(Joi.string()),
    category: Joi.string().regex(/^[a-f0-9]{24}$/i),
  }),
};
