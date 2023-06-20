// This module just exports a function that handles async functions/handlers/controllers
import { NextFunction, Request, Response } from "express";

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (fn: Controller) => {
  // accepts the async func as an arg.
  return (req: Request, res: Response, next: NextFunction) => {
    // returns another function which expects to be called with express req, res and next objects
    fn(req, res, next).catch(next); // the function calls the async function; "fn" and if any error occurs, the catch block calls the next function with the error as arg which will be handled by the global error handling middleware.
  };
};
