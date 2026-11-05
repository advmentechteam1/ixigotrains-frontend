const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- shared header / footer ---------- */
const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const links = [
  ['index.html', 'Home'], ['pnr.html', 'PNR Status'], ['schedule.html', 'Train Schedule'],
  ['live.html', 'Live Status'], ['offers.html', 'Offers'], ['support.html', 'Support']
];
$('#site-header').outerHTML = `
<header class="navbar" id="navbar">
  <a href="index.html" class="logo"><svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a7fe0"/><stop offset="1" stop-color="#0b3fa8"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg)"/><path d="M14 31V20a10 10 0 0 1 10-10h0a10 10 0 0 1 10 10v11a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="#fff"/><rect x="18" y="16" width="12" height="8" rx="2" fill="#0b3fa8"/><circle cx="19" cy="29" r="2" fill="#f47b20"/><circle cx="29" cy="29" r="2" fill="#f47b20"/><path d="M13 40l5-4M35 40l-5-4M10 43h28" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg><span class="logo-text">Ixigo<b>Trains</b><em>.in</em></span></a>
  <nav id="nav">${links.map(([h, t]) => `<a href="${h}" class="${page === h ? 'active' : ''}">${t}</a>`).join('')}</nav>
  <a href="support.html" class="login"><i class="fa-regular fa-user"></i> Login / Sign Up</a>
  <button class="menu-btn" id="menuBtn" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
</header>`;
$('#site-footer').outerHTML = `
<footer>
  <div class="container">
    <div class="f-grid">
      <div class="f-brand">
        <a href="index.html" class="logo light"><svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a7fe0"/><stop offset="1" stop-color="#0b3fa8"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg)"/><path d="M14 31V20a10 10 0 0 1 10-10h0a10 10 0 0 1 10 10v11a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="#fff"/><rect x="18" y="16" width="12" height="8" rx="2" fill="#0b3fa8"/><circle cx="19" cy="29" r="2" fill="#f47b20"/><circle cx="29" cy="29" r="2" fill="#f47b20"/><path d="M13 40l5-4M35 40l-5-4M10 43h28" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></svg><span class="logo-text">Ixigo<b>Trains</b><em>.in</em></span></a>
        <p>Your trusted partner for train ticket booking, PNR status, live train updates and more.</p>
      </div>
      <div class="f-col"><h5>Quick Links</h5><a href="index.html">Home</a><a href="pnr.html">PNR Status</a><a href="schedule.html">Train Schedule</a><a href="live.html">Live Train Status</a></div>
      <div class="f-col"><h5>Our Services</h5><a href="index.html">Book Train Tickets</a><a href="schedule.html">Seat Availability</a><a href="schedule.html">Train Between Stations</a><a href="offers.html">Travel Offers</a></div>
      <div class="f-col"><h5>Support</h5><a href="support.html">Help Center</a><a href="support.html#contact">Contact Support</a><a href="support.html#faq">FAQs</a><a href="support.html">Terms &amp; Conditions</a></div>
      <div class="f-col"><h5>Follow Us</h5><div class="social">
        <a href="#" class="fb"><i class="fa-brands fa-facebook-f"></i></a><a href="#" class="ig"><i class="fa-brands fa-instagram"></i></a>
        <a href="#" class="yt"><i class="fa-brands fa-youtube"></i></a><a href="#" class="x"><i class="fa-brands fa-x-twitter"></i></a></div></div>
    </div>
  </div>
  <div class="copy">© ${new Date().getFullYear()} IxigoTrains.in — All rights reserved.</div>
</footer>
<button class="totop" id="totop" aria-label="Back to top"><i class="fa-solid fa-chevron-up"></i></button>
<div class="toast" id="toast"></div>`;

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 3200);
}

$('#menuBtn').addEventListener('click', () => $('#nav').classList.toggle('open'));
addEventListener('scroll', () => {
  $('#navbar').classList.toggle('scrolled', scrollY > 30);
  $('#totop').classList.toggle('show', scrollY > 500);
});
$('#totop').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- reveal on scroll + counters ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  if (e.target.dataset.count) countUp(e.target);
  io.unobserve(e.target);
}), { threshold: .15 });
$$('.reveal,[data-count]').forEach(el => io.observe(el));

function countUp(el) {
  const end = +el.dataset.count, suffix = el.dataset.suffix || '', dur = 1800, t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1), v = Math.floor(end * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString('en-IN') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ---------- button ripple ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('.btn,.search-btn');
  if (!b) return;
  const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
  const sp = document.createElement('span');
  sp.className = 'ripple';
  sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
  b.appendChild(sp);
  setTimeout(() => sp.remove(), 600);
});

/* ---------- FAQ accordion ---------- */
$$('.faq-item').forEach(item => $('.faq-q', item).addEventListener('click', () => {
  const open = item.classList.contains('open');
  $$('.faq-item').forEach(i => { i.classList.remove('open'); $('.faq-a', i).style.maxHeight = 0; });
  if (!open) { item.classList.add('open'); $('.faq-a', item).style.maxHeight = $('.faq-a', item).scrollHeight + 30 + 'px'; }
}));

