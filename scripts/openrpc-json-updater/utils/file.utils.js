import fs from 'fs';
import path from 'node:path';

export function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Unable to read or parse "${filePath}":`, err);
    process.exit(1);
  }
}

export function buildDatedFileName(basePath) {
  const { dir, name, ext } = path.parse(basePath);
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}`;
  const file = `${name}-updated-${date}${ext}`;
  return dir ? path.join(dir, file) : file;
}
