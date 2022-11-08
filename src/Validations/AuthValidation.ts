
import * as Joi from "joi";

export const signUpValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const signInValidator = Joi.object({
    type: Joi.number().required().valid('email', 'username'),
    email: Joi.alternatives().conditional('type', { is: 'email', then: Joi.string().required() }),
    username: Joi.alternatives().conditional('type', { is: 'username', then: Joi.string().required() }),
    password: Joi.string().required(),
});

