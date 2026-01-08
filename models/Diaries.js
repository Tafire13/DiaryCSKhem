const db = require('../config/database');

// 1. สร้างตาราง Diaries ถ้ายังไม่มี
const initTable = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS Diaries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT NOT NULL,
        date TEXT,
        user_id INTEGER
    )`;
    db.run(sql, (err) => {
        if (err) console.error("Error creating Diaries table:", err.message);
        else console.log("Table 'Diaries' ready.");
    });
};

initTable();

// 2. สร้าง object สำหรับเรียกใช้งาน
const Diaries = {
    // ฟังก์ชันเพิ่มไดอารี่
    create: (data, callback) => {
        const sql = `INSERT INTO Diaries (title, description, image, date, user_id) VALUES (?, ?, ?, ?, ?)`;
        const params = [
            data.title,
            data.description,
            data.image,
            new Date().toISOString().split('T')[0], // วันที่ปัจจุบัน YYYY-MM-DD
            data.user_id
        ];

        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                callback(false);
            } else {
                callback(true);
            }
        });
    },

    // ฟังก์ชันดึงไดอารี่ทั้งหมด (เผื่อใช้ตอนแสดงผล)
    getAll: (callback) => {
        const sql = `
        SELECT Diaries.*, users.username 
        FROM Diaries 
        LEFT JOIN users ON Diaries.user_id = users.uid  
        ORDER BY Diaries.id DESC
    `;
        // ^^^ แก้ไขบรรทัดบน จาก users.id เป็น users.uid (หรือชื่อคอลัมน์ ID จริงๆ ในตาราง users ของคุณ)

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err);
                callback([]);
            } else {
                callback(rows);
            }
        });
    }
};

module.exports = Diaries;