let clickCount = 0;
const CLICK_THRESHOLD = 3;
const botMessageDiv = document.getElementById('bot-message');
const messageContentP = botMessageDiv.querySelector('p');

// **********************************************
// 1. FRONT-END TOKEN (Back-end bilan mos bo'lishi kerak) - YANGILANGAN
// **********************************************
const FRONT_END_TOKEN = "8311436800:AAEjLwVJZjZ5_hpPr6CQHovx6abEOThRA-I"; 

/**
 * Serverdan bot xabarini olish va DOMga joylash funksiyasi
 */
async function fetchBotMessage() {
    try {
        // So'rovni token bilan yuborish
        const response = await fetch('/api/bot-message', {
            method: 'GET',
            headers: {
                // Tokenni so'rov sarlavhasiga qo'shamiz
                'X-Bot-Token': FRONT_END_TOKEN 
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Agar server xato (403) qaytarsa
            throw new Error(data.error || `Server xatosi: ${response.status}`);
        }
        
        // Olingan ma'lumotni bot diviga joylash (Muvaffaqiyatli token)
        messageContentP.innerHTML = `
            <span style="font-weight: bold;">${data.source}:</span>
            <br>
            ${data.message}
        `;
        console.log("Bot xabari token bilan muvaffaqiyatli yuklandi.");

    } catch (error) {
        console.error("Bot xabarini olishda xatolik yuz berdi:", error);
        // Xatoni ko'rsatish
        messageContentP.innerHTML = `<span style="color: red; font-weight: bold;">XATO:</span> ${error.message}`;
    }
}

/**
 * Sahifadagi bosishlarni boshqaruvchi asosiy funksiya.
 */
function handleDocumentClick() {
    clickCount++;
    console.log(`Hozirgi bosish soni: ${clickCount}`);

    if (clickCount % CLICK_THRESHOLD === 0) {
        if (botMessageDiv.classList.contains('hidden')) {
            // Xabarni ko'rsatishdan oldin, uni serverdan olish
            fetchBotMessage(); 
            botMessageDiv.classList.remove('hidden');
            console.log("-> Bot xabari KO'RINDI (Dinamik).");
        } else {
            // Xabarni yashirish
            botMessageDiv.classList.add('hidden');
            console.log("-> Bot xabari YASHIRINDI.");
        }
    }
}

document.addEventListener('click', handleDocumentClick);
messageContentP.textContent = "Yuklanmoqda...";