import { memo } from "react";
import { cn } from "@/lib/utils";

// Chat message component
export interface ChatMessageProps {
  from: string;
  text: string;
}

/**
 * ChatMessage - Individual chat message component
 * Memoized to avoid unnecessary re-renders
 */
const ChatMessage = memo(({ from, text }: ChatMessageProps) => {
  return (
    <div className={`mb-4 ${from === "user" ? "text-right" : ""}`}>
      <div className="font-medium text-navy dark:text-soft-white">
        {from === "agent" ? "Workflow Agent" : "You"}
      </div>
      <div className={cn(
        "p-3 rounded-lg inline-block max-w-[75%] mt-1 text-navy dark:text-soft-white",
        "transition-all duration-200 text-base",
        from === "agent" 
          ? "bg-white dark:bg-navy shadow-md" 
          : "bg-cyan bg-opacity-20"
      )}>
        {text}
      </div>
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;