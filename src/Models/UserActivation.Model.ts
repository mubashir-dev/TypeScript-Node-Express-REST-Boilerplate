import mongoose, { Schema } from "mongoose";
import { IUserActication } from "../Interfaces/IUser.Interface";
import User from './User.Model';

const UserActivationSchema: Schema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        isExpire: {
            type: Number,
            default: 24,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
    },
    { timestamps: true }
);

const UserActivation = mongoose.model<IUserActication>("UserActivation", UserActivationSchema);
export default UserActivation;