import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bot, Send } from "lucide-react";

async function Home() {
  return (
    <div className="h-svh p-4 flex w-full  flex-col gap-2">
      <section className="grow gap-4 flex w-full items-center justify-center flex-col">
        <h3 className="text-center text-4xl leading-snug font-light">
          Interact with your AI assistant <br /> by typing in the input box
          below.
        </h3>
        <div>
          <Bot size={96} />
        </div>
      </section>
      <Separator />
      <section className="h-32 w-full p-2 mx-auto">
        <form className="flex justify-center h-full items-center">
          <Input className="max-w-screen-md px-4 py-2 rounded-l-full rounded-r-none h-16 bg-white" />
          <Button
            type="submit"
            variant="outline"
            className="rounded-l-none cursor-pointer  [font-size:1.4rem_!important] font-stretch-110% cursor-pointe w-32 rounded-r-full h-16"
          >
            <Send />
          </Button>
        </form>
      </section>
    </div>
  );
}
export default Home;
