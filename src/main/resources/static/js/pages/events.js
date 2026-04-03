const EVENTS = [
    {
        id: 'evt-001', type: 'HACKATHON', typeColor: '#D4AF37',
        title: 'IU Spring Hackathon 2026',
        date: '12.APR.2026', time: '08:00 — 20:00',
        location: 'Hall A, IU Campus',
        description: 'A 12-hour team hackathon open to all IU students. Build a working prototype around the theme "Secure By Design". Prizes include internship opportunities and Cyber Coins.',
        capacity: 50
    },
    {
        id: 'evt-002', type: 'WORKSHOP', typeColor: '#60a5fa',
        title: 'Web Exploitation Basics',
        date: '02.APR.2026', time: '14:00 — 17:00',
        location: 'Room B208, IU Campus',
        description: 'Hands-on session covering SQL injection, XSS, CSRF, and SSRF. Bring your laptop. Attendance earns 50 Cyber Coins and is recorded in your verified portfolio.',
        capacity: 30
    },
    {
        id: 'evt-003', type: 'CTF', typeColor: '#c084fc',
        title: 'VN-CTF 2026 — National Competition',
        date: '20.APR.2026', time: '09:00 — 21:00',
        location: 'Online',
        description: 'National Capture The Flag competition. Categories: Web, Pwn, Crypto, Forensics, Reversing. Top 3 teams earn double Cyber Coins and verified achievement badges.',
        capacity: 0
    },
    {
        id: 'evt-004', type: 'WORKSHOP', typeColor: '#60a5fa',
        title: 'Spring Boot Masterclass',
        date: '08.APR.2026', time: '09:00 — 12:00',
        location: 'Room C101, IU Campus',
        description: 'Deep dive into Spring Boot 3.x: building REST APIs, Spring Security, and JPA. Prerequisites: basic Java knowledge. Limited seats — register early.',
        capacity: 25
    },
    {
        id: 'evt-005', type: 'SEMINAR', typeColor: '#8eff71',
        title: 'Cybersecurity Career Paths in 2026',
        date: '15.APR.2026', time: '15:00 — 17:00',
        location: 'Auditorium, IU Campus',
        description: 'Industry professionals share insights on penetration testing, security engineering, threat intelligence, and GRC. Open Q&A session included.',
        capacity: 100
    }
];

function _getJoinedEvents() {
    try { return JSON.parse(localStorage.getItem('joined_events') || '[]'); } catch { return []; }
}

function joinEvent(eventId) {
    const savedUser = sessionStorage.getItem('cyber_user') || localStorage.getItem('cyber_user');
    if (!savedUser) { showToast('Please log in to join events.', 'error'); openModal('login-modal'); return; }
    const joined = _getJoinedEvents();
    if (joined.includes(eventId)) { showToast('Already registered for this event.', 'error'); return; }
    joined.push(eventId);
    localStorage.setItem('joined_events', JSON.stringify(joined));
    showToast('Successfully joined! See you there.', 'success');
    _renderEvents();
}

function leaveEvent(eventId) {
    const joined = _getJoinedEvents().filter(id => id !== eventId);
    localStorage.setItem('joined_events', JSON.stringify(joined));
    showToast('Event registration cancelled.', 'success');
    _renderEvents();
}

function _renderEvents(filterType) {
    const container = document.getElementById('events-grid');
    if (!container) return;
    const joined = _getJoinedEvents();
    const items  = (filterType && filterType !== 'ALL') ? EVENTS.filter(e => e.type === filterType) : EVENTS;
    if (!items.length) {
        container.innerHTML = `<div class="col-span-3 text-center py-20 font-mono text-gray-500 text-xs uppercase tracking-widest">[ No events found ]</div>`;
        return;
    }
    container.innerHTML = items.map(e => {
        const isJoined      = joined.includes(e.id);
        const capacityText  = e.capacity === 0 ? 'Unlimited' : e.capacity;
        return `
            <div class="group bg-[#0a0a0a] border ${isJoined ? 'border-primary/30' : 'border-white/10'} p-6 relative overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col">
                <div class="absolute top-0 left-[-100%] w-full h-[2px] group-hover:left-0 transition-all duration-500" style="background:${e.typeColor}"></div>
                <div class="flex justify-between items-center mb-4">
                    <span class="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                          style="color:${e.typeColor};border-color:${e.typeColor}44;background:${e.typeColor}11">${e.type}</span>
                    ${isJoined ? '<span class="font-mono text-[9px] text-primary uppercase tracking-widest animate-pulse">● JOINED</span>' : ''}
                </div>
                <h3 class="text-white text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors font-headline">${e.title}</h3>
                <p class="text-gray-400 text-sm mb-5 leading-relaxed flex-1 font-mono">${e.description}</p>
                <div class="border-t border-white/5 pt-4 space-y-2 mb-5">
                    <div class="flex items-center gap-2 font-mono text-xs text-gray-500">
                        <span class="material-symbols-outlined text-[14px]" style="color:${e.typeColor}">calendar_month</span>
                        ${e.date} · ${e.time}
                    </div>
                    <div class="flex items-center gap-2 font-mono text-xs text-gray-500">
                        <span class="material-symbols-outlined text-[14px]" style="color:${e.typeColor}">location_on</span>
                        ${e.location}
                    </div>
                    <div class="flex items-center gap-2 font-mono text-xs text-gray-500">
                        <span class="material-symbols-outlined text-[14px]" style="color:${e.typeColor}">group</span>
                        Capacity: ${capacityText}
                    </div>
                </div>
                ${isJoined
                    ? `<button onclick="leaveEvent('${e.id}')" class="w-full py-3 bg-red-600/20 border border-red-500/50 text-red-400 font-mono text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">CANCEL REGISTRATION</button>`
                    : `<button onclick="joinEvent('${e.id}')" class="w-full py-3 border font-mono text-[10px] uppercase tracking-widest transition-all hover:text-black" style="border-color:${e.typeColor};color:${e.typeColor}" onmouseover="this.style.background='${e.typeColor}'" onmouseout="this.style.background=''">JOIN EVENT</button>`
                }
            </div>`;
    }).join('');
}

function filterEvents(type, btn) {
    document.querySelectorAll('#events-filter-bar button').forEach(b => {
        b.classList.remove('text-primary', 'border-primary');
        b.classList.add('text-gray-500', 'border-transparent');
    });
    btn.classList.remove('text-gray-500', 'border-transparent');
    btn.classList.add('text-primary', 'border-primary');
    _renderEvents(type);
}

function buildEvents() {
    _renderEvents();
}
