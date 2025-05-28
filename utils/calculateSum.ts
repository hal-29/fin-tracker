import { Type } from "@google/genai";

export const calculateSumFunctionDeclaration = {
  name: "calculate_sum",
  description:
    "Calculates the sum of transaction amounts with each currency. Returns a JSON object with the total amount for each currency.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      transactions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            amount: {
              type: Type.NUMBER,
              description: "The amount of the transaction.",
            },
            currency: {
              type: Type.STRING,
              description:
                "The currency of the transaction (e.g., 'USD', 'ETB', 'EUR').",
            },
          },
          required: ["amount", "currency"],
        },
        description: "An array of transactions to calculate the sum from.",
      },
    },
    required: ["transactions"],
  },
};

export function calculateSum(data: {
  transactions: { amount: number; currency: string }[];
}) {
  console.log("CALCULATE SUM FUNCTION CALLED WITH DATA:", data);
  const total = data.transactions.reduce((sum, transaction) => {
    if (sum[transaction.currency]) {
      sum[transaction.currency] += transaction.amount;
    } else {
      sum[transaction.currency] = transaction.amount;
    }
    return sum;
  }, {} as any);

  return JSON.stringify(total, null, 2);
}
