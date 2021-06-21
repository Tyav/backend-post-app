import { Joi, Segments } from 'celebrate';

export const forgotPasswordValidation = {
  [Segments.QUERY]: Joi.object().keys({
    type: Joi.string()
      .valid('admin', 'user')
      .lowercase().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().trim().email().required(),
  }),
};
export const resetPasswordValidation = {
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().min(6).required(),
  }),
};
