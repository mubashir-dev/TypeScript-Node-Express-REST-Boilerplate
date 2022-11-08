import User from "../Models/User.Model";
import { IUser } from "../Interfaces/IUser.Interface";
import * as CommonService from '../Services/CommonService';
import * as PasswordService from '../Helpers/PasswordHelper';

export const store = async (body: IUser) => {
    const password = await PasswordService.hashPassword(body.password);
    const { name, username, email } = body;
    const user = new User({ name, username, email, password });
    return user.save();
}

export const findOne = async (find: any) => {
    return User.findOne(find)
}

export const comparePassword = async (hash: string, password: string) => {
    return await PasswordService.comparePassword(password, hash);
}