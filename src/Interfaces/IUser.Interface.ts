import { Document } from "mongoose";

export enum Role {
    IS_ADMIN = 'ADMIN',
    IS_USER = 'USER',
}

export enum Status {
    IS_ACTIVE = 'ACTIVE',
    IS_PENDING = 'PENDING',
    IS_SUSPENDED = 'SUSPENDED'
}
export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    password: string;
    status: string;
    role: string;
    _id?: string;
}

export interface IUserPlayload extends IUser {
    accessToken: string;
    refreshToken: string;
}
export type IUserBasicData = Pick<IUser, '_id' | 'name'>
export type UserPlayload = Pick<IUserPlayload, '_id' | 'name' | 'accessToken' | 'refreshToken'>;