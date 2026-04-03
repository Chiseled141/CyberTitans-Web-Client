const FAQ_ITEMS = [
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
        a: 'Mentors are ranked by reputation score — a StackOverflow-inspired metric calculated from successful mentorship sessions, community upvotes, and project guidance outcomes. When you request a mentor, the system matches you based on skill compatibility. The mentor with the highest reputation score among compatible mentors is recommended first.'
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
        a: 'Browse active projects on the Projects page and click "View Project" to see open roles. Contact the project lead directly, or use the Project Incubator page to pitch your own idea. All project contributions are tracked and added to your portfolio automatically.'
    },
    {
        category: 'PROJECTS',
        q: 'How is project contribution tracked?',
        a: 'The system records tasks completed, collaboration roles, and participation levels for each member per project. These metrics are displayed in the Project panel and are used to calculate your reputation score and populate your verified portfolio.'
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

function buildFaqAndPolicies() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    const categories = [...new Set(FAQ_ITEMS.map(i => i.category))];
    container.innerHTML = categories.map(cat => {
        const catItems  = FAQ_ITEMS.filter(i => i.category === cat);
        const idxOffset = FAQ_ITEMS.indexOf(catItems[0]);
        return `
            <div class="mb-8">
                <div class="flex items-center gap-2 mb-4">
                    <div class="w-2 h-2 bg-secondary"></div>
                    <span class="font-mono text-[10px] uppercase tracking-[0.2em] text-secondary">${cat}</span>
                </div>
                <div class="space-y-2">
                    ${catItems.map((item, i) => {
                        const idx = idxOffset + i;
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
    const ans  = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    ans.classList.toggle('hidden');
    icon.textContent = ans.classList.contains('hidden') ? '+' : '-';
}
