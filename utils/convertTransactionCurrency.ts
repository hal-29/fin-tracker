import prisma from "@/db";
import { Type } from "@google/genai";

export const convertTransactionCurrencyFunctionDeclaration = {
  name: "convert_transaction_currency",
  description:
    "Converts all transactions from one currency to another using a given exchange rate. Updates both the amount and the currency field of each transaction.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      baseCurrency: {
        type: Type.STRING,
        description:
          "The original currency of the transactions to be converted (e.g., 'USD').",
      },
      targetCurrency: {
        type: Type.STRING,
        description:
          "The currency to convert the transactions to (e.g., 'ETB').",
      },
      rate: {
        type: Type.NUMBER,
        description: "The exchange rate to use for conversion.",
      },
    },
    required: ["baseCurrency", "targetCurrency", "rate"],
  },
};

export async function convertTransactionCurrency({
  baseCurrency,
  targetCurrency,
  rate,
}: {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
}): Promise<string> {
  console.log(
    `CONVERTING TRANSACTION CURRENCY: ${baseCurrency} to ${targetCurrency} at rate ${rate}`
  );

  if (rate <= 0) {
    return "Invalid conversion rate.";
  }

  const updated = await prisma.transaction.updateMany({
    where: { currency: baseCurrency },
    data: {
      amount: {
        multiply: rate,
      },
      currency: targetCurrency,
    },
  });

  if (updated.count == 0)
    `There are no transactions made by the specified currency`;

  return `${updated.count} transactions successfully converted from ${baseCurrency} to ${targetCurrency}.`;
}
