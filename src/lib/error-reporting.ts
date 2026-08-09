export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  if (error instanceof Error) {
    console.error("Captured error:", error, context);
  } else {
    console.error("Captured error:", String(error), context);
  }
}
