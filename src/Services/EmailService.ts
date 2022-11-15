import nodemailer from 'nodemailer';
import * as dotenv from "dotenv";
import { IEmailConfigOption, IEmailOptions } from '../Interfaces/IEmailOption.Interface';
import { parserString } from '../Helpers/StringHelper';

const transporterOptions: IEmailConfigOption = {
    host: parserString(process.env.EMAIL_HOST!),
    port: parseInt(process.env.EMAIL_PORT!),
    auth: {
        user: parserString(process.env.EMAIL_USER!),
        pass: parserString(process.env.EMAIL_PASSWORD!)
    }
};

export const sendEmail = async (emailOptions: IEmailOptions) => {
    const transporter = nodemailer.createTransport(transporterOptions);
    const email: IEmailOptions = {
        ...emailOptions
    };
    await transporter.sendMail(email).catch(error => {
        console.log('Email has not sent', error.message);
    });

}
