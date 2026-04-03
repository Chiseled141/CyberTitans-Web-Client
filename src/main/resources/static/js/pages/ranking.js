async function buildRanking() {
    const podiumContainer = document.getElementById('podium-container');
    const listContainer   = document.getElementById('ranking-list-container');
    if (!podiumContainer || !listContainer) return;

    try {
        const response    = await fetch(`${API_BASE_URL}/ranking`);
        const rankingData = await response.json();

        const layout = [
            { idx: 1, color: '#e5e7eb', shadow: 'rgba(229,231,235,0.4)', pad: 'pt-16 pb-4' },
            { idx: 0, color: '#fbbf24', shadow: 'rgba(251,191,36,0.5)',  pad: 'pt-20 pb-6' },
            { idx: 2, color: '#f97316', shadow: 'rgba(249,115,22,0.4)',  pad: 'pt-14 pb-4' }
        ];

        podiumContainer.innerHTML = layout.map(pos => {
            const u = rankingData[pos.idx];
            if (!u) return '';
            const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            return `
                <div class="flex flex-col items-center w-[30%] relative">
                    <div class="relative z-10 mb-[-40px]">
                        <div class="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 flex items-center justify-center font-bold text-2xl text-white bg-[#1a1a1a] shadow-[0_0_20px_${pos.shadow}]" style="border-color:${pos.color}">${initials}</div>
                    </div>
                    <div class="w-full bg-[#0a0a0a] border-t-2 flex flex-col items-center px-2 ${pos.pad}" style="border-color:${pos.color}">
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
    } catch (err) {
        console.error('Ranking error:', err);
    }
}
