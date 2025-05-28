import prisma from "@/db";
import { Type } from "@google/genai";

export const getTransactionFunctionDeclaration = {
  name: "get_all_transactions",
  description:
    "Retrieves all transactions from the database. it retirieves all the items bought with their date bought and categories.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      take: {
        type: Type.INTEGER,
        description: "Number of transactions to retrieve (default is 100).",
      },
      skip: {
        type: Type.INTEGER,
        description: "Number of transactions to skip (default is 0).",
      },
      order: {
        type: Type.STRING,
        description:
          'Order of transactions by date. "asc" or "desc" (default is asc).',
      },
      fromDate: {
        type: Type.STRING,
        description:
          "Start date for filtering transactions. Format: UTC ISO 8601 (e.g., 2023-01-01T00:00:00Z).",
      },
      toDate: {
        type: Type.STRING,
        description:
          "End date for filtering transactions. Format: UTC ISO 8601 (e.g., 2023-01-31T23:59:59Z).",
      },
      category: {
        type: Type.STRING,
        description:
          "Category to filter transactions by (e.g., 'groceries', 'utilities').",
      },
      greaterThanAmount: {
        type: Type.NUMBER,
        description: "Minimum amount for filtering transactions.",
      },
      lessThanAmount: {
        type: Type.NUMBER,
        description: "Maximum amount for filtering transactions.",
      },
    },
    required: [],
  },
};

interface GetAllFilter {
  take?: number;
  skip?: number;
  order?: "desc" | "asc";
  fromDate?: string;
  toDate?: string;
  category?: string;
  greaterThanAmount?: number;
  lessThanAmount?: number;
}

export async function getTransactions(filter: GetAllFilter = {}) {
  console.log("GET ALL TRANSACTIONS FUNCTION CALLED WITH FILTER:", filter);
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: filter.fromDate,
        lte: filter.toDate,
      },
      category: filter.category,
      amount: {
        gte: filter.greaterThanAmount,
        lte: filter.lessThanAmount,
      },
    },
    orderBy: {
      date: filter.order || "asc",
    },
    take: filter.take || 100,
    skip: filter.skip || 0,
    omit: {
      createdAt: true,
      updatedAt: true,
    },
  });

  return JSON.stringify(transactions, null, 2);
}
