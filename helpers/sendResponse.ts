const sendResponse = function(statusCode: number, message: string, payload?: any, error?: any, token?: string) {
  return {
    statusCode,
    message,
    payload,
    error,
    token
  };
};
export default sendResponse;