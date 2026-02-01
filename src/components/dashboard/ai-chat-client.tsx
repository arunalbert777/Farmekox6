"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage, type Language } from "@/lib/hooks";
import { aiVoiceChatAdvisory } from "@/ai/flows/ai-voice-chat-advisory";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty."),
});
type FormValues = z.infer<typeof formSchema>;

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export function AIChatClient() {
  const { language, toggleLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome! How can I help you with your farm today?", sender: "ai" },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const onSubmit = async (values: FormValues) => {
    const userMessage: Message = { id: Date.now(), text: values.message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    form.reset();

    try {
      const response = await aiVoiceChatAdvisory({
        query: values.message,
        language: language as 'en' | 'kn',
      });
      const aiMessage: Message = { id: Date.now() + 1, text: response.advice, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "ai" && (
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="size-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              {message.sender === "user" && (
                <Avatar className="size-8">
                  <AvatarFallback>
                    <User className="size-5" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-secondary rounded-xl px-4 py-2">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            {...form.register("message")}
            placeholder={t("type_your_message")}
            autoComplete="off"
            disabled={loading}
          />
          <Button type="button" variant="outline" onClick={toggleLanguage} disabled={loading}>
            {language.toUpperCase()}
          </Button>
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
