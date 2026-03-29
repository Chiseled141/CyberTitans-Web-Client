async function buildTeam() {
    const container = document.getElementById('team-grid-container');
    if (!container) return;
    try {
        const response = await fetch(`${API_BASE_URL}/team/members`);
        const teamData = await response.json();
        const defaultAvt = "https://ui-avatars.com/api/?background=random&color=fff&name=";
        container.innerHTML = teamData.map(m => `
            <div class="hack-card p-6 border transition-all duration-300">
                <div class="scanner"></div>
                <img src="${m.avatar || (defaultAvt + m.name)}" class="w-full aspect-square object-cover mb-4 grayscale hover:grayscale-0 transition-all"/>
                <div class="space-y-1">
                    <h4 class="text-white font-bold text-lg font-headline">${m.name}</h4>
                    <p class="text-primary font-mono text-xs uppercase tracking-widest">${m.role}</p>
                </div>
                <div class="mt-4 border-t border-white/10 pt-4 text-center">
                    <button onclick="openProfileModal(${m.id})" class="text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-1 hover:bg-primary hover:text-black transition-all">VIEW PROFILE</button>
                </div>
            </div>`).join('');
    } catch (err) { console.error("Team error:", err); }
}

async function buildRanking() {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer = document.getElementById('ranking-list-container');
    if (!podiumContainer || !listContainer) return;
    try {
        const response = await fetch(`${API_BASE_URL}/ranking`);
        const rankingData = await response.json();
        const layout = [
            { idx: 1, color: '#e5e7eb', shadow: 'rgba(229,231,235,0.4)', pad: 'pt-16 pb-4' }, 
            { idx: 0, color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)', pad: 'pt-20 pb-6' },  
            { idx: 2, color: '#f97316', shadow: 'rgba(249,115,22,0.4)', pad: 'pt-14 pb-4' }   
        ];
        podiumContainer.innerHTML = layout.map(pos => {
            const u = rankingData[pos.idx];
            if (!u) return '';
            const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return `
                <div class="flex flex-col items-center w-[30%] relative">
                    <div class="relative z-10 mb-[-40px]">
                        <div class="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 flex items-center justify-center font-bold text-2xl text-white bg-[#1a1a1a] shadow-[0_0_20px_${pos.shadow}]" style="border-color: ${pos.color}">${initials}</div>
                    </div>
                    <div class="w-full bg-[#0a0a0a] border-t-2 flex flex-col items-center px-2 ${pos.pad}" style="border-color: ${pos.color}">
                        <h3 class="text-white text-xs font-bold truncate w-full text-center">${u.name}</h3>
                        <p class="text-mono font-bold text-white mt-2">${u.point.toLocaleString()}</p>
                    </div>
                </div>`;
        }).join('');
        listContainer.innerHTML = rankingData.slice(3).map((u, i) => `
            <div class="flex items-center justify-between p-4 bg-[#111] border-l-2 border-white/5 hover:border-primary mb-2 group transition-all">
                <div class="flex items-center gap-4">
                    <span class="font-mono text-gray-500 w-8 text-center">${(i + 4).toString().padStart(2, '0')}</span>
                    <h4 class="text-white font-bold group-hover:text-primary">${u.name}</h4>
                </div>
                <div class="font-mono text-white">${u.point.toLocaleString()} <span class="text-gray-500 text-xs">PTS</span></div>
            </div>`).join('');
    } catch (err) { console.error("Ranking error:", err); }
}

async function buildProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('fetch failed');
        const projects = await response.json();
        if (!projects.length) {
            container.innerHTML = `<div class="col-span-2 text-center py-20 font-mono text-gray-500 text-sm uppercase tracking-widest">[ No deployments found ]</div>`;
            return;
        }
        container.innerHTML = projects.map(p => _buildProjectCard(p)).join('');
        requestAnimationFrame(() => {
            container.querySelectorAll('.skill-bar-fill[data-w]').forEach(el => {
                el.style.width = el.dataset.w + '%';
            });
        });
    } catch (err) {
        console.error("Projects error:", err);
        container.innerHTML = `<div class="col-span-2 text-center py-20 font-mono text-gray-500 text-sm uppercase tracking-widest">[ Failed to load deployments ]</div>`;
    }
}

