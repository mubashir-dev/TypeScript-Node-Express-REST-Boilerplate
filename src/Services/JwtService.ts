import { Request, Response, NextFunction } from "express";
import * as JWT from "jsonwebtoken";
import { IUserBasicData } from "../Interfaces/IUser.Interface";
require("dotenv").config();

//refactorization needed
export const generateAccessToken = (
    user: IUserBasicData
): Promise<void | string> => {
    return new Promise((resolve, reject) => {
        const jwtPayload: IUserBasicData = user;
        const options = {
            expiresIn: process.env.JWT_TIMEOUT_DURATION,
            issuer: "test.com",
        };
        JWT.sign(jwtPayload, process.env.JWT_SECRET!, options, (error, token) => {
            if (error) {
                reject("JWT access token has not been issued");
                return;
            }
            resolve(token);
        });
    });
};

export const generateRefreshToken = (
    user: IUserBasicData
): Promise<void | string> => {
    return new Promise((resolve, reject) => {
        const jwtPayload = user;
        const options = {
            expiresIn: process.env.JWT_REFRESH_DURATION,
            issuer: "test.com",
        };
        JWT.sign(
            jwtPayload,
            process.env.JWT_REFRESH_SECRET!,
            options,
            (error, token) => {
                if (error) {
                    console.log(error.message);
                    reject("JWT refresh token has not been issued");
                    return;
                }
                resolve(token);
            }
        );
    });
};

export const verifyAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers["authorization"]) return next(new Error("Access Denied"));
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    return new Promise((resolve, reject) => {
        JWT.verify(
            token, process.env.JWT_SECRET!, (err, payload) => {
                if (err) return reject(err);
                resolve(payload);
            }
        );
    });
};

export const verifyRefreshToken = (refreshToken: string) => {
    return new Promise((resolve, reject) => {
        JWT.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!,
            (error, payload) => {
                if (error) return reject(error);
                resolve(payload);
            }
        );
    });
};
