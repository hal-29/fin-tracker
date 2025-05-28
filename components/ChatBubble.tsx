import { Prisma } from "@/generated/prisma";

function ChatBubble({ message }: { message?: Prisma.MessageCreateInput }) {
  if (message?.sender === "USER")
    return (
      <div className="flex justify-end">
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-none p-4 max-w-3/4 text-base">
          I'd like to know more about your features.
        </div>
      </div>
    );

  return (
    <div className="flex">
      <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none p-4 max-w-3/4 text-base">
        Hello! How can I help you today?
      </div>
    </div>
  );
}
export default ChatBubble;