function _buildProjectCard(p) {
    const st = _projectStatusTag(p.status);
    const progress = p.totalTasks ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;
    const techTags = (p.techStack || []).map(t =>
        `<span class="tag-secondary pf-skill-tag">${t}</span>`
    ).join('');
    const memberRows = (p.members || []).slice(0, 3).map(m => `
        <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-[#1a1a1a] border border-white/10 flex items-center justify-center font-mono text-[9px] text-primary">${m.memberName.charAt(0).toUpperCase()}</div>
            <span class="font-mono text-[10px] text-gray-400 flex-1 truncate">${m.memberName}</span>
            <span class="tag-tertiary pf-skill-tag">${m.role}</span>
        </div>`).join('');
    return `
        <div class="hack-card p-6 card-lift">
            <div class="scanner"></div>
            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">/PROJECT</p>
                    <h3 class="font-headline text-xl font-bold text-white">${p.name}</h3>
                </div>
                <span class="${st.cls} pf-skill-tag">${st.label}</span>
            </div>
            <p class="font-mono text-xs text-gray-500 mb-4 leading-relaxed">${p.description || '—'}</p>
            <div class="flex flex-wrap gap-2 mb-4">${techTags}</div>
            ${memberRows ? `<div class="border-t border-white/5 pt-4 mb-4 space-y-2">${memberRows}</div>` : ''}
            <div class="mb-5">
                <div class="flex justify-between font-mono text-[10px] mb-1 text-gray-500">
                    <span>TASKS</span><span>${p.completedTasks || 0} / ${p.totalTasks || 0}</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-bar-fill verified" style="width:0%" data-w="${progress}"></div>
                </div>
            </div>
            <button onclick="openProjectAnalytics(${p.id})" class="w-full text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-2 hover:bg-primary hover:text-black transition-all">
                View Analytics
            </button>
        </div>`;
}

function _projectStatusTag(status) {
    switch ((status || '').toUpperCase()) {
        case 'ACTIVE':
        case 'IN_PROGRESS': return { cls: 'tag-primary',   label: status };
        case 'COMPLETED':   return { cls: 'tag-gold',      label: 'COMPLETED' };
        case 'ON_HOLD':
        case 'PAUSED':      return { cls: 'tag-tertiary',  label: status };
        default:            return { cls: 'tag-secondary', label: status || 'UNKNOWN' };
    }
}

async function openProjectAnalytics(id) {
    openModal('project-analytics-modal');
    const body = document.getElementById('project-analytics-body');
    body.innerHTML = `<p class="font-mono text-xs text-gray-500 animate-pulse text-center py-10 uppercase tracking-widest">Loading data...</p>`;
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`);
        if (!response.ok) throw new Error('not found');
        const p = await response.json();
        const st = _projectStatusTag(p.status);
        const techTags = (p.techStack || []).map(t =>
            `<span class="tag-secondary pf-skill-tag">${t}</span>`
        ).join('');
        const rows = (p.contributions || []).map(c => {
            const pct = c.totalTasks ? Math.round((c.tasksCompleted / c.totalTasks) * 100) : 0;
            return `
                <div class="bg-[#111] border border-white/5 p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-[#1a1a1a] border border-white/10 flex items-center justify-center font-headline font-bold text-primary text-sm">${c.memberName.charAt(0).toUpperCase()}</div>
                            <div>
                                <p class="text-white font-bold text-sm">${c.memberName}</p>
                                <p class="font-mono text-[10px] text-gray-500 uppercase">${c.role}</p>
                            </div>
                        </div>
                        <span class="font-mono text-xs text-primary">${c.tasksCompleted} / ${c.totalTasks} tasks</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-bar-fill verified" style="width:0%" data-w="${pct}"></div>
                    </div>
                </div>`;
        }).join('');
        body.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <h3 class="font-headline text-2xl font-bold text-white">${p.name}</h3>
                <span class="${st.cls} pf-skill-tag ml-4 shrink-0">${st.label}</span>
            </div>
            <p class="font-mono text-xs text-gray-500 mb-4 leading-relaxed">${p.description || ''}</p>
            <div class="flex flex-wrap gap-2 mb-6">${techTags}</div>
            <div class="flex items-center gap-2 mb-3">
                <div class="w-3 h-3 bg-primary"></div>
                <span class="font-mono text-[10px] uppercase tracking-widest text-primary">Contribution Analytics</span>
            </div>
            <div class="space-y-3">${rows || '<p class="font-mono text-xs text-gray-500 text-center py-4">No contribution data yet.</p>'}</div>`;
        requestAnimationFrame(() => {
            body.querySelectorAll('.skill-bar-fill[data-w]').forEach(el => {
                el.style.width = el.dataset.w + '%';
            });
        });
    } catch (err) {
        body.innerHTML = `<p class="font-mono text-xs text-red-400 text-center py-10">[ Failed to load project data ]</p>`;
    }
}

function buildPublications() {}

let _mentorCache = null;

