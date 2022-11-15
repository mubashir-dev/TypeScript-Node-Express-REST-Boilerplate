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
        await JwtService.verifyAccessToken(req, res, next);
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ message: "Access token has been expired" });
            return;
        }
        res.status(500).json({ message: "authentication failed" });
    }
};
