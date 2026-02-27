export function createError(statusCode, message) {
    const error = new Error(message);
    error.statusCode=404;
    throw error;
}