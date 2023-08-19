import fs from 'fs';
import readline from 'readline';
import pkg from 'sqlite3';
const { verbose } = pkg;

const dbPath = './data/userPreferences.db';

// Check if the database file already exists
if (fs.existsSync(dbPath)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('userPreferences1.db already exists. Do you want to overwrite it? (yes/no): ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
      createDatabase(dbPath);
    } else {
      console.log('Database creation aborted.');
    }
    rl.close();
  });
} else {
  createDatabase(dbPath);
}

function createDatabase(path) {
  const dir = path.split('/').slice(0, -1).join('/');

  // Check if the directory exists, and create it if it doesn't
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new (verbose().Database)(path);

  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS preferences (userId TEXT PRIMARY KEY, city TEXT, state TEXT)');
  });

  db.close(() => {
    console.log('Database created successfully.');
  });
}
