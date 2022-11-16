
import * as Joi from "joi";

export const signUpValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm_password: Joi.any().valid(Joi.ref('password')).required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } })
});

export const signInValidator = Joi.object({
    type: Joi.string().required().valid('email', 'username'),
    email: Joi.string().email().when('type', { is: 'email', then: Joi.required() }),
    username: Joi.string().when('type', { is: 'username', then: Joi.required() }),
    password: Joi.string().required(),
});

export const accountVerification = Joi.object({
    code: Joi.string().required().label('Code'),
});

export const passwordReset = Joi.object({
    password: Joi.string().required(),
    confirm_password: Joi.any().valid(Joi.ref('password')).required()
        .label('Confirm password')
        .options({ messages: { 'any.only': '{{#label}} does not match' } })
});

export const emailVerification = Joi.object({
    email: Joi.string().email().required().label('Email')
});

