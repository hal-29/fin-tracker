# 🧾 Personalized Financial Assistant

This is a smart, LLM-powered financial assistant that allows users to log expenses, track spending, and generate financial reports using natural language. Powered by Google's **Gemini 2.0** with function calling, it integrates real-time currency conversion, data storage, and file export capabilities.

## 🚀 Features

- **Natural Language Transaction Logging**  
  Example: "I spent 500 birr on groceries yesterday."

- **Transaction History & Filtering**  
  Example: "Show me all transactions from last month."

- **Currency Conversion**  
  Convert stored transactions from birr to USD or other currencies.

- **CSV Export**  
  Generate and download monthly reports or filtered transaction logs as CSV files.

---

## 🛠️ Technologies Used

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** API Routes with function calling logic
- **Database:** Prisma ORM with SQLite
- **LLM:** Google Gemini 2.0 (via `@google/genai`)
- **Storage:** Vercel Blob Storage (for CSV exports)
- **Deployment:** Vercel

---

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hal-29/fin-tracker.git
   cd financial-assistant
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create a `.env` file and add the following:

   ```env
   GEMINI_API_KEY=your_google_genai_key
   ```

4. **Push Prisma schema and seed**

   ```bash
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 How It Works

- User inputs are sent to **Gemini 2.0 Flash**, which detects intent and calls backend functions (`create_transaction`, `get_transactions`, `export_csv`, etc.).
- These functions interact with a **SQLite database** via **Prisma** to store or retrieve data.
- In the case of data exports, the app uploads generated CSVs to **Vercel Blob Storage** and shares downloadable links.
- Recursion is handled internally by checking for follow-up function calls from the model after executing each one.

---

## 📂 Project Structure

```bash
├── app/                  # Next.js app
├── db/                   # Prisma setup
├── utils/                # Function logic (create, retrieve, export, etc.)
├── components/           # UI components like ChatBubble
├── public/               # Static assets
├── .env                  # Environment variables
├── prisma/schema.prisma  # DB schema
└── README.md             # You’re here!
```

---

## 📄 License

MIT License. Feel free to use and adapt.

---

## ✨ Credits

Built by Haileiyesus Mesafint as part of iCog-labs AGI-Intern training assignment.
