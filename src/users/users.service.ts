import { userModel, IUser } from './users.models'
import jwt from 'jsonwebtoken';

export const addUser = async (user: IUser) => {
    try {
        const isExists = await userModel.findOne({ username: user.username });
        if (isExists?._id || isExists !== null) {
            return {
                status: 409,
                data: "User Already Exist"
            }
        }
        const newUser = await userModel.create({
            username: user.username.toLowerCase(),
            role: user.role,
        });
        const token = jwt.sign({
            username: newUser.username,
            role: newUser.role
        }, process.env.ACCESS_TOKEN_SECRET_KEY as string, {
            expiresIn: "12h",
        });
        return {
            status: 201,
            data: {
                token: token
            }
        }
    } catch (error: any) {
        console.error(error.message);
        return {
            status: 500,
            data: {
                message: "something went wrong!"
            }
        }
    }
}