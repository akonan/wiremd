export interface DebouncedChangeController<T> {
  schedule: (value: T) => void;
  flush: () => void;
  cancel: () => void;
}

export function createDebouncedChangeController<T>(opts: {
  delayMs: number;
  onChange: (value: T) => void;
}): DebouncedChangeController<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pendingValue: T | undefined;

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  }

  function flush() {
    if (pendingValue === undefined) {
      return;
    }

    const value = pendingValue;
    pendingValue = undefined;
    clearTimer();
    opts.onChange(value);
  }

  return {
    schedule(value) {
      pendingValue = value;
      clearTimer();
      timer = setTimeout(() => {
        flush();
      }, opts.delayMs);
    },
    flush,
    cancel() {
      pendingValue = undefined;
      clearTimer();
    },
  };
}
