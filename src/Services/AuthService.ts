import User from "../Models/User.Model";
import UserCode from "../Models/UserCode.Model";
import { IUser, Status, CodeType } from "../Interfaces/IUser.Interface";
import * as CommonService from "../Services/CommonService";
import * as PasswordService from "../Helpers/PasswordHelper";

export const store = async (body: IUser) => {
    const password = await PasswordService.hashPassword(body.password);
    const { name, username, email } = body;
    const user = new User({ name, username, email, password });
    return user.save();
};

export const storeUserCode = async (body: any) => {
    const { user, token, type } = body;
    const userActivation = await UserCode.findOneAndUpdate({ user: user }, { user, token, type }, { upsert: true });
    return userActivation;
};

export const verifyToken = async (token: string) => {
    const currentDate = new Date();
    const tokenExists = await UserCode.aggregate([
        { $match: { token: token, type: CodeType.ACCOUNT_VERIFICATION } },
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
        UserCode.deleteOne({ user: userId, _id: tokenId }),
        User.updateOne({ _id: userId }, { $set: { status: Status.IS_ACTIVE } }),
    ]);
    return activateUser.modifiedCount == 1;
};

export const getUserCode = async (find: any) => {
    return UserCode.findOne(find);
}

export const findOne = async (find: any) => {
    return User.findOne(find).select('-password');
};

export const resetPassword = async (user: any) => {
    const { password, _id, token } = user;
    const [passwordHash, revokeToken] = await Promise.all([
        PasswordService.hashPassword(password),
        UserCode.deleteOne({ token: token })
    ]);
    return User.updateOne({ _id }, { $set: { password: passwordHash } });
};

export const comparePassword = async (hash: string, password: string) => {
    return await PasswordService.comparePassword(password, hash);
};
