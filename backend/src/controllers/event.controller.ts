import { Request, Response } from 'express';
import { EventService } from '../services/event.service';

const eventService = new EventService();

export class EventController {
    async create(req: Request, res: Response) {
        const event = await eventService.create(req.body);
        return res.status(201).json(event);
    }

    async list(req: Request, res: Response) {
        const events = await eventService.list();
        return res.json(events);
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const event = await eventService.getById(id);
        return res.json(event);
    }
}
