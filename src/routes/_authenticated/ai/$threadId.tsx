import { useEffect, useRef } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ai/$threadId")({
  head: () => ({
    meta: [
      { title: "ABTalks AI assistant" },
      {
        name: "description",
        content: "Chat with the ABTalks assistant about events, learning paths and career growth.",
      },
      { property: "og:title", content: "ABTalks AI assistant" },
      { property: "og:description", content: "Your AI mentor for events, learning and careers." },
    ],
  }),
  component: AiThread,
});

interface StoredMessage {
  role: "user" | "assistant";
  message_id: string | null;
  parts: unknown;
}

function AiThread() {
  const { threadId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const persisted = useRef(new Set<string>());

  const threadsQuery = useQuery({
    queryKey: ["chat-threads", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_threads")
        .select("id, title, updated_at")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const historyQuery = useQuery({
    queryKey: ["chat-messages", threadId],
    queryFn: async (): Promise<UIMessage[]> => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("role, message_id, parts")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as StoredMessage[]).map((row, index) => ({
        id: row.message_id ?? `${threadId}-${index}`,
        role: row.role,
        parts: (row.parts ?? []) as UIMessage["parts"],
      }));
    },
  });

  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: historyQuery.data ?? [],
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (error) => toast.error(error.message || "The assistant is unavailable right now."),
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status]);

  useEffect(() => {
    if (!user || status === "streaming" || status === "submitted") return;
    const unsaved = messages.filter((message) => !persisted.current.has(message.id));
    if (unsaved.length === 0) return;
    unsaved.forEach((message) => persisted.current.add(message.id));
    void (async () => {
      const { error } = await supabase.from("chat_messages").insert(
        unsaved.map((message) => ({
          thread_id: threadId,
          user_id: user.id,
          role: message.role === "assistant" ? "assistant" : "user",
          message_id: message.id,
          parts: message.parts as unknown as never,
        })),
      );
      if (error) {
        toast.error("Your message couldn't be saved to this conversation.");
        return;
      }
      const firstUser = messages.find((message) => message.role === "user");
      const title = firstUser
        ? textOf(firstUser).slice(0, 60) || "New conversation"
        : "New conversation";
      await supabase
        .from("chat_threads")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", threadId);
      void queryClient.invalidateQueries({ queryKey: ["chat-threads", user.id] });
    })();
  }, [messages, status, user, threadId, queryClient]);

  useEffect(() => {
    if (historyQuery.data) {
      historyQuery.data.forEach((message) => persisted.current.add(message.id));
    }
  }, [historyQuery.data]);

  async function newThread() {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: "New conversation" })
      .select("id")
      .single();
    if (error || !data) {
      toast.error("Could not start a new conversation.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["chat-threads", user.id] });
    await navigate({ to: "/ai/$threadId", params: { threadId: data.id } });
  }

  async function deleteThread(id: string) {
    await supabase.from("chat_threads").delete().eq("id", id);
    void queryClient.invalidateQueries({ queryKey: ["chat-threads", user?.id] });
    if (id === threadId) await navigate({ to: "/ai" });
  }

  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="space-y-2">
        <Button className="w-full" onClick={() => void newThread()}>
          <Plus className="mr-2 h-4 w-4" /> New chat
        </Button>
        <div className="space-y-1">
          {threadsQuery.data?.map((thread) => (
            <div
              key={thread.id}
              className={cn(
                "flex items-center gap-1 rounded-md border border-transparent px-2",
                thread.id === threadId && "border-border bg-secondary/50",
              )}
            >
              <Link
                to="/ai/$threadId"
                params={{ threadId: thread.id }}
                className="flex-1 truncate py-2 text-sm hover:text-primary"
              >
                {thread.title}
              </Link>
              <button
                type="button"
                aria-label={`Delete ${thread.title}`}
                onClick={() => void deleteThread(thread.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <Card className="flex h-[70vh] flex-col p-0">
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md py-16 text-center">
              <h1 className="font-display text-2xl font-semibold">ABTalks assistant</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask about learning paths, hackathon prep, or which event fits your goals.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] text-[15px] leading-7",
                    message.role === "user"
                      ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {message.role === "assistant" ? (
                    <div className="prose-chat">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{textOf(message)}</ReactMarkdown>
                    </div>
                  ) : (
                    textOf(message)
                  )}
                </div>
              </div>
            ))
          )}
          {status === "submitted" ? (
            <p className="animate-pulse text-sm text-muted-foreground">Thinking…</p>
          ) : null}
        </div>

        <form
          className="flex items-end gap-2 border-t border-border/60 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            const value = inputRef.current?.value.trim();
            if (!value) return;
            void sendMessage({ text: value });
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          <Textarea
            ref={inputRef}
            rows={2}
            placeholder="Ask the ABTalks assistant…"
            aria-label="Message the assistant"
            className="resize-none"
          />
          <Button type="submit" size="icon" disabled={busy} aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}

function textOf(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}
