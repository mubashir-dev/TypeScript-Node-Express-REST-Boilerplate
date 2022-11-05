import { Request, Response, NextFunction } from "express";
import * as ApiResponse from '../Helpers/CustomResponser';

export const validator = (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    const data = schema.validate(req.body, { abortEarly: false });
    if (data.error) {
        let _errors: any = [];
        data.error.details.forEach((element: any) => {
            _errors.push(element.message);
        });
        return ApiResponse.validationWithData(res, _errors);
    }
    next();
};

