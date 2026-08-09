import { t as Card } from "./card-CzXpCsbD.js";
import { t as Skeleton } from "./skeleton-D9W9wFsj.js";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/common/States.tsx
function SectionHeading({ eyebrow, title, description, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "max-w-2xl",
			children: [
				eyebrow ? /* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
					children: eyebrow
				}) : null,
				/* @__PURE__ */ jsx("h2", {
					className: "mt-2 text-2xl font-semibold sm:text-3xl",
					children: title
				}),
				description ? /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-muted-foreground",
					children: description
				}) : null
			]
		}), action]
	});
}
function EmptyState({ icon, title, description, action }) {
	return /* @__PURE__ */ jsxs(Card, {
		className: "flex flex-col items-center justify-center gap-3 border-dashed bg-card/50 px-6 py-14 text-center",
		children: [
			icon ? /* @__PURE__ */ jsx("div", {
				className: "text-muted-foreground",
				children: icon
			}) : null,
			/* @__PURE__ */ jsx("h3", {
				className: "text-base font-semibold",
				children: title
			}),
			description ? /* @__PURE__ */ jsx("p", {
				className: "max-w-md text-sm text-muted-foreground",
				children: description
			}) : null,
			action
		]
	});
}
function ErrorState({ message, onRetry }) {
	return /* @__PURE__ */ jsxs(Card, {
		className: "border-destructive/40 bg-destructive/5 p-6 text-center",
		children: [
			/* @__PURE__ */ jsx("h3", {
				className: "text-base font-semibold text-destructive",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: message ?? "We couldn't load this content. Please try again."
			}),
			onRetry ? /* @__PURE__ */ jsx("button", {
				onClick: onRetry,
				className: "mt-4 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80",
				children: "Try again"
			}) : null
		]
	});
}
function CardGridSkeleton({ count = 6 }) {
	return /* @__PURE__ */ jsx("div", {
		className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
		children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsxs(Card, {
			className: "overflow-hidden p-0",
			children: [/* @__PURE__ */ jsx(Skeleton, { className: "aspect-[16/9] w-full rounded-none" }), /* @__PURE__ */ jsxs("div", {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-1/3" }),
					/* @__PURE__ */ jsx(Skeleton, { className: "h-5 w-4/5" }),
					/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
					/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-2/3" })
				]
			})]
		}, index))
	});
}
function ListSkeleton({ count = 4 }) {
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-4",
		children: Array.from({ length: count }).map((_, index) => /* @__PURE__ */ jsxs(Card, {
			className: "space-y-3 p-5",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-10 w-10 rounded-full" }), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-32" }), /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-20" })]
					})]
				}),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-full" }),
				/* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-3/4" })
			]
		}, index))
	});
}
//#endregion
export { SectionHeading as a, ListSkeleton as i, EmptyState as n, ErrorState as r, CardGridSkeleton as t };

//# sourceMappingURL=States-BH6FfLCK.js.map