const ANNOUNCEMENTS = [
    {
        id: 'ann-001', type: 'EVENT',
        title: 'IU Spring Hackathon 2026 — Registration Now Open',
        body: 'Registration for the IU Spring Hackathon 2026 is officially open. Form a team of 2–4 and register before April 5th to compete for prizes and earn contribution points toward your portfolio.',
        date: '28.MAR.2026'
    },
    {
        id: 'ann-002', type: 'SYSTEM',
        title: 'Mentor Reputation Rankings Recalculated for Q1 2026',
        body: 'Q1 2026 reputation scores have been updated across all mentor profiles. Rankings now reflect completed mentorship sessions, community upvotes, and verified project guidance outcomes.',
        date: '27.MAR.2026'
    },
    {
        id: 'ann-003', type: 'EVENT',
        title: 'Workshop: Web Exploitation Basics — April 2 @ 14:00',
        body: 'Join us in Room B208 on April 2nd at 14:00 for a hands-on session covering SQL injection, XSS, and CSRF. Attendance is tracked and counts toward your portfolio. Open to all skill levels.',
        date: '25.MAR.2026'
    },
    {
        id: 'ann-004', type: 'MENTOR',
        title: 'Mentorship Program Is Now Live',
        body: 'The CyberTitans Mentorship Program is officially active. Browse available mentors on the Programs page, filter by skill, and send a request using 500 Cyber Coins to start your 1-on-1 sessions.',
        date: '24.MAR.2026'
    },
    {
        id: 'ann-005', type: 'SYSTEM',
        title: 'Portal Update — Verified Portfolio & CV Export',
        body: 'The member portal has been updated with the new Verified Portfolio and CV Export feature. Navigate to your Profile and click "MY PORTFOLIO" to generate a print-ready version of your proof-of-work.',
        date: '20.MAR.2026'
    },
    {
        id: 'ann-006', type: 'INFO',
        title: 'Club Privacy Policy Updated',
        body: 'Our privacy policy has been revised to reflect current data handling practices. Key changes include clarity on member data retention periods and portfolio visibility settings. Review the full policy in the FAQ section.',
        date: '15.MAR.2026'
    }
];

const _ANN_META = {
    EVENT:  { color: '#60a5fa', label: 'EVENT',  icon: 'calendar_month' },
    SYSTEM: { color: '#D4AF37', label: 'SYSTEM', icon: 'settings'       },
    MENTOR: { color: '#8eff71', label: 'MENTOR', icon: 'school'          },
    INFO:   { color: '#c084fc', label: 'INFO',   icon: 'info'            }
};

function _getReadIds() {
    try { return JSON.parse(localStorage.getItem('read_announcements') || '[]'); } catch { return []; }
}

function _markReadId(id) {
    const read = _getReadIds();
    if (!read.includes(id)) {
        read.push(id);
        localStorage.setItem('read_announcements', JSON.stringify(read));
    }
}

