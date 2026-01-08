const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); // เพิ่ม fs

const dbPath = path.resolve(__dirname, '../data/database.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;
