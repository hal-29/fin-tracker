import { Bot } from "lucide-react";

function InitialMessage() {
  return (
    <section className="grow gap-4 flex w-full items-center justify-center flex-col">
      <h3 className="text-center text-4xl leading-snug font-light">
        Interact with your AI assistant <br /> by typing in the input box below.
      </h3>
      <div>
        <Bot size={96} />
      </div>
    </section>
  );
}
export default InitialMessage;
