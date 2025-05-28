import ChatBubble from "./ChatBubble";

function MessageThread() {
  return (
    <section className="flex-1 overflow-y-auto p-4 rounded-xl shadow-sm bg-background w-full mx-auto max-w-4xl space-y-4">
      <ChatBubble />
    </section>
  );
}
export default MessageThread;
