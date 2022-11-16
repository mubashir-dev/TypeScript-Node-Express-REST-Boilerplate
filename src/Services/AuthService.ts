import User from "../Models/User.Model";
import UserActivation from "../Models/UserActivation.Model";
import { IUser, Status } from "../Interfaces/IUser.Interface";
import * as CommonService from "../Services/CommonService";
import * as PasswordService from "../Helpers/PasswordHelper";

export const store = async (body: IUser) => {
    const password = await PasswordService.hashPassword(body.password);
    const { name, username, email } = body;
    const user = new User({ name, username, email, password });
    return user.save();
};

export const storeVerificationToken = async (body: any) => {
    const { user, token } = body;
    const userActivation = await UserActivation.findOneAndUpdate({ user: user }, { user, token }, { upsert: true });
    return userActivation;
};

export const verifyToken = async (token: string) => {
    const currentDate = new Date();
    const tokenExists = await UserActivation.aggregate([
        { $match: { token: token } },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            },
        },
        { $unwind: "$user" },
        { $match: { "user.status": "PENDING" } },
        {
            $addFields: {
                isValid: {
                    $dateDiff: {
                        startDate: "$createdAt",
                        endDate: currentDate,
                        unit: "hour",
                    },
                },
                userId: "$user._id",
            },
        },
        {
            $project: {
                userId: 1,
                isValid: 1,
            },
        },
    ]);
    return tokenExists[0];
};

export const verifyAccount = async (userId: string, tokenId: string) => {
    const [tokenExists, activateUser] = await Promise.all([
        UserActivation.deleteOne({ user: userId, _id: tokenId }),
        User.updateOne({ _id: userId }, { $set: { status: Status.IS_ACTIVE } }),
    ]);
    return activateUser.modifiedCount == 1;
};
export const findOne = async (find: any) => {
    return User.findOne(find);
};

export const comparePassword = async (hash: string, password: string) => {
    return await PasswordService.comparePassword(password, hash);
};