async function buildMentorList(skillFilter) {
    const container = document.getElementById('mentor-list-container');
    if (!container) return;

    try {
        if (!_mentorCache) {
            const [membersRes, rankRes] = await Promise.all([
                fetch(`${API_BASE_URL}/team/members`),
                fetch(`${API_BASE_URL}/ranking`).catch(() => null)
            ]);
            if (!membersRes.ok) throw new Error();
            const members = await membersRes.json();
            const ranking = (rankRes && rankRes.ok) ? await rankRes.json() : [];

            // Merge reputation score from ranking, then sort highest first
            _mentorCache = members.map(m => {
                const rankEntry = ranking.find(r => r.name === m.name);
                return { ...m, reputationScore: rankEntry ? (rankEntry.point || 0) : 0 };
            }).sort((a, b) => b.reputationScore - a.reputationScore);
        }

        const members = (skillFilter && skillFilter !== 'ALL')
            ? _mentorCache.filter(m =>
                (m.experiences || []).some(e =>
                    (e.name || '').toLowerCase().includes(skillFilter.toLowerCase())
                )
              )
            : _mentorCache;

        if (!members.length) {
            container.innerHTML = `<div class="col-span-3 text-center py-10 font-mono text-gray-500 text-xs uppercase tracking-widest">No mentors found for "${skillFilter}"</div>`;
            return;
        }

        const defaultAvt = "https://ui-avatars.com/api/?background=random&color=fff&name=";
        container.innerHTML = members.map((m, i) => {
            const skills = (m.experiences || []).slice(0, 4).map(e =>
                `<span class="tag-secondary pf-skill-tag">${e.name || ''}</span>`
            ).join('');
            const repColor = i === 0 ? 'text-[#fbbf24]' : i === 1 ? 'text-[#e5e7eb]' : i === 2 ? 'text-[#f97316]' : 'text-primary';
            const repLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
            return `
                <div class="hack-card p-6 card-lift flex flex-col">
                    <div class="scanner"></div>
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <img src="${m.avatar || (defaultAvt + encodeURIComponent(m.name))}" class="w-12 h-12 object-cover border border-white/10 grayscale hover:grayscale-0 transition-all flex-shrink-0"/>
                            <div>
                                <h4 class="font-headline font-bold text-white">${m.name}</h4>
                                <p class="font-mono text-[10px] text-primary uppercase tracking-widest">${m.role}</p>
                            </div>
                        </div>
                        <div class="text-right flex-shrink-0 ml-2">
                            <p class="font-mono text-[10px] text-gray-500 uppercase">REP</p>
                            <p class="font-headline font-bold ${repColor}">${m.reputationScore.toLocaleString()}</p>
                            <p class="font-mono text-[10px] text-gray-500">${repLabel}</p>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5 mb-4 flex-1">${skills || '<span class="tag-secondary pf-skill-tag">General</span>'}</div>
                    <button onclick="openProfileModal(${m.id})" class="w-full text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-2 hover:bg-primary hover:text-black transition-all mt-auto">
                        View Profile &amp; Request
                    </button>
                </div>`;
        }).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-3 text-center py-10 font-mono text-gray-500 text-xs uppercase tracking-widest">[ Failed to load mentors ]</div>`;
    }
}

function filterMentorSkill(skill, btn) {
    document.querySelectorAll('#mentor-filter-bar button').forEach(b => {
        b.className = 'tag-secondary pf-skill-tag';
    });
    btn.className = 'tag-gold pf-skill-tag';
    buildMentorList(skill);
}

function filterPublications(category, btn) {
    document.querySelectorAll('#pub-filter-bar button').forEach(b => {
        b.classList.remove('text-primary', 'border-primary');
        b.classList.add('text-gray-500', 'border-transparent');
    });
    btn.classList.remove('text-gray-500', 'border-transparent');
    btn.classList.add('text-primary', 'border-primary');

    document.querySelectorAll('#publications-grid [data-category]').forEach(card => {
        const show = category === 'ALL' || card.dataset.category === category;
        card.style.display = show ? '' : 'none';
    });
}

