/**
 * Stub error reporter — replace with a real service (e.g. Sentry) if needed.
 * The function signature mirrors what __root.tsx expects.
 */
export function reportLovableError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (import.meta.env.DEV) {
    console.error("[Sinau.id] Unhandled error reported:", error, context);
  }
}
