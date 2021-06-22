import { Joi, Segments } from 'celebrate';

export const create = {
  [Segments.BODY]: Joi.object().keys({
    content: Joi.string().min(1).max(5000).required(),
  }),
};

export const update = {
  [Segments.BODY]: Joi.object().keys({
    content: Joi.string().min(1).max(5000).required(),
  }),
};
