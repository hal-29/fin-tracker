import prisma, { Prisma } from "@/db";
import { Type } from "@google/genai";

export const createTransactionFunctionDeclaration = {
  name: "create_transaction",
  description: "Creates a new transaction in the database.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: {
        type: Type.NUMBER,
        description: "The amount of the transaction.",
      },
      date: {
        type: Type.STRING,
        description:
          "The date of the transaction in UTC ISO 8601 format (e.g., 2023-01-01T00:00:00Z).",
      },
      category: {
        type: Type.STRING,
        description:
          "The category of the transaction. use one of the following (groceries, electronics, clothing, hobbies) ).",
      },
      description: {
        type: Type.STRING,
        description: "A brief description of the transaction.",
      },
      currency: {
        type: Type.STRING,
        description:
          "The currency of the transaction (e.g., 'USD', 'ETB', 'EUR'). if it's not specified use 'ETB' as default.",
      },
    },
    required: ["amount", "date", "category", "description"],
  },
};

export default async function createTrannsaction(
  data: Prisma.TransactionCreateInput
) {
  console.log("CREATE TRANSACTION FUNCTION CALLED WITH DATA:", data);
  const taransaction = await prisma.transaction.create({
    data,
  });

  return JSON.stringify(taransaction, null, 2);
}
