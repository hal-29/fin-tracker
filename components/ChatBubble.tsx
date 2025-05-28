"use client";
import { Prisma } from "@/generated/prisma";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

function ChatBubble({ message }: { message?: Prisma.MessageCreateInput }) {
  if (!message) return null;

  if (message.sender === "USER") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-none p-4 max-w-3/4 text-base whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  if (message.sender === "FILE") {
    return (
      <div className="flex">
        <div className="bg-muted space-y-2 text-muted-foreground rounded-2xl p-4 max-w-3/4 text-base prose prose-sm dark:prose-invert whitespace-pre-wrap">
          <div>{message.content}</div>
          {message.link && (
            <a href={message.link} download>
              <Button size="sm" className="cursor-pointer">
                <span>
                  <Download />
                </span>
                <span>Download</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none p-4 max-w-3/4 text-base prose prose-sm dark:prose-invert whitespace-pre-wrap">
        <ReactMarkdown>{message.content || ""}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ChatBubble;
