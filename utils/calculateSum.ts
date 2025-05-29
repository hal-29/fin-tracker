import prisma from "@/db";
import { Type } from "@google/genai";

export const calculateSumFunctionDeclaration = {
  name: "calculate_sum",
  description:
    "Calculates the amount of money spend for the transactions. optional date filtering parameters can be passed to be specfic. Returns a JSON object with the total amount for each currency.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      fromDate: {
        type: Type.STRING,
        description:
          "Start date for the date of transactions. Format: UTC ISO 8601 (e.g., 2023-01-01T00:00:00Z).",
      },
      toDate: {
        type: Type.STRING,
        description:
          "End date for the date of transactions. Format: UTC ISO 8601 (e.g., 2023-01-31T23:59:59Z).",
      },
    },
    description:
      "Optional parameters to specify the time period of the transactions made.",
    required: [],
  },
};

export async function calculateSum({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}) {
  console.log("CALCULATE SUM FUNCTION CALLED WITH FILTER:", fromDate, toDate);

  const transactions = await prisma.transaction.findMany({
    where: { date: { gte: fromDate, lte: toDate } },
  });

  const total = transactions.reduce((sum, transaction) => {
    if (sum[transaction.currency]) {
      sum[transaction.currency] += transaction.amount;
    } else {
      sum[transaction.currency] = transaction.amount;
    }
    return sum;
  }, {} as any);

  return JSON.stringify(total, null, 2);
}
