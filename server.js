const express = require('express');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api'); // Telegram kutubxonasini chaqirish
const app = express();
const PORT = 3000;

// **********************************************
// 1. MAXFIY TOKEN VA BOT INITSializatsiyasi
// **********************************************
// Siz bergan haqiqiy token
const BOT_SECRET_TOKEN = "8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I"; 
const telegramBot = new TelegramBot(BOT_SECRET_TOKEN, { polling: true }); 
// Eslatma: 'polling: true' botni lokal muhitda ishlash uchun Telegram serverini doimiy tinglashga majbur qiladi.

// Global o'zgaruvchi: Botdan kelgan oxirgi xabarni saqlash uchun
let lastBotMessage = {
    message: "Hali botdan xabar kelmadi. Telegramda /start yoki istalgan matn yuboring.",
    source: "Telegram Bot Xizmati"
};

// **********************************************
// 2. TELEGRAM BOT MANTIQI (Yangiliklar)
// **********************************************

// Botga istalgan matnli xabar kelganda
telegramBot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Kelgan xabarni global o'zgaruvchiga saqlaymiz
    lastBotMessage = {
        message: `Oxirgi xabar: "${text}"`,
        source: `Telegramdan (${msg.from.first_name || 'Anonim'})`
    };

    console.log(`[BOT YANGILANISHI] Telegramdan yangi xabar keldi: "${text}"`);

    // Botdan javob yuborish (ixtiyoriy)
    telegramBot.sendMessage(chatId, `Veb-saytga ${text} xabari saqlandi. Endi saytga 3 marta bosing!`);
});

// **********************************************
// 3. EXPRESS SERVER MANTIQI
// **********************************************

// Statik fayllarni taqdim etish
app.use(express.static(path.join(__dirname, '/')));

// Bot xabarini olish uchun API Endpoint (Token orqali himoya)
app.get('/api/bot-message', (req, res) => {
    const incomingToken = req.headers['x-bot-token'];

    // Tokenni tekshirish (bu yerda biz botning haqiqiy API kalitini ishlatmayapmiz,
    // balki avvalgi soxta tokenni xavfsizlik uchun ishlatishda davom etamiz,
    // ammo endi manba (data) sifatida real bot xabarini beramiz).
    if (incomingToken !== BOT_SECRET_TOKEN) {
        return res.status(403).json({ 
            error: "Token noto'g'ri. So'rov rad etildi." 
        });
    }

    // Agar token to'g'ri bo'lsa, oxirgi kelgan xabarni qaytaramiz!
    console.log("Muvaffaqiyatli: Front-endga Telegramdan kelgan oxirgi xabar yuborilmoqda.");
    res.json(lastBotMessage);
});

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    console.log(`=> DIQQAT: Telegram bot ishga tushdi (Polling rejimida).`);
    console.log(`=> Telegram botingizga istalgan xabarni yuboring.`);
});