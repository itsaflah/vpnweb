/* Interactive behaviors:
   - Power button toggles connection: starts/stops timer & animates speeds
   - Simple timer (hh:mm:ss) that increments while connected
   - FAQ accordion (accessible)
   - Reveal-on-scroll for elements with class .reveal
   - Plan choose button highlight
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const powerBtn = document.getElementById('powerBtn');
  const timerEl = document.getElementById('timer');
  const downloadEl = document.getElementById('download');
  const uploadEl = document.getElementById('upload');
  const pingEl = document.getElementById('ping');
  let connected = false;
  let intervalId = null;
  let seconds = 3506; // initial 00:58:26 -> 58*60 + 26 = 3506

  function formatTime(s) {
    const h = String(Math.floor(s / 3600)).padStart(2, '0');
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  function startConnection() {
    connected = true;
    powerBtn.classList.add('connected');
    powerBtn.setAttribute('aria-pressed','true');
    powerBtn.title = 'Disconnect';
    powerBtn.querySelector('.fa-power-off').style.color = '#fff';

    // animate speeds to higher values
    let dl = parseInt(downloadEl.textContent,10) || 0;
    let ul = parseInt(uploadEl.textContent,10) || 0;
    let ping = 10;
    // quicker update for a lively UI
    intervalId = setInterval(() => {
      seconds++;
      timerEl.textContent = formatTime(seconds);

      // small random fluctuations
      dl += (Math.random() * 2 - 0.8);
      ul += (Math.random() * 1.6 - 0.6);
      ping = Math.max(6, Math.round(10 + (Math.random() * 6 - 3)));

      downloadEl.textContent = Math.max(1, Math.round(dl));
      uploadEl.textContent = Math.max(1, Math.round(ul));
      pingEl.textContent = ping + ' ms';
    }, 1000);
  }

  function stopConnection() {
    connected = false;
    powerBtn.classList.remove('connected');
    powerBtn.setAttribute('aria-pressed','false');
    powerBtn.title = 'Connect';
    powerBtn.querySelector('.fa-power-off').style.color = '#fff';
    clearInterval(intervalId);
    intervalId = null;
  }

  // Toggle connect/disconnect
  powerBtn.addEventListener('click', () => {
    if (!connected) {
      startConnection();
    } else {
      stopConnection();
    }
  });

  // Start with connected state as in screenshot (optional)
  // startConnection();

  // FAQ accordion (accessible)
  const accItems = document.querySelectorAll('[data-acc]');
  accItems.forEach(item => {
    const btn = item.querySelector('.acc-btn');
    const panel = item.querySelector('.acc-panel');
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close all
      accItems.forEach(i => {
        i.querySelector('.acc-btn').setAttribute('aria-expanded','false');
        i.querySelector('.acc-panel').style.display = 'none';
      });
      // toggle this
      if (!expanded) {
        btn.setAttribute('aria-expanded','true');
        panel.style.display = 'block';
      } else {
        btn.setAttribute('aria-expanded','false');
        panel.style.display = 'none';
      }
    });
  });

  // Plan choose highlighting
  document.querySelectorAll('.choose').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.target.closest('.plan');
      document.querySelectorAll('.plan').forEach(p => p.classList.remove('selected'));
      plan.classList.add('selected');
      plan.scrollIntoView({behavior:'smooth', block:'center'});
    });
  });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('show');
      }
    });
  }, {threshold:0.15});
  reveals.forEach(r => obs.observe(r));

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Keyboard: Enter on power btn toggles too
  powerBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); powerBtn.click(); }
  });
});
