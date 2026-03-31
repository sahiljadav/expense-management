const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });


const connectionString = process.env.POSTGRESS_CONNECTION || "postgresql://postgres:postgres@localhost:5432/expense_manager?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
