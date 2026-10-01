(() => {
  'use strict';

  const link = document.querySelector('.game-home a');
  if (!link) return;

  const homeUrl = new URL(link.getAttribute('href'), window.location.href).href;
  let leaving = false;
  let navigationQueued = false;
  let overlay;

  function warmHome() {
    fetch(homeUrl, { cache: 'force-cache', credentials: 'same-origin' }).catch(() => {});
    fetch(new URL('home.css', homeUrl).href, { cache: 'force-cache', credentials: 'same-origin' }).catch(() => {});
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'home-transition';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'assertive');
    overlay.innerHTML = '<div class="home-transition-card"><span class="home-transition-paw" aria-hidden="true">🐾</span><span>返回遊戲室…</span><div class="home-transition-track" aria-hidden="true"><i class="home-transition-bar"></i></div></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function showTransition() {
    if (leaving) return;
    leaving = true;
    document.documentElement.classList.add('returning-home');
    link.setAttribute('aria-disabled', 'true');
    const screen = ensureOverlay();
    requestAnimationFrame(() => screen.classList.add('visible'));
  }

  link.addEventListener('pointerdown', showTransition, { passive: true });
  function navigateHome() {
    if (navigationQueued) return;
    navigationQueued = true;
    requestAnimationFrame(() => window.location.assign(homeUrl));
  }
  link.addEventListener('pointerup', event => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    showTransition();
    navigateHome();
  });
  link.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') showTransition();
  });
  link.addEventListener('click', event => {
    event.preventDefault();
    showTransition();
    navigateHome();
  });

  window.addEventListener('pageshow', () => {
    leaving = false;
    navigationQueued = false;
    document.documentElement.classList.remove('returning-home');
    link.removeAttribute('aria-disabled');
    overlay?.classList.remove('visible');
  });

  if ('requestIdleCallback' in window) requestIdleCallback(warmHome, { timeout: 1800 });
  else setTimeout(warmHome, 900);
})();
