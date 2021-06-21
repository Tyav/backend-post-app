/**
 * Returns a custom error object with descriptive messages.
 * @property {Array} arr - Array of Joi validation errors.
 * @returns {Object}
 */
interface JoiErr {
  path: string[];
  message: string;
}
interface IerrMessage {
  [key: string]: string;
}

export default function customErrorMessage(errors: JoiErr[]) {
  return errors.reduce<IerrMessage>((acc, error) => {
    const [key] = error.path;
    acc[key] = error.message.replace(/"/g, '');

    if (key === 'phone') acc[key] = 'Phone number must be a valid number!';
    return acc;
  }, {});
}
