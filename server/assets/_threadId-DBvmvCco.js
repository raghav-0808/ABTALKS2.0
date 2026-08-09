import { t as supabase } from "./client-CoEqkHDN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { _ as Button, n as Route, v as useAuth } from "./router-DrXqpvlG.js";
import { t as Card } from "./card-CzXpCsbD.js";
import { t as Textarea } from "./textarea-kko37XEX.js";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
//#region src/routes/_authenticated/ai/$threadId.tsx?tsr-split=component
function AiThread() {
	const { threadId } = Route.useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const inputRef = useRef(null);
	const persisted = useRef(/* @__PURE__ */ new Set());
	const threadsQuery = useQuery({
		queryKey: ["chat-threads", user?.id],
		enabled: Boolean(user?.id),
		queryFn: async () => {
			const { data, error } = await supabase.from("chat_threads").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const historyQuery = useQuery({
		queryKey: ["chat-messages", threadId],
		queryFn: async () => {
			const { data, error } = await supabase.from("chat_messages").select("role, message_id, parts").eq("thread_id", threadId).order("created_at", { ascending: true });
			if (error) throw error;
			return (data ?? []).map((row, index) => ({
				id: row.message_id ?? `${threadId}-${index}`,
				role: row.role,
				parts: row.parts ?? []
			}));
		}
	});
	const { messages, sendMessage, status } = useChat({
		id: threadId,
		messages: historyQuery.data ?? [],
		transport: new DefaultChatTransport({ api: "/api/chat" }),
		onError: (error) => toast.error(error.message || "The assistant is unavailable right now.")
	});
	useEffect(() => {
		inputRef.current?.focus();
	}, [threadId, status]);
	useEffect(() => {
		if (!user || status === "streaming" || status === "submitted") return;
		const unsaved = messages.filter((message) => !persisted.current.has(message.id));
		if (unsaved.length === 0) return;
		unsaved.forEach((message) => persisted.current.add(message.id));
		(async () => {
			const { error } = await supabase.from("chat_messages").insert(unsaved.map((message) => ({
				thread_id: threadId,
				user_id: user.id,
				role: message.role === "assistant" ? "assistant" : "user",
				message_id: message.id,
				parts: message.parts
			})));
			if (error) {
				toast.error("Your message couldn't be saved to this conversation.");
				return;
			}
			const firstUser = messages.find((message) => message.role === "user");
			const title = firstUser ? textOf(firstUser).slice(0, 60) || "New conversation" : "New conversation";
			await supabase.from("chat_threads").update({
				title,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", threadId);
			queryClient.invalidateQueries({ queryKey: ["chat-threads", user.id] });
		})();
	}, [
		messages,
		status,
		user,
		threadId,
		queryClient
	]);
	useEffect(() => {
		if (historyQuery.data) historyQuery.data.forEach((message) => persisted.current.add(message.id));
	}, [historyQuery.data]);
	async function newThread() {
		if (!user) return;
		const { data, error } = await supabase.from("chat_threads").insert({
			user_id: user.id,
			title: "New conversation"
		}).select("id").single();
		if (error || !data) {
			toast.error("Could not start a new conversation.");
			return;
		}
		queryClient.invalidateQueries({ queryKey: ["chat-threads", user.id] });
		await navigate({
			to: "/ai/$threadId",
			params: { threadId: data.id }
		});
	}
	async function deleteThread(id) {
		await supabase.from("chat_threads").delete().eq("id", id);
		queryClient.invalidateQueries({ queryKey: ["chat-threads", user?.id] });
		if (id === threadId) await navigate({ to: "/ai" });
	}
	const busy = status === "submitted" || status === "streaming";
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[16rem_minmax(0,1fr)]",
		children: [/* @__PURE__ */ jsxs("aside", {
			className: "space-y-2",
			children: [/* @__PURE__ */ jsxs(Button, {
				className: "w-full",
				onClick: () => void newThread(),
				children: [/* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }), " New chat"]
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-1",
				children: threadsQuery.data?.map((thread) => /* @__PURE__ */ jsxs("div", {
					className: cn("flex items-center gap-1 rounded-md border border-transparent px-2", thread.id === threadId && "border-border bg-secondary/50"),
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/ai/$threadId",
						params: { threadId: thread.id },
						className: "flex-1 truncate py-2 text-sm hover:text-primary",
						children: thread.title
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": `Delete ${thread.title}`,
						onClick: () => void deleteThread(thread.id),
						className: "text-muted-foreground hover:text-destructive",
						children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
					})]
				}, thread.id))
			})]
		}), /* @__PURE__ */ jsxs(Card, {
			className: "flex h-[70vh] flex-col p-0",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex-1 space-y-6 overflow-y-auto p-6",
				children: [messages.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "mx-auto max-w-md py-16 text-center",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "font-display text-2xl font-semibold",
						children: "ABTalks assistant"
					}), /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Ask about learning paths, hackathon prep, or which event fits your goals."
					})]
				}) : messages.map((message) => /* @__PURE__ */ jsx("div", {
					className: cn("flex", message.role === "user" ? "justify-end" : "justify-start"),
					children: /* @__PURE__ */ jsx("div", {
						className: cn("max-w-[85%] text-[15px] leading-7", message.role === "user" ? "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground" : "text-foreground"),
						children: message.role === "assistant" ? /* @__PURE__ */ jsx("div", {
							className: "prose-chat",
							children: /* @__PURE__ */ jsx(ReactMarkdown, {
								remarkPlugins: [remarkGfm],
								children: textOf(message)
							})
						}) : textOf(message)
					})
				}, message.id)), status === "submitted" ? /* @__PURE__ */ jsx("p", {
					className: "animate-pulse text-sm text-muted-foreground",
					children: "Thinking…"
				}) : null]
			}), /* @__PURE__ */ jsxs("form", {
				className: "flex items-end gap-2 border-t border-border/60 p-4",
				onSubmit: (event) => {
					event.preventDefault();
					const value = inputRef.current?.value.trim();
					if (!value) return;
					sendMessage({ text: value });
					if (inputRef.current) inputRef.current.value = "";
				},
				children: [/* @__PURE__ */ jsx(Textarea, {
					ref: inputRef,
					rows: 2,
					placeholder: "Ask the ABTalks assistant…",
					"aria-label": "Message the assistant",
					className: "resize-none"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					size: "icon",
					disabled: busy,
					"aria-label": "Send message",
					children: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" })
				})]
			})]
		})]
	});
}
function textOf(message) {
	return message.parts.map((part) => part.type === "text" ? part.text : "").join("").trim();
}
//#endregion
export { AiThread as component };

//# sourceMappingURL=_threadId-DBvmvCco.js.map