import { Router } from 'express';
import { createTicket, getTickets, getAllTicket, markAsClosed, deleteTicket } from './tickets.controller'
import { isAuthenticted, isAdmin } from '../middlewares/authentication'
export const ticketsRouter = Router();

ticketsRouter.post('/new', isAuthenticted, isAdmin, createTicket); 
ticketsRouter.get('/', isAuthenticted, getTickets);
ticketsRouter.get('/all', isAuthenticted, getAllTicket);
ticketsRouter.put('/markAsClosed/:ticketID', isAuthenticted, markAsClosed);
ticketsRouter.delete('/delete/:ticketID', isAuthenticted, isAdmin, deleteTicket);