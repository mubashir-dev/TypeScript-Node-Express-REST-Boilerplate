import { NextFunction, Request, Response, Router } from "express";
const router: Router = Router();
import * as AuthController from "../Controllers/AuthController";
import { validator } from "../Middlewares/ValidateRequest";
import { Authenticate } from '../Middlewares/Authenticate';
import { signUpValidator, signInValidator, accountVerification, emailVerification, passwordReset } from "../Validations/AuthValidation";

router.get("/current-user", Authenticate, AuthController.currentUser);
router.post("/sign-up", validator(signUpValidator), AuthController.signUp);
router.post("/sign-in", validator(signInValidator), AuthController.signIn);
router.post("/activate-account", validator(accountVerification), AuthController.activateAccount);
router.post("/send-verification-code", validator(emailVerification), AuthController.sendVerificationCode);
router.post("/forgot-password", validator(emailVerification), AuthController.forgotPassword);
router.patch("/reset-password/:code", validator(passwordReset), AuthController.resetPassword);

export default router;