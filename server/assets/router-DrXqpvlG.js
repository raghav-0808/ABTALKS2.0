import { t as supabase } from "./client-CoEqkHDN.js";
import { t as cn } from "./utils-C_uf36nf.js";
import { c as fetchProfileByUsername, l as fetchProfiles, n as fetchEventBySlug, r as fetchEvents, s as fetchPosts, u as fetchResources } from "./api-CfgFj8iz.js";
import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Bell, BookOpen, Bookmark, CalendarDays, Check, ChevronRight, Circle, Hexagon, LayoutDashboard, LogOut, Menu, MessageSquare, Search, User, Users, X } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { Command } from "cmdk";
import { Toaster } from "sonner";
import { z } from "zod";
import { convertToModelMessages, streamText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/styles.css?url
var styles_default = "/ABTALKS2.0/assets/styles-DrNpA7B5.css";
//#endregion
//#region src/lib/error-reporting.ts
function reportError(error, context = {}) {
	if (typeof window === "undefined") return;
	if (error instanceof Error) console.error("Captured error:", error, context);
	else console.error("Captured error:", String(error), context);
}
//#endregion
//#region src/hooks/useAuth.tsx
var AuthContext = createContext(void 0);
function AuthProvider({ children }) {
	const [session, setSession] = useState(null);
	const [profile, setProfile] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [loading, setLoading] = useState(true);
	const userId = session?.user?.id ?? null;
	useEffect(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
			setSession(nextSession);
			setLoading(false);
		});
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	const loadProfile = useMemo(() => async (id) => {
		if (!id) {
			setProfile(null);
			setIsAdmin(false);
			return;
		}
		const [{ data: profileRow }, { data: roleRows }] = await Promise.all([supabase.from("profiles").select("*").eq("id", id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", id)]);
		setProfile(profileRow ?? null);
		setIsAdmin(Boolean(roleRows?.some((row) => row.role === "admin")));
	}, []);
	useEffect(() => {
		loadProfile(userId);
	}, [userId, loadProfile]);
	const value = useMemo(() => ({
		session,
		user: session?.user ?? null,
		profile,
		isAdmin,
		loading,
		refreshProfile: () => loadProfile(userId),
		signOut: async () => {
			await supabase.auth.signOut();
			setProfile(null);
			setIsAdmin(false);
		}
	}), [
		session,
		profile,
		isAdmin,
		loading,
		loadProfile,
		userId
	]);
	return /* @__PURE__ */ jsx(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used inside AuthProvider");
	return context;
}
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ jsx(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetTrigger = SheetPrimitive.Trigger;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/avatar.tsx
var Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Root, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = AvatarPrimitive.Root.displayName;
var AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Image, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
var AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AvatarPrimitive.Fallback, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
//#endregion
//#region src/components/ui/dropdown-menu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region src/components/ui/badge.tsx
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
//#region src/lib/format.ts
function formatEventDate(iso) {
	return format(new Date(iso), "EEE, d MMM yyyy");
}
function formatEventTime(iso) {
	return format(new Date(iso), "h:mm a");
}
function formatRelative(iso) {
	return formatDistanceToNow(new Date(iso), { addSuffix: true });
}
function isPastDate(iso) {
	return isPast(new Date(iso));
}
function formatDuration(minutes) {
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.round(minutes / 60 * 10) / 10;
	if (hours < 24) return `${hours} hr`;
	return `${Math.round(hours / 8)} days of study`;
}
function initials(name) {
	return name.split(" ").map((part) => part[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function greeting(date = /* @__PURE__ */ new Date()) {
	const hour = date.getHours();
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}
//#endregion
//#region src/components/ui/dialog.tsx
var Dialog = SheetPrimitive.Root;
var DialogPortal = SheetPrimitive.Portal;
var DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
var DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
var DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/ui/command.tsx
var Command$1 = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = Command.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ jsx(Dialog, {
		...props,
		children: /* @__PURE__ */ jsx(DialogContent, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ jsx(Command$1, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ jsx(Command.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = Command.Input.displayName;
var CommandList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = Command.List.displayName;
var CommandEmpty = React.forwardRef((props, ref) => /* @__PURE__ */ jsx(Command.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = Command.Empty.displayName;
var CommandGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = Command.Group.displayName;
var CommandSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = Command.Separator.displayName;
var CommandItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(Command.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = Command.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ jsx("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
//#endregion
//#region src/components/search/GlobalSearch.tsx
function GlobalSearch({ open, onOpenChange }) {
	const navigate = useNavigate();
	const [term, setTerm] = useState("");
	const [debounced, setDebounced] = useState("");
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(term.trim()), 250);
		return () => clearTimeout(timer);
	}, [term]);
	const { data, isFetching } = useQuery({
		queryKey: ["global-search", debounced],
		enabled: open && debounced.length > 1,
		queryFn: async () => {
			const [events, people, posts, resources] = await Promise.all([
				fetchEvents({
					search: debounced,
					limit: 4
				}),
				fetchProfiles({
					search: debounced,
					limit: 4
				}),
				fetchPosts({
					search: debounced,
					limit: 4
				}),
				fetchResources({
					search: debounced,
					limit: 4
				})
			]);
			return {
				events,
				people,
				posts,
				resources
			};
		}
	});
	function go(to) {
		onOpenChange(false);
		setTerm("");
		navigate({ to });
	}
	const hasResults = (data?.events.length ?? 0) + (data?.people.length ?? 0) + (data?.posts.length ?? 0) + (data?.resources.length ?? 0) > 0;
	return /* @__PURE__ */ jsxs(CommandDialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ jsx(CommandInput, {
			placeholder: "Search events, people, posts and resources...",
			value: term,
			onValueChange: setTerm
		}), /* @__PURE__ */ jsxs(CommandList, { children: [
			debounced.length < 2 ? /* @__PURE__ */ jsx(CommandEmpty, { children: "Type at least two characters to search." }) : isFetching && !hasResults ? /* @__PURE__ */ jsx(CommandEmpty, { children: "Searching…" }) : !hasResults ? /* @__PURE__ */ jsxs(CommandEmpty, { children: [
				"No results for “",
				debounced,
				"”."
			] }) : null,
			data?.events.length ? /* @__PURE__ */ jsx(CommandGroup, {
				heading: "Events",
				children: data.events.map((event) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go(`/events/${event.slug}`),
					children: [/* @__PURE__ */ jsx(CalendarDays, { className: "mr-2 h-4 w-4" }), event.title]
				}, event.id))
			}) : null,
			data?.people.length ? /* @__PURE__ */ jsx(CommandGroup, {
				heading: "People",
				children: data.people.map((person) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go(`/profile/${person.username}`),
					children: [
						/* @__PURE__ */ jsx(Users, { className: "mr-2 h-4 w-4" }),
						person.full_name,
						" · @",
						person.username
					]
				}, person.id))
			}) : null,
			data?.posts.length ? /* @__PURE__ */ jsx(CommandGroup, {
				heading: "Posts",
				children: data.posts.map((post) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go("/community"),
					children: [/* @__PURE__ */ jsx(MessageSquare, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ jsx("span", {
						className: "truncate",
						children: post.title ?? post.content.slice(0, 70)
					})]
				}, post.id))
			}) : null,
			data?.resources.length ? /* @__PURE__ */ jsx(CommandGroup, {
				heading: "Learning resources",
				children: data.resources.map((resource) => /* @__PURE__ */ jsxs(CommandItem, {
					onSelect: () => go("/learn"),
					children: [/* @__PURE__ */ jsx(BookOpen, { className: "mr-2 h-4 w-4" }), resource.title]
				}, resource.id))
			}) : null
		] })]
	});
}
//#endregion
//#region src/components/layout/Navbar.tsx
var navLinks = [
	{
		label: "Home",
		to: "/"
	},
	{
		label: "Explore",
		to: "/explore"
	},
	{
		label: "Events",
		to: "/events"
	},
	{
		label: "Community",
		to: "/community"
	},
	{
		label: "Learn",
		to: "/learn"
	},
	{
		label: "AI Assistant",
		to: "/ai"
	}
];
function Navbar() {
	const { user, profile, isAdmin, signOut } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const [searchOpen, setSearchOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	useEffect(() => setMobileOpen(false), [pathname]);
	const { data: unread = 0 } = useQuery({
		queryKey: ["notifications-unread", user?.id],
		enabled: Boolean(user?.id),
		refetchInterval: 6e4,
		queryFn: async () => {
			const { count } = await supabase.from("notifications").select("*", {
				count: "exact",
				head: true
			}).eq("user_id", user.id).eq("is_read", false);
			return count ?? 0;
		}
	});
	async function handleSignOut() {
		await signOut();
		await navigate({
			to: "/",
			replace: true
		});
	}
	return /* @__PURE__ */ jsxs("header", {
		className: "glass-nav sticky top-0 z-50",
		children: [/* @__PURE__ */ jsxs("nav", {
			"aria-label": "Main navigation",
			className: "mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex shrink-0 items-center gap-2",
					children: [/* @__PURE__ */ jsx(Hexagon, {
						className: "h-6 w-6 text-primary",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("span", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "ABTalks"
					})]
				}),
				/* @__PURE__ */ jsx("ul", {
					className: "hidden flex-1 items-center gap-1 lg:flex",
					children: navLinks.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: link.to,
						className: cn("rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground", pathname === link.to && "bg-secondary text-foreground"),
						children: link.label
					}) }, link.to))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "ml-auto flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Search ABTalks",
							onClick: () => setSearchOpen(true),
							children: /* @__PURE__ */ jsx(Search, { className: "h-5 w-5" })
						}),
						user ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							asChild: true,
							"aria-label": "Notifications",
							children: /* @__PURE__ */ jsxs(Link, {
								to: "/notifications",
								className: "relative",
								children: [/* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }), unread > 0 && /* @__PURE__ */ jsx("span", {
									className: "absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground",
									children: unread > 9 ? "9+" : unread
								})]
							})
						}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsx("button", {
								className: "rounded-full ring-offset-background transition-opacity hover:opacity-85",
								"aria-label": "Account menu",
								children: /* @__PURE__ */ jsxs(Avatar, {
									className: "h-9 w-9 border border-border",
									children: [/* @__PURE__ */ jsx(AvatarImage, {
										src: profile?.avatar_url ?? void 0,
										alt: ""
									}), /* @__PURE__ */ jsx(AvatarFallback, { children: initials(profile?.full_name ?? "AB") })]
								})
							})
						}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
							align: "end",
							className: "w-56",
							children: [
								/* @__PURE__ */ jsxs(DropdownMenuLabel, { children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium",
									children: profile?.full_name ?? "Member"
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: ["@", profile?.username ?? "..."]
								})] }),
								/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/dashboard",
										children: [/* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 h-4 w-4" }), " Dashboard"]
									})
								}),
								profile?.username && /* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/profile/$username",
										params: { username: profile.username },
										children: [/* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }), " My profile"]
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/saved",
										children: [/* @__PURE__ */ jsx(Bookmark, { className: "mr-2 h-4 w-4" }), " Saved"]
									})
								}),
								isAdmin && /* @__PURE__ */ jsx(DropdownMenuItem, {
									asChild: true,
									children: /* @__PURE__ */ jsxs(Link, {
										to: "/admin",
										children: [/* @__PURE__ */ jsx(Badge, {
											variant: "secondary",
											className: "mr-2",
											children: "Admin"
										}), "Admin dashboard"]
									})
								}),
								/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
								/* @__PURE__ */ jsxs(DropdownMenuItem, {
									onSelect: () => void handleSignOut(),
									children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
								})
							]
						})] })] }) : /* @__PURE__ */ jsxs("div", {
							className: "hidden items-center gap-2 sm:flex",
							children: [/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/auth",
									search: { mode: "login" },
									children: "Login"
								})
							}), /* @__PURE__ */ jsx(Button, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Link, {
									to: "/auth",
									search: { mode: "signup" },
									children: "Join ABTalks"
								})
							})]
						}),
						/* @__PURE__ */ jsxs(Sheet, {
							open: mobileOpen,
							onOpenChange: setMobileOpen,
							children: [/* @__PURE__ */ jsx(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									className: "lg:hidden",
									"aria-label": "Open menu",
									children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
								})
							}), /* @__PURE__ */ jsxs(SheetContent, {
								side: "right",
								className: "w-[280px] p-6",
								children: [
									/* @__PURE__ */ jsx(SheetTitle, {
										className: "font-display text-lg",
										children: "ABTalks"
									}),
									/* @__PURE__ */ jsx("ul", {
										className: "mt-6 space-y-1",
										children: navLinks.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
											to: link.to,
											className: "block rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
											children: link.label
										}) }, link.to))
									}),
									!user && /* @__PURE__ */ jsxs("div", {
										className: "mt-6 space-y-2",
										children: [/* @__PURE__ */ jsx(Button, {
											className: "w-full",
											asChild: true,
											children: /* @__PURE__ */ jsx(Link, {
												to: "/auth",
												search: { mode: "signup" },
												children: "Join ABTalks"
											})
										}), /* @__PURE__ */ jsx(Button, {
											variant: "outline",
											className: "w-full",
											asChild: true,
											children: /* @__PURE__ */ jsx(Link, {
												to: "/auth",
												search: { mode: "login" },
												children: "Login"
											})
										})]
									})
								]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ jsx(GlobalSearch, {
			open: searchOpen,
			onOpenChange: setSearchOpen
		})]
	});
}
//#endregion
//#region src/components/layout/Footer.tsx
var columns = [{
	title: "Platform",
	links: [
		{
			label: "Explore",
			to: "/explore"
		},
		{
			label: "Events",
			to: "/events"
		},
		{
			label: "Community",
			to: "/community"
		},
		{
			label: "Learn",
			to: "/learn"
		}
	]
}, {
	title: "Account",
	links: [
		{
			label: "Dashboard",
			to: "/dashboard"
		},
		{
			label: "Saved",
			to: "/saved"
		},
		{
			label: "Notifications",
			to: "/notifications"
		},
		{
			label: "ABTalks AI",
			to: "/ai"
		}
	]
}];
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "mt-24 border-t border-border/60",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs(Link, {
				to: "/",
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx(Hexagon, {
					className: "h-5 w-5 text-primary",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsx("span", {
					className: "font-display text-lg font-semibold",
					children: "ABTalks"
				})]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-3 max-w-sm text-sm text-muted-foreground",
				children: "An AI-powered community for students, developers, founders and technology enthusiasts. Learn together, build together, ship together."
			})] }), columns.map((column) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
				className: "text-sm font-semibold text-foreground",
				children: column.title
			}), /* @__PURE__ */ jsx("ul", {
				className: "mt-3 space-y-2",
				children: column.links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
					to: link.to,
					className: "text-sm text-muted-foreground transition-colors hover:text-primary",
					children: link.label
				}) }, link.to))
			})] }, column.title))]
		}), /* @__PURE__ */ jsxs("div", {
			className: "border-t border-border/60 px-4 py-5 text-center text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ABTalks. Built as an open community project."
			]
		})]
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ABTalks — Where Ideas Meet Intelligence" },
			{
				name: "description",
				content: "ABTalks is an AI-powered community for students, developers and founders: events, hackathons, learning resources and networking."
			},
			{
				name: "author",
				content: "ABTalks"
			},
			{
				property: "og:title",
				content: "ABTalks — Where Ideas Meet Intelligence"
			},
			{
				property: "og:description",
				content: "Discover people, events, knowledge and opportunities shaping technology."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function AuthSync() {
	const router = useRouter();
	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") router.invalidate();
		});
		return () => data.subscription.unsubscribe();
	}, [router]);
	return null;
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
			/* @__PURE__ */ jsx(AuthSync, {}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-screen flex-col",
				children: [
					/* @__PURE__ */ jsx(Navbar, {}),
					/* @__PURE__ */ jsx("main", {
						className: "flex-1",
						children: /* @__PURE__ */ jsx(Outlet, {})
					}),
					/* @__PURE__ */ jsx(Footer, {})
				]
			}),
			/* @__PURE__ */ jsx(Toaster$1, {
				position: "top-right",
				richColors: true
			})
		] })
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$16 = () => import("./routes-CvGb1f8k.js");
var Route$17 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ABTalks — Where Ideas Meet Intelligence" },
		{
			name: "description",
			content: "Discover technology events, hackathons, workshops, learning resources and a community of builders — with an AI assistant that personalises it all."
		},
		{
			property: "og:title",
			content: "ABTalks — Where Ideas Meet Intelligence"
		},
		{
			property: "og:description",
			content: "Discover people, events, knowledge and opportunities shaping the next generation of technology."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
//#endregion
//#region src/routes/_authenticated/route.tsx
var $$splitComponentImporter$15 = () => import("./route-Di7iQBCH.js");
var Route$16 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({
			to: "/auth",
			search: { mode: "login" }
		});
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
//#endregion
//#region src/routes/auth.tsx
var $$splitComponentImporter$14 = () => import("./auth-sAJLrLW4.js");
var searchSchema = z.object({ mode: z.enum([
	"login",
	"signup",
	"forgot"
]).catch("login") });
var Route$15 = createFileRoute("/auth")({
	validateSearch: searchSchema,
	head: () => ({ meta: [
		{ title: "Sign in or join ABTalks" },
		{
			name: "description",
			content: "Create your ABTalks account to register for events, save learning resources and get personalised recommendations."
		},
		{
			property: "og:title",
			content: "Sign in or join ABTalks"
		},
		{
			property: "og:description",
			content: "Join the ABTalks technology community."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
//#endregion
//#region src/routes/community.tsx
var $$splitComponentImporter$13 = () => import("./community-ANKUkVpI.js");
var Route$14 = createFileRoute("/community")({
	head: () => ({ meta: [
		{ title: "Community feed | ABTalks" },
		{
			name: "description",
			content: "Share projects, ask questions and celebrate wins with students, developers and founders in the ABTalks community."
		},
		{
			property: "og:title",
			content: "Community feed | ABTalks"
		},
		{
			property: "og:description",
			content: "Share projects and ask questions on ABTalks."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
//#endregion
//#region src/routes/explore.tsx
var $$splitComponentImporter$12 = () => import("./explore-BirLgEog.js");
var Route$13 = createFileRoute("/explore")({
	head: () => ({ meta: [
		{ title: "Explore events, people & resources | ABTalks" },
		{
			name: "description",
			content: "Search across ABTalks events, community members and learning resources to find exactly what you need next."
		},
		{
			property: "og:title",
			content: "Explore events, people & resources | ABTalks"
		},
		{
			property: "og:description",
			content: "Search events, members and learning resources across ABTalks."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
//#endregion
//#region src/routes/learn.tsx
var $$splitComponentImporter$11 = () => import("./learn-XBM71pso.js");
var Route$12 = createFileRoute("/learn")({
	head: () => ({ meta: [
		{ title: "Learning paths & resources | ABTalks" },
		{
			name: "description",
			content: "Curated learning paths for AI, web development, cloud, security and data — sorted by difficulty and time to complete."
		},
		{
			property: "og:title",
			content: "Learning paths & resources | ABTalks"
		},
		{
			property: "og:description",
			content: "Curated technology learning paths from the ABTalks community."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
//#endregion
//#region src/routes/reset-password.tsx
var $$splitComponentImporter$10 = () => import("./reset-password-Bo7oNQcm.js");
var Route$11 = createFileRoute("/reset-password")({
	head: () => ({ meta: [
		{ title: "Set a new password | ABTalks" },
		{
			name: "description",
			content: "Choose a new password for your ABTalks account."
		},
		{
			property: "og:title",
			content: "Set a new password | ABTalks"
		},
		{
			property: "og:description",
			content: "Choose a new password for your ABTalks account."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/_authenticated/admin.tsx
var $$splitComponentImporter$9 = () => import("./admin-wBWL7C0-.js");
var Route$10 = createFileRoute("/_authenticated/admin")({
	head: () => ({ meta: [
		{ title: "Admin overview | ABTalks" },
		{
			name: "description",
			content: "Community health metrics for ABTalks organisers."
		},
		{
			property: "og:title",
			content: "Admin overview | ABTalks"
		},
		{
			property: "og:description",
			content: "Community health metrics for ABTalks organisers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
//#endregion
//#region src/routes/_authenticated/dashboard.tsx
var $$splitComponentImporter$8 = () => import("./dashboard-CivS7fu5.js");
var Route$9 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Your dashboard | ABTalks" },
		{
			name: "description",
			content: "Personalised event, learning and community recommendations based on your interests."
		},
		{
			property: "og:title",
			content: "Your dashboard | ABTalks"
		},
		{
			property: "og:description",
			content: "Your personalised ABTalks recommendations."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/_authenticated/notifications.tsx
var $$splitComponentImporter$7 = () => import("./notifications-C_Su9r9n.js");
var Route$8 = createFileRoute("/_authenticated/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications | ABTalks" },
		{
			name: "description",
			content: "Event reminders, follows and replies from the ABTalks community."
		},
		{
			property: "og:title",
			content: "Notifications | ABTalks"
		},
		{
			property: "og:description",
			content: "Your ABTalks activity notifications."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/_authenticated/onboarding.tsx
var $$splitComponentImporter$6 = () => import("./onboarding-BUUk8wzT.js");
var Route$7 = createFileRoute("/_authenticated/onboarding")({
	head: () => ({ meta: [
		{ title: "Personalise your feed | ABTalks" },
		{
			name: "description",
			content: "Pick the technologies you care about so ABTalks can recommend the right events."
		},
		{
			property: "og:title",
			content: "Personalise your feed | ABTalks"
		},
		{
			property: "og:description",
			content: "Choose your interests to personalise ABTalks."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_authenticated/saved.tsx
var $$splitComponentImporter$5 = () => import("./saved-C1u8mi97.js");
var Route$6 = createFileRoute("/_authenticated/saved")({
	head: () => ({ meta: [
		{ title: "Saved items | ABTalks" },
		{
			name: "description",
			content: "Events and learning resources you saved for later on ABTalks."
		},
		{
			property: "og:title",
			content: "Saved items | ABTalks"
		},
		{
			property: "og:description",
			content: "Your saved ABTalks events and resources."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/api/chat.ts
var SYSTEM_PROMPT = `You are the ABTalks assistant, a friendly mentor inside a technology community platform for students, developers and founders.
Help members choose events to attend, plan learning paths, prepare for hackathons and grow their careers.
Be concise, practical and encouraging. Use markdown with short sections and bullet points.`;
var Route$5 = createFileRoute("/api/chat")({ server: { handlers: { POST: async ({ request }) => {
	const body = await request.json();
	if (!Array.isArray(body.messages)) return new Response("Messages are required", { status: 400 });
	const key = process.env["LOVABLE_API_KEY"];
	if (!key) return new Response("AI is not configured", { status: 500 });
	const gateway = createOpenAICompatible({
		name: "lovable",
		baseURL: "https://ai.gateway.lovable.dev/v1",
		headers: {
			"Lovable-API-Key": key,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		}
	});
	return streamText({
		model: gateway("google/gemini-3.6-flash"),
		system: SYSTEM_PROMPT,
		messages: await convertToModelMessages(body.messages)
	}).toUIMessageStreamResponse({ originalMessages: body.messages });
} } } });
//#endregion
//#region src/routes/events/index.tsx
var $$splitComponentImporter$4 = () => import("./events--WadzaBm.js");
var Route$4 = createFileRoute("/events/")({
	head: () => ({ meta: [
		{ title: "Tech events, hackathons & workshops | ABTalks" },
		{
			name: "description",
			content: "Browse upcoming hackathons, workshops, tech talks and meetups from the ABTalks community and register in one click."
		},
		{
			property: "og:title",
			content: "Tech events, hackathons & workshops | ABTalks"
		},
		{
			property: "og:description",
			content: "Browse upcoming hackathons, workshops and tech talks on ABTalks."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/events/$slug.tsx
var $$splitComponentImporter$3 = () => import("./_slug-BMiXuPAI.js");
var $$splitErrorComponentImporter = () => import("./_slug-x_xX2a8G.js");
var Route$3 = createFileRoute("/events/$slug")({
	loader: async ({ params }) => {
		return { event: await fetchEventBySlug(params.slug) };
	},
	head: ({ loaderData }) => {
		const event = loaderData?.event;
		const title = event ? `${event.title} | ABTalks` : "Event | ABTalks";
		const description = event?.summary ?? "Discover technology events, hackathons and workshops on ABTalks.";
		return { meta: [
			{ title },
			{
				name: "description",
				content: description.slice(0, 155)
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description.slice(0, 155)
			},
			...event?.banner_url ? [{
				property: "og:image",
				content: event.banner_url
			}, {
				name: "twitter:image",
				content: event.banner_url
			}] : []
		] };
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/profile/$username.tsx
var $$splitComponentImporter$2 = () => import("./_username-B2VBbwNy.js");
var Route$2 = createFileRoute("/profile/$username")({
	loader: async ({ params }) => ({ profile: await fetchProfileByUsername(params.username) }),
	head: ({ loaderData }) => {
		const profile = loaderData?.profile;
		const title = profile ? `${profile.full_name} (@${profile.username}) | ABTalks` : "Profile | ABTalks";
		const description = profile?.headline ?? profile?.bio ?? "An ABTalks community member profile.";
		return { meta: [
			{ title },
			{
				name: "description",
				content: description.slice(0, 155)
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description.slice(0, 155)
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/_authenticated/ai/index.tsx
var $$splitComponentImporter$1 = () => import("./ai-TkY76e3H.js");
var Route$1 = createFileRoute("/_authenticated/ai/")({
	head: () => ({ meta: [
		{ title: "ABTalks AI assistant" },
		{
			name: "description",
			content: "Ask the ABTalks assistant what to learn, which event to join and how to prepare."
		},
		{
			property: "og:title",
			content: "ABTalks AI assistant"
		},
		{
			property: "og:description",
			content: "Your AI mentor for events, learning and careers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/_authenticated/ai/$threadId.tsx
var $$splitComponentImporter = () => import("./_threadId-DBvmvCco.js");
var Route = createFileRoute("/_authenticated/ai/$threadId")({
	head: () => ({ meta: [
		{ title: "ABTalks AI assistant" },
		{
			name: "description",
			content: "Chat with the ABTalks assistant about events, learning paths and career growth."
		},
		{
			property: "og:title",
			content: "ABTalks AI assistant"
		},
		{
			property: "og:description",
			content: "Your AI mentor for events, learning and careers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AuthenticatedRouteRoute = Route$16.update({
	id: "/_authenticated",
	getParentRoute: () => Route$18
});
var AuthRoute = Route$15.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$18
});
var CommunityRoute = Route$14.update({
	id: "/community",
	path: "/community",
	getParentRoute: () => Route$18
});
var ExploreRoute = Route$13.update({
	id: "/explore",
	path: "/explore",
	getParentRoute: () => Route$18
});
var LearnRoute = Route$12.update({
	id: "/learn",
	path: "/learn",
	getParentRoute: () => Route$18
});
var ResetPasswordRoute = Route$11.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$18
});
var AuthenticatedAdminRoute = Route$10.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$9.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedNotificationsRoute = Route$8.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOnboardingRoute = Route$7.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedSavedRoute = Route$6.update({
	id: "/saved",
	path: "/saved",
	getParentRoute: () => AuthenticatedRouteRoute
});
var ApiChatRoute = Route$5.update({
	id: "/api/chat",
	path: "/api/chat",
	getParentRoute: () => Route$18
});
var EventsIndexRoute = Route$4.update({
	id: "/events/",
	path: "/events/",
	getParentRoute: () => Route$18
});
var EventsSlugRoute = Route$3.update({
	id: "/events/$slug",
	path: "/events/$slug",
	getParentRoute: () => Route$18
});
var ProfileUsernameRoute = Route$2.update({
	id: "/profile/$username",
	path: "/profile/$username",
	getParentRoute: () => Route$18
});
var AuthenticatedAiIndexRoute = Route$1.update({
	id: "/ai/",
	path: "/ai/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedNotificationsRoute,
	AuthenticatedOnboardingRoute,
	AuthenticatedSavedRoute,
	AuthenticatedAiThreadIdRoute: Route.update({
		id: "/ai/$threadId",
		path: "/ai/$threadId",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAiIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	CommunityRoute,
	ExploreRoute,
	LearnRoute,
	ResetPasswordRoute,
	ApiChatRoute,
	EventsSlugRoute,
	ProfileUsernameRoute,
	EventsIndexRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Button as _, Route$15 as a, formatEventTime as c, initials as d, isPastDate as f, AvatarImage as g, getRouter, AvatarFallback as h, Route$3 as i, formatRelative as l, Avatar as m, Route as n, formatDuration as o, Badge as p, Route$2 as r, formatEventDate as s, router_exports as t, greeting as u, useAuth as v };

//# sourceMappingURL=router-DrXqpvlG.js.map