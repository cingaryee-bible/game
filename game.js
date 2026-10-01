(() => {
  'use strict';

  const SIZE = 4;
  const KEY = 'catBookRoom-v1';
  const LEVELS = [
    null,
    { glyph: '紙', label: '一張紙' },
    { glyph: '頁', label: '兩頁紙' },
    { glyph: '冊', label: '小冊子' },
    { glyph: '書', label: '一本書' },
    { glyph: '疊', label: '一疊書' },
    { glyph: '架', label: '小書架' },
    { glyph: '椅', label: '閱讀椅' },
    { glyph: '燈', label: '一盞暖燈' },
    { glyph: '窗', label: '窗邊書角' },
    { glyph: '房', label: '貓咪書房' },
    { glyph: '藏', label: '星光藏書室' },
    { glyph: '光', label: '無盡書之光' },
    { glyph: '店', label: '小小書店' },
    { glyph: '園', label: '閱讀花園' },
    { glyph: '車', label: '圖書列車' },
    { glyph: '島', label: '漂浮書島' },
    { glyph: '城', label: '雲端書城' },
    { glyph: '月', label: '月亮藏書閣' },
    { glyph: '河', label: '星河圖書館' },
    { glyph: '宙', label: '故事宇宙' }
  ];

  const messages = {
    idle: ['慢慢來，書房會長大的。', '這一步，也算是一點進展。', '再合一次，可能就有新東西。'],
    merge: ['嗯，整齊多了。', '兩件相遇，變成更好的東西。', '聽，是翻書的聲音。'],
    combo: ['連起來了！', '這一下很漂亮。', '小貓也精神起來了。'],
    high: ['房間開始有光了。', '原來可以走到這麼遠。', '這裡很適合坐一會。']
  };

  const el = {
    board: document.querySelector('#board'), tiles: document.querySelector('#tiles'),
    score: document.querySelector('#score'), best: document.querySelector('#best'),
    pawCount: document.querySelector('#pawCount'), pawMeter: document.querySelector('#pawMeter'),
    pawButton: document.querySelector('#pawButton'), undoButton: document.querySelector('#undoButton'),
    newButton: document.querySelector('#newButton'), soundButton: document.querySelector('#soundButton'),
    message: document.querySelector('#catMessage'), mascot: document.querySelector('#mascot'),
    floatScore: document.querySelector('#floatScore'), modal: document.querySelector('#modal'),
    modalTitle: document.querySelector('#modalTitle'), modalText: document.querySelector('#modalText'),
    modalActions: document.querySelector('#modalActions'), toast: document.querySelector('#toast')
  };

  let state = loadState() || freshState();
  let previous = null;
  let mergedCells = new Set();
  let newCell = -1;
  let pawMode = false;
  let touchStart = null;
  let toastTimer;
  let audioContext;

  function freshState() {
    const s = { board: Array(16).fill(0), score: 0, best: Number(localStorage.getItem(KEY + '-best')) || 0, paw: 1, meter: 0, muted: false };
    addRandom(s.board); addRandom(s.board);
    return s;
  }

  function loadState() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s || !Array.isArray(s.board) || s.board.length !== 16) return null;
      const paw = Math.min(1, Math.max(0, Number(s.paw) || 0));
      return { board: s.board.map(n => Number(n) || 0), score: Number(s.score) || 0, best: Number(s.best) || 0, paw, meter: paw ? 0 : Math.max(0, Math.min(99, Number(s.meter) || 0)), muted: !!s.muted };
    } catch { return null; }
  }

  function save() {
    state.best = Math.max(state.best, state.score);
    state.paw = Math.min(1, Math.max(0, state.paw));
    if (state.paw) state.meter = 0;
    localStorage.setItem(KEY, JSON.stringify(state));
    localStorage.setItem(KEY + '-best', String(state.best));
  }

  function cloneState() { return JSON.parse(JSON.stringify(state)); }

  function addRandom(board) {
    const empty = board.map((v, i) => v ? -1 : i).filter(i => i >= 0);
    if (!empty.length) return -1;
    const index = empty[Math.floor(Math.random() * empty.length)];
    board[index] = Math.random() < .9 ? 1 : 2;
    return index;
  }

  function lineIndexes(direction) {
    const lines = [];
    for (let i = 0; i < SIZE; i++) {
      const line = [];
      for (let j = 0; j < SIZE; j++) {
        if (direction === 'left') line.push(i * SIZE + j);
        if (direction === 'right') line.push(i * SIZE + (SIZE - 1 - j));
        if (direction === 'up') line.push(j * SIZE + i);
        if (direction === 'down') line.push((SIZE - 1 - j) * SIZE + i);
      }
      lines.push(line);
    }
    return lines;
  }

  function move(direction) {
    if (!['left','right','up','down'].includes(direction) || !el.modal.hidden || pawMode) return;
    const before = state.board.slice();
    const snapshot = cloneState();
    let gained = 0, merges = 0, highest = 0;
    mergedCells = new Set();

    lineIndexes(direction).forEach(indexes => {
      const values = indexes.map(i => state.board[i]).filter(Boolean);
      const output = [];
      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          const level = Math.min(values[i] + 1, LEVELS.length - 1);
          output.push(level); i++; merges++; highest = Math.max(highest, level);
          gained += Math.pow(2, level);
          mergedCells.add(indexes[output.length - 1]);
        } else output.push(values[i]);
      }
      while (output.length < SIZE) output.push(0);
      indexes.forEach((index, n) => { state.board[index] = output[n]; });
    });

    if (before.every((v, i) => v === state.board[i])) return;
    previous = snapshot;
    state.score += gained;
    if (merges && state.paw === 0) {
      state.meter += merges * 12 + Math.max(0, highest - 3);
      if (state.meter >= 100) {
        state.meter = 0;
        state.paw = 1;
        showToast('儲滿一隻貓爪了');
      }
    }
    newCell = addRandom(state.board);
    react(merges, highest);
    playSound(merges, highest);
    save(); render();
    if (gained) showFloat('+' + gained);
    setTimeout(checkEnd, 380);
  }

  function canMove() {
    if (state.board.some(v => !v)) return true;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      const i = r * SIZE + c;
      if (c < SIZE - 1 && state.board[i] === state.board[i + 1]) return true;
      if (r < SIZE - 1 && state.board[i] === state.board[i + SIZE]) return true;
    }
    return false;
  }

  function checkEnd() {
    if (canMove()) return;
    if (state.paw > 0) {
      openModal('書房暫時滿了', '用一隻貓爪撥開兩件較小的物件，繼續整理。', [
        { text: '🐾 用貓爪繼續', primary: true, action: rescue },
        { text: '這局先到這裡', action: confirmNew }
      ]);
    } else {
      openModal('今天整理到這裡', `今局得到 ${state.score} 分。小貓已經替你記住最好成績。`, [
        { text: '再走一局', primary: true, action: startNew }
      ]);
    }
  }

  function rescue() {
    closeModal(); previous = cloneState();
    const occupied = state.board.map((v,i) => ({v,i})).filter(x => x.v).sort((a,b) => a.v - b.v || Math.random() - .5);
    occupied.slice(0, 2).forEach(x => { state.board[x.i] = 0; });
    state.paw = 0; pawMode = false; el.message.textContent = '小貓替你騰出一點空間。';
    animateCat('pounce'); playTone(260, .11); save(); render();
  }

  function usePaw(index) {
    if (!pawMode || !state.board[index]) return;
    previous = cloneState(); state.board[index] = 0; state.paw = 0; pawMode = false;
    el.message.textContent = '撥開了，慢慢繼續。';
    animateCat('pounce'); playTone(250, .1); save(); render();
  }

  function togglePaw() {
    if (!state.paw) { showToast('合併物件可以儲貓爪'); return; }
    pawMode = !pawMode; render();
    el.message.textContent = pawMode ? '點一下想撥走的物件。' : '慢慢來，書房會長大的。';
  }

  function undo() {
    if (!previous) { showToast('暫時沒有可以復原的一步'); return; }
    const currentBest = state.best;
    state = previous; state.best = Math.max(currentBest, state.best); previous = null;
    pawMode = false; mergedCells.clear(); newCell = -1; save(); render();
    el.message.textContent = '回到剛才那一步。';
  }

  function confirmNew() {
    openModal('開始新一局？', '目前棋盤會被收起，最好成績仍然保留。', [
      { text: '開始新一局', primary: true, action: startNew },
      { text: '繼續這一局', action: closeModal }
    ]);
  }

  function startNew() {
    const best = Math.max(state.best, state.score);
    const muted = state.muted;
    state = freshState(); state.best = best; state.muted = muted;
    previous = null; pawMode = false; mergedCells.clear(); newCell = -1;
    closeModal(); save(); render(); el.message.textContent = '新的一頁，慢慢開始。';
  }

  function openModal(title, text, actions) {
    el.modalTitle.textContent = title; el.modalText.textContent = text; el.modalActions.replaceChildren();
    actions.forEach(a => {
      const button = document.createElement('button'); button.textContent = a.text;
      if (a.primary) button.className = 'primary'; button.addEventListener('click', a.action);
      el.modalActions.appendChild(button);
    });
    el.modal.hidden = false;
    requestAnimationFrame(() => el.modalActions.querySelector('.primary, button')?.focus());
  }

  function closeModal() { el.modal.hidden = true; }

  function render() {
    el.tiles.replaceChildren();
    state.board.forEach((level, index) => {
      if (!level) return;
      const cappedLevel = Math.min(level, LEVELS.length - 1);
      const data = LEVELS[cappedLevel];
      const tile = document.createElement('button');
      tile.className = `tile l${cappedLevel}${mergedCells.has(index) ? ' merge' : ''}${newCell === index ? ' new' : ''}`;
      tile.style.gridArea = `${Math.floor(index / SIZE) + 1} / ${index % SIZE + 1}`;
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', data.label + (pawMode ? '，點擊移除' : ''));
      const imageNumber = String(cappedLevel).padStart(2, '0');
      tile.innerHTML = `<img class="tile-art" src="./assets/tiles/tile-${imageNumber}.webp?v=9" width="320" height="427" alt="" draggable="false"><span class="label">${data.label}</span>`;
      tile.addEventListener('click', () => usePaw(index));
      el.tiles.appendChild(tile);
    });
    el.score.textContent = state.score.toLocaleString('zh-Hant');
    el.best.textContent = state.best.toLocaleString('zh-Hant');
    el.pawCount.textContent = state.paw;
    el.pawMeter.style.width = (state.paw ? 100 : state.meter) + '%';
    el.board.classList.toggle('paw-mode', pawMode);
    el.pawButton.classList.toggle('active', pawMode);
    el.pawButton.setAttribute('aria-pressed', String(pawMode));
    el.undoButton.disabled = !previous;
    el.soundButton.textContent = state.muted ? '♩' : '♪';
    el.soundButton.setAttribute('aria-label', state.muted ? '開啟聲音' : '關閉聲音');
    newCell = -1;
  }

  function react(merges, highest) {
    if (!merges) { el.message.textContent = random(messages.idle); return; }
    if (highest >= 8) el.message.textContent = random(messages.high);
    else if (merges >= 2) el.message.textContent = random(messages.combo);
    else el.message.textContent = random(messages.merge);
    animateCat(merges >= 2 ? 'pounce' : 'pleased');
    if (navigator.vibrate) navigator.vibrate(merges >= 2 ? [18, 25, 22] : 18);
  }

  function animateCat(className) {
    el.mascot.classList.remove('pleased', 'pounce'); void el.mascot.offsetWidth;
    el.mascot.classList.add(className);
  }

  function random(array) { return array[Math.floor(Math.random() * array.length)]; }

  function showFloat(text) {
    el.floatScore.textContent = text; el.floatScore.classList.remove('go'); void el.floatScore.offsetWidth; el.floatScore.classList.add('go');
  }

  function showToast(text) {
    clearTimeout(toastTimer); el.toast.textContent = text; el.toast.classList.add('show');
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1800);
  }

  function playSound(merges, level) {
    if (!merges || state.muted) return;
    playTone(280 + Math.min(level, 10) * 32, merges > 1 ? .16 : .1);
    if (merges > 1) setTimeout(() => playTone(420 + level * 28, .13), 90);
  }

  function playTone(frequency, duration) {
    if (state.muted) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioContext.createOscillator(); const gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.075, audioContext.currentTime + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
      osc.connect(gain).connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + duration + .02);
    } catch { /* sound is optional */ }
  }

  function toggleSound() {
    state.muted = !state.muted; save(); render(); showToast(state.muted ? '聲音已關閉' : '聲音已開啟');
  }

  el.board.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  el.board.addEventListener('touchmove', e => { if (touchStart && !pawMode) e.preventDefault(); }, { passive: false });
  el.board.addEventListener('touchend', e => {
    if (!touchStart || pawMode) { touchStart = null; return; }
    const t = e.changedTouches[0], dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y;
    touchStart = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  });

  window.addEventListener('keydown', e => {
    const map = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
    if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); undo(); }
    if (e.key === 'Escape' && !el.modal.hidden) closeModal();
  });

  el.undoButton.addEventListener('click', undo);
  el.pawButton.addEventListener('click', togglePaw);
  el.newButton.addEventListener('click', confirmNew);
  el.soundButton.addEventListener('click', toggleSound);
  el.mascot.addEventListener('animationend', () => el.mascot.classList.remove('pleased', 'pounce'));

  render();
})();
