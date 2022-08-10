import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { usersRouter } from "./users/users.router";
import { ticketsRouter } from "./tickets/tickets.router";
import fs from "fs";
import path from "path";

dotenv.config();
if (!process.env.PORT) {
    console.log(`port number is missing!`);
    process.exit(1);
}

const mongodbUri: string = process.env.MONGODB_URI as string;

mongoose.connect(mongodbUri, {}, (err) => {
    if (err) console.log(err);
    else console.log(`mongodb connected successfully!`);
})

const PORT: number = parseInt(process.env.PORT as string)
const app: Application = express();
const corsOptions: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
const root: any = path.join(__dirname)
const accessLogStream = fs.createWriteStream(`${root}/access.log`, { flags: 'a' })

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));

app.get('/', (req: Request, res: Response) => {
    res.status(200).send({
        status: 200,
        message: "Health is Good!"
    });
})

app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);
app.get('/logs', (req: Request, res: Response) => {
    res.status(200).sendFile(`${root}/access.log`, (err) => {
        console.log(err);
    })
})
app.get('*', (req: Request, res: Response) => {
    res.status(404).send({
        status: 404,
        message: "Path Not Found!"
    });
})
app.listen(PORT, () => {
    console.log(`server is listening on http://localhost:${PORT}`);
});