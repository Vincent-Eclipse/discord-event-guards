function createKeyedDebouncer(
  delayMs,
  { setTimeoutFn = setTimeout, clearTimeoutFn = clearTimeout } = {},
) {
  const pending = new Map();

  function schedule(key, run) {
    const existing = pending.get(key);
    if (existing) clearTimeoutFn(existing);

    const timer = setTimeoutFn(() => {
      pending.delete(key);
      run();
    }, delayMs);

    pending.set(key, timer);
  }

  function isPending(key) {
    return pending.has(key);
  }

  function cancel(key) {
    const existing = pending.get(key);
    if (existing === undefined) return;
    clearTimeoutFn(existing);
    pending.delete(key);
  }

  return { schedule, isPending, cancel };
}

module.exports = { createKeyedDebouncer };

