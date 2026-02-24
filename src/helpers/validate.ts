import { validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { error } from "./response"; // tumhari response helper file se error function

// validations ko wrap karne wala middleware
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // saare validations sequentially run karo
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) break;
        }

        // request ke validation result nikaalo
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array();
            return res.status(400).json(error(errorsArray[0].msg, errorsArray));
        }

        next();
    };
};
