const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http'); 
const socketIo = require('socket.io'); 
const path = require('path');

// =========================================================
// 1. O'zgarmas Ma'lumotlar
// =========================================================
const token = '8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I'; 
const publicUrl = 'https://telegram-bot-k42a.onrender.com'; // Sizning Render URL manzilngiz
const port = process.env.PORT || 3000;
const webHookPath = `/${token}`;

// =========================================================
// 2. Server va Socket.io Sozlamalari (CORS RUXSATI BERILGAN)
// =========================================================
const app = express();
const server = http.createServer(app); 
// Socket.io ni CORS (Boshqa manbalardan kelgan ulanish)ga ruxsat berish bilan sozlash
const io = socketIo(server, {
    cors: {
        origin: "*", // Barcha tashqi domenlardan ulanishga ruxsat berish
        methods: ["GET", "POST"]
    }
}); 

app.use(bodyParser.json()); 
// public papkasi ichidagi statik fayllarni taqdim etish
app.use(express.static(path.join(__dirname, 'public'))); 

// =========================================================
// 3. Botni WebHook rejimida ishga tushirish
// =========================================================
const bot = new TelegramBot(token); 
bot.setWebHook(`${publicUrl}${webHookPath}`).catch(err => {
    console.error("WebHook o'rnatishda xato:", err);
});

// 4. WebHook Endpoint (Telegramdan keladigan POST so'rovlarni qabul qilish)
app.post(webHookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200); 
});

// =========================================================
// 5. Socket.io aloqasi
// =========================================================
io.on('connection', (socket) => {
    console.log('Yangi sayt mijoz ulandi (Socket.io)');
    
    socket.on('disconnect', () => {
        console.log('Sayt mijoz uzildi');
    });
});

// =========================================================
// 6. Bot Logikasi: Telegram xabarini Socket.io orqali saytga yuborish
// =========================================================
bot.on('message', (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    // Saytga yuboriladigan maxfiy xabarni yaratish
    const secretMessage = `Telegramdan kelgan yangi xabar: "${text.toUpperCase()}"`; 
    
    // Barcha ulangan brauzerlarga 'secret-message' eventi orqali xabarni yuborish
    io.emit('secret-message', secretMessage); 
    
    // Telegramga javob yuborish
    bot.sendMessage(chatId, `Xabar qabul qilindi va ${io.engine.clientsCount} ta sayt mijoziga uzatildi. Endi saytga 3 marta bosing!`);
});

// =========================================================
// 7. Serverni Tinglash
// =========================================================
server.listen(port, () => {
    console.log(`Express server Socket.io bilan ${port} portida ishlamoqda`);
});