import { Type } from "@google/genai";

interface ApiResponse {
  rates: Record<string, number>;
}

const url =
  process.env.CURR_EXCHANGE_URL || "https://open.er-api.com/v6/latest/";

export const getExchangeRateFunctionDeclaration = {
  name: "get_exchange_rate",
  description: "Get the exchange rate between two currencies.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      fromCurrency: {
        type: Type.STRING,
        description:
          "The 3-letter currency code to convert from (e.g., USD, EUR)",
      },
      toCurrency: {
        type: Type.STRING,
        description:
          "The 3-letter currency code to convert to (e.g., USD, EUR)",
      },
    },
  },
  required: ["fromCurrency", "toCurrency"],
};

export default async function getExchangeRate({
  fromCurrency,
  toCurrency,
}: {
  fromCurrency: string;
  toCurrency: string;
}): Promise<string> {
  try {
    console.log(`FETCHING EXCHANGE RATE: ${fromCurrency} to ${toCurrency}`);

    const response = await fetch(`${url}${fromCurrency}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    const rates = data.rates;

    if (!rates[toCurrency]) {
      return `Currency ${toCurrency} rate could not be found`;
    }

    const exchangeRate = rates[toCurrency];
    return `1 ${fromCurrency} = ${exchangeRate} ${toCurrency}`;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return "Failed to fetch exchange rate. Please try again later.";
  }
}
