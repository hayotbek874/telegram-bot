// Sayt elementlarini olamiz
const statusMessage = document.getElementById('status-message');
const secretMessageBox = document.getElementById('secret-message-box');
const messageContent = document.getElementById('message-content');
const clickCountElement = document.getElementById('click-count');

// Bosishlar sonini hisoblagich va xabar saqlagich
let clickCounter = 0;
// Botdan xabar kelmaguncha ko'rsatiladigan dastlabki xabar
let lastReceivedMessage = "Botdan hali birorta xabar kelmadi."; 

// =========================================================
// Socket.io Ulanishi
// Render URL manzilingizga ulanish o'rnatilmoqda
// =========================================================
const socket = io('https://telegram-bot-k42a.onrender.com'); 

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

// 3. Botdan Kelgan Xabarni Qabul Qilish (Serverdagi io.emit('secret-message', ...) dan keladi)
socket.on('secret-message', (message) => {
    // Console'ga yozib tekshiramiz (Debugging uchun)
    console.log("Botdan yangi xabar keldi:", message); 
    
    // Kelgan yangi xabarni global o'zgaruvchida saqlaymiz
    lastReceivedMessage = message; 
    
    // Foydalanuvchiga yangi xabar kelganini bildiramiz
    messageContent.textContent = "Yangi maxfiy xabar keldi. 3 marta bosing!"; 
    
    // Xabar kelganda, uni yashirib, hisoblagichni nolga qaytaramiz
    secretMessageBox.style.display = 'none';
    clickCounter = 0;
    clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;
});

// =========================================================
// 4. 3 marta Bosish Mantiqi (Click Event Listener)
// =========================================================

// Butun sahifadagi bosishlarni tinglaymiz
document.body.addEventListener('click', () => {
    
    // Har bir bosishni sanaymiz
    clickCounter++;
    clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;

    // Uch marta bosilganda mantiqni ishga tushiramiz
    if (clickCounter === 3) {
        
        // Hozirgi ko'rinish holatini tekshiramiz
        const isVisible = secretMessageBox.style.display === 'block';

        if (isVisible) {
            // Agar ko'rinib turgan bo'lsa, yashiramiz
            secretMessageBox.style.display = 'none';
        } else {
            // Agar yashirin bo'lsa, ko'rsatamiz
            secretMessageBox.style.display = 'block';
            
            // Va eng so'nggi kelgan xabarni joylashtiramiz
            messageContent.textContent = lastReceivedMessage; 
        }
        
        // Bosish siklini yakunlab, hisoblagichni nolga qaytaramiz
        clickCounter = 0;
        clickCountElement.textContent = `Bosishlar soni: ${clickCounter}`;
    }
});