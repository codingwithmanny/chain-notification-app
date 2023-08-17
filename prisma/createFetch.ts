// Imports
// ========================================================
import { faker } from "@faker-js/faker";

// Domain
// ========================================================
const API_URL = "http://localhost:3000/api";

// Seed
// ========================================================
async function main() {
  const create = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      network: ["smartweave", "mumbai"][Math.round(Math.random())],
      contractAddress: faker.datatype.hexadecimal({ length: 40 }),
      contractABICode: JSON.stringify({}),
      functionName: faker.lorem.word(),
      functionValue: faker.lorem.word(),
      functionValueType: ["string", "number", "boolean"][
        Math.round(Math.random() * 2)
      ],
      functionValueIndex: faker.datatype.number({ min: 0, max: 10 }),
      operator: ["=", ">", "<", ">=", "<="][Math.round(Math.random() * 4)],
      conditionValue: `${faker.datatype.number({ min: 0, max: 10 })}`,
      email: faker.internet.email(),
    }),
  });

  // fcd78f27-a91c-4920-b2ed-6325ab0ddef4

  const createJson = await create.json();

  console.log(`Created 1 jobs`);
  console.log(createJson);
}

// Init
// ========================================================
main()
  .then(async () => {
    // Do nothing
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
