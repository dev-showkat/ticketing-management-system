import { Request, Response } from "express";
import { addTicket, findTickets, findAllTickets, markClosed, removeTicket } from "./tickets.service"

export const createTicket = async (req: Request, res: Response) => {
    let { title, description, assignedTo } = req.body;
    try {
        if (!title || !description) {
            return res.status(400).send({
                message: "title and description are requied"
            });
        }
        if (!assignedTo) assignedTo = res.locals.username;
        const response = await addTicket({ title, description, assignedTo });
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({
            message: "something went wrong!"
        });
    }
}

export const getTickets = async (req: Request, res: Response) => {
    const { title, status, priority } = req.query;
    try {
        let response: any;
        if (title) {
            response = await findTickets({ title: title });
        } else if (status) {
            response = await findTickets({ status: status });
        } else {
            response = await findTickets({ priority: priority });
        }
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({
            message: "something went wrong!"
        });
    }
}

export const getAllTicket = async (req: Request, res: Response) => {
    try {
        const response = await findAllTickets();
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({
            message: "something went wrong!"
        });
    }
}
export const markAsClosed = async (req: Request, res: Response) => {
    const { ticketID } = req.params;
    try {
        if (!ticketID) {
            return res.status(404).send({
                message: `Ticket not found with id: ${ticketID}`
            });
        }
        const { username, role } = res.locals;
        const response = await markClosed(ticketID, { username, role });
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({
            message: "something went wrong!"
        });
    }
}

export const deleteTicket = async (req: Request, res: Response) => {
    const { ticketID } = req.params;
    try {
        if (!ticketID) {
            return res.status(404).send({
                message: `Ticket not found with id: ${ticketID}`
            });
        }
        const response = await removeTicket(ticketID);
        res.status(response.status).send(response.data);
    } catch (error: any) {
        console.error(error.message);
        res.status(500).send({
            message: "something went wrong!"
        });
    }
}