import fs from 'fs';
import path from 'path';

export const writeLog = async (content: string) => {
  const date = new Date().toISOString().split('T')[0]; 
  const logDir = path.resolve(process.cwd(), 'log');
  const logPath = path.join(logDir, `${date}-log.md`);

  const logEntry = `### 📬 ${new Date().toLocaleString()} Notification Log\n\n${content}\n\n---\n`;

  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  fs.appendFileSync(logPath, logEntry, 'utf8');
};
