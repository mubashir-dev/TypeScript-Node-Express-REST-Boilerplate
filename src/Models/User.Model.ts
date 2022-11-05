import mongoose, { Schema } from "mongoose";
import { IUser, Role, Status } from "../Interfaces/IUser.Interface";

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            require: true
        },
        role: {
            type: String,
            enum: Role,
            default: Role.IS_USER
        },
        status: {
            type: String,
            enum: Status,
            default: Status.IS_PENDING,
        },
    },
    { timestamps: true }
);
const User = mongoose.model<IUser>("User", UserSchema);
export default User;