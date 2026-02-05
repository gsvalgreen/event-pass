import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';
import { randomUUID } from 'crypto';

describe('Ticket Concurrency', () => {
    let eventId: string;
    let userTokens: string[] = [];

    beforeAll(async () => {
        await prisma.ticket.deleteMany();
        await prisma.event.deleteMany();
        await prisma.user.deleteMany();

        // Create Event with small capacity
        const event = await prisma.event.create({
            data: {
                title: 'Limited Event',
                description: 'Only 5 spots',
                date: new Date(),
                location: 'Space',
                totalTickets: 5,
                availableTickets: 5,
            },
        });
        eventId = event.id;

        // Create 10 Users
        for (let i = 0; i < 10; i++) {
            const email = `user${i}@test.com`;
            const res = await request(app).post('/api/auth/register').send({
                name: `User ${i}`,
                email,
                password: 'password123',
            });
            userTokens.push(res.body.token);
        }
    });

    it('should prevent overbooking using atomic transactions', async () => {
        // Try to buy 10 tickets for an event with 5 spots
        const buyPromises = userTokens.map((token) =>
            request(app)
                .post('/api/tickets')
                .set('Authorization', `Bearer ${token}`)
                .send({ eventId })
        );

        const responses = await Promise.all(buyPromises);

        const successCount = responses.filter((r) => r.status === 201).length;
        const failCount = responses.filter((r) => r.status === 400).length;

        expect(successCount).toBe(5);
        expect(failCount).toBe(5);

        const updatedEvent = await prisma.event.findUnique({ where: { id: eventId } });
        expect(updatedEvent?.availableTickets).toBe(0);
    });
});
