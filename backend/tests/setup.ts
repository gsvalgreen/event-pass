import { prisma } from '../src/lib/prisma';

// Clean DB before all tests
beforeAll(async () => {
    // Connect
});

afterAll(async () => {
    await prisma.$disconnect();
});
