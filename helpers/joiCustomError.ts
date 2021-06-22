import { ValidationErrorItem } from "@hapi/joi";


interface IerrMessage {
  [key: string]: string;
}

/**
 * Returns a custom error object with descriptive messages.
 * @property {Array} arr - Array of Joi validation errors.
 * @returns {Object}
 */
export default function customErrorMessage(errors?: ValidationErrorItem[]) {
  if (!errors) {
    return {}
  }
  return errors.reduce<IerrMessage>((acc, error) => {
    const [key] = error.path;
    acc[key] = error.message.replace(/"/g, '');
    return acc;
  }, {});
}
