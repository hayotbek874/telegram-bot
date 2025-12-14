const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// 1. O'zgarmas Ma'lumotlar
const token = '8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I'; 
const publicUrl = 'https://telegram-bot-db2l.onrender.com';
const port = process.env.PORT || 3000;

// WebHook uchun maxfiy manzil (Domen Kaliti)
const webHookUrl = `${publicUrl}/${token}`;

// 2. Server Sozlamalari
const app = express();
app.use(bodyParser.json()); // Telegramdan kelgan JSON so'rovlarni tahlil qilish

// 3. Botni WebHook rejimida ishga tushirish
const bot = new TelegramBot(token); 

// Pollingni to'xtatish va WebHookni o'rnatish
bot.setWebHook(webHookUrl)
    .then(() => {
        console.log(`WebHook muvaffaqiyatli o'rnatildi: ${webHookUrl}`);
    })
    .catch(err => {
        console.error("WebHook o'rnatishda xato:", err);
    });

// 4. WebHook Endpoint (Telegramdan keladigan POST so'rovlarni qabul qilish)
// Telegram yangi xabar kelganda aynan shu manzilga (url/token) POST yuboradi.
app.post(`/${token}`, (req, res) => {
    bot.processUpdate(req.body);
    // Telegramga muvaffaqiyatli qabul qilinganini bildirish
    res.sendStatus(200); 
});

// 5. Asosiy Server Endpoints (Sayt integratsiyasi uchun tayyorgarlik)

// Saytga integratsiya qilinadigan HTML faylni taqdim etish (hozircha oddiy tekst)
app.get('/', (req, res) => {
    // Keyingi qadamda biz bu yerga index.html faylini yuklaymiz.
    res.send(`
        <h1>Telegram Bot WebHook Server ishlamoqda!</h1>
        <p>WebHook URL: ${webHookUrl}</p>
        <p>Bot WebHook rejimida muvaffaqiyatli ishga tushirildi. Endi faqat sayt bilan integratsiya qilish kerak.</p>
    `);
});

// 6. Serverni Tinglash
app.listen(port, () => {
    console.log(`Express server ${port} portida ishlamoqda`);
});


// 7. Bot Logikasi (Xabar kelganda nima qilish)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // --- Keyingi bosqich: Saytga xabar yuborish logikasi shu yerda bo'ladi ---
    
    // Hozircha oddiy javob yuboramiz
    bot.sendMessage(chatId, `Siz yubordingiz: "${text}". Men WebHook orqali ishlayapman.`);
});