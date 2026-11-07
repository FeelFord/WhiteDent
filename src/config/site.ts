// Compiled into the static bundle; this is a public URL prefix, never a secret.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: `/${string}`) { return `${basePath}${path}`; }
