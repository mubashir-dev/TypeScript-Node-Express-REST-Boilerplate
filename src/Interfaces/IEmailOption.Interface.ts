export interface IEmailConfigOption {
    host: string;
    port: number;
    auth: {
        user: string;  //username
        pass: string; //password 
    }
}

export interface IEmailOptions {
    from: string;
    to: string;
    cc?: string[];
    subject: string;
    html?: string;
    template?: any;
}