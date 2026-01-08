const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// --- Import Models & Routers ---
const Diaries = require('./models/Diaries');
const authRouter = require('./routers/authRoute');
const diaryRouter = require('./routers/diaryRoute'); // <--- เพิ่มบรรทัดนี้

// --- View Engine Setup ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Session Setup ---
app.use(session({
    secret: 'secret_key_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));

// --- Routes Usage ---
app.use(authRouter); 
app.use(diaryRouter); // <--- ต้องเรียกใช้ตรงนี้ด้วย ระบบอัปโหลดถึงจะทำงาน

// --- Main Route (รวม Logic เช็ค Login + ดึงข้อมูล) ---
app.get('/', (req, res) => {
    // 1. ถ้ายังไม่ Login ให้เด้งไปหน้า Login
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }

    // 2. ถ้า Login แล้ว ให้ดึงข้อมูล Diary มาแสดง
    Diaries.getAll((data) => {
        res.render('index', {
            user: req.session.user, // ส่งข้อมูล User จาก Session
            diaries: data           // ส่งข้อมูล Diary จาก Database
        });
    });
});

app.listen(3000, () => {
    console.log('🚀 http://localhost:3000');
});