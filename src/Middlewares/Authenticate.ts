import { Request, Response, NextFunction } from "express";
import * as JWT from "jsonwebtoken";
import * as JwtService from "../Services/JwtService";
import * as ApiResponse from "../Helpers/CustomResponser";
require("dotenv").config();


export const Authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let jwt = req.headers.authorization;
        if (!jwt) {
            return ApiResponse.unauthorizeError(res, "Unauthorized access");
        }
        const user = await JwtService.verifyAccessToken(req, res, next);
        req.user = user;
        next();
    } catch (error: any) {
        if (error) {
            res.status(401).json({ message: "Access token has been expired" });
            return;
        }
        res.status(500).json({ message: "authentication failed" });
    }
};
