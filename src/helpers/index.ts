import { body, validationResult } from "express-validator";

const errorResponse = (msg: string, details?: any) => ({
    success: false,
    message: msg,
    errors: details || [],
});

export const validate = (validations: any) => {
    return async (req: any, res: any, next: any) => {
        await validations.reduce(async (promise: any, validation: any) => {
            await promise;
            return validation.run(req);
        }, Promise.resolve());

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const errorsArray = errors.array();
            return res.status(400).json(errorResponse(errorsArray[0].msg, errorsArray));
        }

        return next();
    };
};
