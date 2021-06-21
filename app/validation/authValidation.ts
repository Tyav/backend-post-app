import { Joi, Segments } from 'celebrate';

export const verify = {
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string(),
    // id: Joi.string()
    //   .regex(/^[A-F0-9]{24}$/i)
    //   .required(),
  }),
};
