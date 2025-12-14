// Sayt elementlarini olamiz
const statusMessage = document.getElementById('status-message');
const secretMessageBox = document.getElementById('secret-message-box');
const messageContent = document.getElementById('message-content');
const clickCountElement = document.getElementById('click-count');

// Bosishlar sonini hisoblagich va xabar saqlagich
let clickCounter = 0;
let lastReceivedMessage = "Botdan hali birorta xabar kelmadi."; 

// =========================================================
// Socket.io Ulanishi
// =========================================================
// Agar bu fayl tashqi saytda ishlatilsa, URL aniq ko'rsatilishi kerak
const BOT_SERVER_URL = 'https://telegram-bot-k42a.onrender.com';
const socket = io(BOT_SERVER_URL); 

// 1. Ulanish Muvaffaqiyatli Bo'lganda
socket.on('connect', () => {
    statusMessage.textContent = '✅ Serverga muvaffaqiyatli ulanildi!';
    statusMessage.style.color = 'green';
});

// 2. Ulanish Uzilganda
socket.on('disconnect', () => {
    statusMessage.textContent = '❌ Server bilan aloqa uzildi.';
    statusMessage.style.color = 'red';
});

// 3. Botdan Kelgan Xabarni Qabul Qilish 
socket.on('secret-message', (message) => {
    console.log("Botdan yangi maxfiy xabar keldi:", message); 
    
    lastReceivedMessage = message; 
    
    // Foydalanuvchiga yangi xabar kelganini bildiramiz
    messageContent.textContent = "Yangi maxfiy xabar keldi. 3 marta bosing!"; 
    
    // Xabar kelganda uni yashirib, hisoblagichni nolga qaytaramiz
    secretMessageBox.style.display = 'none';
    clickCounter = 0;
    clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;
});

// =========================================================
// 4. 3 marta Bosish Mantiqi (Click Event Listener)
// =========================================================
document.body.addEventListener('click', () => {
    
    clickCounter++;
    clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;

    // Agar 3 marta bosilsa
    if (clickCounter === 3) {
        
        const isVisible = secretMessageBox.style.display === 'block';

        if (isVisible) {
            // Agar ko'rinib turgan bo'lsa, yashiramiz
            secretMessageBox.style.display = 'none';
        } else {
            // Agar yashirin bo'lsa, ko'rsatamiz
            secretMessageBox.style.display = 'block';
            
            // Eng so'nggi kelgan xabarni joylashtiramiz
            messageContent.textContent = lastReceivedMessage; 
        }
        
        // Hisoblagichni nolga qaytaramiz
        clickCounter = 0;
        clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;
    }
});