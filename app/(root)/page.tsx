"use client";

import MessageThread from "@/components/MessageThread";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Prisma } from "@/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { DialogTitle } from "@radix-ui/react-dialog";

function Home() {
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();
  const { transcript, startListening, stopListening, listening } =
    useSpeechRecognition();

  useEffect(() => {
    if (transcript && listening === false) {
      setMessage(transcript);
      setShowModal(false);
    }
  }, [transcript, listening]);

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
      await queryClient.cancelQueries({ queryKey: ["messages"] });
      const previousMessages = queryClient.getQueryData<
        Prisma.MessageUncheckedCreateInput[]
      >(["messages"]);

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

      setMessage("");

      return { previousMessages };
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Prisma.MessageUncheckedCreateInput[]>(
        ["messages"],
        (old) => (old ? [...old, ...data] : data)
      );
    },
    onError: (_err, _newMessage, context) => {
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

  const handleVoiceInput = () => {
    setShowModal(true);
    startListening();
  };

  const handleCancelRecording = () => {
    stopListening();
    setShowModal(false);
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
            type="button"
            className="h-14 w-14 rounded-full"
            onClick={handleVoiceInput}
          >
            <Mic size={22} />
          </Button>
          <Button
            type="submit"
            className="h-14 w-14 rounded-full"
            disabled={mutation.isPending}
          >
            <Send size={22} />
          </Button>
        </form>
      </section>

      <Dialog open={showModal}>
        <DialogContent>
          <DialogTitle>Speak your message</DialogTitle>
          <h2 className="text-xl font-semibold mb-4">Listening...</h2>
          <Button onClick={handleCancelRecording}>Stop</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Home;
