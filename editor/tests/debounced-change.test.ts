import { describe, expect, it, vi } from 'vitest';
import { createDebouncedChangeController } from '../src/debouncedChange.js';

describe('editor debounced change controller', () => {
  it('emits only the latest scheduled value', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const controller = createDebouncedChangeController({
      delayMs: 200,
      onChange,
    });

    controller.schedule('first');
    controller.schedule('second');
    vi.advanceTimersByTime(200);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('second');
    vi.useRealTimers();
  });

  it('flushes a pending value immediately without double-emitting later', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const controller = createDebouncedChangeController({
      delayMs: 200,
      onChange,
    });

    controller.schedule('pending');
    controller.flush();
    vi.advanceTimersByTime(200);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('pending');
    vi.useRealTimers();
  });

  it('cancels a pending value', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const controller = createDebouncedChangeController({
      delayMs: 200,
      onChange,
    });

    controller.schedule('pending');
    controller.cancel();
    vi.advanceTimersByTime(200);

    expect(onChange).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
