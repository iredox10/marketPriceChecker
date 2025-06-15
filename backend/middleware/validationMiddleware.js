
import { validationResult } from 'express-validator';

/**
 * Middleware to check for validation errors from express-validator.
 * If errors exist, it sends a 400 response with a list of the errors.
 * Otherwise, it calls the next middleware in the chain.
 */
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
