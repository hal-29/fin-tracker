import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  const messages = await prisma.message.findMany();

  return NextResponse.json(messages);
}
