const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backupDatabase() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const tables = [
    'menu_items',
    'categories',
    'modifiers',
    'modifier_options',
    'orders',
    'order_items',
    'order_item_modifiers',
    'business_hours',
    'carts',
    'cart_items',
    'cart_item_modifiers'
  ];

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);

  const backup = {};

  try {
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) {
        throw new Error(`Error backing up ${table}: ${error.message}`);
      }

      backup[table] = data;
    }

    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    console.log(`Backup completed: ${backupFile}`);

    // Cleanup old backups (keep last 7 days)
    const files = fs.readdirSync(BACKUP_DIR);
    const oldFiles = files
      .filter(f => f.startsWith('backup-'))
      .sort()
      .slice(0, -7);

    for (const file of oldFiles) {
      fs.unlinkSync(path.join(BACKUP_DIR, file));
      console.log(`Deleted old backup: ${file}`);
    }

  } catch (error) {
    console.error('Backup failed:', error);
    process.exit(1);
  }
}

backupDatabase();
