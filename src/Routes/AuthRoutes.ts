import { NextFunction, Request, Response, Router } from "express";
const router: Router = Router();
import * as AuthController from "../Controllers/AuthController";
import { validator } from "../Middlewares/ValidateRequest";
import { signUpValidator, signInValidator, accountVerification, sendVerificationCode } from "../Validations/AuthValidation";

router.post("/sign-up", validator(signUpValidator), AuthController.signUp);
router.post("/sign-in", validator(signInValidator), AuthController.signIn);
router.post("/activate-account", validator(accountVerification), AuthController.activateAccount);
router.post("/send-verification-code", validator(sendVerificationCode), AuthController.sendVerificationCode);

export default router;