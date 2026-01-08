const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// ระบุที่อยู่ไฟล์ database
const dbPath = path.resolve(__dirname, '../data/database.db');

// สร้างการเชื่อมต่อ
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ' + dbPath + ': ' + err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;