(() => {
  'use strict';

  const links = [...document.querySelectorAll('a.game')];
  if (!links.length) return;

  let navigating = false;
  let overlay;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'game-transition';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'assertive');
    overlay.innerHTML = '<div class="game-transition-card"><span class="game-transition-paw" aria-hidden="true">🐾</span><span class="game-transition-label">進入遊戲…</span><div class="game-transition-track" aria-hidden="true"><i class="game-transition-bar"></i></div></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function enterGame(link) {
    if (navigating) return;
    navigating = true;
    const screen = ensureOverlay();
    const title = link.querySelector('h2')?.textContent?.trim() || '遊戲';
    screen.querySelector('.game-transition-label').textContent = `進入${title}…`;
    screen.classList.add('visible');
    link.setAttribute('aria-disabled', 'true');
    // Give Safari one paint before leaving, so a slow navigation never looks frozen.
    setTimeout(() => window.location.assign(link.href), 32);
  }

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      enterGame(link);
    });
  });

  window.addEventListener('pageshow', () => {
    navigating = false;
    links.forEach(link => link.removeAttribute('aria-disabled'));
    overlay?.classList.remove('visible');
  });
})();
