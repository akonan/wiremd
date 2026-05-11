/** wiremd Editor - URL hash share encoding */

import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';

export const SHARE_HASH_KEY = 'code';

export function encodeShareHash(markdown: string): string {
  if (!markdown) return '';
  return `#${SHARE_HASH_KEY}=${compressToEncodedURIComponent(markdown)}`;
}

export function decodeShareHash(hash: string | undefined | null): string | null {
  if (!hash) return null;
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const prefix = `${SHARE_HASH_KEY}=`;
  if (!raw.startsWith(prefix)) return null;
  const payload = raw.slice(prefix.length);
  if (!payload) return null;
  try {
    const decoded = decompressFromEncodedURIComponent(payload);
    return decoded ? decoded : null;
  } catch {
    return null;
  }
}
