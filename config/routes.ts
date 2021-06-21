import { Application } from 'express';
import { converter, notFound, handler, internal } from './error';

export default function router(
  app: Application,
  routes: (app: Application) => void
) {
  routes(app);

  /**
   * Error handling
   */
  // if error is not an instanceOf APIError, convert it.
  app.use(converter);

  // handle some internal server errors
  app.use(internal);

  // catch 404 and forward to error handler
  app.use(notFound);

  // error handler, send stacktrace only during development
  app.use(handler);
}
