import prisma from "@/db";
import { put } from "@vercel/blob";
import { Readable } from "stream";
import { format } from "date-fns";
import { Type } from "@google/genai";

export const exportTransactionsCSVFunctionDeclaration = {
  name: "export_transactions_csv",
  description:
    "Export all transactions within a specified time period as a CSV and return status of the upload.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      fromDate: {
        type: Type.STRING,
        description:
          "Start date for filtering transactions to export . Format: UTC ISO 8601 (e.g., 2023-01-01T00:00:00Z).",
      },
      toDate: {
        type: Type.STRING,
        description:
          "End date for filtering transactions to export . Format: UTC ISO 8601 (e.g., 2023-01-31T23:59:59Z).",
      },
    },
  },
  required: [],
};

export default async function exportTransactionsToCSV({
  fromDate,
  toDate,
}: {
  fromDate?: string;
  toDate?: string;
}): Promise<string | null> {
  console.log(
    `EXPORTING TRANSACTIONS TO CSV: ${fromDate || ""} to ${toDate || ""}`
  );
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const header = ["id", "amount", "category", "description", "createdAt"];
    const rows = transactions.map((tx) => [
      tx.id,
      tx.amount,
      tx.category,
      tx.description || "",
      format(tx.createdAt, "yyyy-MM-dd HH:mm:ss"),
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const stream = Readable.from([csv]);

    const dateStr = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
    const filename = `transactions-${dateStr}.csv`;

    const blob = await put(`/fin-tracker/${filename}`, stream, {
      access: "public",
    });

    return blob.downloadUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
