import User from "../Models/User.Model";
import { IUser } from "../Interfaces/IUser.Interface";
import * as CommonService from '../Services/CommonService';
import { Response } from "express";
import * as ApiResponse from '../Helpers/CustomResponser';

export const store = async (body: IUser, res: Response) => {
    const { name, username, email, password } = body;
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
    const user = User.create({ name, username, email, password });
    return user;
}