import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../users/users.models";

export const isAuthenticted = async (req: Request, res: Response, next: Function) => {
    const { authorization } = req.headers;
    try {
        if (!authorization || !authorization.startsWith("Bearer")) {
            return res.status(403).send({
                message: "Unauthorized"
            });
        }
        const token: string = authorization.split("Bearer ")[1];
        const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string);
        res.locals = { ...res.locals, username: decodedToken?.username, role: decodedToken?.role}
        const user = await userModel.findOne({ username: decodedToken?.username, role: decodedToken?.role});
        if (!user?._id || user === null) return res.status(401).send({
            message: "Unauthorized"
        });
        console.log(`decoded token: ${decodedToken}`) ;
        return next();
    } catch (err) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
};

export const isAdmin = async (req: Request, res: Response, next: Function) => {
    try {
        const { role } = res.locals;
        if(!(role === "admin")) return res.status(403).send({
            message: "Unauthorized"
        });
        return next();
    } catch (err) {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
};
