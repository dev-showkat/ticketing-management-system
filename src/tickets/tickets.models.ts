import { Schema, Document, model} from "mongoose";

export interface ITicket {
    title: String,
    description:String,
    status?: String,
    priority?:String,
    assignedTo: String,
    createdAt?: Date;
}
interface ITicketDocument extends ITicket, Document {}

export const ticketSchema = new Schema({
    title: { type: String },
    description: {type: String},
    status: { type: String, default: 'open' },
    priority:{ type: String, default: 'low' },
    assignedTo: {type: String},
    createdAt: { type: Date, default: Date.now }
});

export const ticketModel = model<ITicketDocument>("tickets", ticketSchema);
