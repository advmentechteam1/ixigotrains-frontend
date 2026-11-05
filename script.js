const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- shared header / footer ---------- */
const page = ('/' + location.pathname.split('/').pop().replace(/.html$/, '').replace(/^index$/, '')).toLowerCase();
const links = [
  ['/', 'Home'], ['/pnr', 'PNR Status'], ['/schedule', 'Train Schedule'],
  ['/live', 'Live Status'], ['/offers', 'Offers'], ['/support', 'Support']
];
$('#site-header').outerHTML = `
<header class="navbar" id="navbar">
  <a href="/" class="logo"><svg class="logo-mark" aria-hidden="true" viewBox="0 0 48 48"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a7fe0"/><stop offset="1" stop-color="#0b3fa8"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg)"/><path d="M24 6c-6.8 0-12.2 5.3-12.2 11.9 0 8.4 12.2 20.6 12.2 20.6s12.2-12.2 12.2-20.6C36.2 11.3 30.8 6 24 6z" fill="#fff"/><circle cx="24" cy="17.8" r="5.2" fill="#0b3fa8"/><path d="M7 42.5c6-3.6 11-3.6 17-1.2s11 2.4 17-1.3" fill="none" stroke="#f47b20" stroke-width="3.2" stroke-linecap="round"/></svg><span class="logo-text">Ixigo<b>Trains</b><em>.in</em></span></a>
  <nav id="nav">${links.map(([h, t]) => `<a href="${h}" class="${page === h ? 'active' : ''}">${t}</a>`).join('')}</nav>
  <a href="/support" class="login"><i class="fa-regular fa-user"></i> Login / Sign Up</a>
  <button class="menu-btn" id="menuBtn" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
</header>`;
$('#site-footer').outerHTML = `
<footer>
  <div class="container">
    <div class="f-grid">
      <div class="f-brand">
        <a href="/" class="logo light"><svg class="logo-mark" aria-hidden="true" viewBox="0 0 48 48"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a7fe0"/><stop offset="1" stop-color="#0b3fa8"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg)"/><path d="M24 6c-6.8 0-12.2 5.3-12.2 11.9 0 8.4 12.2 20.6 12.2 20.6s12.2-12.2 12.2-20.6C36.2 11.3 30.8 6 24 6z" fill="#fff"/><circle cx="24" cy="17.8" r="5.2" fill="#0b3fa8"/><path d="M7 42.5c6-3.6 11-3.6 17-1.2s11 2.4 17-1.3" fill="none" stroke="#f47b20" stroke-width="3.2" stroke-linecap="round"/></svg><span class="logo-text">Ixigo<b>Trains</b><em>.in</em></span></a>
        <p>Your trusted partner for train, bus and flight ticket booking, PNR status, live updates and more.</p>
      </div>
      <div class="f-col"><h5>Quick Links</h5><a href="/">Home</a><a href="/pnr">PNR Status</a><a href="/schedule">Train Schedule</a><a href="/live">Live Train Status</a></div>
      <div class="f-col"><h5>Our Services</h5><a href="/train">Book Train Tickets</a><a href="/bus">Book Bus Tickets</a><a href="/flight">Book Flight Tickets</a><a href="/schedule">Train Between Stations</a><a href="/offers">Travel Offers</a></div>
      <div class="f-col"><h5>Support</h5><a href="/support">Help Center</a><a href="/support#contact">Contact Support</a><a href="/support#faq">FAQs</a><a href="/support">Terms &amp; Conditions</a></div>
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
    location.href = `/schedule?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&date=${$('#date').value}&cls=${encodeURIComponent($('#cls').value)}`;
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

/* ---------- hero image sliders ---------- */
$$('.hero-slides').forEach(box => {
  const sl = $$('.slide', box);
  if (sl.length < 2) return;
  const dots = $$('#slideDots button'), words = ['Train', 'Bus', 'Flight'], hw = $('#heroWord');
  let cur = 0, timer;
  const show = i => {
    cur = i;
    sl.forEach((s, k) => s.classList.toggle('active', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i % 3));
    if (hw) hw.textContent = words[i % 3];
  };
  const start = () => { clearInterval(timer); timer = setInterval(() => show((cur + 1) % sl.length), 4500); };
  dots.forEach((d, i) => d.addEventListener('click', () => { show(i); start(); }));
  start();
});

/* ---------- mode tabs (train / bus / flight) ---------- */
const modeTabs = $('#modeTabs');
if (modeTabs) {
  const tabs = $$('.tab', modeTabs);
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.toggle('active', x === t));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + t.dataset.tab));
  }));
}
$$('.swap[data-a]').forEach(b => b.addEventListener('click', () => {
  const x = $('#' + b.dataset.a), y = $('#' + b.dataset.b); [x.value, y.value] = [y.value, x.value];
}));
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Goa', 'Chandigarh', 'Agra', 'Varanasi', 'Indore', 'Kochi'];
const cdl = document.createElement('datalist');
cdl.id = 'cities';
cdl.innerHTML = CITIES.map(c => `<option value="${c}">`).join('');
document.body.appendChild(cdl);
$$('input[name=trip]').forEach(r => r.addEventListener('change', () => {
  const round = $('input[name=trip]:checked').value === 'round', ret = $('#flRet');
  ret.disabled = !round; $('#retField').classList.toggle('disabled', !round);
  if (round && !ret.value) ret.value = $('#flDate').value;
}));
if ($('#retField')) $('#retField').classList.add('disabled');
function goSearch(page, a, b, extra) {
  const f = $('#' + a).value.trim(), t = $('#' + b).value.trim();
  if (!f || !t) return toast('Please enter origin and destination.');
  if (f.toLowerCase() === t.toLowerCase()) return toast('Origin and destination cannot be the same.');
  location.href = `${page}?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}` + extra;
}
if ($('#busForm') && !$('#busResults')) $('#busForm').addEventListener('submit', e => {
  e.preventDefault();
  goSearch('/bus', 'busFrom', 'busTo', `&date=${$('#busDate').value}&type=${encodeURIComponent($('#busType').value)}`);
});
if ($('#flightForm') && !$('#flightResults')) $('#flightForm').addEventListener('submit', e => {
  e.preventDefault();
  goSearch('/flight', 'flFrom', 'flTo', `&date=${$('#flDate').value}&ret=${$('#flRet').disabled ? '' : $('#flRet').value}&pax=${encodeURIComponent($('#flClass').value)}`);
});

/* ---------- bus & flight result pages (demo data) ---------- */
const BUSES = [
  ['Orange Travels', 'Volvo Multi-Axle AC Sleeper', '21:30', '06:00', '8h 30m', 1450, 4.4, 14],
  ['National Express', 'AC Semi Sleeper 2+2', '22:15', '05:45', '7h 30m', 980, 4.1, 22],
  ['Blue Line Tours', 'Non-AC Seater 2+2', '20:00', '05:30', '9h 30m', 620, 3.9, 31],
  ['Royal Cruiser', 'Scania AC Sleeper', '23:00', '06:30', '7h 30m', 1690, 4.6, 9],
  ['State Transport', 'Deluxe Seater', '19:45', '05:15', '9h 30m', 540, 3.8, 40]
];
const FLIGHTS = [
  ['IndiGo', '6E-2174', '06:10', '08:25', '2h 15m', 'Non-stop', 4850],
  ['Air India', 'AI-865', '09:30', '11:50', '2h 20m', 'Non-stop', 5620],
  ['Akasa Air', 'QP-1307', '13:05', '15:20', '2h 15m', 'Non-stop', 4390],
  ['Air India Express', 'IX-1198', '17:40', '20:05', '2h 25m', 'Non-stop', 6280],
  ['SpiceJet', 'SG-8152', '21:15', '00:45', '3h 30m', '1 stop', 3990]
];
function loadResultPage(kind) {
  const q = new URLSearchParams(location.search);
  const ids = kind === 'bus' ? ['busFrom', 'busTo', 'busDate'] : ['flFrom', 'flTo', 'flDate'];
  const box = $(kind === 'bus' ? '#busResults' : '#flightResults'), form = $(kind === 'bus' ? '#busForm' : '#flightForm');
  const render = () => {
    const f = $('#' + ids[0]).value.trim(), t = $('#' + ids[1]).value.trim(), d = $('#' + ids[2]).value;
    if (!f || !t) return toast('Please enter origin and destination.');
    if (f.toLowerCase() === t.toLowerCase()) return toast('Origin and destination cannot be the same.');
    const esc = x => x.replace(/</g, '&lt;');
    const head = `<span class="demo-note"><i class="fa-solid fa-circle-info"></i> Demo results — sample ${kind === 'bus' ? 'buses' : 'flights'} only</span>
      <h3 style="color:var(--navy);margin-bottom:6px">${esc(f)} <i class="fa-solid fa-arrow-right" style="color:var(--orange)"></i> ${esc(t)} · ${d}</h3>`;
    const rows = kind === 'bus'
      ? BUSES.map((b, i) => `<div class="res-card" style="animation-delay:${i * .08}s"><div><b>${b[0]}</b><small>${b[1]}</small></div>
          <div class="times"><div><b>${b[2]}</b><small>${esc(f)}</small></div><i class="fa-solid fa-bus"></i><div><b>${b[3]}</b><small>${esc(t)}</small></div><small>${b[4]}</small></div>
          <div><b>₹${b[5]}</b><small><i class="fa-solid fa-star" style="color:#f5a800"></i> ${b[6]} · ${b[7]} seats left</small></div>
          <button class="btn" style="padding:9px 18px;font-size:13px" onclick="toast('Seat selection opens soon (demo)')">Select Seat</button></div>`).join('')
      : FLIGHTS.map((b, i) => `<div class="res-card" style="animation-delay:${i * .08}s"><div><b>${b[0]}</b><small>${b[1]}</small></div>
          <div class="times"><div><b>${b[2]}</b><small>${esc(f)}</small></div><i class="fa-solid fa-plane"></i><div><b>${b[3]}</b><small>${esc(t)}</small></div><small>${b[4]} · ${b[5]}</small></div>
          <div><b>₹${b[6].toLocaleString('en-IN')}</b><small>per adult</small></div>
          <button class="btn" style="padding:9px 18px;font-size:13px" onclick="toast('Booking opens soon (demo)')">Book</button></div>`).join('');
    box.innerHTML = `<div class="panel">${head}${rows}</div>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  if (q.get('from')) {
    $('#' + ids[0]).value = q.get('from'); $('#' + ids[1]).value = q.get('to') || '';
    if (q.get('date')) $('#' + ids[2]).value = q.get('date');
    if (kind === 'bus' && q.get('type')) $('#busType').value = q.get('type');
    if (kind === 'flight' && q.get('pax')) $('#flClass').value = q.get('pax');
    render();
  }
  form.addEventListener('submit', e => { e.preventDefault(); render(); });
  $$('.chip-link[data-from],.route[data-from]').forEach(c => c.addEventListener('click', () => {
    $('#' + ids[0]).value = c.dataset.from; $('#' + ids[1]).value = c.dataset.to; render();
  }));
}
if ($('#busResults')) loadResultPage('bus');
if ($('#flightResults')) loadResultPage('flight');

