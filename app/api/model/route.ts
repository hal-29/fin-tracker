import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  getTransactionFunctionDeclaration,
  getTransactions,
} from "@/utils/getTransactions";
import createTrannsaction, {
  createTransactionFunctionDeclaration,
} from "@/utils/createTransaction";
import prisma, { Prisma } from "@/db";
import {
  getCurrentDate,
  getCurrentDateFunctionDeclaration,
} from "@/utils/getCurrentDate";
import {
  calculateSum,
  calculateSumFunctionDeclaration,
} from "@/utils/calculateSum";
import exportTransactionsToCSV, {
  exportTransactionsCSVFunctionDeclaration,
} from "@/utils/exportTransactionsToCSV";
import {
  convertTransactionCurrency,
  convertTransactionCurrencyFunctionDeclaration,
} from "@/utils/convertTransactionCurrency";
import getExchangeRate, {
  getExchangeRateFunctionDeclaration,
} from "@/utils/getCurrencyRate";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  tools: [
    {
      functionDeclarations: [
        getTransactionFunctionDeclaration,
        createTransactionFunctionDeclaration,
        getCurrentDateFunctionDeclaration,
        calculateSumFunctionDeclaration,
        exportTransactionsCSVFunctionDeclaration,
        convertTransactionCurrencyFunctionDeclaration,
        getExchangeRateFunctionDeclaration,
      ],
    },
  ],
};

const INFO_TEXT = `You are a financial assistant helping users manage transactions,
             retrieve history, create new ones, calculate sums, and provide the current 
             UTC date/time. Use tools to fulfill requests based on user intent. Always 
             include currency when creating transactions. Use tools to determine dates 
             and calculate accordingly. Format responses in a user-friendly way or markdown, 
             avoiding raw data or unnecessary details.`;

export async function POST(req: NextRequest) {
  const data = (await req.json()) as { message: string };

  if (!data.message)
    return NextResponse.json({ error: "message is required" }, { status: 400 });

  const lastMessages = await prisma.message.findMany({
    where: { sender: { not: "FILE" } },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  const contents = lastMessages.reverse().map((message) => ({
    role: message.sender === "USER" ? "user" : "model",
    parts: [{ text: message.content }],
  }));

  contents.push({
    role: "user",
    parts: [{ text: data.message + INFO_TEXT }],
  });

  let loopCount = 0;
  let finalText = "";
  let downloadableLink: string | null = null;

  while (loopCount++ < 10) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      config,
      contents,
    });

    const toolCall = response.functionCalls?.[0];

    if (!toolCall) {
      finalText = response.text || "No response from AI";
      contents.push({
        role: "model",
        parts: [{ text: finalText }],
      });
      break;
    }

    let result;
    switch (toolCall.name) {
      case "get_all_transactions":
        result = await getTransactions(toolCall.args);
        break;
      case "create_transaction":
        result = await createTrannsaction(
          toolCall.args as Prisma.TransactionCreateInput
        );
        break;
      case "get_current_date":
        result = await getCurrentDate();
        break;
      case "calculate_sum":
        calculateSum(
          toolCall.args as {
            transactions: { amount: number; currency: string }[];
          }
        );
        break;
      case "export_transactions_csv":
        downloadableLink = await exportTransactionsToCSV(
          toolCall.args as { fromDate?: string; toDate?: string }
        );
        result = downloadableLink
          ? "File exported sucessfully."
          : "Failed to export files.";
        break;
      case "convert_transaction_currency":
        result = await convertTransactionCurrency(
          toolCall.args as {
            baseCurrency: string;
            targetCurrency: string;
            rate: number;
          }
        );
        break;
      case "get_exchange_rate":
        result = await getExchangeRate(
          toolCall.args as {
            fromCurrency: string;
            toCurrency: string;
          }
        );
        break;
      default:
        return NextResponse.json(
          { error: `Unknown function call: ${toolCall.name}` },
          { status: 400 }
        );
    }

    contents.push({
      role: "model",
      parts: [{ text: JSON.stringify(toolCall, null, 2) }],
    });

    contents.push({
      role: "user",
      parts: [
        {
          text: result!,
        },
      ],
    });
  }

  await prisma.message.create({
    data: {
      sender: "USER",
      content: data.message,
    },
  });
  const modelMessage = await prisma.message.create({
    data: {
      sender: "ASSISTANT",
      content: finalText,
    },
  });
  let fileMessage;
  if (downloadableLink) {
    fileMessage = await prisma.message.create({
      data: {
        sender: "FILE",
        content: "transactions.csv",
        link: downloadableLink,
      },
    });
  }

  const returns = [modelMessage];
  if (fileMessage) returns.push(fileMessage);

  return NextResponse.json(returns, { status: 201 });
}
