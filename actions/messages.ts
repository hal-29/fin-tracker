"use server";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Define the function declaration for the model
const weatherFunctionDeclaration = {
  name: "get_current_temperature",
  description: "Gets the current temperature for a given location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: "The city name, e.g. San Francisco",
      },
    },
    required: ["location"],
  },
};

const config = {
  tools: [
    {
      functionDeclarations: [weatherFunctionDeclaration],
    },
  ],
};

export async function sendMessage(formData: FormData) {
  try {
    const message = formData.get("message") as string;

    if (!message || message.trim() === "") {
      throw new Error("Message cannot be empty");
    }

    const contents = [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      config,
      model: "gemini-2.0-flash",
      contents: contents,
    });

    const toolCall = response.functionCalls?.at(0);
    let result;
    if (toolCall?.name === "get_current_temperature") {
      result = await getCurrentTemperature(
        toolCall.args as { location: string }
      );
    } else {
      console.log(response.text);
      return;
    }

    contents.push({
      role: "model",
      parts: [
        {
          text: JSON.stringify(toolCall, null, 2),
        },
      ],
    });

    contents.push({
      role: "user",
      parts: [
        {
          text: `${toolCall?.name} returned: ${result}`,
        },
      ],
    });

    const finalResponse = await ai.models.generateContent({
      config,
      model: "gemini-2.0-flash",
      contents: contents,
    });

    console.log(finalResponse.text);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

async function getCurrentTemperature(args: { location: string }) {
  const temp = (Math.random() * 10 + 20).toFixed(1);

  console.log("DEMO TEMP", temp);

  return temp + "°C";
}
