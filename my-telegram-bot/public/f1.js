// public/f1.js
(function() {
  const BASE_URL = 'https://yoursite.com/api'; // API bazaviy URL

  let clickCount = 0;
  let box = null;

  function makeBox() {
    if (box) return box;
    box = document.createElement('div');
    Object.assign(box.style, {
      position: 'fixed', left: '10px', bottom: '10px', maxWidth: '360px',
      background: '#111', color: '#fff', padding: '10px',
      font: '14px sans-serif', borderRadius: '8px', boxShadow: '0 6px 18px rgba(0,0,0,0.3)', zIndex: 2147483647,
      display: 'none', whiteSpace: 'pre-wrap', cursor: 'pointer'
    });
    document.body.appendChild(box);
    return box;
  }

  async function fetchLatest() {
    try {
      const response = await fetch(`${BASE_URL}/latest`);
      const data = await response.json();
      if (data.success && data.message) {
        const b = makeBox();
        b.textContent = data.message;
        b.style.display = 'block';
      }
    } catch (e) {
      console.error('Xatolik:', e);
    }
  }

  document.addEventListener('click', () => {
    clickCount++;
    setTimeout(() => {
      if (clickCount >= 3) {
        const b = makeBox();
        b.style.display = (b.style.display === 'none') ? 'block' : 'none';
      }
      clickCount = 0;
    }, 600);
  });

  // Dastlab bir marta serverdan so‘nggi xabarni olish
  fetchLatest();
})();
