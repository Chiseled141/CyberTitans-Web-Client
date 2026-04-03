// ─── ARTICLES ────────────────────────────────────────────────────────────────

const ARTICLES = {
    'ws-leaderboard': {
        title: 'Building a Real-time Leaderboard with Spring Boot WebSocket & Vanilla JS',
        author: 'Vũ Sơn Thái', date: '26.MAR.2026', category: 'WEB_DEV', categoryColor: '#60a5fa',
        content: `<p>Real-time features used to require polling — hammering your server every few seconds hoping something changed. WebSockets flip this model: a persistent, bidirectional channel where the server pushes updates the moment they happen.</p>
<h3>1. Setting Up STOMP over WebSocket in Spring Boot</h3>
<p>Add the <code class="text-primary">spring-boot-starter-websocket</code> dependency and enable STOMP messaging:</p>
<pre>@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }
}</pre>
<h3>2. Broadcasting Score Updates</h3>
<p>Any time a score changes, broadcast the full leaderboard to all subscribers on <code class="text-primary">/topic/leaderboard</code>:</p>
<pre>@Service
public class LeaderboardService {
    @Autowired private SimpMessagingTemplate broker;

    public void pushUpdate(List&lt;RankEntry&gt; rankings) {
        broker.convertAndSend("/topic/leaderboard", rankings);
    }
}</pre>
<h3>3. Vanilla JS Client — No Framework Required</h3>
<p>SockJS + the STOMP.js CDN client is all you need. Subscribe and re-render the DOM on every message:</p>
<pre>const socket = new SockJS('/ws');
const stomp  = Stomp.over(socket);

stomp.connect({}, () => {
  stomp.subscribe('/topic/leaderboard', msg => {
    const data = JSON.parse(msg.body);
    renderLeaderboard(data);
  });
});</pre>
<p>The <code class="text-primary">renderLeaderboard</code> function just maps the array to table rows — pure DOM manipulation, zero dependencies. Total client-side payload: ~12 KB gzipped.</p>
<h3>Key Takeaways</h3>
<ul>
  <li>STOMP over SockJS gives you graceful fallback to long-polling for clients that block WebSockets.</li>
  <li>Broadcast full snapshots, not deltas — simpler client logic and idempotent updates.</li>
  <li>For high-frequency updates, debounce the broadcast (e.g. max once per 200ms).</li>
</ul>`
    },
    'segment-tree': {
        title: 'Segment Trees & Lazy Propagation: Cracking ICPC Asia Regional Problems',
        author: 'Triệu Quang Thiện', date: '20.MAR.2026', category: 'ALGORITHMS', categoryColor: '#facc15',
        content: `<p>Range-update, range-query problems are ICPC staples. A naive approach is O(n) per query; a segment tree with lazy propagation brings this down to O(log n) — the difference between AC and TLE on a 10⁵-node array.</p>
<h3>The Core Idea of Lazy Propagation</h3>
<p>Instead of propagating every update down to the leaves immediately, we store a <em>pending</em> update at each node and push it down only when we need to visit the children.</p>
<pre>void pushDown(int node) {
    if (lazy[node] != 0) {
        for (int child : {2*node, 2*node+1}) {
            tree[child] += lazy[node] * segLen[child];
            lazy[child] += lazy[node];
        }
        lazy[node] = 0;
    }
}

void update(int node, int l, int r, int ql, int qr, long val) {
    if (qr &lt; l || r &lt; ql) return;
    if (ql &lt;= l && r &lt;= qr) {
        tree[node] += val * (r - l + 1);
        lazy[node] += val;
        return;
    }
    pushDown(node);
    int mid = (l + r) / 2;
    update(2*node, l, mid, ql, qr, val);
    update(2*node+1, mid+1, r, ql, qr, val);
    tree[node] = tree[2*node] + tree[2*node+1];
}</pre>
<h3>Complexity Summary</h3>
<ul>
  <li>Build: O(n)</li>
  <li>Range update: O(log n)</li>
  <li>Range query: O(log n)</li>
  <li>Persistent variant memory: O(n + q·log n)</li>
</ul>`
    },
    'v8-exploit': {
        title: 'Pwn2Own 2026: Exploiting the V8 JavaScript Engine',
        author: 'Nguyễn Thái Sơn', date: '15.MAR.2026', category: 'CTF_WRITEUP', categoryColor: '#c084fc',
        content: `<p>This write-up documents a Type Confusion vulnerability in V8's optimizing compiler (TurboFan) demonstrated at Pwn2Own 2026, leading to full renderer RCE in Chrome 123.</p>
<pre>// Trigger JIT with consistent type feedback
function trigger(arr) {
    return arr[0] + arr[1];
}
for (let i = 0; i &lt; 10000; i++) trigger([1.1, 2.2]);
trigger(confusedObj); // causes OOB read/write primitive</pre>
<p class="article-warning">⚠ This write-up is for educational purposes. The vulnerability was reported to Google and patched in Chrome 124.0.6367.60.</p>`
    },
    'llama-vn': {
        title: 'Fine-tuning LLaMA 3.1 for Vietnamese Sentiment Analysis',
        author: 'Vương Trần Lâm Bình', date: '10.MAR.2026', category: 'AI_ML', categoryColor: '#f472b6',
        content: `<p>We fine-tuned LLaMA 3.1-8B using LoRA adapters on a custom Vietnamese dataset and benchmarked against GPT-4o.</p>
<pre>config = LoraConfig(
    r=16, lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05, bias="none",
    task_type="CAUSAL_LM"
)</pre>
<p>Fine-tuning a smaller model on domain-specific Vietnamese data outperformed GPT-4o zero-shot by 4.3 percentage points.</p>`
    },
    'docker-cicd': {
        title: 'Containerizing Spring Boot with Docker & GitHub Actions CI/CD',
        author: 'Nguyễn Thu Ngọc', date: '05.MAR.2026', category: 'WEB_DEV', categoryColor: '#60a5fa',
        content: `<p>From a bare Spring Boot JAR to a fully automated Docker Hub push on every merge to main.</p>
<pre>FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</pre>`
    },
    'sqli-rce': {
        title: 'SQL Injection to RCE: Cracking the HackTheBox "Fortress" Machine',
        author: 'Nguyễn Văn Lợi', date: '02.MAR.2026', category: 'CTF_WRITEUP', categoryColor: '#c084fc',
        content: `<p>Fortress chains a blind SQLi in the login form with an unrestricted file upload to land a reverse shell.</p>
<pre>username=admin' AND SLEEP(5)-- -&password=x
# Response time jumped from ~80ms to ~5080ms ✓</pre>
<p class="article-warning">⚠ All techniques demonstrated against an isolated HTB lab environment for educational purposes only.</p>`
    }
};

