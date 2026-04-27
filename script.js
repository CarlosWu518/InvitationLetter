/* ===== 配置区（直接修改即可） ===== */
const CONFIG = {
    // 订婚日期（年, 月-1, 日, 时, 分）
    weddingDate: new Date(2026, 4, 11, 18, 18),
    // 地址（用于复制）
    fullAddress: '请填写完整地址 · 大酒店 · X 楼 X 厅'
};

/* ===== 1. 花瓣飘落 ===== */
function createPetals(count = 14) {
    const layer = document.getElementById('petals');
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        const size = 8 + Math.random() * 12;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 8 + Math.random() * 8;
        const drift = (Math.random() - 0.5) * 200;
        p.style.left = left + 'vw';
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = delay + 's';
        p.style.setProperty('--drift', drift + 'px');
        p.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);
        layer.appendChild(p);
    }
}
createPetals();

/* ===== 2. 信封点击开启 ===== */
const cover = document.getElementById('cover');
const envelope = document.querySelector('.envelope');
const invitation = document.getElementById('invitation');

let opened = false;
function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');
    setTimeout(() => {
        cover.classList.add('opened');
        invitation.classList.add('show');
        document.body.style.overflow = 'auto';
    }, 1400);
}
document.body.style.overflow = 'hidden';
envelope.addEventListener('click', openEnvelope);
cover.addEventListener('click', openEnvelope);

/* ===== 3. 滚动淡入 ===== */
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach((el) => io.observe(el));

/* ===== 4. 倒计时 ===== */
function pad(n) { return String(n).padStart(2, '0'); }
function tickCountdown() {
    const now = new Date();
    const diff = CONFIG.weddingDate - now;
    if (diff <= 0) {
        ['cdDay','cdHour','cdMin','cdSec'].forEach(id =>
            document.getElementById(id).textContent = '00');
        return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdDay').textContent = pad(d);
    document.getElementById('cdHour').textContent = pad(h);
    document.getElementById('cdMin').textContent = pad(m);
    document.getElementById('cdSec').textContent = pad(s);
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* 同步日历日期显示 */
document.getElementById('dateDay').textContent = pad(CONFIG.weddingDate.getDate());

/* ===== 5. 复制地址 ===== */
const toast = document.getElementById('toast');
function showToast(text, duration = 1800) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

document.getElementById('copyAddrBtn').addEventListener('click', () => {
    const text = CONFIG.fullAddress;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('地址已复制 · 期待您的莅临'))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
});

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        showToast('地址已复制 · 期待您的莅临');
    } catch (e) {
        showToast('复制失败，请手动复制');
    }
    document.body.removeChild(ta);
}

/* ===== 6. 点击页面冒爱心 ===== */
let lastBurst = 0;
document.addEventListener('click', (e) => {
    if (!opened) return;
    if (e.target.closest('button, input, textarea, .envelope, .place-btn')) return;
    const now = Date.now();
    if (now - lastBurst < 600) return;
    lastBurst = now;
    spawnSingleHeart(e.clientX, e.clientY);
});

function spawnSingleHeart(x, y) {
    const h = document.createElement('div');
    h.textContent = '♥';
    h.style.cssText = `
        position: fixed; left: ${x}px; top: ${y}px;
        color: #c9354c; font-size: 22px; pointer-events: none; z-index: 999;
        transition: transform 1.2s cubic-bezier(0.2,0.8,0.2,1), opacity 1.2s ease;
        text-shadow: 0 2px 6px rgba(201,53,76,0.4);
    `;
    document.body.appendChild(h);
    requestAnimationFrame(() => {
        h.style.transform = `translate(${(Math.random()-0.5)*40}px, -100px) scale(${1+Math.random()*0.6})`;
        h.style.opacity = '0';
    });
    setTimeout(() => h.remove(), 1300);
}
