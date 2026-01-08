const express = require('express');
const router = express.Router();
const multer = require('multer');
const Diaries = require('../models/Diaries');
const axios = require('axios');
const FormData = require('form-data');

// --- 1. ตั้งค่า Multer (เปลี่ยนเป็น Memory Storage) ---
// เราจะไม่เก็บไฟล์ลงเครื่องเราแล้ว แต่จะเก็บเป็น Buffer ใน RAM ชั่วคราวเพื่อส่งต่อให้ API
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- 2. Route รับข้อมูล ---
router.post('/add-diary', upload.single('image'), async (req, res) => {
    // 1. เช็คว่ามีไฟล์ส่งมาไหม
    if (!req.file) {
        console.log("Error: No file uploaded");
        return res.redirect('/');
    }

    try {
        // --- 2. เตรียมข้อมูลส่งไป up-pic.com ---
        const formData = new FormData();
        // ตาม curl: source=@image.jpeg (ดังนั้น field ชื่อ 'source')
        formData.append('source', req.file.buffer, req.file.originalname); 

        // --- 3. ยิง API ไปที่ up-pic.com ---
        console.log("Uploading to up-pic.com...");
        
        const apiResponse = await axios.post('https://up-pic.com/api/1/upload', formData, {
            headers: {
                // ใส่ API Key ของคุณตรงนี้
                'X-API-Key': 'chv_7vp_c2a7b709c9f8bdf85491f630a56a462d5cdbf20aa6e7cb54cbec8c57099e265c823da80e2666e17b379916233be2ceef6d91dbc02c511c13448c23398149208f', 
                ...formData.getHeaders() // ใส่ Header ที่จำเป็นสำหรับ Multipart
            }
        });

        // --- 4. ดึง URL รูปจาก Response ---
        // ปกติ API แนวนี้จะ return json กลับมา เราต้องแกะเอา URL
        // (โครงสร้างนี้เป็นมาตรฐาน Chevereto API ที่ up-pic น่าจะใช้)
        const imageUrl = apiResponse.data.image.url; 
        
        console.log("Upload Success! Image URL:", imageUrl);

        // --- 5. บันทึกลง Database (SQLite) ---
        const userId = req.session.user ? req.session.user.uid : 1;

        const newDiary = {
            title: req.body.title,
            description: req.body.description,
            image: imageUrl, // *สำคัญ* เก็บ URL จากเว็บฝากรูป แทน path ในเครื่อง
            user_id: userId
        };

        Diaries.create(newDiary, (success) => {
            if (success) {
                console.log("Diary Saved to DB Successfully!");
                res.redirect('/');
            } else {
                console.log("Database Error");
                res.status(500).send("Database Error");
            }
        });

    } catch (error) {
        console.error("API Upload Error:");
        if (error.response) {
            // กรณี API ตอบ error กลับมา
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
        res.status(500).send("Error uploading image to external server");
    }
});

module.exports = router;