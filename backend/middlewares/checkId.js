import { isValidObjectId } from "mongoose";
import createHttpError from "../utils/httpError.js";

function checkId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return next(createHttpError(400, `Invalid id: ${req.params.id}`));
  }

  return next();
}

export default checkId;
