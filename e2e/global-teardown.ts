import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, 'data', 'portfolio.json');
const BACKUP_FILE = path.join(ROOT, 'data', '.portfolio.json.e2e-backup');
const MANIFEST_FILE = path.join(ROOT, 'data', '.e2e-file-manifest.json');

const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const TEMP_DIR = path.join(ROOT, 'temp');

function deleteNewFiles(dir: string, pattern: RegExp, before: string[]) {
  if (!fs.existsSync(dir)) return;
  const before_ = new Set(before);
  for (const name of fs.readdirSync(dir)) {
    if (pattern.test(name) && !before_.has(name)) {
      fs.unlinkSync(path.join(dir, name));
    }
  }
}

export default async function globalTeardown() {
  if (fs.existsSync(BACKUP_FILE)) {
    fs.copyFileSync(BACKUP_FILE, DATA_FILE);
    fs.unlinkSync(BACKUP_FILE);
  } else {
    console.warn('[global-teardown] No portfolio.json backup found to restore from.');
  }

  if (fs.existsSync(MANIFEST_FILE)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    deleteNewFiles(PUBLIC_DIR, /^resume_\d+\.pdf$/, manifest.resumePdfs ?? []);
    deleteNewFiles(DATA_DIR, /^portfolio\.backup\.\d+\.json$/, manifest.portfolioBackups ?? []);
    deleteNewFiles(TEMP_DIR, /\.tex$/, manifest.tempTexFiles ?? []);
    fs.unlinkSync(MANIFEST_FILE);
  }
}
