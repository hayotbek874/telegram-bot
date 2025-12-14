// server.js
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// 1. O'zgarmas Ma'lumotlar
const token = '8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I'; 
const publicUrl = 'https://telegram-bot-db2l.onrender.com';
const port = process.env.PORT || 3000;

// 'Samarqand' kalitiga o'xshash qism: Render manzilining oxiriga Bot Tokeni qo'shiladi.
// Bu siz so'ragan **ko'rinmas universal kalit** vazifasini o'taydi.
const webHookPath = `/${token}`; 
const webHookUrl = `${publicUrl}${webHookPath}`;

// 2. Server Sozlamalari
const app = express();
app.use(bodyParser.json()); 

// 3. Botni WebHook rejimida ishga tushirish
const bot = new TelegramBot(token); 

// WebHookni o'rnatish (bu faqat bir marta ishga tushadi)
bot.setWebHook(webHookUrl)
    .then(() => {
        console.log(`WebHook o'rnatildi: ${webHookUrl}`);
    })
    .catch(err => {
        console.error("WebHook o'rnatishda xato:", err);
    });

// 4. WebHook Endpoint
// Telegram yangi xabar kelganda aynan shu KO'RINMAS MANZILGA POST so'rov yuboradi:
// https://telegram-bot-db2l.onrender.com/8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I
app.post(webHookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200); 
});

// 5. Sayt uchun Asosiy GET so'rovi (index.html faylini yetkazish uchun)
app.get('/', (req, res) => {
    // Keyingi bosqichda biz bu yerga index.html ni yuklaymiz
    res.send(`<h1>Render Server ishlamoqda. WebHook o'rnatildi: ${webHookUrl}</h1>`);
});

// 6. Serverni Tinglash
app.listen(port, () => {
    console.log(`Express server ${port} portida ishlamoqda`);
});


// 7. Bot Logikasi (Xabar kelganda nima qilish)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    
    // Hozircha oddiy javob, keyin bu yerga Socket.io qo'shiladi
    bot.sendMessage(chatId, `Siz yubordingiz: "${text}". WebHook rejimida muvaffaqiyatli ishlayapman.`);
});