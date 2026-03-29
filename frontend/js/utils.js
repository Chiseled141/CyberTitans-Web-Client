async function includeHTML() {
    const elements = [...document.querySelectorAll('[include-html]')];
    await Promise.all(elements.map(async (el) => {
        const file = el.getAttribute('include-html');
        try {
            const response = await fetch(file + '?v=' + new Date().getTime());
            if (response.ok) el.outerHTML = await response.text();
        } catch (err) { console.error("[SYSTEM] Lỗi nạp HTML:", err); }
    }));
    initializeApp();
}

function showPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page-' + name);
    if (el) el.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(a => a.classList.toggle('nav-active', a.dataset.page === name));
    if (name === 'my-profile') loadOperativeData();
    if (name === 'portfolio')  loadPortfolioData();
    window.scrollTo(0, 0);
}

function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    const text = document.getElementById('toast-text');
    if (!t || !text) return;
    t.className = `glass-panel border border-primary/20 px-6 py-4 flex items-center gap-4 show ${type}`;
    text.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; } }
function closeModal(id) { const m = document.getElementById(id); if (m) { m.classList.remove('open'); document.body.style.overflow = ''; } }
function handleBackdropClick(event, modalId) { closeModal(modalId); }

function animateCoinValue(elementId, start, end, duration) {
    const obj = document.getElementById(elementId);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        obj.textContent = currentVal.toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.textContent = end.toLocaleString();
    };
    window.requestAnimationFrame(step);
}