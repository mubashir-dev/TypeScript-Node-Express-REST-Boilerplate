import { Request, Response, NextFunction } from "express";
import User from "../Models/User.Model";
import { IUser } from "../Interfaces/IUser.Interface";
import * as AuthService from "../Services/AuthService";
import { signUpValidator } from "../Validations/AuthValidation";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await AuthService.store(req.body, res);
        res.status(201).send(data);
    } catch (error) {
        next(error);
    }
}