function buildFaqAndPolicies() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    const items = [
        {
            category: 'MEMBERSHIP',
            q: 'Who can join CyberTitans?',
            a: 'Any student at International University (IU) can join. Simply create an account, complete your profile, and you are automatically enrolled as a Recruit. No technical prerequisites are required — all skill levels are welcome.'
        },
        {
            category: 'MEMBERSHIP',
            q: 'What is the difference between Recruit, Operative, and Master tiers?',
            a: 'Recruit (free) gives basic access to public content and the community. Operative (1,000 Coins) unlocks private repositories, CTF labs, and mentorship sessions. Master (5,000 Coins) grants full access including unlimited 1-on-1 mentorship and gold advisory access. Tier upgrades are paid with Cyber Coins earned through contributions.'
        },
        {
            category: 'CYBER COINS',
            q: 'How do I earn Cyber Coins?',
            a: 'Coins are awarded for verified contributions: completing project tasks, attending workshops, winning CTF competitions, submitting publications, and receiving positive mentor reviews. The exact amount depends on the activity type and is recorded automatically by the system.'
        },
        {
            category: 'CYBER COINS',
            q: 'What can I spend Cyber Coins on?',
            a: 'Coins can be used to request a 1-on-1 mentorship session (500 Coins per session) or to unlock higher membership tiers (Operative: 1,000 / Master: 5,000). Coins cannot be transferred between members.'
        },
        {
            category: 'MENTOR MATCHING',
            q: 'How does the Mentor Matching system work?',
            a: 'Mentors are ranked by reputation score — a StackOverflow-inspired metric calculated from successful mentorship sessions, community upvotes, and project guidance outcomes. When you request a mentor, the system matches you based on skill compatibility (e.g., a Java learner is paired with a Java expert). The mentor with the highest reputation score among compatible mentors is recommended first.'
        },
        {
            category: 'MENTOR MATCHING',
            q: 'How do I become a mentor?',
            a: 'Members with the MENTOR role can offer mentorship sessions. Mentor status is assigned by admins based on demonstrated technical expertise, contribution history, and reputation score. Contact the club admin if you believe you qualify.'
        },
        {
            category: 'PORTFOLIO & CV',
            q: 'What is the Verified Portfolio / Proof of Work?',
            a: 'Your portfolio is auto-generated from real system data — projects you contributed to, workshops you attended, and skills validated by the club. Unlike self-reported CVs, every item is backed by recorded evidence, making your portfolio a trustworthy "Proof of Work" that recruiters can verify.'
        },
        {
            category: 'PORTFOLIO & CV',
            q: 'How do I export my CV?',
            a: 'Navigate to your Profile page and click "MY PORTFOLIO", then click "GENERATE CV.EXE". A print-ready version of your verified portfolio will open in a new tab. Use your browser\'s "Print to PDF" function (Ctrl+P / Cmd+P) to save it as a PDF file.'
        },
        {
            category: 'PROJECTS',
            q: 'How do I join a club project?',
            a: 'Browse active projects on the Projects page and click "View Analytics" to see open roles. Contact the project lead directly, or use the Project Incubator page to pitch your own idea. All project contributions are tracked and added to your portfolio automatically.'
        },
        {
            category: 'PROJECTS',
            q: 'How is project contribution tracked?',
            a: 'The system records tasks completed, collaboration roles, and participation levels for each member per project. These metrics are displayed in the Project Contribution Analytics panel and are used to calculate your reputation score and populate your verified portfolio.'
        },
        {
            category: 'PRIVACY & DATA',
            q: 'Who can see my profile information?',
            a: 'Your name, role, and public skills are visible to all club members. Your email and phone number are only visible to you and admins. Your portfolio page is visible to all logged-in members. Admins can access full member data for club management purposes.'
        },
        {
            category: 'PRIVACY & DATA',
            q: 'How do I delete my account?',
            a: 'Account deletion must be requested through a club admin. Your contribution history and project records are retained for club records but your personal information (email, phone) will be removed. Contact an admin via the Team page.'
        }
    ];

    // Group by category
    const categories = [...new Set(items.map(i => i.category))];
    container.innerHTML = categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        const idx_offset = items.indexOf(catItems[0]);
        return `
            <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-2 h-2 bg-secondary"></div>
                    <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">${cat}</span>
                </div>
                <div class="space-y-2">
                    ${catItems.map((item, i) => {
                        const idx = idx_offset + i;
                        return `
                        <div class="border border-white/5 bg-[#0a0a0a] hover:border-secondary/20 transition-all">
                            <button onclick="toggleFaq(${idx})" class="w-full flex items-center justify-between px-6 py-4 text-left group">
                                <span class="font-bold text-sm text-white group-hover:text-secondary transition-colors pr-4">${item.q}</span>
                                <span id="faq-icon-${idx}" class="text-secondary font-mono text-xl flex-shrink-0">+</span>
                            </button>
                            <div id="faq-answer-${idx}" class="hidden px-6 pb-4">
                                <p class="text-on-surface-variant text-sm leading-relaxed font-mono">${item.a}</p>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
    }).join('');
}

function toggleFaq(index) {
    const ans = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    ans.classList.toggle('hidden');
    icon.textContent = ans.classList.contains('hidden') ? '+' : '-';
}