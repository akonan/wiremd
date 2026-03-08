import type { DataGenerationOptions, PlaceholderToken } from '../types.js';
import { DefaultPlaceholderProvider } from './providers/default-provider.js';

export interface DataGenerator {
  resolve: (token: PlaceholderToken) => string;
}

export function createDataGenerator(options: DataGenerationOptions = {}): DataGenerator {
  const random = createRandom(options.seed);
  const now = options.now ?? new Date();
  const provider = new DefaultPlaceholderProvider({ random, now });

  return {
    resolve: (token: PlaceholderToken) => provider.resolve(token),
  };
}

export function createRandom(seed?: string | number): () => number {
  if (seed === undefined || seed === null || seed === '') {
    return () => Math.random();
  }

  const numericSeed = hashSeed(seed);
  return mulberry32(numericSeed);
}

function hashSeed(seed: string | number): number {
  const value = String(seed);
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
