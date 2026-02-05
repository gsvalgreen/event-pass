import { prisma } from '../lib/prisma';
import { AppError } from '../middlewares/error.middleware';
import { z } from 'zod';

const createEventSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    date: z.string().transform((str) => new Date(str)),
    location: z.string().min(3),
    totalTickets: z.number().int().positive(),
});

type CreateEventInput = z.infer<typeof createEventSchema>;

export class EventService {
    async create(data: CreateEventInput) {
        const validated = createEventSchema.parse(data);

        return prisma.event.create({
            data: {
                ...validated,
                availableTickets: validated.totalTickets,
            },
        });
    }

    async list() {
        return prisma.event.findMany({
            orderBy: { date: 'asc' },
        });
    }

    async getById(id: string) {
        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            throw new AppError('Event not found', 404);
        }

        return event;
    }
}
