/**
 * Stay Human Shift – Chat-Widget (24/7 anonymer Support)
 * Einbinden auf allen Seiten via: <script src="chat-widget.js"></script>
 */
(function () {
  'use strict';

  // ── STYLES ──────────────────────────────────────────────
  const css = `
    :root {
      --cw-bronze:  #cd7f32;
      --cw-bronze2: #b56c22;
      --cw-green:   #27ae60;
      --cw-red:     #e74c3c;
      --cw-bg:      #2a2a2a;
      --cw-surface: #333333;
      --cw-border:  #484848;
      --cw-text:    #e8e6e3;
      --cw-muted:   #a8a8a8;
    }

    /* Toggle button */
    #cw-toggle {
      position: fixed;
      bottom: 1.5rem; right: 1.5rem;
      z-index: 9999;
      width: 56px; height: 56px;
      background: var(--cw-bronze);
      border: none; border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 18px rgba(205,127,50,0.45);
      transition: background 200ms, transform 200ms;
      animation: cw-pulse 3s ease-in-out infinite;
    }
    #cw-toggle:hover { background: var(--cw-bronze2); transform: scale(1.08); animation: none; }
    #cw-toggle svg { pointer-events: none; transition: opacity 200ms, transform 200ms; }
    #cw-toggle .cw-icon-close { display: none; }
    #cw-toggle.is-open .cw-icon-chat  { display: none; }
    #cw-toggle.is-open .cw-icon-close { display: block; }
    #cw-toggle.is-open { animation: none; }

    @keyframes cw-pulse {
      0%, 100% { box-shadow: 0 4px 18px rgba(205,127,50,0.45); }
      50%       { box-shadow: 0 4px 28px rgba(205,127,50,0.7); }
    }

    /* Notification dot */
    #cw-dot {
      position: fixed;
      bottom: calc(1.5rem + 40px); right: calc(1.5rem + 4px);
      z-index: 9999;
      width: 12px; height: 12px;
      background: var(--cw-red);
      border: 2px solid #2e2e2e;
      border-radius: 50%;
      animation: cw-blink 2s ease-in-out infinite;
    }
    #cw-dot.hidden { display: none; }
    @keyframes cw-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

    /* Chat window */
    #cw-window {
      position: fixed;
      bottom: calc(1.5rem + 72px); right: 1.5rem;
      z-index: 9998;
      width: min(360px, calc(100vw - 2rem));
      background: var(--cw-bg);
      border: 1px solid var(--cw-border);
      border-radius: 16px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.55);
      overflow: hidden;
      display: none;
      flex-direction: column;
      max-height: 520px;
      transform: translateY(12px); opacity: 0;
      transition: transform 280ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease;
      font-family: 'Satoshi', -apple-system, sans-serif;
    }
    #cw-window.is-open {
      display: flex;
      transform: translateY(0); opacity: 1;
    }

    /* Header */
    .cw-header {
      background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
      border-bottom: 1px solid var(--cw-border);
      padding: 1rem 1.1rem 0.85rem;
      display: flex; align-items: center; gap: 0.65rem;
    }
    .cw-header__avatar {
      width: 36px; height: 36px; flex-shrink: 0;
      background: rgba(205,127,50,0.15);
      border: 1.5px solid rgba(205,127,50,0.35);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: var(--cw-bronze);
    }
    .cw-header__name {
      font-size: 0.85rem; font-weight: 700; color: var(--cw-text);
      font-family: 'Cabinet Grotesk', sans-serif;
    }
    .cw-header__status {
      display: flex; align-items: center; gap: 0.35rem;
      font-size: 0.7rem; color: var(--cw-green);
    }
    .cw-header__status::before {
      content: ''; width: 6px; height: 6px; background: var(--cw-green);
      border-radius: 50%;
    }
    .cw-header__tag {
      margin-left: auto;
      font-size: 0.62rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.08em; padding: 0.18rem 0.55rem;
      background: rgba(39,174,96,0.12); border: 1px solid rgba(39,174,96,0.25);
      color: var(--cw-green); border-radius: 99px;
    }

    /* Body */
    .cw-body { padding: 1.1rem; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }

    /* Greeting bubble */
    .cw-bubble {
      background: var(--cw-surface); border: 1px solid var(--cw-border);
      border-radius: 12px 12px 12px 3px;
      padding: 0.9rem 1rem; font-size: 0.88rem;
      color: var(--cw-text); line-height: 1.6;
    }
    .cw-bubble strong { color: var(--cw-bronze); }

    /* Quick buttons */
    .cw-quick-label { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--cw-muted); padding: 0 0.1rem; }
    .cw-quick-actions { display: flex; flex-direction: column; gap: 0.5rem; }
    .cw-quick-btn {
      display: flex; align-items: center; gap: 0.6rem;
      background: #1e1e1e; border: 1px solid var(--cw-border);
      border-radius: 10px; padding: 0.75rem 0.9rem;
      text-decoration: none; color: var(--cw-text);
      font-size: 0.83rem; font-weight: 500;
      transition: border-color 180ms, background 180ms;
      cursor: pointer;
    }
    .cw-quick-btn:hover { border-color: var(--cw-bronze); background: rgba(205,127,50,0.05); }
    .cw-quick-btn__icon {
      width: 28px; height: 28px; flex-shrink: 0; border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
    }
    .cw-quick-btn__icon--bronze { background: rgba(205,127,50,0.15); color: var(--cw-bronze); }
    .cw-quick-btn__icon--green  { background: rgba(39,174,96,0.15);  color: var(--cw-green);  }
    .cw-quick-btn__icon--red    { background: rgba(231,76,60,0.15);  color: var(--cw-red);    }
    .cw-quick-btn__text { flex: 1; line-height: 1.3; }
    .cw-quick-btn__sub { font-size: 0.72rem; color: var(--cw-muted); display: block; }

    /* Hotline popup (Rot-Button) */
    #cw-hotline {
      background: rgba(231,76,60,0.08); border: 1px solid rgba(231,76,60,0.25);
      border-radius: 10px; padding: 0.9rem 1rem;
      display: none; flex-direction: column; gap: 0.4rem;
    }
    #cw-hotline.is-visible { display: flex; }
    #cw-hotline p { font-size: 0.82rem; color: var(--cw-muted); margin: 0; }
    #cw-hotline a { color: var(--cw-red); font-weight: 700; font-size: 0.88rem; text-decoration: none; display: block; }
    #cw-hotline a:hover { text-decoration: underline; }

    /* Footer */
    .cw-footer {
      padding: 0.6rem 1.1rem;
      border-top: 1px solid var(--cw-border);
      text-align: center;
      font-size: 0.65rem; color: #555;
    }

    @media (max-width: 420px) {
      #cw-toggle { bottom: 1rem; right: 1rem; }
      #cw-dot    { bottom: calc(1rem + 40px); right: calc(1rem + 4px); }
      #cw-window { bottom: calc(1rem + 72px); right: 1rem; }
    }
  `;

  // ── HTML ─────────────────────────────────────────────────
  const html = `
    <style>${css}</style>

    <div id="cw-dot" title="Stay Human Shift Support"></div>

    <button id="cw-toggle" aria-label="Support-Chat öffnen" aria-haspopup="dialog" aria-expanded="false">
      <svg class="cw-icon-chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="cw-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="cw-window" role="dialog" aria-label="Stay Human Shift Support-Chat" aria-modal="false">
      <div class="cw-header">
        <div class="cw-header__avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div>
          <div class="cw-header__name">Stay Human Shift</div>
          <div class="cw-header__status">24/7 für dich da</div>
        </div>
        <div class="cw-header__tag">Anonym</div>
      </div>

      <div class="cw-body">
        <div class="cw-bubble">
          Hi! Hier ist dein digitaler <strong>Safe Space</strong> von STAY HUMAN SHIFT.<br><br>
          Drückt der Schuh im Job oder brauchst du gerade einfach einen klaren Kopf?<br>
          Ich bin anonym für dich da.
        </div>

        <div>
          <p class="cw-quick-label">Was brauchst du gerade?</p>
        </div>

        <div class="cw-quick-actions">
          <a href="stress-check.html" class="cw-quick-btn">
            <span class="cw-quick-btn__icon cw-quick-btn__icon--bronze">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <span class="cw-quick-btn__text">
              Direkt zum anonymen Stress-Check
              <span class="cw-quick-btn__sub">4 Fragen · sofort · kein Login</span>
            </span>
          </a>

          <a href="klarerkopf.html" class="cw-quick-btn">
            <span class="cw-quick-btn__icon cw-quick-btn__icon--green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            <span class="cw-quick-btn__text">
              Für die kostenlosen Talkrunden anmelden
              <span class="cw-quick-btn__sub">Juni 2026 · 100% kostenlos & anonym</span>
            </span>
          </a>

          <button class="cw-quick-btn" onclick="document.getElementById('cw-hotline').classList.toggle('is-visible');this.querySelector('.cw-quick-btn__sub').textContent='Hotlines werden angezeigt ↓';">
            <span class="cw-quick-btn__icon cw-quick-btn__icon--red">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.63 19a19.5 19.5 0 0 1-6.91-6.91 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.89a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </span>
            <span class="cw-quick-btn__text">
              Ich brauche JETZT sofort Hilfe
              <span class="cw-quick-btn__sub">Krisen-Hotlines anzeigen</span>
            </span>
          </button>
        </div>

        <div id="cw-hotline">
          <p><strong style="color:#e74c3c;">Sofort-Hilfe — kostenlos, 24/7</strong></p>
          <a href="tel:01806313031">01806 313031 – Sucht- &amp; Drogenhotline</a>
          <a href="tel:08001110111">0800 111 0 111 – Telefonseelsorge</a>
          <a href="tel:08001110222">0800 111 0 222 – Telefonseelsorge</a>
          <a href="tel:112">112 – Notruf</a>
        </div>
      </div>

      <div class="cw-footer">Stay Human Shift · 100% anonym · Kein Konto nötig</div>
    </div>
  `;

  // ── INJECT ───────────────────────────────────────────────
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);

  // ── TOGGLE LOGIC ─────────────────────────────────────────
  const toggle = document.getElementById('cw-toggle');
  const win    = document.getElementById('cw-window');
  const dot    = document.getElementById('cw-dot');

  toggle.addEventListener('click', function () {
    const isOpen = win.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      dot.classList.add('hidden');
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !win.contains(e.target)) {
      win.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && win.classList.contains('is-open')) {
      win.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

})();
