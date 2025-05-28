"use client";

import { Prisma } from "@/db";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import InitialMessage from "./InitialMessage";

function MessageThread({
  loading,
  error,
  messages,
}: {
  loading: boolean;
  error: boolean;
  messages?: Prisma.MessageUncheckedCreateInput[];
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading messages...</p>
        <span>
          <LoaderCircleIcon
            className="animate-spin text-muted-foreground ml-2"
            size={24}
          />
        </span>
      </div>
    );
  }

  if (error || !messages) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error loading messages</p>
      </div>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto p-4 rounded-xl shadow-sm bg-background w-full mx-auto max-w-4xl space-y-4">
      {messages.length === 0 ? (
        <InitialMessage />
      ) : (
        <>
          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </section>
  );
}
export default MessageThread;
