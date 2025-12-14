const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http'); // HTTP serverni ulash
const socketIo = require('socket.io'); // Socket.io ni ulash
const path = require('path');

// 1. O'zgarmas Ma'lumotlar
const token = '8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I'; 
// Keyingi deployda Render o'zi URL beradi. Hozircha bu bizning asosiy domenimiz.
const publicUrl = 'https://telegram-bot-db2l.onrender.com'; 
const port = process.env.PORT || 3000;
const webHookPath = `/${token}`;

// 2. Server Sozlamalari
const app = express();
const server = http.createServer(app); // Express ilovasidan HTTP server yaratish
const io = socketIo(server); // Socket.io ni HTTP serverga ulash

app.use(bodyParser.json()); 
// index.html va boshqa statik fayllarni (masalan, CSS/JS) taqdim etish
app.use(express.static(path.join(__dirname, 'public'))); 

// 3. Botni WebHook rejimida ishga tushirish
const bot = new TelegramBot(token); 
bot.setWebHook(`${publicUrl}${webHookPath}`).catch(err => {
    console.error("WebHook o'rnatishda xato:", err);
});

// 4. WebHook Endpoint (Telegramdan keladigan POST so'rovlarni qabul qilish)
app.post(webHookPath, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200); 
});

// 5. Socket.io aloqasi (Front-end brauzerlar ulanganida)
io.on('connection', (socket) => {
    console.log('Yangi sayt mijoz ulandi (Socket.io)');
    
    // Test uchun ulanish so'ngida xabar yuborish
    socket.emit('status', 'Bot serveriga ulanish o\'rnatildi.');

    socket.on('disconnect', () => {
        console.log('Sayt mijoz uzildi');
    });
});

// 6. Bot Logikasi: Telegramdan kelgan xabarni Socket.io orqali saytga yuborish
bot.on('message', (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    // Saytga xabar yuborish (maxfiy xabarni tayyorlash)
    const secretMessage = `Botdan kelgan maxfiy xabar: ${text.toUpperCase()}`;
    
    // Barcha ulangan brauzerlarga xabarni yuborish
    io.emit('secret-message', secretMessage); 
    
    bot.sendMessage(chatId, `Xabar qabul qilindi va ${io.engine.clientsCount} ta sayt mijoziga yuborildi.`);
});


// 7. Serverni Tinglash
server.listen(port, () => {
    console.log(`Express server Socket.io bilan ${port} portida ishlamoqda`);
});