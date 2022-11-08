import { Router } from "express";
const router: Router = Router();
import * as AuthController from "../Controllers/AuthController";
import { validator } from "../Middlewares/ValidateRequest";
import { signUpValidator, signInValidator } from "../Validations/AuthValidation";

router.post("/sign-up", validator(signUpValidator), AuthController.signUp);
router.post("/sign-in", validator(signInValidator), AuthController.signIn);

export default router;