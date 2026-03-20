/**
 * Neon free-tier auto-suspend recovery utility.
 *
 * Neon pauses the database compute after ~5 min of inactivity.
 * When suspended, the PgBouncer pooler IMMEDIATELY rejects new
 * connections with a PrismaClientInitializationError instead of
 * queuing them. connect_timeout doesn't help.
 *
 * Solution: retry the DB call up to MAX_RETRIES times, waiting
 * a bit longer each attempt so the Neon compute has time to wake.
 */

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000; // first retry after 1s, then 2s, 3s …

function isNeonSuspendError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const msg = (err as any)?.message ?? "";
  const name = (err as any)?.name ?? "";
  // PrismaClientInitializationError + "Can't reach database server"
  return (
    name === "PrismaClientInitializationError" ||
    msg.includes("Can't reach database server") ||
    msg.includes("connect ECONNREFUSED") ||
    msg.includes("Connection refused")
  );
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps any async DB call with automatic retry on Neon cold-start errors.
 *
 * Usage:
 *   const meals = await withDbRetry(() => prisma.meal.findMany({ ... }));
 */
export async function withDbRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (isNeonSuspendError(err)) {
        const delay = BASE_DELAY_MS * attempt; // 1s, 2s, 3s, 4s, 5s
        console.warn(
          `[db-retry] Neon DB unreachable (attempt ${attempt}/${MAX_RETRIES}). ` +
          `Retrying in ${delay}ms…`
        );
        await sleep(delay);
      } else {
        // Not a connection error — don't retry, re-throw immediately
        throw err;
      }
    }
  }

  // All retries exhausted
  console.error("[db-retry] All retries failed. Neon compute may still be waking up.");
  throw lastError;
}
