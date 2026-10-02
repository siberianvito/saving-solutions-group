import fs from "node:fs";
import path from "node:path";

/**
 * Build-time check for optional media. Pages render an art plate when a photo
 * hasn't been produced yet; drop the file into /public/media and rebuild.
 */
export function availableMedia(paths: (string | undefined)[]): string[] {
  return paths.filter((p): p is string => !!p && fs.existsSync(path.join(process.cwd(), "public", p)));
}
