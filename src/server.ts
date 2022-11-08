import express from "express";
import { Request, Response, NextFunction } from "express";
import { connectDatabase } from './Config/DatabaseConnector';
import AuthRoutes from './Routes/AuthRoutes';
import * as dotenv from "dotenv";
import morgan from "morgan";
const app = express();
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
dotenv.config();
connectDatabase(process.env.DB_URL + '/' + process.env.DB_NAME);
app.use(morgan("dev"));
app.get("/welcome", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ message: "✔ Server is Up & Running" });
});
//Routes
app.use("/auth", AuthRoutes);
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is Up & Running On Port ${process.env.PORT}`);
});