/* ---------- helpers ---------- */
const STATIONS = ['New Delhi (NDLS)', 'Mumbai Central (BCT)', 'Lucknow (LKO)', 'Agra Cantt (AGC)', 'Varanasi (BSB)', 'Pune (PUNE)', 'Howrah (HWH)', 'Chennai Central (MAS)', 'Bengaluru (SBC)', 'Jaipur (JP)', 'Hyderabad (HYB)'];
const dl = document.createElement('datalist');
dl.id = 'stations';
dl.innerHTML = STATIONS.map(s => `<option value="${s}">`).join('');
document.body.appendChild(dl);
const todayISO = new Date().toISOString().split('T')[0];
$$('input[type=date]').forEach(d => { d.min = todayISO; d.value = todayISO; });

const swap = $('#swap');
if (swap) swap.addEventListener('click', () => { const f = $('#from'), t = $('#to'); [f.value, t.value] = [t.value, f.value]; });

/* ---------- home: search + tabs + route cards ---------- */
const bookForm = $('#bookForm');
if (bookForm) {
  $$('.tab[data-href]').forEach(t => t.addEventListener('click', () => location.href = t.dataset.href));
  bookForm.addEventListener('submit', e => {
    e.preventDefault();
    const f = $('#from').value.trim(), t = $('#to').value.trim();
    if (!f || !t) return toast('Please enter origin and destination stations.');
    if (f === t) return toast('Origin and destination cannot be the same.');
    location.href = `schedule.html?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&date=${$('#date').value}&cls=${encodeURIComponent($('#cls').value)}`;
  });
  $$('.route').forEach(c => c.addEventListener('click', () => {
    $('#from').value = c.dataset.from; $('#to').value = c.dataset.to;
    $('.search-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast(`${c.dataset.from} → ${c.dataset.to} selected. Press Search Trains.`);
  }));
}

/* ---------- PNR page ---------- */
const pnrForm = $('#pnrForm');
if (pnrForm) pnrForm.addEventListener('submit', e => {
  e.preventDefault();
  const p = $('#pnr').value.trim();
  if (!/^\d{10}$/.test(p)) return toast('Enter a valid 10 digit PNR number.');
  const n = +p.slice(-1), confirmed = n % 2 === 0;
  $('#pnrResult').innerHTML = `
  <div class="panel">
    <span class="demo-note"><i class="fa-solid fa-circle-info"></i> Demo result — not real railway data</span>
    <div class="pnr-head">
      <div><small>PNR</small><h3>${p}</h3></div>
      <div><small>Train</small><h3>12951 · Mumbai Rajdhani</h3></div>
      <div><span class="pill ${confirmed ? 'ok' : 'wl'}">${confirmed ? 'CONFIRMED' : 'WL ' + (n + 2) + ' / RAC'}</span></div>
    </div>
    <div class="journey">
      <div class="st"><b>16:35</b><small>New Delhi (NDLS)</small></div>
      <div class="line"><i class="fa-solid fa-train"></i></div>
      <div class="st"><b>08:35</b><small>Mumbai Central (BCT)</small></div>
    </div>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>Passenger</th><th>Booking Status</th><th>Current Status</th><th>Coach / Seat</th></tr></thead><tbody>
      <tr class="row-in"><td>Passenger 1</td><td>WL 4</td><td>${confirmed ? 'CNF' : 'WL ' + (n + 2)}</td><td>${confirmed ? 'B2 / ' + (10 + n) : '—'}</td></tr>
      <tr class="row-in" style="animation-delay:.15s"><td>Passenger 2</td><td>WL 5</td><td>${confirmed ? 'CNF' : 'WL ' + (n + 3)}</td><td>${confirmed ? 'B2 / ' + (11 + n) : '—'}</td></tr>
    </tbody></table></div>
  </div>`;
  $('#pnrResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ---------- Schedule page ---------- */
const TRAINS = [
  ['12951', 'Mumbai Rajdhani', '16:35', '08:35', '16h 00m', 'Daily', 1450],
  ['12957', 'Swarna Jayanti Rajdhani', '19:55', '12:10', '16h 15m', 'Mon, Wed, Fri', 1390],
  ['22209', 'Mumbai Duronto', '23:00', '15:50', '16h 50m', 'Tue, Thu, Sat', 1280],
  ['12903', 'Golden Temple Mail', '07:10', '04:25', '21h 15m', 'Daily', 720],
  ['12137', 'Punjab Mail', '19:40', '16:15', '20h 35m', 'Daily', 680],
  ['22435', 'Vande Bharat Express', '06:00', '13:10', '07h 10m', 'Except Fri', 1850]
];
const STOPS = [['New Delhi (NDLS)', '16:35', '—', 0], ['Mathura Jn (MTJ)', '18:00', '18:02', 141], ['Kota Jn (KOTA)', '21:35', '21:45', 465],
  ['Ratlam Jn (RTM)', '00:20', '00:25', 655], ['Vadodara Jn (BRC)', '03:55', '04:05', 993], ['Surat (ST)', '05:40', '05:45', 1147],
  ['Borivali (BVI)', '07:55', '07:57', 1366], ['Mumbai Central (BCT)', '08:35', '—', 1384]];

const trainList = $('#trainList');
if (trainList) {
  const q = new URLSearchParams(location.search);
  if (q.get('from')) {
    $('#from').value = q.get('from'); $('#to').value = q.get('to');
    if (q.get('date')) $('#date').value = q.get('date');
    if (q.get('cls')) $('#cls').value = q.get('cls');
    showTrains();
  }
  $('#betweenForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = $('#from').value.trim(), t = $('#to').value.trim();
    if (!f || !t) return toast('Please enter origin and destination stations.');
    if (f === t) return toast('Origin and destination cannot be the same.');
    showTrains();
  });
  function showTrains() {
    const f = $('#from').value, t = $('#to').value;
    trainList.innerHTML = `<div class="panel"><span class="demo-note"><i class="fa-solid fa-circle-info"></i> Demo timetable — sample trains only</span>
      <h3 style="color:var(--navy);margin-bottom:14px">${f} <i class="fa-solid fa-arrow-right" style="color:var(--orange)"></i> ${t} · ${$('#date').value}</h3>
      <div class="table-wrap"><table class="tbl"><thead><tr><th>Train</th><th>Departs</th><th>Arrives</th><th>Duration</th><th>Runs on</th><th>Fare from</th><th></th></tr></thead><tbody>
      ${TRAINS.map((x, i) => `<tr class="row-in" style="animation-delay:${i * .08}s"><td><b>${x[0]}</b> ${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td><td>${x[4]}</td><td>${x[5]}</td><td><b>₹${x[6]}</b></td><td><button class="btn" style="padding:8px 16px;font-size:13px" onclick="toast('Booking opens soon (demo)')">Book</button></td></tr>`).join('')}
      </tbody></table></div></div>`;
    trainList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  $('#trainForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#trainNo').value.trim();
    if (!v) return toast('Enter a train number or name.');
    $('#stopList').innerHTML = `<div class="panel"><span class="demo-note"><i class="fa-solid fa-circle-info"></i> Demo schedule — sample route</span>
      <h3 style="color:var(--navy);margin-bottom:14px">Schedule for “${v.replace(/</g, '&lt;')}”</h3>
      <div class="table-wrap"><table class="tbl"><thead><tr><th>#</th><th>Station</th><th>Arrives</th><th>Departs</th><th>Distance</th></tr></thead><tbody>
      ${STOPS.map((s, i) => `<tr class="row-in" style="animation-delay:${i * .07}s"><td>${i + 1}</td><td>${s[0]}</td><td>${i ? s[1] : '—'}</td><td>${s[2] === '—' && i ? '—' : (i ? s[2] : s[1])}</td><td>${s[3]} km</td></tr>`).join('')}
      </tbody></table></div></div>`;
    $('#stopList').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

/* ---------- Live status page ---------- */
const liveForm = $('#liveForm');
if (liveForm) liveForm.addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#trainNo').value.trim();
  if (!v) return toast('Enter a train number or name.');
  const now = 4;
  $('#liveResult').innerHTML = `<div class="panel">
    <span class="demo-note"><i class="fa-solid fa-circle-info"></i> Demo tracking — not real-time data</span>
    <div class="pnr-head"><div><small>Train</small><h3>${v.replace(/</g, '&lt;')}</h3></div>
      <div><small>Running status</small><h3>Running 12 min late</h3></div><div><span class="pill live"><i class="fa-solid fa-satellite-dish"></i> LIVE</span></div></div>
    <div class="progress"><div id="bar"></div></div><small style="color:var(--muted)">${Math.round(now / 7 * 100)}% journey completed</small>
    <div class="timeline">${STOPS.map((s, i) => `<div class="tl ${i < now ? 'done' : i === now ? 'now' : ''}" style="animation-delay:${i * .12}s">
      <span class="t">${s[1]}</span><b>${s[0]}</b><small>${i < now ? 'Departed' : i === now ? 'Currently here · +12 min' : 'Upcoming'} · ${s[3]} km</small></div>`).join('')}</div></div>`;
  setTimeout(() => $('#bar').style.width = Math.round(now / 7 * 100) + '%', 100);
  $('#liveResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ---------- Offers: copy coupon ---------- */
$$('.coupon button').forEach(b => b.addEventListener('click', () => {
  const code = b.previousElementSibling.textContent;
  (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).catch(() => {}).finally(() => {
    b.textContent = 'Copied ✓'; toast(`Coupon ${code} copied`);
    setTimeout(() => b.textContent = 'Copy', 2000);
  });
}));

/* ---------- Support / newsletter forms ---------- */
const cf = $('#contactForm');
if (cf) cf.addEventListener('submit', e => {
  e.preventDefault();
  toast('Thanks! Your message has been received. We will reply within 24 hours.');
  cf.reset();
});
const nf = $('#newsForm');
if (nf) nf.addEventListener('submit', e => {
  e.preventDefault();
  toast('Subscribed! Watch your inbox for offers.');
  nf.reset();
});
$$('img[data-fallback]').forEach(i => i.addEventListener('error', () => i.style.visibility = 'hidden'));
