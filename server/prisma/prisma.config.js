// Prisma Config (JavaScript)
// This file is used by the Prisma CLI to connect to the database

const config = {
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
};

module.exports = config;
