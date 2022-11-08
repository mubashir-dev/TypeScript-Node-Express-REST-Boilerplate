
import * as Joi from "joi";

export const signUpValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const signInValidator = Joi.object({
    type: Joi.string().required().valid('email', 'username'),
    email: Joi.string().email().when('type', { is: 'email', then: Joi.required() }),
    username: Joi.string().when('type', { is: 'username', then: Joi.required() }),
    password: Joi.string().required(),
});

