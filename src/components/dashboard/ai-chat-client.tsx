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
import { Send, Loader2, User, Bot, Mic, MicOff, StopCircle } from "lucide-react";
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
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'kn' ? 'kn-IN' : 'en-US';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        form.setValue('message', transcript);
      };
      
      recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
      }

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }
  }, [language, form]);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      form.reset({ message: '' });
      recognitionRef.current.start();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    stopAudio();
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
      
      if (audioRef.current && response.audio) {
          audioRef.current.src = response.audio;
          audioRef.current.play();
          setIsSpeaking(true);
      }
    } catch (error) {
      console.error(error);
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
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <Input
            {...form.register("message")}
            placeholder={t("type_your_message")}
            autoComplete="off"
            disabled={loading || isRecording}
          />
          <Button type="button" variant="outline" onClick={toggleLanguage} disabled={loading || isRecording}>
            {language.toUpperCase()}
          </Button>
          <Button 
            type="button" 
            size="icon" 
            onClick={handleToggleRecording} 
            disabled={loading} 
            variant={isRecording ? 'destructive' : 'outline'}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <MicOff className="size-5" /> : <Mic className="size-5" />}
          </Button>
          <Button type="submit" size="icon" disabled={loading || isRecording || !form.watch("message")}>
            <Send className="size-5" />
          </Button>
          {isSpeaking && (
            <Button 
              type="button" 
              size="icon" 
              onClick={stopAudio} 
              variant="destructive"
              aria-label="Stop audio"
            >
              <StopCircle className="size-5" />
            </Button>
          )}
        </form>
        <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} className="hidden" />
      </div>
    </div>
  );
}
