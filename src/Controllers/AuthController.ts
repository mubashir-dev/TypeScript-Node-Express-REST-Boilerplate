import { Request, Response, NextFunction } from "express";
import * as AuthService from "../Services/AuthService";
import * as ApiResponse from "../Helpers/CustomResponser";
import User from "../Models/User.Model";
import UserCode from "../Models/UserCode.Model";
import { IUserBasicData, UserPlayload, UserTuple, CodeType } from "../Interfaces/IUser.Interface";
import * as CommonService from "../Services/CommonService";
import * as JwtService from "../Services/JwtService";
import * as EmailService from "../Services/EmailService";
import { IEmailOptions } from "../Interfaces/IEmailOption.Interface";

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email } = req.body;
        const [checkEmail, checkUsername] = await Promise.all([
            CommonService.checkIfExists(User, { param: "email", value: email }),
            CommonService.checkIfExists(User, { param: "username", value: username }),
        ]);
        if (checkEmail) {
            return ApiResponse.validationWithData(res, [
                `Email ${email} already taken`,
            ]);
        }
        if (checkUsername) {
            return ApiResponse.validationWithData(res, [
                `Username ${username} already taken`,
            ]);
        }
        const userSignUp = await AuthService.store(req.body);
        const token = CommonService.generateToken();
        const userActivation: any = await AuthService.storeUserCode({
            user: userSignUp._id,
            token: token,
            type: CodeType.ACCOUNT_VERIFICATION
        });
        const data: IUserBasicData = {
            _id: userSignUp._id,
            name: userSignUp.name,
        };
        //send email with token
        const emailOptions: IEmailOptions = {
            to: userSignUp.email,
            from: "test@gmail.com",
            subject: "Verify Your Account",
            html: `<p>Verify Your Account,using the following code <b>${userActivation.token}</b>,the code is valid for 24 hours<p>`,
        };
        await EmailService.sendEmail(emailOptions);
        return ApiResponse.successWithData(
            res,
            "account created successfully",
            data
        );
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message}`);
    }
};

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body;
        const findOptions = {
            ...(email && {
                email: {
                    $regex: new RegExp(email),
                    $options: "i",
                },
            }),
            ...(username && {
                username: {
                    $regex: new RegExp(username),
                },
            }),
        };
        const userExist = await AuthService.findOne(findOptions);
        if (!userExist) {
            return ApiResponse.unauthorizeError(res, "account not found");
        }
        if (userExist.status == "PENDING") {
            return ApiResponse.unauthorizeError(
                res,
                "account verification is pending"
            );
        }
        if (userExist.status == "SUSPENDED") {
            return ApiResponse.unauthorizeError(
                res,
                "account is suspended,contact support"
            );
        }
        const passwordMatching = await AuthService.comparePassword(
            userExist.password,
            password
        );
        if (!passwordMatching) {
            return ApiResponse.unauthorizeError(
                res,
                "email or password may be incorrect"
            );
        }
        const data: IUserBasicData = {
            _id: userExist._id,
            name: userExist.name,
        };
        const [accessToken, refreshToken]: string | any = await Promise.all([
            JwtService.generateAccessToken(data),
            JwtService.generateRefreshToken(data),
        ]);
        const userPlayload: UserPlayload = {
            _id: data._id,
            name: data.name,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        return ApiResponse.successWithData(res, "login sucessfully", userPlayload);
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message} `);
    }
};

export const activateAccount = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = await AuthService.verifyToken(req.body.code);
    if (!result) {
        return ApiResponse.simpleValidationError(res, `code does not exist`);
    }

    if (result.isValid > 24) {
        return ApiResponse.simpleValidationError(
            res,
            "code is either invalid or expired"
        );
    }
    //revoke token & activate account
    const activateUser = await AuthService.verifyAccount(
        result.userId,
        result._id
    );

    if (activateUser) {
        return ApiResponse.simpleValidationError(
            res,
            "account successfully activated"
        );
    }
    return ApiResponse.simpleValidationError(res, "account activation failed");
};

export const sendVerificationCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req.body;
        const checkEmail = await CommonService.checkIfExists(User, {
            param: 'email',
            value: email
        });
        if (!checkEmail) {
            return ApiResponse.notFound(res, "Account does not exist");
        }
        const userExist: UserTuple = await AuthService.findOne({
            'email': email,
        });

        if (userExist?.status != 'PENDING') {
            return ApiResponse.simpleValidationError(res, `Accoun has already been verified`);
        };
        const token = CommonService.generateToken();
        await AuthService.storeUserCode({
            user: userExist?._id,
            token: token,
            type: CodeType.ACCOUNT_VERIFICATION
        });
        //send email with token
        const emailOptions: IEmailOptions = {
            to: userExist?.email!,
            from: "test@gmail.com",
            subject: "Verify Your Account",
            html: `<p>Verify Your Account,using the following code <b>${token}</b>,the code is valid for 24 hours<p>`,
        };
        await EmailService.sendEmail(emailOptions);
        return ApiResponse.successWithoutData(
            res,
            "Verification code has been sent successfully"
        );
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message} `);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const checkEmail = await CommonService.checkIfExists(User, {
            param: 'email',
            value: email,
        });
        if (!checkEmail) {
            return ApiResponse.notFound(res, "Account does not exist");
        }
        const userExist: UserTuple = await AuthService.findOne({ email });
        if (userExist?.status != 'ACTIVE') {
            return ApiResponse.simpleValidationError(res, `Account has not been verified`);
        };
        const token = CommonService.generateToken();
        await AuthService.storeUserCode({
            user: userExist?._id,
            token: token,
            type: CodeType.PASSWORD_RESET
        });

        //send email with token
        const emailOptions: IEmailOptions = {
            to: userExist?.email!,
            from: "test@gmail.com",
            subject: "Reset Password",
            html: `<p>Reset Password,using the following lin <b> <a href="${req.protocol}://${req.get(
                "host"
            )}/auth/reset-password/${token}">Password Reset Link</a></b},the code is valid for 24 hours<p>`,
        };
        await EmailService.sendEmail(emailOptions);
        return ApiResponse.successWithoutData(res, 'Password reset link has been sent successfully');
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message} `);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.params;
        const { password } = req.body;
        const checkCode = await CommonService.checkIfExists(UserCode, {
            param: 'token',
            value: code,
        });
        if (!checkCode) {
            return ApiResponse.notFound(res, "Password reset link is invalid");
        }
        const codeExist = await AuthService.getUserCode({ token: code });

        await AuthService.resetPassword({
            _id: codeExist?.user,
            password,
            token: code
        });
        return ApiResponse.successWithoutData(res, 'Password has been restored successfully');
    } catch (error: any) {
        return ApiResponse.ServerError(res, `${error.message} `);
    }
}

export const currentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id } = req.user;
        const userData: UserTuple = await AuthService.findOne({ _id });
        return ApiResponse.successWithData(res, 'current logged user', userData);
    }
    catch (error: any) {
        return ApiResponse.ServerError(res, error.message);
    }
}