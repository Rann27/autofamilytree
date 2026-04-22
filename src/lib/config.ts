import fs from 'fs';
import path from 'path';

export interface AppConfig {
  familyName: string;
  subtitle: string;
}

const CONFIG_PATH = path.join(process.cwd(), 'data', 'config.json');

const DEFAULT_CONFIG: AppConfig = {
  familyName: 'Keluarga Besar',
  subtitle: 'Silsilah & Nasab',
};

function ensureFile(): void {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
  }
}

export function readConfig(): AppConfig {
  ensureFile();
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeConfig(config: Partial<AppConfig>): AppConfig {
  ensureFile();
  const current = readConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
