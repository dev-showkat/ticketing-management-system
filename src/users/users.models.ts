import { Schema, Document, model } from "mongoose";

export interface IUser {
    username: String,
    role: String
}
interface IUserDocument extends IUser, Document { }

export const userSchema = new Schema({
    username: { type: String, index: true, unique: true, sparse: true },
    role: String
});

export const userModel = model<IUserDocument>("users", userSchema);
