(() => {
  'use strict';
  const link = document.querySelector('.topbar .home');
  if (!link) return;
  let leaving = false;
  let overlay;

  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (leaving) return;
    leaving = true;
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'home-transition';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.innerHTML = '<div class="home-transition-card"><span class="home-transition-paw" aria-hidden="true">🐾</span><span>返回遊戲室…</span><div class="home-transition-track" aria-hidden="true"><i class="home-transition-bar"></i></div></div>';
      document.body.appendChild(overlay);
    }
    overlay.classList.add('visible');
    link.setAttribute('aria-disabled', 'true');
    // Paint feedback before leaving; the homepage continues its own loading screen.
    setTimeout(() => window.location.assign(link.href), 32);
  });

  window.addEventListener('pageshow', () => {
    leaving = false;
    link.removeAttribute('aria-disabled');
    overlay?.classList.remove('visible');
  });
})();
