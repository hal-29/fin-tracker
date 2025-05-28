import { Type } from "@google/genai";

export const getCurrentDateFunctionDeclaration = {
  name: "get_current_date",
  description:
    "Retrieves the current date and time in UTC. It can be used as a referance time to calculate relative times like, yesterday, tommorow, today, last week, last month, etc.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
  required: [],
};

export async function getCurrentDate() {
  console.log("GET CURRENT DATE FUNCTION CALLED");

  const date = new Date();
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
  });
}
