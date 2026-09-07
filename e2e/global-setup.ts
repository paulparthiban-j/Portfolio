import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, 'data', 'portfolio.json');
const BACKUP_FILE = path.join(ROOT, 'data', '.portfolio.json.e2e-backup');
const MANIFEST_FILE = path.join(ROOT, 'data', '.e2e-file-manifest.json');

const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(ROOT, 'data');
const TEMP_DIR = path.join(ROOT, 'temp');

function listMatching(dir: string, pattern: RegExp): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => pattern.test(name));
}

/**
 * Snapshots real on-disk state before the test run so global-teardown can
 * restore data/portfolio.json exactly and delete only files the test run
 * itself created. Tests exercise real file-writing API routes, so this is
 * the safety net that keeps the developer's actual portfolio content from
 * ever being at risk from running the suite.
 */
export default async function globalSetup() {
  // Don't clobber a backup left behind by a previous run that crashed
  // before teardown - that backup still holds the true original content.
  if (!fs.existsSync(BACKUP_FILE)) {
    if (fs.existsSync(DATA_FILE)) {
      fs.copyFileSync(DATA_FILE, BACKUP_FILE);
    }
  } else {
    console.warn(
      '[global-setup] Found a leftover .portfolio.json.e2e-backup from a previous run - reusing it instead of overwriting, to avoid backing up already-test-mutated data.'
    );
  }

  const manifest = {
    resumePdfs: listMatching(PUBLIC_DIR, /^resume_\d+\.pdf$/),
    portfolioBackups: listMatching(DATA_DIR, /^portfolio\.backup\.\d+\.json$/),
    tempTexFiles: listMatching(TEMP_DIR, /\.tex$/),
  };
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
}
