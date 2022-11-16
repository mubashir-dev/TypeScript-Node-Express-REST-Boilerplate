import { Request, Response, NextFunction } from "express";

export const successWithoutData = function (res: Response, msg: string) {
    let data = {
        status: true,
        message: msg,
    };
    return res.status(200).json(data);
};

export const successWithData = function (res: Response, msg: string, data: any) {
    let resData = {
        status: true,
        message: msg,
        data: data,
    };
    return res.status(200).json(resData);
};

export const recordCreated = function (res: Response, msg: string, data: Object) {
    let resData = {
        status: true,
        message: msg,
        data: data,
    };
    return res.status(201).json(resData);
};

export const ServerError = function (res: Response, msg: string) {
    let data = {
        status: false,
        message: msg,
    };
    return res.status(500).json(data);
};

export const notFound = function (res: Response, msg: string) {
    let data = {
        status: false,
        message: msg,
    };
    return res.status(404).json(data);
};

export const validationWithData = function (res: Response, data: Object) {
    let resData = {
        status: false,
        errors: data,
    };
    return res.status(422).json(resData);
};

export const simpleValidationError = function (res: Response, msg: string) {
    let resData = {
        status: false,
        message: msg,
    };
    return res.status(400).json(resData);
};

export const unauthorizeError = function (res: Response, msg: string) {
    let resData = {
        status: false,
        message: msg,
    };
    return res.status(401).json(resData);
};
