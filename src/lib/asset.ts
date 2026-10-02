/**
 * Prefixes public-asset paths with the deployment base path.
 * Empty in local dev and on root-domain hosts; set to the repo subpath
 * (e.g. /quantum-impact-marketing) for GitHub Pages builds.
 */
export const asset = (path: string) =>
  (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + path;
