import mongoose from "mongoose";

export const connectDatabase = (connectionString: string) => {
    mongoose.connect(connectionString, {}, (err) => {
        if (!err) {
            console.log(`✔ Databse Connected Successfully`);
        } else {
            console.error(`❌ Databse Connected Failed`);
        }
    });
    mongoose.connection.on("disconnected", () => {
        console.log(`Databse Connection Disconnected`);
    });
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        process.exit(0);
    });
}