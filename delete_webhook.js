// delete_webhook.js
const TelegramBot = require('node-telegram-bot-api');
// Sizning bot tokeningizni kiriting
const token = '8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I'; 
const bot = new TelegramBot(token);

bot.deleteWebHook()
    .then(success => {
        if (success) {
            console.log("✅ WebHook muvaffaqiyatli o'chirildi. Toza holatga qaytdik.");
        } else {
            console.log("⚠️ WebHook allaqachon o'chirilgan yoki xato yuz berdi.");
        }
        process.exit(); 
    })
    .catch(error => {
        console.error("❌ WebHookni o'chirishda jiddiy xato:", error);
        process.exit(1);
    });