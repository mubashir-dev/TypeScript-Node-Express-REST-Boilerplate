import mongoose, { Schema } from "mongoose";
import { IUserActication, CodeType } from "../Interfaces/IUser.Interface";
import User from './User.Model';

const UserCodeSchema: Schema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        type: {
            type: String,
            enum: CodeType,
            required: true,
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

const UserCode = mongoose.model<IUserActication>("UserCode", UserCodeSchema);
export default UserCode;