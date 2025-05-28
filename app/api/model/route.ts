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
      ],
    },
  ],
};

const INFO_TEXT = `[SYSTEM INFO]: You are a financial assistant.
         Help users manage transactions, retrieve history,
         create new ones, calculate sums, and provide the 
         current UTC date/time. Use provided tools to fulfill
         requests based on user intent. Avoid mentioning tools
         or asking unnecessary details. Always include currency
         when creating transactions. Never ask for specific date
         if relative date is provided, use the tools to current date
         and calculate based off of it.`;

export async function POST(req: NextRequest) {
  const data = (await req.json()) as { message: string };

  if (!data.message)
    return NextResponse.json({ error: "message is required" }, { status: 400 });

  const lastMessages = await prisma.message.findMany({
    take: 5,
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

  while (loopCount++ < 5) {
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
        result = calculateSum(
          toolCall.args as {
            transactions: { amount: number; currency: string }[];
          }
        );
        break;
      default:
        return NextResponse.json(
          { error: `Unknown function call: ${toolCall.name}` },
          { status: 400 }
        );
    }

    // Push Gemini's tool call message (optional)
    contents.push({
      role: "model",
      parts: [{ text: JSON.stringify(toolCall, null, 2) }],
    });

    // Push tool result back to Gemini
    contents.push({
      role: "user",
      parts: [
        {
          text: result,
        },
      ],
    });
  }

  // Save both user & assistant messages
  await prisma.message.create({
    data: {
      sender: "USER",
      content: data.message,
    },
  });
  await prisma.message.create({
    data: {
      sender: "ASSISTANT",
      content: finalText,
    },
  });

  return NextResponse.json({ message: finalText }, { status: 201 });
}
