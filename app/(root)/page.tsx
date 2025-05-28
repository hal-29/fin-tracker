"use client";

import MessageThread from "@/components/MessageThread";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";

function Home() {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      return (await res.json()) as Prisma.MessageUncheckedCreateInput[];
    },
  });

  const mutation = useMutation({
    mutationKey: ["messages"],
    mutationFn: async (newMessage: string) => {
      const res = await fetch("/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = (await res.json()) as {
        id: number;
        content: string;
        link?: string;
        sender: "USER" | "ASSISTANT" | "FILE";
        createdAt: string;
      }[];

      return data;
    },
    onMutate: async (newMessage) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["messages"] });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<
        Prisma.MessageUncheckedCreateInput[]
      >(["messages"]);

      // Optimistically update
      if (previousMessages) {
        queryClient.setQueryData(
          ["messages"],
          [
            ...previousMessages,
            {
              content: newMessage,
              sender: "USER",
              createdAt: new Date().toISOString(),
            },
          ]
        );
      }

      // Clear input immediately
      setMessage("");

      return { previousMessages };
    },
    onSuccess: (data) => {
      // Append the assistant response
      queryClient.setQueryData<Prisma.MessageUncheckedCreateInput[]>(
        ["messages"],
        // (old) => (old ? [...old, data] : [data])
        (old) => (old ? [...old, ...data] : data)
      );
    },
    onError: (_err, _newMessage, context) => {
      // Rollback to previous messages if error
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages"], context.previousMessages);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    mutation.mutate(message.trim());
  };

  return (
    <div className="h-svh flex flex-col justify-between px-4 py-3">
      <MessageThread
        loading={query.isLoading}
        error={query.isError}
        messages={
          mutation.isPending
            ? [...(query.data || []), { sender: "ASSISTANT", content: "..." }]
            : query.data || []
        }
      />
      <Separator className="my-4" />
      <section className="h-32 w-full p-2 mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center gap-2 h-full max-w-4xl mx-auto items-center"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            name="message"
            autoComplete="off"
            autoFocus
            required
            type="text"
            placeholder="Type your message..."
            className="grow px-4 py-2 rounded-full h-14 bg-white"
          />
          <Button
            type="submit"
            className="h-14 w-14 rounded-full"
            disabled={mutation.isPending}
          >
            <Send size={22} />
          </Button>
        </form>
      </section>
    </div>
  );
}

export default Home;
