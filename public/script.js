// Sayt elementlari
const statusMessage = document.getElementById('status-message');
const secretMessageBox = document.getElementById('secret-message-box');
const messageContent = document.getElementById('message-content');
const clickCountElement = document.getElementById('click-count');

// Bosishlar sonini hisoblagich
let clickCounter = 0;
let lastReceivedMessage = "Maxfiy xabar yo'q."; // Oxirgi kelgan xabarni saqlash

// Socket.io ulanishini o'rnatish
// Bu yerda serverning URL manzili ishlatiladi
const socket = io('https://telegram-bot-k42a.onrender.com'); 

// 1. Ulanishni tekshirish
socket.on('connect', () => {
    statusMessage.textContent = 'Serverga muvaffaqiyatli ulanildi!';
    statusMessage.style.color = 'green';
});

socket.on('disconnect', () => {
    statusMessage.textContent = 'Server bilan aloqa uzildi.';
    statusMessage.style.color = 'red';
});

// 2. Botdan kelgan xabarni qabul qilish
socket.on('secret-message', (message) => {
    lastReceivedMessage = message; // Yangi xabarni saqlaymiz
    messageContent.textContent = lastReceivedMessage; // Xabarni darhol yangilaymiz

    // Yangi xabar kelganda avtomatik ravishda yashiramiz (agar ko'rinib turgan bo'lsa)
    secretMessageBox.style.display = 'none';
    clickCounter = 0; // Hisoblagichni nolga qaytaramiz
    clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;
});

// 3. 3 marta bosish mantiqini qo'shish
document.body.addEventListener('click', () => {
    clickCounter++;
    clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;

    if (clickCounter === 3) {
        // 3-marta bosilganda
        const isVisible = secretMessageBox.style.display === 'block';

        if (isVisible) {
            // Agar ko'rinib turgan bo'lsa, yashiramiz
            secretMessageBox.style.display = 'none';
        } else {
            // Agar yashirin bo'lsa, ko'rsatamiz
            secretMessageBox.style.display = 'block';
            messageContent.textContent = lastReceivedMessage; // Eng so'nggi xabarni ko'rsatamiz
        }
        
        // Hisoblagichni qayta ishga tushiramiz (keyingi marta bosish sikli uchun)
        clickCounter = 0;
        clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;
    }
});