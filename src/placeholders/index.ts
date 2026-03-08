import type { DataGenerationOptions } from '../types.js';
import { createDataGenerator, type DataGenerator } from './generator.js';
import { parsePlaceholderExpression } from './parser.js';

interface PlaceholderResolverContext {
  generator: DataGenerator;
  preserveUnknown: boolean;
}

const PLACEHOLDER_REGEX = /\{\{\s*([^{}]+?)\s*\}\}/g;

export function resolveTextPlaceholders(text: string, options: DataGenerationOptions = {}): string {
  const context = createResolverContext(options);
  return resolveTextWithContext(text, context);
}

export function resolveNodePlaceholders<T>(node: T, options: DataGenerationOptions = {}): T {
  const context = createResolverContext(options);
  return resolveValue(node, context);
}

function createResolverContext(options: DataGenerationOptions): PlaceholderResolverContext {
  return {
    generator: createDataGenerator(options),
    preserveUnknown: options.preserveUnknown ?? true,
  };
}

function resolveValue<T>(value: T, context: PlaceholderResolverContext): T {
  if (typeof value === 'string') {
    return resolveTextWithContext(value, context) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveValue(item, context)) as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
      result[key] = resolveValue(nestedValue, context);
    }

    return result as T;
  }

  return value;
}

function resolveTextWithContext(text: string, context: PlaceholderResolverContext): string {
  if (!text.includes('{{') || !text.includes('}}')) {
    return text;
  }

  return text.replace(PLACEHOLDER_REGEX, (raw: string, expression: string) => {
    const token = parsePlaceholderExpression(expression, raw);
    if (!token) {
      return context.preserveUnknown ? raw : '';
    }

    return context.generator.resolve(token);
  });
}