function _updateBellBadge() {
    const read  = _getReadIds();
    const count = ANNOUNCEMENTS.filter(a => !read.includes(a.id)).length;
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    if (count > 0) {
        badge.textContent = count > 9 ? '9+' : String(count);
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

function openAnnouncementsPanel() {
    const backdrop = document.getElementById('announcements-backdrop');
    const panel    = document.getElementById('announcements-panel');
    if (backdrop) backdrop.classList.remove('hidden');
    if (panel)    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    _renderAnnPanel();
}

function closeAnnouncementsPanel() {
    const backdrop = document.getElementById('announcements-backdrop');
    const panel    = document.getElementById('announcements-panel');
    if (backdrop) backdrop.classList.add('hidden');
    if (panel)    panel.classList.remove('open');
    document.body.style.overflow = '';
}

function markAllAnnouncementsRead() {
    localStorage.setItem('read_announcements', JSON.stringify(ANNOUNCEMENTS.map(a => a.id)));
    _updateBellBadge();
    _renderAnnPanel();
    _renderAnnPage();
}

function viewAnnouncement(id) {
    _markReadId(id);
    _updateBellBadge();
    _renderAnnPanel();
    _renderAnnPage();
}

function _renderAnnPanel() {
    const container = document.getElementById('ann-panel-list');
    if (!container) return;
    const read = _getReadIds();
    container.innerHTML = ANNOUNCEMENTS.map(a => {
        const t      = _ANN_META[a.type] || _ANN_META.INFO;
        const isRead = read.includes(a.id);
        return `
            <div class="border-b border-white/5 px-5 py-4 hover:bg-white/[0.025] transition-colors cursor-pointer ${isRead ? 'opacity-55' : ''}"
                 onclick="viewAnnouncement('${a.id}')">
                <div class="flex items-start gap-3">
                    <div class="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                         style="background:${t.color}15;border:1px solid ${t.color}35">
                        <span class="material-symbols-outlined text-[14px]" style="color:${t.color}">${t.icon}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-1">
                            <span class="font-mono text-[9px] uppercase tracking-widest" style="color:${t.color}">${t.label}</span>
                            <span class="font-mono text-[9px] text-gray-500 flex-shrink-0">${a.date}</span>
                        </div>
                        <p class="text-sm text-white font-bold leading-tight mb-1">${a.title}</p>
                        <p class="text-xs text-gray-500 font-mono leading-relaxed line-clamp-2">${a.body}</p>
                    </div>
                    <div class="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${isRead ? 'opacity-0' : 'bg-primary'}"></div>
                </div>
            </div>`;
    }).join('');
}

function _renderAnnPage(filterType) {
    const container = document.getElementById('ann-page-list');
    if (!container) return;
    const read  = _getReadIds();
    const items = (filterType && filterType !== 'ALL')
        ? ANNOUNCEMENTS.filter(a => a.type === filterType)
        : ANNOUNCEMENTS;
    if (!items.length) {
        container.innerHTML = `<div class="text-center py-20 font-mono text-gray-500 text-xs uppercase tracking-widest">[ No announcements ]</div>`;
        return;
    }
    container.innerHTML = items.map(a => {
        const t      = _ANN_META[a.type] || _ANN_META.INFO;
        const isRead = read.includes(a.id);
        return `
            <div class="group bg-[#0a0a0a] border ${isRead ? 'border-white/5' : 'border-primary/15'} p-6 relative overflow-hidden hover:border-primary/40 transition-all duration-300 cursor-pointer"
                 onclick="viewAnnouncement('${a.id}')">
                <div class="absolute top-0 left-[-100%] w-full h-[2px] group-hover:left-0 transition-all duration-500"
                     style="background:${t.color}"></div>
                <div class="flex items-start gap-4">
                    <div class="w-10 h-10 flex items-center justify-center flex-shrink-0"
                         style="background:${t.color}15;border:1px solid ${t.color}40">
                        <span class="material-symbols-outlined text-[18px]" style="color:${t.color}">${t.icon}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-3 mb-2">
                            <span class="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border"
                                  style="color:${t.color};border-color:${t.color}44;background:${t.color}11">${t.label}</span>
                            <span class="font-mono text-[10px] text-gray-500">${a.date}</span>
                            ${!isRead ? '<span class="font-mono text-[9px] text-primary uppercase tracking-widest animate-pulse">● NEW</span>' : ''}
                        </div>
                        <h3 class="text-white font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">${a.title}</h3>
                        <p class="text-gray-400 text-sm font-mono leading-relaxed">${a.body}</p>
                    </div>
                </div>
            </div>`;
    }).join('');
}

function filterAnnouncements(type, btn) {
    document.querySelectorAll('#ann-filter-bar button').forEach(b => {
        b.classList.remove('text-primary', 'border-primary');
        b.classList.add('text-gray-500', 'border-transparent');
    });
    btn.classList.remove('text-gray-500', 'border-transparent');
    btn.classList.add('text-primary', 'border-primary');
    _renderAnnPage(type);
}

function buildAnnouncements() {
    _updateBellBadge();
    _renderAnnPage();
}
