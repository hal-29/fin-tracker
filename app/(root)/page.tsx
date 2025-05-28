import MessageForm from "@/components/MessageForm";
import MessageThread from "@/components/MessageThread";
import { Separator } from "@/components/ui/separator";

async function Home() {
  return (
    <div className="h-svh flex flex-col justify-between px-4 py-3">
      <MessageThread />
      <Separator className="my-4" />
      <MessageForm />
    </div>
  );
}

export default Home;
