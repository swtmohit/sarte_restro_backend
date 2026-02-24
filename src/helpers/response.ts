import {NextFunction, Request, RequestHandler, Response} from "express";
// import {encryptObjectValues} from './index'

export interface RestApiResponse<T> {
    data?: T | null,
    type?: "error" | "success",
    message?: string,
    errors?: any[]
}

export function success<T = any>(message: string, data: T | null = null): RestApiResponse<T> {
    return {
        data,
        type: "success",
        message
    };
}

// export function response<T = any>(data: T | null = null, message = "Success"): RestApiResponse<T> {
//     return {
//         data: encryptObjectValues(data),
//         type: "success",
//         message
//     };
// }

export function error<T = any>(message: string, errors: any[] = [], data: T | null = null): RestApiResponse<T> {
    return {
        data,
        errors,
        message,
        type: "error"
    };
}

export const wrapRequestHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};