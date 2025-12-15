// routes/api.js
const express = require('express');
const router = express.Router();

let latestMessage = ''; // So‘nggi xabarni saqlash uchun o‘zgaruvchi

// Botdan xabarni qabul qilish
router.post('/send', (req, res) => {
  const { message } = req.body;
  if (message) {
    latestMessage = message;
    res.json({ success: true, info: 'Xabar saqlandi' });
  } else {
    res.status(400).json({ success: false, error: 'Xabar yo‘q' });
  }
});

// Saytdan so‘nggi xabarni olish
router.get('/latest', (req, res) => {
  res.json({ success: true, message: latestMessage });
});

module.exports = router;