/* ---------- bus & flight status / live demo forms ---------- */
const esc2 = x => String(x).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
const demo = '<span class="demo-note"><i class="fa-solid fa-circle-info"></i> Demo result — not real data</span>';
function bind(id, fn) { const f = $('#' + id); if (f) f.addEventListener('submit', e => { e.preventDefault(); fn(); }); }
bind('busStatusForm', () => {
  const t = $('#busTkt').value.trim().toUpperCase(), m = $('#busMob').value.trim();
  if (!/^[A-Z]{1,3}\d{4,8}$/.test(t)) return toast('Enter a valid ticket number, e.g. BT123456.');
  if (!/^\d{10}$/.test(m)) return toast('Enter a valid 10 digit mobile number.');
  const ok = +t.slice(-1) % 2 === 0;
  $('#busStatusRes').innerHTML = `<div class="panel">${demo}<h4 style="color:var(--navy)">Ticket ${esc2(t)}</h4>
    <p><span class="pill ${ok ? 'ok' : 'wl'}">${ok ? 'CONFIRMED' : 'RESCHEDULED'}</span></p>
    <p>Delhi → Jaipur · Volvo AC Seater</p><p>Seat <b>${12 + +t.slice(-1)}A</b> · Boarding: Kashmere Gate, ${ok ? '06:30' : '07:00'}</p></div>`;
});
bind('flightStatusForm', () => {
  const p = $('#flPnr').value.trim().toUpperCase(), n = $('#flName').value.trim();
  if (!/^[A-Z0-9]{6}$/.test(p)) return toast('Enter a valid 6 character booking reference.');
  if (!n) return toast('Enter the passenger last name.');
  const ok = p.charCodeAt(5) % 2 === 0;
  $('#flightStatusRes').innerHTML = `<div class="panel">${demo}<h4 style="color:var(--navy)">Booking ${esc2(p)}</h4>
    <p><span class="pill ${ok ? 'ok' : 'wl'}">${ok ? 'TICKETED' : 'ON HOLD'}</span></p>
    <p>Delhi → Mumbai · ${esc2(n)}</p><p>Departure <b>09:30</b> · Web check-in opens 48 hours before</p></div>`;
});
bind('busLiveForm', () => {
  const t = $('#busLiveTkt').value.trim();
  if (!t) return toast('Enter ticket number or bus number.');
  const pct = 40 + (t.length * 7) % 45;
  $('#busLiveRes').innerHTML = `<div class="panel">${demo}<h4 style="color:var(--navy)">${esc2(t.toUpperCase())}</h4>
    <p>Last crossed: <b>Kotputli</b> · Next: <b>Shahpura</b></p><p>Running <b>on time</b> · ETA 11:50 at Jaipur</p>
    <div style="height:8px;border-radius:6px;background:#e8eef9;overflow:hidden;margin-top:8px"><div id="busBar" style="height:100%;width:0;background:linear-gradient(90deg,#2eaa4f,#ffb066);transition:width 1.2s"></div></div></div>`;
  setTimeout(() => { const b = $('#busBar'); if (b) b.style.width = pct + '%'; }, 100);
});
bind('flightLiveForm', () => {
  const f = $('#flLiveNo').value.trim();
  if (!f) return toast('Enter a flight number.');
  const late = f.length % 2;
  $('#flightLiveRes').innerHTML = `<div class="panel">${demo}<h4 style="color:var(--navy)">${esc2(f.toUpperCase())}</h4>
    <p><span class="pill ${late ? 'wl' : 'ok'}">${late ? 'DELAYED 25 MIN' : 'ON TIME'}</span></p>
    <p>Delhi (T3) → Mumbai (T2)</p><p>Departs <b>${late ? '09:55' : '09:30'}</b> · Gate <b>B${12 + f.length}</b> · Arrives <b>${late ? '12:15' : '11:50'}</b></p></div>`;
});

/* ---------- label table cells so tables can stack on phones ---------- */
function labelTables(root = document) {
  $$('table.tbl', root).forEach(t => {
    const heads = $$('thead th', t).map(h => h.textContent.trim());
    $$('tbody tr', t).forEach(tr => $$('td', tr).forEach((td, i) => { if (!td.hasAttribute('data-label')) td.setAttribute('data-label', heads[i] || ''); }));
  });
}
labelTables();
new MutationObserver(() => labelTables()).observe(document.body, { childList: true, subtree: true });
