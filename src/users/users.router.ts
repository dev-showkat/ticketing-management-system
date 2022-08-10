import { Router } from 'express';
import { createUser } from './users.controller'

export const usersRouter = Router();

usersRouter.post('/new', createUser)