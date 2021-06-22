import { Joi, Segments } from 'celebrate';

export const forgotPasswordValidation = {
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().trim().email().required(),
  }),
};
export const resetPasswordValidation = {
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().min(6).required(),
  }),
};
