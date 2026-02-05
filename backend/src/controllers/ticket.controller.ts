import { Request, Response } from 'express';
import { TicketService } from '../services/ticket.service';
import { z } from 'zod';

const ticketService = new TicketService();

const buyTicketSchema = z.object({
    eventId: z.string().uuid(),
});

const validateTicketSchema = z.object({
    token: z.string(),
});

export class TicketController {
    async buy(req: Request, res: Response) {
        const { eventId } = buyTicketSchema.parse(req.body);
        const userId = req.user!.userId; // Guaranteed by authMiddleware

        const ticket = await ticketService.buyTicket(userId, eventId);
        return res.status(201).json(ticket);
    }

    async listMyTickets(req: Request, res: Response) {
        const userId = req.user!.userId;
        const tickets = await ticketService.listMyTickets(userId);
        return res.json(tickets);
    }

    async validate(req: Request, res: Response) {
        const { token } = validateTicketSchema.parse(req.body);
        const result = await ticketService.validateCheckIn(token);
        return res.json(result);
    }
}
