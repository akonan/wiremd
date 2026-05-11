// Browser stub — resolveIncludes is never called in the editor
export const resolve = (...parts: string[]) => parts.join('/');
export const dirname = (p: string) => p.split('/').slice(0, -1).join('/') || '/';
