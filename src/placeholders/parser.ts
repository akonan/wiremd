import type { PlaceholderToken } from '../types.js';

const LOREM_MAX_PARAGRAPHS = 20;
const IMAGE_MAX_SIZE = 5000;

export interface PlaceholderMatch {
  raw: string;
  expression: string;
  start: number;
  end: number;
  token: PlaceholderToken | null;
  error?: string;
}

export function parsePlaceholderExpression(expression: string, raw = `{{${expression}}}`): PlaceholderToken | null {
  const normalizedExpression = expression.trim();

  if (normalizedExpression === 'user.name') {
    return {
      kind: 'user.name',
      raw,
      expression: normalizedExpression,
    };
  }

  if (normalizedExpression === 'user.email') {
    return {
      kind: 'user.email',
      raw,
      expression: normalizedExpression,
    };
  }

  if (normalizedExpression === 'date') {
    return {
      kind: 'date',
      raw,
      expression: normalizedExpression,
    };
  }

  const loremMatch = normalizedExpression.match(/^lorem:(\d+)$/);
  if (loremMatch) {
    const paragraphs = parsePositiveInteger(loremMatch[1]);
    if (paragraphs === null || paragraphs > LOREM_MAX_PARAGRAPHS) {
      return null;
    }

    return {
      kind: 'lorem',
      raw,
      expression: normalizedExpression,
      paragraphs,
    };
  }

  const imageMatch = normalizedExpression.match(/^image:(\d{1,4})x(\d{1,4})$/i);
  if (imageMatch) {
    const width = parsePositiveInteger(imageMatch[1]);
    const height = parsePositiveInteger(imageMatch[2]);

    if (width === null || height === null || width > IMAGE_MAX_SIZE || height > IMAGE_MAX_SIZE) {
      return null;
    }

    return {
      kind: 'image',
      raw,
      expression: normalizedExpression,
      width,
      height,
    };
  }

  const numberMatch = normalizedExpression.match(/^number:(-?\d+)\s*-\s*(-?\d+)$/);
  if (numberMatch) {
    const min = parseInteger(numberMatch[1]);
    const max = parseInteger(numberMatch[2]);

    if (min === null || max === null || min > max) {
      return null;
    }

    return {
      kind: 'number',
      raw,
      expression: normalizedExpression,
      min,
      max,
    };
  }

  return null;
}

export function extractPlaceholderMatches(text: string): PlaceholderMatch[] {
  const placeholderRegex = /\{\{\s*([^{}]+?)\s*\}\}/g;
  const matches: PlaceholderMatch[] = [];

  for (const match of text.matchAll(placeholderRegex)) {
    const raw = match[0];
    const expression = match[1].trim();
    const token = parsePlaceholderExpression(expression, raw);
    const start = match.index ?? 0;

    matches.push({
      raw,
      expression,
      start,
      end: start + raw.length,
      token,
      error: token ? undefined : `Unsupported placeholder expression: ${expression}`,
    });
  }

  return matches;
}

function parsePositiveInteger(input: string): number | null {
  const value = parseInteger(input);
  if (value === null || value <= 0) {
    return null;
  }
  return value;
}

function parseInteger(input: string): number | null {
  if (!/^-?\d+$/.test(input)) {
    return null;
  }

  const value = Number.parseInt(input, 10);
  if (!Number.isFinite(value)) {
    return null;
  }

  return value;
}
