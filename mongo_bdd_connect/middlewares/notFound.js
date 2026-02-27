import { createError } from "../utils/helpers.js";

export async function notFound(req,res,next) {
    next(createError(404, "Route inexistante"));
}