function openArticle(key) {
    const a = ARTICLES[key];
    if (!a) return;

    const set = (id, val, prop = 'textContent') => {
        const el = document.getElementById(id);
        if (el) el[prop] = val;
    };

    set('article-title',   a.title);
    set('article-date',    a.date);
    set('article-author',  a.author);
    set('article-content', a.content, 'innerHTML');

    const badge = document.getElementById('article-category-badge');
    if (badge) {
        badge.textContent        = a.category;
        badge.style.color        = a.categoryColor;
        badge.style.borderColor  = a.categoryColor + '44';
        badge.style.background   = a.categoryColor + '11';
    }

    const av = document.getElementById('article-author-avatar');
    if (av) {
        av.textContent  = (a.author || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        av.style.background = ['#1a3a2a','#1e3a5f','#3d1a42','#3d2b00'][(a.author||'').charCodeAt(0) % 4];
    }

    openModal('article-modal');
    const panel = document.getElementById('article-modal-panel');
    if (panel) panel.scrollTop = 0;
}

// ─── TEAM ────────────────────────────────────────────────────────────────────

async function buildTeam() {
    const container = document.getElementById('team-grid-container');
    if (!container) return;

    const _initials  = name => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const _avatarBg  = name => ['#1a3a2a','#1e3a5f','#3d1a42','#3d2b00','#1a2e3a','#2d1a1a'][(name||'').charCodeAt(0) % 6];
    const _avatar    = (m, cls) => m.avatar
        ? `<img src="${m.avatar}" class="${cls}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
           <div class="${cls} hidden items-center justify-center font-headline font-bold text-2xl text-primary border border-primary/30" style="display:none;background:${_avatarBg(m.name)}">${_initials(m.name)}</div>`
        : `<div class="${cls} flex items-center justify-center font-headline font-bold text-2xl text-primary border border-primary/30" style="background:${_avatarBg(m.name)}">${_initials(m.name)}</div>`;

    try {
        const response  = await fetch(`${API_BASE_URL}/team/members`);
        const teamData  = await response.json();
        container.innerHTML = teamData.map(m => `
            <div class="hack-card p-6 border transition-all duration-300">
                <div class="scanner"></div>
                ${_avatar(m, 'w-full aspect-square object-cover mb-4 grayscale hover:grayscale-0 transition-all')}
                <div class="space-y-1">
                    <h4 class="text-white font-bold text-lg font-headline">${m.name}</h4>
                    <p class="text-primary font-mono text-xs uppercase tracking-widest">${m.role}</p>
                </div>
                <div class="mt-4 border-t border-white/10 pt-4 text-center">
                    <button onclick="openProfileModal(${m.id})" class="text-primary font-mono text-[10px] uppercase border border-primary/20 px-4 py-1 hover:bg-primary hover:text-black transition-all">VIEW PROFILE</button>
                </div>
            </div>`).join('');
    } catch (err) {
        console.error('Team error:', err);
    }
}

// ─── PUBLICATIONS FILTER ──────────────────────────────────────────────────────

function filterPublications(category, btn) {
    document.querySelectorAll('#pub-filter-bar button').forEach(b => {
        b.classList.remove('text-primary', 'border-primary');
        b.classList.add('text-gray-500', 'border-transparent');
    });
    btn.classList.remove('text-gray-500', 'border-transparent');
    btn.classList.add('text-primary', 'border-primary');

    document.querySelectorAll('#publications-grid [data-category]').forEach(card => {
        card.style.display = (category === 'ALL' || card.dataset.category === category) ? '' : 'none';
    });
}
