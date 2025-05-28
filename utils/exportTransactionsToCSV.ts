import prisma from "@/db";
import { put } from "@vercel/blob";
import { Readable } from "stream";
import { format } from "date-fns";
import { Type } from "@google/genai";

export const exportTransactionsCSVFunctionDeclaration = {
  name: "export_transactions_csv",
  description:
    "Export all transactions as a CSV and return status of the upload.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
  required: [],
};

export async function handleExportTransactionsCSV() {
  const url = await exportTransactionsToCSV();
  return `CSV export is ready: ${url}`;
}

export default async function exportTransactionsToCSV(): Promise<
  string | null
> {
  try {
    const transactions = await prisma.transaction.findMany({
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
