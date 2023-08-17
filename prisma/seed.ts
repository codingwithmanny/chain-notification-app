// Imports
// ========================================================
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

// Config
// ========================================================
const prisma = new PrismaClient();

// Seed
// ========================================================
async function main() {
  const jobs = [];

  for (let i = 0; i < 6;  i++) {
    jobs.push(await prisma.job.create({
      data: {
        // status: 'PENDING',
        // jobId: undefined,
        network: ['smartweave', 'mumbai'][Math.round(Math.random())],
        contractAddress: faker.datatype.hexadecimal({ length: 40 }),
        contractABICode: JSON.stringify({}),
        functionName: faker.lorem.word(),
        functionValue: faker.lorem.word(),
        functionValueType: ['string', 'number', 'boolean'][Math.round(Math.random() * 2)],
        functionValueIndex: faker.datatype.number({ min: 0, max: 10 }),
        operator: ['=', '>', '<', '>=', '<='][Math.round(Math.random() * 4)],
        conditionValue: `${faker.datatype.number({ min: 0, max: 10 })}`,
        email: faker.internet.email(),
        // attempts: undefined,
      },
    }));
  }

  console.log(`Seeded ${jobs.length} jobs`);
}

// Init
// ========================================================
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });