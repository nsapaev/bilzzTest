type Task<T> = () => Promise<T>;

export type Result<T> =
  | { status: "fulfilled"; value: T; attempts: number }
  | { status: "rejected"; reason: unknown; attempts: number };

export async function queue<T>(
  tasks: Task<T>[],
  concurrency: number,
  retries = 3,
): Promise<Result<T>[]> {
  let active = 0;
  let nextIndex = 0;
  let remaining = tasks.length;

  const results: Result<T>[] = new Array(tasks.length);

  let resolveAll!: (v: Result<T>[]) => void;
  const done = new Promise<Result<T>[]>((res) => (resolveAll = res));

  function finishIfDone() {
    if (remaining === 0 && active === 0) resolveAll(results);
  }

  async function runWithRetry(
    task: Task<T>,
  ): Promise<{ value?: T; error?: unknown; attempts: number }> {
    let error: unknown;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const value = await task();
        return { value, attempts: attempt };
      } catch (e) {
        error = e;
      }
    }

    return { error, attempts: retries };
  }

  function runNext() {
    const idx = nextIndex;
    if (idx >= tasks.length) return;

    nextIndex++;
    active++;

    runWithRetry(tasks[idx])
      .then((res) => {
        if ("value" in res && res.value !== undefined) {
          results[idx] = {
            status: "fulfilled",
            value: res.value,
            attempts: res.attempts,
          };
        } else {
          results[idx] = {
            status: "rejected",
            reason: res.error,
            attempts: res.attempts,
          };
        }
      })
      .finally(() => {
        active--;
        remaining--;

        runNext();
        finishIfDone();
      });
  }

  const startCount = Math.min(concurrency, tasks.length);
  for (let i = 0; i < startCount; i++) runNext();

  return done;
}
