import { ITicket } from './tickets.models'
import { ticketModel } from './tickets.models'
import { Types } from "mongoose";

const { ObjectId } = Types
export const addTicket = async (ticket: ITicket) => {
    try {
        const newTicket = await ticketModel.create(ticket);
        return {
            status: 201,
            data: {
                id: newTicket.id
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

export const findTickets = async (queryString: any) => {
    let tickets = [];
    try {
        tickets = await ticketModel.where(queryString);
        return {
            status: 200,
            data: {
                tickets: tickets
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

export const findAllTickets = async () => {
    let tickets = [];
    try {
        tickets = await ticketModel.find({});
        return {
            status: 200,
            data: {
                tickets: tickets
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


export const markClosed = async (ticketID: string, user: { username: string, role: string }) => {
    try {
        if (!ObjectId.isValid(ticketID)) {
            return {
                status: 404,
                data: "Invalid ticketId"
            }
        }
        const isExists = await ticketModel.findOne({ _id: ticketID });
        if (!isExists?._id || isExists === null) {
            return {
                status: 404,
                data: "Ticket not found"
            }
        }
        if (!(user.username === isExists?.assignedTo) && !(user.role === "admin")) return {
            status: 403,
            data: {
                message: "Unauthorised"
            }
        };
        if (user.username === isExists?.assignedTo) {
            const allTicketsOfUser = await ticketModel.find({ username: user.username });
            for (const t of allTicketsOfUser) {
                if (isExists.priority === "low") {
                    if ((t.priority === "medium" && t.status === "open")) {
                        return {
                            status: 200,
                            data: {
                                message: "A higher priority task remains to be closed",
                                tickets: allTicketsOfUser.filter((t) => (t.priority === "medium" && t.status === "open") || (t.priority === "high" && t.status === "open"))
                            }
                        }
                    } else if ((t.priority === "high" && t.status === "open")) {
                        return {
                            status: 200,
                            data: {
                                message: "A higher priority task remains to be closed",
                                tickets: allTicketsOfUser.filter((t) => t.priority === "medium" && t.status === "open")
                            }
                        }
                    }
                } else if (isExists.priority === "medium") {
                    if (t.priority === "high" && t.status === "open") return {
                        status: 200,
                        data: {
                            message: "A higher priority task remains to be closed"
                        }
                    }
                }
            }
        }
        await isExists.updateOne({ status: "closed" })
        return {
            status: 200,
            data: {
                message: "Ticket closed successfully"
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

export const removeTicket = async (ticketID: string) => {
    try {
        if (!ObjectId.isValid(ticketID)) {
            return {
                status: 404,
                data: "Invalid ticketId"
            }
        }
        const isExists = await ticketModel.findOne({ _id: ticketID });
        if (!isExists?._id || isExists === null) {
            return {
                status: 404,
                data: "Ticket not found"
            }
        }
        await ticketModel.deleteOne({ _id: ticketID });
        return {
            status: 204,
            data: {}
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