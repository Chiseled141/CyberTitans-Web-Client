const STATIC_PROJECTS = [
    {
        id: 1, name: 'CyberTitans Web Platform', status: 'ACTIVE',
        description: 'Full-stack club management system built with Spring Boot and Vanilla JS. Features member profiles, mentor matching, dynamic CV generation, and a Cyber Coin economy.',
        techStack: ['Spring Boot', 'Java', 'MySQL', 'Tailwind CSS', 'Vanilla JS'],
        members: [
            { memberName: 'Vũ Sơn Thái',     role: 'Lead Dev'  },
            { memberName: 'Nguyễn Minh Khoa', role: 'Backend'   },
            { memberName: 'Trần Thị Lan',     role: 'Frontend'  }
        ],
        totalTasks: 24, completedTasks: 18
    },
    {
        id: 2, name: 'CTF Automated Scorer', status: 'ACTIVE',
        description: 'Real-time Capture The Flag scoring engine with dynamic flag verification, team leaderboards via WebSocket, and Docker-based challenge sandboxing.',
        techStack: ['Python', 'FastAPI', 'Docker', 'Redis', 'WebSocket'],
        members: [
            { memberName: 'Lê Hoàng Nam',  role: 'Architect' },
            { memberName: 'Phạm Quốc Huy', role: 'DevOps'    }
        ],
        totalTasks: 16, completedTasks: 10
    },
    {
        id: 3, name: 'Network Intrusion Detector', status: 'IN_PROGRESS',
        description: 'ML-based IDS that classifies network traffic using a Random Forest model trained on the NSL-KDD dataset. Achieves 97.4% accuracy on test set.',
        techStack: ['Python', 'Scikit-learn', 'Pandas', 'Wireshark', 'Flask'],
        members: [
            { memberName: 'Đỗ Thanh Tùng', role: 'ML Engineer'  },
            { memberName: 'Bùi Thị Mai',   role: 'Data Analyst' },
            { memberName: 'Nguyễn Văn An', role: 'Backend'       }
        ],
        totalTasks: 20, completedTasks: 13
    },
    {
        id: 4, name: 'SecureVault Password Manager', status: 'COMPLETED',
        description: 'End-to-end encrypted password manager with AES-256 vault storage, TOTP-based 2FA, and a browser extension for auto-fill. Open-sourced on the club GitHub.',
        techStack: ['React', 'Node.js', 'AES-256', 'TOTP', 'MongoDB'],
        members: [
            { memberName: 'Hoàng Thị Thu', role: 'Full Stack' },
            { memberName: 'Trần Minh Đức', role: 'Security'   }
        ],
        totalTasks: 18, completedTasks: 18
    }
];

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
            <button onclick="openProjectModal(${p.id})" class="w-full text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-2 hover:bg-primary hover:text-black transition-all">
                View Project
            </button>
        </div>`;
}

function _animateProgressBars(container) {
    requestAnimationFrame(() => {
        container.querySelectorAll('.skill-bar-fill[data-w]').forEach(el => {
            el.style.width = el.dataset.w + '%';
        });
    });
}

async function buildProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('fetch failed');
        const projects = await response.json();
        const data = projects.length ? projects : STATIC_PROJECTS;
        container.innerHTML = data.map(p => _buildProjectCard(p)).join('');
        _animateProgressBars(container);
    } catch {
        container.innerHTML = STATIC_PROJECTS.map(p => _buildProjectCard(p)).join('');
        _animateProgressBars(container);
    }
}

async function openProjectModal(id) {
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
                <span class="font-mono text-[10px] uppercase tracking-widest text-primary">Member Contributions</span>
            </div>
            <div class="space-y-3">${rows || '<p class="font-mono text-xs text-gray-500 text-center py-4">No contribution data yet.</p>'}</div>`;
        _animateProgressBars(body);
    } catch {
        body.innerHTML = `<p class="font-mono text-xs text-red-400 text-center py-10">[ Failed to load project data ]</p>`;
    }
}
