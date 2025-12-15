// index.js
const express = require('express');
const { Telegraf } = require('telegraf');
const config = require('./config');

const app = express();
const bot = new Telegraf(config.botToken);

// Express sozlamalari
app.use(express.json());

// API marshrutlarini ulaymiz
app.use('/api', require('./routes/api'));

// Telegram botni ishga tushiramiz
bot.launch().then(() => {
  console.log('Bot ishga tushdi');
});

// Serverni ishga tushiramiz
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishga tushdi`);
});
