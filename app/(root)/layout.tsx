"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FileChartColumnIncreasingIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

const queryClient = new QueryClient();

function layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="p-4">
        <div className="fixed top-16 flex divide-x left-16 rounded-full bg-zinc-900 border">
          <Link href="/" className="text-white px-4 py-2">
            <HomeIcon size={20} />
          </Link>
          <Link href="/transactions" className="text-white px-4 py-2">
            <FileChartColumnIncreasingIcon size={20} />
          </Link>
        </div>
        {children}
      </main>
    </QueryClientProvider>
  );
}
export default layout;
