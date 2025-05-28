import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { sendMessage } from "@/actions/messages";

function MessageForm() {
  return (
    <section className="h-32 w-full p-2 mx-auto">
      <form
        action={sendMessage}
        className="flex justify-center gap-2 h-full max-w-4xl mx-auto items-center"
      >
        <Input
          name="message"
          autoComplete="off"
          autoFocus
          required
          type="text"
          placeholder="Type your message..."
          className="grow  px-4 py-2 rounded-full  h-14 bg-white"
        />
        <Button
          type="submit"
          className=" cursor-pointer [font-size:1.4rem_!important] font-stretch-110% cursor-pointe h-14 w-14 rounded-full"
        >
          <Send size={22} />
        </Button>
      </form>
    </section>
  );
}
export default MessageForm;
