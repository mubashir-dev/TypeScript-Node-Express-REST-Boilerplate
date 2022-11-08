import { Request, Response, NextFunction } from "express";
import * as AuthService from "../Services/AuthService";
import * as ApiResponse from "../Helpers/CustomResponser";
import User from '../Models/User.Model';
import { IUserSignUp } from "../Interfaces/IUser.Interface";
import * as CommonService from '../Services/CommonService';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email } = req.body;
        const [checkEmail, checkUsername] = await Promise.all([
            CommonService.checkIfExists(User, { param: 'email', value: email }),
            CommonService.checkIfExists(User, { param: 'username', value: username })
        ]);
        if (checkEmail) {
            return ApiResponse.validationWithData(res, [`Email ${email} already taken`])
        }
        if (checkUsername) {
            return ApiResponse.validationWithData(res, [`Username ${username} already taken`])
        }
        const userSignUp = await AuthService.store(req.body);
        const data: IUserSignUp = {
            _id: userSignUp._id,
            name: userSignUp.name,
            email: userSignUp.email,
            username: userSignUp.username
        };
        return ApiResponse.successWithData(res, 'account created successfully', data);
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message}`);
    }
}

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;
        console.log(`🚀 ~ req.body`, req.body)
        const findOptions = {
            ...(email) && {
                email: {
                    $regex: new RegExp(email),
                    $options: 'i'
                }
            },
            ...(username) && {
                username: {
                    $regex: new RegExp(username),
                }
            },
        }
        const userExist = await AuthService.findOne(findOptions);
        if (!userExist) {
            return ApiResponse.notFound(res, 'account not found');
        }
        const passwordMatching = await AuthService.comparePassword(userExist.password, password);
        if (!passwordMatching) {
            return ApiResponse.unauthorizeError(res, 'credentials are not matching');
        }
        const data: IUserSignUp = {
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            username: userExist.username
        };
        return ApiResponse.successWithData(res, 'login sucessfully', data);
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message}`);
    }
}
