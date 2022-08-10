import { Request, Response } from "express";
import { addUser } from "./users.service"

export const createUser = async (req: Request, res: Response) => {
    const { username, role } = req.body;
    try {
        if (!username || !["admin", "employee"].includes(role)) {
            return res.status(400).send({
                message: `username and role(admin or employee) are requied`
            })
        };
        const response = await addUser({ username, role });
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({
            message: "something went wrong!"
        });
    }
}