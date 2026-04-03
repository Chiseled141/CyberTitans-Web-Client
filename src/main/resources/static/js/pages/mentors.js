let _mentorCache = null;

async function buildMentorList(skillFilter) {
    const container = document.getElementById('mentor-list-container');
    if (!container) return;

    const _initials  = name => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const _avatarBg  = name => ['#1a3a2a','#1e3a5f','#3d1a42','#3d2b00','#1a2e3a','#2d1a1a'][(name||'').charCodeAt(0) % 6];
    const _avatar    = m => m.avatar
        ? `<img src="${m.avatar}" class="w-12 h-12 object-cover border border-white/10 grayscale hover:grayscale-0 transition-all flex-shrink-0" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
           <div class="w-12 h-12 flex items-center justify-center font-headline font-bold text-sm text-primary border border-primary/30 flex-shrink-0" style="display:none;background:${_avatarBg(m.name)}">${_initials(m.name)}</div>`
        : `<div class="w-12 h-12 flex items-center justify-center font-headline font-bold text-sm text-primary border border-primary/30 flex-shrink-0" style="background:${_avatarBg(m.name)}">${_initials(m.name)}</div>`;

    try {
        if (!_mentorCache) {
            const [membersRes, rankRes] = await Promise.all([
                fetch(`${API_BASE_URL}/team/members`),
                fetch(`${API_BASE_URL}/ranking`).catch(() => null)
            ]);
            if (!membersRes.ok) throw new Error();
            const members = await membersRes.json();
            const ranking = (rankRes && rankRes.ok) ? await rankRes.json() : [];
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

        container.innerHTML = members.map((m, i) => {
            const skills   = (m.experiences || []).slice(0, 4).map(e =>
                `<span class="tag-secondary pf-skill-tag">${e.name || ''}</span>`
            ).join('');
            const repColor = i === 0 ? 'text-[#fbbf24]' : i === 1 ? 'text-[#e5e7eb]' : i === 2 ? 'text-[#f97316]' : 'text-primary';
            const repLabel = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
            return `
                <div class="hack-card p-6 card-lift flex flex-col">
                    <div class="scanner"></div>
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            ${_avatar(m)}
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
    } catch {
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
