/* ============================================================
   app.js — Birthday Website VIP Engine
   Modules:
   1. Synthesized Web Audio SFX
   2. Custom Cursor & Interactive Particles
   3. Interactive 3D Birthday Cake & Candle Blow (Mic + Tap)
   4. ₹500 Birthday Gift Vault & WhatsApp Order Dispatch
   5. Scratch & Win VIP Friendship Coupons
   6. BFF Developer Terminal (~bff-cli)
   7. AI Dev Compliment & Roast Oracle
   8. 3-Level Birthday Arcade (Memory, Quiz, Balloon Blitz)
============================================================ */

// =====================================================
// 1. SYNTHESIZED WEB AUDIO SFX ENGINE
// =====================================================
let audioCtx = null;
let soundEnabled = true;

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playAudioFx(type) {
  if (!soundEnabled) return;
  try {
    initAudioContext();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'pop') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } 
    else if (type === 'flip') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.06);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
    else if (type === 'coin') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
    else if (type === 'blow') {
      // Noise burst for blowing whoosh
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(200, now + 0.4);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.4);
    }
    else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const noteTime = now + (i * 0.1);
        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    }
  } catch (e) {
    console.log('Audio FX error:', e);
  }
}

// Audio Toggle Button
const audioToggleBtn = document.getElementById('audioToggle');
if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', () => {
    initAudioContext();
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('audioIcon');
    const label = audioToggleBtn.querySelector('.audio-label');
    if (soundEnabled) {
      icon.textContent = '🔊';
      label.textContent = 'SFX: ON';
      audioToggleBtn.classList.remove('muted');
      playAudioFx('coin');
      showToast('🔊 Sound Effects Enabled!');
      if (currentStep >= 2) {
        playBirthdaySong();
      }
    } else {
      icon.textContent = '🔇';
      label.textContent = 'SFX: OFF';
      audioToggleBtn.classList.add('muted');
      showToast('🔇 Sound Effects Muted');
      stopBirthdaySong();
    }
  });
}

// =====================================================
// RESPONSIVE HEADER HEIGHT SYNC
// Measures real navbar + tracker heights and writes
// them to CSS custom properties so content is never
// hidden behind fixed headers on any screen size.
// =====================================================
function syncHeaderVars() {
  const navbar  = document.getElementById('navbar');
  const tracker = document.getElementById('journeyTracker');
  const banner  = document.getElementById('storeCountdownBanner');
  const root    = document.documentElement;

  const navH     = navbar  ? navbar.getBoundingClientRect().height  : 64;
  const trackH   = tracker ? tracker.getBoundingClientRect().height : 76;
  const bannerH  = (banner && !banner.classList.contains('hidden'))
                   ? banner.getBoundingClientRect().height : 0;

  root.style.setProperty('--navbar-h',      `${navH}px`);
  root.style.setProperty('--tracker-h',     `${trackH}px`);
  // content padding-top = navbar + tracker + optional banner
  root.style.setProperty('--header-total',  `${navH + trackH + bannerH + 8}px`);
  // banner always sits right below tracker
  root.style.setProperty('--banner-top',    `${navH + trackH}px`);
}

// Also call whenever banner visibility changes
function syncHeaderVarsDelayed() {
  // Wait one frame so the DOM has painted new heights
  requestAnimationFrame(syncHeaderVars);
}

// =====================================================
// STEP-BY-STEP CONTROL SYSTEM & JOURNEY PROGRESSION BAR
// =====================================================
let currentStep = 1;
let maxUnlockedStep = 1;
const totalSteps = 8;


const STEP_METADATA = [
  { step: 1, id: 'hero', name: 'Home', title: 'Step 1: Welcome Home 🎈' },
  { step: 2, id: 'cake', name: 'Candle', title: 'Step 2: Interactive Cake & Candle Ritual 🎂' },
  { step: 3, id: 'games', name: 'Arcade', title: 'Step 3: 3-Level Birthday Arcade 🕹️' },
  { step: 4, id: 'gifts', name: 'Gift Vault', title: 'Step 4: ₹500 Birthday Gift Vault 🎁' },
  { step: 5, id: 'coupons', name: 'VIP Perks', title: 'Step 5: Scratch & Win VIP Friendship Perks 🎟️' },
  { step: 6, id: 'step-memories', name: 'Memories', title: 'Step 6: Time Capsule & Memories 📸' },
  { step: 7, id: 'devcompliments', name: 'AI Roast', title: 'Step 7: AI Dev Compliment & Roast Machine 🤖' },
  { step: 8, id: 'wish', name: 'Grand Wish', title: 'Step 8: Grand Wish & Final Letter 💌' }
];

const stepIds = {
  1: 'hero',
  2: 'cake',
  3: 'games',
  4: 'gifts',
  5: 'coupons',
  6: 'step-memories',
  7: 'devcompliments',
  8: 'wish'
};

// Check if progress exists in localStorage
if (localStorage.getItem('maxUnlockedStep')) {
  maxUnlockedStep = parseInt(localStorage.getItem('maxUnlockedStep'), 10);
  if (isNaN(maxUnlockedStep) || maxUnlockedStep < 1) maxUnlockedStep = 1;
  if (maxUnlockedStep > totalSteps) maxUnlockedStep = totalSteps;
}

function updateJourneyTracker() {
  const currentMeta = STEP_METADATA.find(m => m.step === currentStep) || STEP_METADATA[0];
  
  // Update Header Text
  const titleEl = document.getElementById('journeyCurrentStepName');
  if (titleEl) {
    titleEl.textContent = currentMeta.title;
  }

  // Update Completion Percentage
  const pct = Math.round(((maxUnlockedStep - 1) / (totalSteps - 1)) * 100);
  const pctEl = document.getElementById('journeyProgressPct');
  if (pctEl) {
    pctEl.textContent = `${pct}% Completed • ${maxUnlockedStep}/${totalSteps} Unlocked`;
  }

  // Update Progress Fill Line
  const lineFill = document.getElementById('journeyLineFill');
  if (lineFill) {
    lineFill.style.width = `${((maxUnlockedStep - 1) / (totalSteps - 1)) * 100}%`;
  }

  const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';

  // Update Step Buttons
  document.querySelectorAll('#journeyStepsList .journey-step-btn').forEach(btn => {
    const s = parseInt(btn.dataset.step, 10);
    const chip = btn.querySelector('.step-status-chip');
    
    btn.classList.remove('active', 'completed', 'unlocked', 'locked');

    if (s === currentStep) {
      btn.classList.add('active');
      if (chip) chip.textContent = 'Active';
    } else if (s < currentStep || s < maxUnlockedStep) {
      btn.classList.add('completed');
      if (chip) chip.textContent = '✓ Done';
    } else if (s === maxUnlockedStep) {
      btn.classList.add('unlocked');
      if (chip) chip.textContent = 'Open';
    } else {
      btn.classList.add('locked');
      if (chip) chip.textContent = '🔒';
    }

    // Step 4 special claimed badge
    if (s === 4 && isClaimed) {
      if (chip) chip.textContent = 'Claimed ✅';
      btn.classList.add('completed');
    }
  });

  updateNavbarLocks();
}

function showStep(stepNum) {
  // Hide all steps
  for (let s = 1; s <= totalSteps; s++) {
    const el = document.getElementById(stepIds[s]);
    if (el) el.classList.remove('active');
  }
  
  // Show active step
  const activeEl = document.getElementById(stepIds[stepNum]);
  if (activeEl) {
    activeEl.classList.add('active');
    // Trigger scroll reveal animations for this step
    setTimeout(() => revealStepScrollItems(activeEl), 50);
  }
  
  currentStep = stepNum;
  
  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'instant' });
  
  // Update Journey Progress Bar
  updateJourneyTracker();

  // Run step-specific setups
  if (stepNum === 2) {
    playBirthdaySong();
    restoreCakeState();
  } else {
    // If navigating to home, pause song; otherwise keep festive music playing
    if (stepNum < 2) {
      stopBirthdaySong();
    }
  }
  
  if (stepNum === 3) {
    initMemoryGame();
  }
  if (stepNum === 4) {
    // Start or check 12h timer when visiting store if not checked out yet
    const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';
    if (!isClaimed) {
      let expiry = localStorage.getItem('giftVaultTimerExpiry');
      if (!expiry) {
        expiry = Date.now() + 12 * 60 * 60 * 1000;
        localStorage.setItem('giftVaultTimerExpiry', expiry);
      }
      startStoreCountdownTimer();
    }
    renderGiftCatalog();
    updateBudgetAndCartUI();
  }
  if (stepNum === 5) {
    initScratchCards();
  }
  if (stepNum === 6) {
    unlockStep(7);
  }
  if (stepNum === 7) {
    unlockStep(8);
  }
}

function unlockStep(stepNum) {
  if (stepNum > maxUnlockedStep) {
    maxUnlockedStep = stepNum;
    localStorage.setItem('maxUnlockedStep', maxUnlockedStep);
    updateJourneyTracker();
  }
}

function goToStep(stepNum) {
  if (stepNum <= maxUnlockedStep) {
    showStep(stepNum);
  } else if (stepNum === maxUnlockedStep + 1) {
    unlockStep(stepNum);
    showStep(stepNum);
  } else {
    playAudioFx('pop');
    showToast(`🔒 Complete Step ${maxUnlockedStep} first to unlock this page!`);
  }
}

function navigateToStep(stepNum) {
  if (stepNum <= maxUnlockedStep) {
    showStep(stepNum);
  } else {
    playAudioFx('pop');
    showToast(`🔒 Complete Step ${maxUnlockedStep} first to unlock this page!`);
  }
}

// =====================================================
// 12-HOUR GIFT VAULT COUNTDOWN TIMER
// =====================================================
let storeTimerInterval = null;

function enableStoreTimerAndProceed() {
  const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';
  if (isClaimed) {
    unlockStep(5);
    navigateToStep(5);
    return;
  }

  let expiry = localStorage.getItem('giftVaultTimerExpiry');
  if (!expiry) {
    // 12 hours from now
    expiry = Date.now() + 12 * 60 * 60 * 1000;
    localStorage.setItem('giftVaultTimerExpiry', expiry);
  }

  startStoreCountdownTimer();
  unlockStep(5);
  navigateToStep(5);
  showToast('⏳ 12-Hour Gift Timer Started! Feel free to explore other pages & return anytime! 🛍️', 4500);
}

function startStoreCountdownTimer() {
  const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';
  const banner = document.getElementById('storeCountdownBanner');

  if (isClaimed) {
    if (banner) { banner.classList.add('hidden'); syncHeaderVarsDelayed(); }
    if (storeTimerInterval) {
      clearInterval(storeTimerInterval);
      storeTimerInterval = null;
    }
    return;
  }

  const expiry = parseInt(localStorage.getItem('giftVaultTimerExpiry'), 10);
  if (!expiry || isNaN(expiry)) return;

  if (banner) { banner.classList.remove('hidden'); syncHeaderVarsDelayed(); }


  const timerEl = document.getElementById('countdownTimerVal');

  function updateTimer() {
    const now = Date.now();
    const remainingMs = expiry - now;

    if (remainingMs <= 0) {
      if (timerEl) timerEl.textContent = '00:00:00 (Time Expired!)';
      clearInterval(storeTimerInterval);
      storeTimerInterval = null;
      return;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = n => String(n).padStart(2, '0');
    if (timerEl) {
      timerEl.textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
  }

  updateTimer();
  if (!storeTimerInterval) {
    storeTimerInterval = setInterval(updateTimer, 1000);
  }
}

function updateNavbarLocks() {
  const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';

  document.querySelectorAll('#navLinks a[data-step]').forEach(link => {
    const s = parseInt(link.dataset.step, 10);
    const label = link.textContent.replace(' 🔒', '').replace(' ✅', '');
    if (s <= maxUnlockedStep) {
      link.classList.remove('locked');
      if (s === 4) {
        link.innerHTML = `🎁 Gift Store ${isClaimed ? '<span class="budget-pill claimed">Claimed ✅</span>' : '<span class="budget-pill" id="navBudgetPill">₹500 Left</span>'}`;
      } else {
        link.textContent = label;
      }
    } else {
      link.classList.add('locked');
      if (s === 4) {
        link.innerHTML = `🎁 Gift Store 🔒 ${isClaimed ? '<span class="budget-pill claimed">Claimed ✅</span>' : '<span class="budget-pill" id="navBudgetPill">₹500 Left</span>'}`;
      } else {
        link.textContent = label + ' 🔒';
      }
    }
  });
}

// Birthday Song Player logic
let songPlaying = false;
let songAudio = null;
let synthMelodyTimeout = null;
let currentSynthOsc = null;
let currentSynthGain = null;
let melodyIndex = 0;

const birthdayMelody = [
  { note: 'C4', dur: 0.75 }, { note: 'C4', dur: 0.25 }, { note: 'D4', dur: 1 }, { note: 'C4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'E4', dur: 2 },
  { note: 'C4', dur: 0.75 }, { note: 'C4', dur: 0.25 }, { note: 'D4', dur: 1 }, { note: 'C4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'F4', dur: 2 },
  { note: 'C4', dur: 0.75 }, { note: 'C4', dur: 0.25 }, { note: 'C5', dur: 1 }, { note: 'A4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'E4', dur: 1 }, { note: 'D4', dur: 2 },
  { note: 'A#4', dur: 0.75 }, { note: 'A#4', dur: 0.25 }, { note: 'A4', dur: 1 }, { note: 'F4', dur: 1 }, { note: 'G4', dur: 1 }, { note: 'F4', dur: 2 }
];

const noteFreqs = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'A#4': 466.16, 'C5': 523.25
};

function playBirthdaySong() {
  if (songPlaying) return;
  if (!soundEnabled) return;
  songPlaying = true;
  
  songAudio = new Audio('birthday_song.mp3');
  songAudio.loop = true;
  
  songAudio.play().then(() => {
    showToast('🎵 Playing Custom Birthday Song! 🎂');
  }).catch(err => {
    console.log('Local MP3 not found or blocked. Playing synthesized BFF.OS theme!', err);
    melodyIndex = 0;
    playSynthBirthdaySong();
  });
}

function playSynthBirthdaySong() {
  if (!songPlaying || !soundEnabled) return;
  initAudioContext();
  if (!audioCtx) return;
  
  const now = audioCtx.currentTime;
  const item = birthdayMelody[melodyIndex];
  const freq = noteFreqs[item.note];
  const duration = item.dur * 0.45;
  
  currentSynthOsc = audioCtx.createOscillator();
  currentSynthGain = audioCtx.createGain();
  
  currentSynthOsc.type = 'triangle';
  currentSynthOsc.frequency.setValueAtTime(freq, now);
  
  currentSynthGain.gain.setValueAtTime(0, now);
  currentSynthGain.gain.linearRampToValueAtTime(0.06, now + 0.03);
  currentSynthGain.gain.setValueAtTime(0.06, now + duration - 0.03);
  currentSynthGain.gain.linearRampToValueAtTime(0, now + duration);
  
  currentSynthOsc.connect(currentSynthGain);
  currentSynthGain.connect(audioCtx.destination);
  
  currentSynthOsc.start(now);
  currentSynthOsc.stop(now + duration);
  
  melodyIndex = (melodyIndex + 1) % birthdayMelody.length;
  synthMelodyTimeout = setTimeout(playSynthBirthdaySong, duration * 1000 + 40);
}

function stopBirthdaySong() {
  songPlaying = false;
  
  if (songAudio) {
    try {
      songAudio.pause();
      songAudio = null;
    } catch (e) {}
  }
  
  if (synthMelodyTimeout) {
    clearTimeout(synthMelodyTimeout);
    synthMelodyTimeout = null;
  }
  
  if (currentSynthOsc) {
    try {
      currentSynthOsc.stop();
      currentSynthOsc = null;
    } catch (e) {}
  }
}

// =====================================================
// 2. CUSTOM CURSOR & CANVAS PARTICLES
// =====================================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateCursorFollower() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dx = mouseX - followerX;
  const dy = mouseY - followerY;
  if (Math.abs(dx) > 0.4 || Math.abs(dy) > 0.4) {
    followerX += dx * 0.16;
    followerY += dy * 0.16;
    if (cursorFollower) {
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
    }
  }
  requestAnimationFrame(animateCursorFollower);
}
animateCursorFollower();

function bindHoverCursors() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('a, button, .game-card, .quiz-opt, .polaroid, .gift-card, .scratch-card-box, .level-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2)';
      if (cursorFollower) {
        cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.2)';
        cursorFollower.style.borderColor = 'var(--pink)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      if (cursorFollower) {
        cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
        cursorFollower.style.borderColor = 'rgba(168,85,247,0.6)';
      }
    });
  });
}
bindHoverCursors();

// Canvas Stars & Confetti - Optimized
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let stars = [];
let confettiParticles = [];
let isConfettiActive = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createStars() {
  stars = [];
  const starCount = window.innerWidth < 768 ? 35 : 60;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.008 + 0.003,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    });
  }
}
createStars();

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.alpha += s.speed * s.twinkleDir;
    if (s.alpha >= 0.85 || s.alpha <= 0.1) s.twinkleDir *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }
}

function triggerCongratsConfetti() {
  createConfetti();
  playAudioFx('fanfare');
  showToast('🎉 Happy Birthday, Legend! ✨', 4000);
}

function createConfetti() {
  confettiParticles = [];
  isConfettiActive = true;
  const colors = ['#ff5e98', '#a855f7', '#06b6d4', '#fbbf24', '#10b981', '#f43f5e', '#3b82f6'];
  for (let i = 0; i < 220; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: -30,
      w: Math.random() * 14 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4.5 + 2.5,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 9,
      opacity: 1,
    });
  }
  setTimeout(() => {
    isConfettiActive = false;
    confettiParticles = [];
  }, 6000);
}

function drawConfetti() {
  confettiParticles.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;
    if (p.y > canvas.height + 30) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
}

function animateCanvas() {
  drawStars();
  if (isConfettiActive) drawConfetti();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// =====================================================
// 3. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING
// =====================================================
let candlesBlown = false;
let micStream = null;
let micAudioContext = null;
let micAnalyser = null;
let isListeningMic = false;

function restoreCakeState() {
  if (localStorage.getItem('cakeBlown') === 'true') {
    candlesBlown = true;
    for (let i = 1; i <= 4; i++) {
      const flame = document.getElementById('flame' + i);
      const smoke = document.getElementById('smoke' + i);
      if (flame) flame.classList.add('extinguished');
      if (smoke) smoke.classList.add('active');
    }

    const statusText = document.getElementById('flameStatusText');
    if (statusText) {
      statusText.innerHTML = '✨ <strong>WISH GRANTED!</strong> The universe heard your dream! 🌟';
      statusText.style.color = 'var(--emerald)';
    }

    const relightBtn = document.getElementById('relightBtn');
    if (relightBtn) relightBtn.classList.remove('hidden');

    const transitionContainer = document.getElementById('cakeTransition');
    if (transitionContainer) {
      transitionContainer.classList.remove('hidden');
    }
  }
}

function blowOutCandles(manual = true) {
  if (candlesBlown) return;
  candlesBlown = true;
  localStorage.setItem('cakeBlown', 'true');

  playAudioFx('blow');

  // Extinguish all flames
  for (let i = 1; i <= 4; i++) {
    const flame = document.getElementById('flame' + i);
    const smoke = document.getElementById('smoke' + i);
    if (flame) flame.classList.add('extinguished');
    if (smoke) smoke.classList.add('active');
  }

  const statusText = document.getElementById('flameStatusText');
  if (statusText) {
    statusText.innerHTML = '✨ <strong>WISH GRANTED!</strong> The universe heard your dream! 🌟';
    statusText.style.color = 'var(--emerald)';
  }

  const relightBtn = document.getElementById('relightBtn');
  if (relightBtn) relightBtn.classList.remove('hidden');

  createConfetti();
  playAudioFx('fanfare');
  showToast('🎂 Candles Blown! Your wish is locked into the universe! 🥂', 4500);

  // Stop mic if active
  if (isListeningMic && micStream) {
    micStream.getTracks().forEach(track => track.stop());
    isListeningMic = false;
    const micBtnText = document.getElementById('micBtnText');
    if (micBtnText) micBtnText.textContent = 'Use Real Mic Blow';
  }

  // Show transition button to proceed to Step 3
  const transitionContainer = document.getElementById('cakeTransition');
  if (transitionContainer) {
    transitionContainer.classList.remove('hidden');
  }
  unlockStep(3);
}

function relightCandles() {
  candlesBlown = false;
  localStorage.removeItem('cakeBlown');
  for (let i = 1; i <= 4; i++) {
    const flame = document.getElementById('flame' + i);
    const smoke = document.getElementById('smoke' + i);
    if (flame) flame.classList.remove('extinguished');
    if (smoke) smoke.classList.remove('active');
  }

  const statusText = document.getElementById('flameStatusText');
  if (statusText) {
    statusText.innerHTML = '🕯️ The candles are burning bright! Make a wish...';
    statusText.style.color = 'var(--gold)';
  }

  const relightBtn = document.getElementById('relightBtn');
  if (relightBtn) relightBtn.classList.add('hidden');

  playAudioFx('flip');
  showToast('✨ Candles relit with fresh magic!');
}

async function startMicBlowDetection() {
  if (candlesBlown) {
    relightCandles();
  }

  const micBtnText = document.getElementById('micBtnText');
  if (isListeningMic) {
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    isListeningMic = false;
    if (micBtnText) micBtnText.textContent = 'Use Real Mic Blow';
    showToast('Mic blow detection stopped.');
    return;
  }

  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    micAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = micAudioContext.createMediaStreamSource(micStream);
    micAnalyser = micAudioContext.createAnalyser();
    micAnalyser.fftSize = 256;
    source.connect(micAnalyser);

    isListeningMic = true;
    if (micBtnText) micBtnText.textContent = 'Listening... Blow now! 🎙️';
    showToast('🎙️ Mic active! Blow softly near your device microphone!');

    const bufferLength = micAnalyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkBlow() {
      if (!isListeningMic || candlesBlown) return;
      micAnalyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;

      // Threshold for blow noise detection
      if (average > 55) {
        blowOutCandles(false);
      } else {
        requestAnimationFrame(checkBlow);
      }
    }
    checkBlow();

  } catch (err) {
    console.error('Mic access denied or error:', err);
    showToast('⚠️ Mic access denied. You can still tap the Blow button!');
    if (micBtnText) micBtnText.textContent = 'Use Real Mic Blow';
  }
}

// =====================================================
// 4. ₹500 GIFT VAULT & WHATSAPP ORDER DISPATCH
// =====================================================
const MAX_BUDGET = 500;

const GIFT_CATALOG = [
  {
    id: 'coldbrew',
    title: 'Artisanal Cold Brew & Cookies',
    price: 220,
    badge: '⭐ Daily Fuel',
    emoji: '☕',
    desc: 'Rich gourmet chilled brew paired with crunchy artisanal cookies for late-night inspiration.'
  },
  {
    id: 'chocolates',
    title: 'Belgian Truffle Chocolate Box',
    price: 350,
    badge: '🍫 Sweet Tooth',
    emoji: '🍫',
    desc: 'Assorted handcrafted luxury dark & milk Belgian pralines that melt in your mouth.'
  },
  {
    id: 'bestseller_book',
    title: 'Bestseller Book / Manga of Choice',
    price: 380,
    badge: '📚 Page Turner',
    emoji: '📖',
    desc: 'Any sci-fi, fantasy, tech, or manga paperback title you’ve been dying to read next.'
  },
  {
    id: 'desk_plant',
    title: 'Aesthetic Desk Plant / Succulent',
    price: 250,
    badge: '🌿 Chill Vibe',
    emoji: '🪴',
    desc: 'A gorgeous easy-care green succulent in a minimalist ceramic pot to elevate your desk setup.'
  },
  {
    id: 'pizza_craving',
    title: 'Midnight Swiggy / Zomato Pizza',
    price: 400,
    badge: '🍕 Midnight Craving',
    emoji: '🍕',
    desc: 'Cheesy hot pizza of your choice delivered whenever the next 1 AM craving hits!'
  },
  {
    id: 'scented_candle',
    title: 'Lavender Scented Candle & Fairy Lights',
    price: 290,
    badge: '🌸 Zen Aura',
    emoji: '🕯️',
    desc: 'Soothing aromatherapy soy candle + warm starry fairy lights for cozy evenings.'
  },
  {
    id: 'movie_combo',
    title: 'Movie Ticket + Tub of Caramel Popcorn',
    price: 350,
    badge: '🎬 Blockbuster',
    emoji: '🍿',
    desc: 'One ticket to your most anticipated cinema release + giant tub of sweet crunchy popcorn.'
  },
  {
    id: 'custom_wish',
    title: 'Custom Mystery Wish (You Name It!)',
    price: 500,
    badge: '✨ Total Freedom',
    emoji: '🎁',
    desc: 'Anything specific you want under ₹500 — write in the order note and your friend will get it!'
  }
];

let cart = {}; // { itemId: qty }

// Initialize cart from localStorage if not already claimed
if (localStorage.getItem('giftVaultCheckedOut') !== 'true') {
  if (localStorage.getItem('giftVaultCart')) {
    try {
      cart = JSON.parse(localStorage.getItem('giftVaultCart')) || {};
    } catch (e) {
      cart = {};
    }
  }
}

function isGiftVaultClaimed() {
  return localStorage.getItem('giftVaultCheckedOut') === 'true';
}

function renderGiftCatalog() {
  const grid = document.getElementById('giftsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const claimed = isGiftVaultClaimed();

  GIFT_CATALOG.forEach(gift => {
    const qty = cart[gift.id] || 0;
    const card = document.createElement('div');
    card.className = `gift-card ${claimed ? 'claimed-card-mode' : ''}`;
    card.id = `gift-card-${gift.id}`;
    card.innerHTML = `
      <div class="gift-card-badge">${claimed ? '🌟 Spree Claimed' : gift.badge}</div>
      <div class="gift-emoji-container">${gift.emoji}</div>
      <h3>${gift.title}</h3>
      <p>${gift.desc}</p>
      <div class="gift-footer">
        <div class="gift-price">₹${gift.price}</div>
        <div class="gift-actions-slot">
          ${claimed ? `
            <button class="gift-action-btn" style="opacity: 0.7; cursor: default; background: rgba(16, 185, 129, 0.2); border-color: var(--emerald); color: var(--emerald);" disabled>
              <span>✓ Claimed in Spree</span>
            </button>
          ` : qty > 0 ? `
            <div class="gift-qty-controls">
              <button class="qty-btn" onclick="updateCartItemQty('${gift.id}', -1)" aria-label="Decrease quantity">-</button>
              <span class="qty-count">${qty}</span>
              <button class="qty-btn" onclick="updateCartItemQty('${gift.id}', 1)" aria-label="Increase quantity">+</button>
            </div>
          ` : `
            <button class="gift-action-btn" onclick="addGiftToCart('${gift.id}')">
              <span>+ Add to Cart</span>
            </button>
          `}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  bindHoverCursors();
}

function calculateCartTotal() {
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const item = GIFT_CATALOG.find(g => g.id === id);
    if (item) total += item.price * qty;
  }
  return total;
}

function calculateCartCount() {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function addGiftToCart(id) {
  if (isGiftVaultClaimed()) {
    showToast('🎁 Your ₹500 Gift Vault reward is already claimed!');
    return;
  }

  const item = GIFT_CATALOG.find(g => g.id === id);
  if (!item) return;

  const currentTotal = calculateCartTotal();
  if (currentTotal + item.price > MAX_BUDGET) {
    showToast(`⚠️ Adding this would exceed your ₹500 budget! (Total: ₹${currentTotal + item.price})`);
    playAudioFx('pop');
    return;
  }

  cart[id] = (cart[id] || 0) + 1;
  localStorage.setItem('giftVaultCart', JSON.stringify(cart));
  playAudioFx('coin');
  updateBudgetAndCartUI();
  showToast(`🎁 Added "${item.title}" to your gift cart!`);
}

function updateCartItemQty(id, delta) {
  if (isGiftVaultClaimed()) return;

  const item = GIFT_CATALOG.find(g => g.id === id);
  if (!item) return;

  const currentQty = cart[id] || 0;
  const newQty = currentQty + delta;

  if (delta > 0) {
    const currentTotal = calculateCartTotal();
    if (currentTotal + item.price > MAX_BUDGET) {
      showToast(`⚠️ Exceeds ₹500 budget limit! (Remaining: ₹${MAX_BUDGET - currentTotal})`);
      playAudioFx('pop');
      return;
    }
  }

  if (newQty <= 0) {
    delete cart[id];
  } else {
    cart[id] = newQty;
  }

  localStorage.setItem('giftVaultCart', JSON.stringify(cart));
  playAudioFx(delta > 0 ? 'coin' : 'pop');
  updateBudgetAndCartUI();
}

function renderClaimedVaultView() {
  const claimedView = document.getElementById('claimedVaultView');
  if (!claimedView) return;

  if (!isGiftVaultClaimed()) {
    claimedView.classList.add('hidden');
    return;
  }

  claimedView.classList.remove('hidden');

  let orderData = activeOrderData;
  if (!orderData && localStorage.getItem('giftVaultActiveOrder')) {
    try {
      orderData = JSON.parse(localStorage.getItem('giftVaultActiveOrder'));
      activeOrderData = orderData;
    } catch (e) {}
  }

  if (!orderData) return;

  const metaEl = document.getElementById('claimedOrderMeta');
  if (metaEl) {
    metaEl.innerHTML = `
      <div class="claimed-meta-item">
        <span class="claimed-meta-label">Order Reference</span>
        <span class="claimed-meta-val">#${orderData.orderId}</span>
      </div>
      <div class="claimed-meta-item">
        <span class="claimed-meta-label">Claimed On</span>
        <span class="claimed-meta-val">${orderData.dateStr}</span>
      </div>
      <div class="claimed-meta-item">
        <span class="claimed-meta-label">Total Value Claimed</span>
        <span class="claimed-meta-val text-gold">₹${orderData.total} (Free Birthday Spree)</span>
      </div>
      <div class="claimed-meta-item">
        <span class="claimed-meta-label">Deliver To</span>
        <span class="claimed-meta-val">${orderData.recipientName}</span>
      </div>
      <div class="claimed-meta-item">
        <span class="claimed-meta-label">Location</span>
        <span class="claimed-meta-val">${orderData.deliveryAddress}</span>
      </div>
    `;
  }

  const itemsGrid = document.getElementById('claimedItemsGrid');
  if (itemsGrid && orderData.items) {
    itemsGrid.innerHTML = orderData.items.map(item => `
      <div class="claimed-item-card">
        <div class="claimed-item-emoji">${item.emoji}</div>
        <div class="claimed-item-info">
          <div class="claimed-item-title">${item.title} (×${item.qty})</div>
          <div class="claimed-item-price">₹${item.itemTotal}</div>
        </div>
      </div>
    `).join('');
  }
}

function updateBudgetAndCartUI() {
  const claimed = isGiftVaultClaimed();

  if (claimed) {
    // If already checked out, reset money/balance to ₹0 as requested
    let orderTotal = 500;
    if (activeOrderData && activeOrderData.total) {
      orderTotal = activeOrderData.total;
    } else if (localStorage.getItem('giftVaultActiveOrder')) {
      try {
        const d = JSON.parse(localStorage.getItem('giftVaultActiveOrder'));
        if (d && d.total) orderTotal = d.total;
      } catch (e) {}
    }

    const totalEl = document.getElementById('budgetCartTotal');
    const remEl = document.getElementById('budgetRemaining');
    const progressEl = document.getElementById('budgetProgressBar');
    const alertEl = document.getElementById('budgetAlert');
    const navPill = document.getElementById('navBudgetPill');

    if (totalEl) totalEl.textContent = `₹${orderTotal.toFixed(2)}`;
    if (remEl) remEl.textContent = `₹0.00`;
    if (progressEl) {
      progressEl.style.width = '100%';
      progressEl.classList.add('maxed');
    }
    if (navPill) {
      navPill.textContent = 'Claimed ✅';
      navPill.classList.add('claimed');
    }

    if (alertEl) {
      alertEl.innerHTML = `🎉 <strong>Reward Already Claimed!</strong> Your ₹500 Birthday Spree is confirmed (Order #${activeOrderData ? activeOrderData.orderId : 'BFF-CLAIMED'}).`;
      alertEl.style.color = 'var(--emerald)';
    }

    // Hide floating cart
    const floatingCta = document.getElementById('floatingCartCta');
    if (floatingCta) floatingCta.classList.remove('visible');

    // Hide countdown timer banner
    const timerBanner = document.getElementById('storeCountdownBanner');
    if (timerBanner) timerBanner.classList.add('hidden');

    renderClaimedVaultView();
    renderGiftCatalog();
    return;
  }

  // Not claimed - active shopping spree
  const total = calculateCartTotal();
  const remaining = MAX_BUDGET - total;
  const count = calculateCartCount();
  const pct = Math.min(100, (total / MAX_BUDGET) * 100);

  // Budget Tracker Banner
  const totalEl = document.getElementById('budgetCartTotal');
  const remEl = document.getElementById('budgetRemaining');
  const progressEl = document.getElementById('budgetProgressBar');
  const alertEl = document.getElementById('budgetAlert');
  const navPill = document.getElementById('navBudgetPill');

  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  if (remEl) remEl.textContent = `₹${remaining.toFixed(2)}`;
  if (progressEl) {
    progressEl.style.width = `${pct}%`;
    progressEl.classList.toggle('maxed', total === MAX_BUDGET);
  }
  if (navPill) {
    navPill.textContent = `₹${remaining} Left`;
    navPill.classList.remove('claimed');
  }

  if (alertEl) {
    if (total === 0) {
      alertEl.textContent = '✨ You have ₹500 to spend! Add your favorite treats below.';
      alertEl.style.color = 'var(--gold)';
    } else if (total === MAX_BUDGET) {
      alertEl.textContent = '🌟 Perfect ₹500 combo! Ready to checkout & claim your gifts!';
      alertEl.style.color = 'var(--emerald)';
    } else {
      alertEl.textContent = `💫 ₹${remaining} remaining! You can still add more items!`;
      alertEl.style.color = 'var(--cyan)';
    }
  }

  // Header Cart Badge
  const countBadge = document.getElementById('cartCountBadge');
  if (countBadge) countBadge.textContent = count;

  // Floating CTA
  const floatingCta = document.getElementById('floatingCartCta');
  const floatingCount = document.getElementById('floatingCartCount');
  const floatingTotal = document.getElementById('floatingCartTotal');
  if (floatingCta) {
    if (count > 0) {
      floatingCta.classList.add('visible');
      if (floatingCount) floatingCount.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
      if (floatingTotal) floatingTotal.textContent = `₹${total}`;
    } else {
      floatingCta.classList.remove('visible');
    }
  }

  // Drawer details
  renderDrawerItems(total, remaining, count, pct);

  // Re-render catalog action buttons
  renderGiftCatalog();
}

function renderDrawerItems(total, remaining, count, pct) {
  const drawerCount = document.getElementById('drawerCartCount');
  const drawerBalance = document.getElementById('drawerBalanceText');
  const drawerFill = document.getElementById('drawerProgressFill');
  const drawerSum = document.getElementById('drawerTotalSum');
  const checkoutBtn = document.getElementById('proceedCheckoutBtn');
  const container = document.getElementById('cartItemsList');

  if (drawerCount) drawerCount.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
  if (drawerBalance) drawerBalance.textContent = `₹${remaining.toFixed(2)} left`;
  if (drawerFill) drawerFill.style.width = `${pct}%`;
  if (drawerSum) drawerSum.textContent = `₹${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = count === 0;

  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-emoji">🎁</div>
        <h4>Your gift cart is empty!</h4>
        <p>Explore the ₹500 Gift Vault and pick whatever you love.</p>
        <button class="btn btn-primary btn-sm" onclick="closeCartDrawer()">Browse Gifts</button>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  for (const [id, qty] of Object.entries(cart)) {
    const item = GIFT_CATALOG.find(g => g.id === id);
    if (!item) continue;

    const row = document.createElement('div');
    row.className = 'drawer-cart-item';
    row.innerHTML = `
      <div class="drawer-item-emoji">${item.emoji}</div>
      <div class="drawer-item-details">
        <div class="drawer-item-title">${item.title}</div>
        <div class="drawer-item-price">₹${item.price} × ${qty} = ₹${item.price * qty}</div>
      </div>
      <div class="gift-qty-controls">
        <button class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)">-</button>
        <span class="qty-count">${qty}</span>
        <button class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)">+</button>
      </div>
    `;
    container.appendChild(row);
  }
}

// Drawer toggles
function openCartDrawer() {
  document.getElementById('cartOverlay')?.classList.add('active');
  document.getElementById('cartDrawer')?.classList.add('active');
  playAudioFx('flip');
}

function closeCartDrawer() {
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.getElementById('cartDrawer')?.classList.remove('active');
}

document.getElementById('cartBtn')?.addEventListener('click', openCartDrawer);

// Checkout Modal
function openCheckoutModal() {
  closeCartDrawer();
  if (isGiftVaultClaimed()) {
    openReceiptModalFromData();
    return;
  }

  const total = calculateCartTotal();
  if (total === 0) {
    showToast('Your cart is empty! Pick some gifts first.');
    return;
  }

  const previewBox = document.getElementById('checkoutOrderPreview');
  if (previewBox) {
    let html = '<div style="font-weight:800; margin-bottom:8px; color:var(--gold);">Order Summary:</div>';
    for (const [id, qty] of Object.entries(cart)) {
      const item = GIFT_CATALOG.find(g => g.id === id);
      if (item) {
        html += `
          <div class="preview-item-row">
            <span>${item.emoji} ${item.title} (×${qty})</span>
            <span class="font-mono">₹${item.price * qty}</span>
          </div>
        `;
      }
    }
    html += `
      <div class="preview-item-row" style="border-top:1px dashed rgba(255,255,255,0.2); margin-top:8px; padding-top:8px; font-weight:800;">
        <span>Total Gift Value:</span>
        <span class="font-mono text-gold">₹${total} (Free for Birthday Star!)</span>
      </div>
    `;
    previewBox.innerHTML = html;
  }

  document.getElementById('checkoutModalOverlay')?.classList.add('active');
  playAudioFx('flip');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModalOverlay')?.classList.remove('active');
}

// Active Order Details for WhatsApp / Invoice
let activeOrderData = null;

function handlePlaceOrder(e) {
  e.preventDefault();

  const recipientName = document.getElementById('recipientName').value.trim() || 'Birthday Star';
  const deliveryAddress = document.getElementById('deliveryAddress').value.trim() || 'Direct handoff';
  const customNotes = document.getElementById('customPreferences').value.trim() || 'None';
  const friendPhone = document.getElementById('friendPhone').value.trim();

  const orderId = `BFF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const total = calculateCartTotal();

  const itemsList = [];
  for (const [id, qty] of Object.entries(cart)) {
    const item = GIFT_CATALOG.find(g => g.id === id);
    if (item) itemsList.push({ ...item, qty, itemTotal: item.price * qty });
  }

  activeOrderData = {
    orderId,
    dateStr,
    recipientName,
    deliveryAddress,
    customNotes,
    friendPhone,
    total,
    items: itemsList
  };

  // Persist order state and mark as checked out
  localStorage.setItem('giftVaultActiveOrder', JSON.stringify(activeOrderData));
  localStorage.setItem('giftVaultCheckedOut', 'true');
  localStorage.removeItem('giftVaultCart');
  cart = {};

  // Stop countdown timer banner
  if (storeTimerInterval) {
    clearInterval(storeTimerInterval);
    storeTimerInterval = null;
  }
  document.getElementById('storeCountdownBanner')?.classList.add('hidden');

  closeCheckoutModal();
  renderGoldenReceipt(activeOrderData);
  document.getElementById('receiptModalOverlay')?.classList.add('active');

  // Update Store view immediately to Claimed State
  updateBudgetAndCartUI();
  renderClaimedVaultView();

  createConfetti();
  playAudioFx('fanfare');
  showToast('🎉 Order created! Send it to your friend on WhatsApp to fulfill!', 4000);

  // Show transition buttons and unlock next step (VIP Vouchers)
  const receiptProceed = document.getElementById('receiptProceedBtn');
  if (receiptProceed) receiptProceed.style.display = 'block';
  
  const storeTransition = document.getElementById('storeTransition');
  if (storeTransition) storeTransition.classList.remove('hidden');
  
  unlockStep(5);
  updateJourneyTracker();
}

function renderGoldenReceipt(data) {
  if (!data) return;
  document.getElementById('receiptOrderId').textContent = `ORDER #${data.orderId}`;
  document.getElementById('receiptDate').textContent = data.dateStr;
  document.getElementById('receiptSubtotal').textContent = `₹${data.total}`;

  const itemsListEl = document.getElementById('receiptItemsList');
  if (itemsListEl && data.items) {
    itemsListEl.innerHTML = data.items.map(item => `
      <div class="receipt-item-row">
        <span>${item.emoji} ${item.title} × ${item.qty}</span>
        <span>₹${item.itemTotal}</span>
      </div>
    `).join('');
  }

  const addrBox = document.getElementById('receiptAddressBox');
  if (addrBox) {
    addrBox.innerHTML = `
      <div><strong>Deliver To:</strong> ${data.recipientName}</div>
      <div><strong>Location:</strong> ${data.deliveryAddress}</div>
      ${data.customNotes && data.customNotes !== 'None' ? `<div><strong>Note:</strong> ${data.customNotes}</div>` : ''}
    `;
  }
}

function openReceiptModalFromData() {
  if (!activeOrderData && localStorage.getItem('giftVaultActiveOrder')) {
    try {
      activeOrderData = JSON.parse(localStorage.getItem('giftVaultActiveOrder'));
    } catch (e) {}
  }
  if (activeOrderData) {
    renderGoldenReceipt(activeOrderData);
    document.getElementById('receiptModalOverlay')?.classList.add('active');
    playAudioFx('flip');
  } else {
    showToast('No receipt found yet. Pick some gifts first!');
  }
}

function closeReceiptModal() {
  document.getElementById('receiptModalOverlay')?.classList.remove('active');
}

function dispatchOrderToWhatsApp() {
  if (!activeOrderData) return;

  const itemsText = activeOrderData.items.map(i => `• ${i.emoji} ${i.title} (Qty: ${i.qty}) - ₹${i.itemTotal}`).join('\n');
  const message = 
`🎂 *BIRTHDAY GIFT VAULT ORDER* 🎁
Order ID: #${activeOrderData.orderId}
Date: ${activeOrderData.dateStr}

Hey bestie! Here are the gifts I selected from my ₹500 Birthday Vault:

${itemsText}

💰 *Total Value:* ₹${activeOrderData.total}
📍 *Delivery Location:* ${activeOrderData.deliveryAddress}
📝 *Notes/Preferences:* ${activeOrderData.customNotes}

Thank you so much for the best birthday treat ever! ❤️🚀`;

  const encodedMsg = encodeURIComponent(message);
  let waUrl = `https://wa.me/?text=${encodedMsg}`;
  if (activeOrderData.friendPhone) {
    const cleanedPhone = activeOrderData.friendPhone.replace(/\D/g, '');
    waUrl = `https://wa.me/${cleanedPhone}?text=${encodedMsg}`;
  }

  window.open(waUrl, '_blank');
  showToast('📲 WhatsApp link opened!');
}

function copyOrderDetailsToClipboard() {
  if (!activeOrderData) return;
  const itemsText = activeOrderData.items.map(i => `• ${i.emoji} ${i.title} (Qty: ${i.qty}) - ₹${i.itemTotal}`).join('\n');
  const text = 
`🎂 BIRTHDAY GIFT ORDER #${activeOrderData.orderId}
Items:
${itemsText}
Total: ₹${activeOrderData.total}
Location: ${activeOrderData.deliveryAddress}
Note: ${activeOrderData.customNotes}`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Order summary copied to clipboard!');
  }).catch(() => {
    showToast('Order details ready!');
  });
}

// =====================================================
// 5. SCRATCH & WIN VIP FRIENDSHIP COUPONS
// =====================================================
let scratchCardsInitialized = false;
let scratchCardsRevealed = [false, false, false];

function checkAllCardsScratched() {
  if (scratchCardsRevealed.every(val => val === true)) {
    const couponsTransition = document.getElementById('couponsTransition');
    if (couponsTransition) {
      couponsTransition.classList.remove('hidden');
    }
    unlockStep(6);
  }
}

function initScratchCards() {
  if (scratchCardsInitialized) return;
  scratchCardsInitialized = true;

  for (let i = 1; i <= 3; i++) {
    const canvas = document.getElementById('scratchCanvas' + i);
    const hint = document.getElementById('scratchHint' + i);
    if (!canvas) continue;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;

    // Fill with metallic silver / violet foil
    function fillOverlay() {
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add shimmer pattern
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#6b7280');
      grad.addColorStop(0.3, '#d1d5db');
      grad.addColorStop(0.5, '#f3f4f6');
      grad.addColorStop(0.7, '#9ca3af');
      grad.addColorStop(1, '#4b5563');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#374151';
      ctx.font = 'bold 16px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ SCRATCH TO REVEAL ✨', canvas.width / 2, canvas.height / 2);
    }
    fillOverlay();

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      if (hint) hint.style.display = 'none';

      // Check scratched percentage
      if (!isRevealed) {
        checkScratched();
      }
    }

    function checkScratched() {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let transparentPixels = 0;
        for (let j = 3; j < data.length; j += 4) {
          if (data[j] === 0) transparentPixels++;
        }
        const pct = transparentPixels / (canvas.width * canvas.height);
        if (pct > 0.42) {
          isRevealed = true;
          scratchCardsRevealed[i - 1] = true;
          canvas.style.transition = 'opacity 0.6s ease';
          canvas.style.opacity = '0';
          setTimeout(() => { canvas.style.display = 'none'; }, 600);
          playAudioFx('coin');
          createConfetti();
          showToast('🎟️ VIP Friendship Voucher Unlocked!', 3000);
          checkAllCardsScratched();
        }
      } catch (e) {}
    }

    // Mouse events
    canvas.addEventListener('mousedown', e => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    });

    window.addEventListener('mousemove', e => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    });

    window.addEventListener('mouseup', () => { isDrawing = false; });

    // Touch events for mobile
    canvas.addEventListener('touchstart', e => {
      isDrawing = true;
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      if (!isDrawing) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener('touchend', () => { isDrawing = false; });
  }
}

// =====================================================
// 6. BFF DEVELOPER TERMINAL (~_ dev_cli)
// =====================================================
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalInput = document.getElementById('terminalInput');
const terminalHistory = document.getElementById('terminalHistory');
let cmdHistory = [];
let historyIndex = -1;

function openTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.classList.add('active');
  playAudioFx('flip');
  setTimeout(() => terminalInput && terminalInput.focus(), 100);
}

function closeTerminal() {
  if (!terminalOverlay) return;
  terminalOverlay.classList.remove('active');
}

document.getElementById('terminalToggleBtn')?.addEventListener('click', openTerminal);

// Global hotkey: press '~' or '`' to open terminal
window.addEventListener('keydown', e => {
  if (e.key === '`' || e.key === '~') {
    if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
      return;
    }
    e.preventDefault();
    if (terminalOverlay?.classList.contains('active')) {
      closeTerminal();
    } else {
      openTerminal();
    }
  } else if (e.key === 'Escape' && terminalOverlay?.classList.contains('active')) {
    closeTerminal();
  }
});

const TERMINAL_COMMANDS = {
  help: () => `
<span class="term-highlight">Available Commands:</span>
  • <span class="cmd-badge">git log</span>             - View our friendship version history
  • <span class="cmd-badge">cat friendship.json</span> - Print friendship environment config
  • <span class="cmd-badge">npm run be-awesome</span>   - Execute birthday cheer sequence
  • <span class="cmd-badge">hack_heart</span>          - Decrypt friendship love cipher
  • <span class="cmd-badge">matrix</span>              - Run green matrix stream effect
  • <span class="cmd-badge">sudo love</span>           - Grant root BFF privileges
  • <span class="cmd-badge">roast</span>               - Generate a friendly developer roast
  • <span class="cmd-badge">compliment</span>          - Generate a sweet developer compliment
  • <span class="cmd-badge">claim_gift</span>          - Jump to the ₹500 Gift Vault
  • <span class="cmd-badge">blow_candle</span>         - Extinguish the cake candles
  • <span class="cmd-badge">clear</span>               - Clear the terminal console
  • <span class="cmd-badge">exit</span>                - Close the terminal window
`,
  'git log': () => `
<span class="term-highlight">commit 9fa83bc (HEAD -> main, origin/main)</span>
Author: Your Best Friend &lt;bff@heart.local&gt;
Date:   Thu Aug 27 00:00:00 2026 +0530
    feat: celebrate another year of unstoppable genius and laughs! 🎂

<span class="term-highlight">commit 4c82e01</span>
Author: Your Best Friend &lt;bff@heart.local&gt;
Date:   Sat May 10 01:23:45 2025 +0530
    fix: midnight existential crisis resolved via 2AM chai & gossip

<span class="term-highlight">commit 1b04a9f</span>
Author: Your Best Friend &lt;bff@heart.local&gt;
Date:   Wed Jan 15 12:00:00 2020 +0530
    feat: initial commit (forever friends established)
`,
  'cat friendship.json': () => `
{
  <span class="term-highlight">"bff_status"</span>: "PERMANENT_UNCONDITIONAL",
  <span class="term-highlight">"compatibility"</span>: 100.0,
  <span class="term-highlight">"favorite_activities"</span>: ["Road trips", "Midnight snacks", "Roasting everyone", "Deep talks"],
  <span class="term-highlight">"shared_secrets"</span>: "ENCRYPTED_AES256_SAFE",
  <span class="term-highlight">"gift_vault_balance"</span>: "₹500.00 INR",
  <span class="term-highlight">"uptime"</span>: "100.00% (Zero downtime)"
}
`,
  'npm run be-awesome': () => {
    createConfetti();
    playAudioFx('fanfare');
    return `
> bff-universe@2.4.0 be-awesome
> executing infinite joy and victory fanfare...

[OK] 1000 happiness packets dispatched!
[OK] Birthday Star elevated to highest tier! 🚀✨
`;
  },
  hack_heart: () => {
    createConfetti();
    return `
<span style="color:var(--pink);">
  [✔] Connecting to BFF mainframe...
  [✔] Bypassing grumpy firewall...
  [✔] Injecting unlimited hugs and chai credits...
  [✔] HACK SUCCESSFUL! You are 100% loved forever! ❤️
</span>
`;
  },
  'sudo love': () => `
[sudo] password for bff: **********
Permission Granted. You have full ROOT administrative control over my time, advice, and snack supply!
`,
  roast: () => `🌶️ <span style="color:var(--gold);">Roast:</span> You complain about bugs, yet you still stay up till 3 AM reading code and eating Maggi. You are the final boss of chaos! 😂`,
  compliment: () => `💖 <span style="color:var(--pink);">Compliment:</span> Your intelligence and humor are the kind of combination they write songs about. Truly 1 in 8 billion! ✨`,
  claim_gift: () => {
    closeTerminal();
    document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' });
    return 'Navigating to ₹500 Gift Vault...';
  },
  blow_candle: () => {
    blowOutCandles();
    return 'Extinguishing candles on the cake... Done!';
  },
  matrix: () => {
    return `<span style="color:#22c55e;">
01001000 01100001 01110000 01110000 01111001 00100000 01000010 01101001 
01110010 01110100 01101000 01100100 01100001 01111001 00100001 
(Binary translation: Happy Birthday!)
</span>`;
  },
  clear: () => {
    if (terminalHistory) terminalHistory.innerHTML = '';
    return null;
  },
  exit: () => {
    closeTerminal();
    return 'Goodbye!';
  }
};

if (terminalInput) {
  terminalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const rawCmd = terminalInput.value.trim();
      const cmd = rawCmd.toLowerCase();
      if (!rawCmd) return;

      cmdHistory.push(rawCmd);
      historyIndex = cmdHistory.length;

      // Add to output
      const line = document.createElement('div');
      line.innerHTML = `<span class="term-prompt">bff@birthday-machine:~$</span> ${rawCmd}`;
      terminalHistory.appendChild(line);

      let response;
      if (TERMINAL_COMMANDS[cmd]) {
        response = TERMINAL_COMMANDS[cmd]();
      } else {
        response = `<span style="color:#ef4444;">bash: command not found: ${rawCmd}. Type <code class="cmd-badge">help</code> for a list of commands.</span>`;
      }

      if (response) {
        const respEl = document.createElement('div');
        respEl.innerHTML = response;
        terminalHistory.appendChild(respEl);
      }

      terminalInput.value = '';
      const body = document.getElementById('terminalBody');
      if (body) body.scrollTop = body.scrollHeight;
      playAudioFx('pop');
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = cmdHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < cmdHistory.length - 1) {
        historyIndex++;
        terminalInput.value = cmdHistory[historyIndex] || '';
      } else {
        historyIndex = cmdHistory.length;
        terminalInput.value = '';
      }
    }
  });
}

// =====================================================
// 7. AI DEV COMPLIMENT & ROAST GENERATOR
// =====================================================
const COMPLIMENTS = {
  sweet: [
    `"You're like clean, well-commented code: extremely rare, deeply appreciated, and universally admired." ✨`,
    `"If friendship was an open-source repo, you would have 100k GitHub stars and zero open issues!" 🌟`,
    `"Your smile has a lower latency and higher hit rate than a Redis cache on high-speed memory!" 💖`,
    `"Thank you for being the most dependable human on Earth. Zero memory leaks, pure unconditional love." 🥂`
  ],
  roast: [
    `"You have 47 browser tabs open right now and you know you're not going to read 46 of them." 😂`,
    `"You say 'I will sleep early today' with the same confidence as someone pushing straight to main without testing." 🌶️`,
    `"Your debugging strategy is 90% console.log('PLEASE WORK PLEASE') and 10% staring blankly." 😆`,
    `"You're the only person who can spend 2 hours picking what to watch and fall asleep 5 minutes into the movie." 🍿`
  ],
  dev: [
    `"Status: 200 OK — You are the best exception handling block in my life's try-catch." ⚡`,
    `"while (true) { cheerForYou(); drinkChai(); celebrate(); }" ☕`,
    `"const bff = new BestFriend({ loyalty: Infinity, humor: 100, awesomeness: 'MAX' });" 💻`,
    `"git commit -m 'Fixed all sadness, added unlimited birthday joy'" 🚀`
  ]
};

function generateDevCompliment(type) {
  const pool = COMPLIMENTS[type] || COMPLIMENTS.sweet;
  const quote = pool[Math.floor(Math.random() * pool.length)];
  const display = document.getElementById('complimentDisplay');
  if (display) {
    display.style.opacity = '0';
    setTimeout(() => {
      display.innerHTML = `
        <p class="code-comment">// Output stream [${type.toUpperCase()}_MODE]</p>
        <h3 class="compliment-text">${quote}</h3>
      `;
      display.style.opacity = '1';
    }, 200);
  }
  playAudioFx('coin');
}

// =====================================================
// 8. 3-LEVEL BIRTHDAY ARCADE
// =====================================================
const levelUnlocked = [true, false, false];

function selectLevel(num) {
  const idx = num - 1;
  if (!levelUnlocked[idx]) {
    showToast('🔒 Complete the previous level first to unlock this stage!');
    playAudioFx('pop');
    return;
  }

  document.querySelectorAll('.level-btn').forEach((btn, i) => {
    btn.classList.remove('active');
    if (i === idx) btn.classList.add('active');
  });

  document.querySelectorAll('.game-level').forEach(lvl => lvl.classList.add('hidden'));
  document.getElementById('level' + num)?.classList.remove('hidden');

  playAudioFx('flip');
  if (num === 1 && !memoryInitialized) initMemoryGame();
  if (num === 2 && !quizInitialized) initQuiz();
  if (num === 3) initBalloonGame();
}

function unlockNextLevel(nextNum) {
  levelUnlocked[nextNum - 1] = true;
  const btn = document.getElementById('lvl' + nextNum + 'Btn');
  if (btn) {
    btn.classList.remove('locked');
    btn.classList.add('unlocked');
  }
  const status = document.getElementById('lvl' + nextNum + 'Status');
  if (status) status.textContent = '✅';

  showToast(`🎉 Level ${nextNum} Unlocked!`, 3000);
  playAudioFx('fanfare');
  setTimeout(() => selectLevel(nextNum), 500);
}

/* LEVEL 1: Memory Card Match */
const cardEmojis = ['🎂', '🎈', '🎁', '⭐', '🌸', '🦋', '🌈', '💫'];
let cards = [...cardEmojis, ...cardEmojis];
let flipped = [], matched = 0, flips = 0, canFlip = true;
let gameTimerInterval, gameSeconds = 0;
let memoryInitialized = false;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initMemoryGame() {
  memoryInitialized = true;
  renderCards();
  startGameTimer();
}

function renderCards() {
  const grid = document.getElementById('cardGrid');
  if (!grid) return;
  grid.innerHTML = '';
  shuffle(cards);
  flipped = []; matched = 0; flips = 0; gameSeconds = 0;
  updateCardStats();

  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.emoji = emoji;
    card.dataset.index = i;
    card.innerHTML = `
      <div class="card-front"><span>?</span></div>
      <div class="card-back">${emoji}</div>
    `;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
  bindHoverCursors();
}

function flipCard(card) {
  if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flipped.push(card);
  flips++;
  playAudioFx('flip');
  updateCardStats();

  if (flipped.length === 2) {
    canFlip = false;
    const [a, b] = flipped;
    if (a.dataset.emoji === b.dataset.emoji) {
      setTimeout(() => {
        a.classList.add('matched');
        b.classList.add('matched');
        matched++;
        playAudioFx('coin');
        document.getElementById('matchCount').textContent = matched + '/8';
        flipped = [];
        canFlip = true;
        if (matched === 8) showMemoryWin();
      }, 350);
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flipped = [];
        canFlip = true;
      }, 850);
    }
  }
}

function updateCardStats() {
  const fEl = document.getElementById('flipCount');
  const mEl = document.getElementById('matchCount');
  if (fEl) fEl.textContent = flips;
  if (mEl) mEl.textContent = matched + '/8';
}

function startGameTimer() {
  clearInterval(gameTimerInterval);
  gameSeconds = 0;
  gameTimerInterval = setInterval(() => {
    gameSeconds++;
    const tEl = document.getElementById('gameTimer');
    if (tEl) tEl.textContent = gameSeconds + 's';
  }, 1000);
}

function showMemoryWin() {
  clearInterval(gameTimerInterval);
  const stars = flips <= 16 ? '⭐⭐⭐' : flips <= 22 ? '⭐⭐' : '⭐';
  document.getElementById('starRating').textContent = stars;
  document.getElementById('winStats').textContent = `${flips} flips in ${gameSeconds} seconds! ${stars === '⭐⭐⭐' ? 'Godlike memory!' : 'Awesome run!'}`;
  document.getElementById('level1Win')?.classList.add('show');
  document.getElementById('lvl1Status').textContent = '✅';
  createConfetti();
  playAudioFx('fanfare');
}

function restartMemoryGame() {
  clearInterval(gameTimerInterval);
  renderCards();
  startGameTimer();
  document.getElementById('level1Win')?.classList.remove('show');
}

/* LEVEL 2: BFF Quiz */
const quizData = [
  {
    q: '🌅 Where did our friendship first kick off?',
    opts: ['At a party 🎉', 'At college / work 🎓', 'Through mutual friends 👥', 'Online / Discord 💻'],
    correct: 0,
    fun: 'The most legendary beginning ever!'
  },
  {
    q: '☕ What is my supreme comfort drink of choice?',
    opts: ['Espresso ☕', 'Kadak Chai 🍵', 'Hot Cocoa 🍫', 'Boba Tea 🧋'],
    correct: 1,
    fun: 'Chai o\'clock, every single day!'
  },
  {
    q: '🎬 Which genre guarantees we have a great movie night?',
    opts: ['Horror 👻', 'Comedy 😂', 'Sci-Fi Mind Benders 🚀', 'Action Thrillers 🍿'],
    correct: 1,
    fun: 'Because laughing until our stomachs hurt is mandatory!'
  },
  {
    q: '🌍 My ultimate dream vacation spot is?',
    opts: ['Tokyo, Japan 🇯🇵', 'Amalfi Coast, Italy 🇮🇹', 'Maldives 🏝️', 'Swiss Alps 🏔️'],
    correct: 2,
    fun: 'Clear water, sun, and zero emails!'
  },
  {
    q: '🍕 What is the uncontested 2 AM midnight food craving?',
    opts: ['Pizza 🍕', 'Biryani 🍛', 'Ice Cream 🍦', 'Maggi Noodles 🍜'],
    correct: 3,
    fun: '2 AM Maggi hits differently every single time!'
  },
  {
    q: '💪 What is my hidden superpower?',
    opts: ['Making people laugh 😊', 'Fast typing ⌨️', 'Napping anywhere 😴', 'Finishing web projects fast'],
    correct: 0,
    fun: 'Your infectious smile lights up every room!'
  },
  {
    q: '🎵 What music vibe rules our road trips?',
    opts: ['Indie & Acoustic 🎸', 'Bollywood Hits 🎶', 'Synthwave & EDM ⚡', '90s Nostalgia 💿'],
    correct: 3,
    fun: 'Nostalgia tracks on full volume with windows down!'
  },
  {
    q: '🎂 How many candles belong on your cake today?',
    opts: ['Count them yourself! 😆', 'Age is an immutable constant ✨', 'Still forever young 💫', 'Enough to summon fireworks 🔥'],
    correct: 2,
    fun: 'Forever young, brilliant, and iconic!'
  }
];

let currentQ = 0, quizScore = 0, quizInitialized = false;

function initQuiz() {
  quizInitialized = true;
  currentQ = 0;
  quizScore = 0;
  renderQuestion();
}

function renderQuestion() {
  const area = document.getElementById('quizArea');
  if (!area) return;
  if (currentQ >= quizData.length) { showQuizWin(); return; }

  const qd = quizData[currentQ];
  const pct = (currentQ / quizData.length) * 100;
  const pBar = document.getElementById('quizProgress');
  const pTxt = document.getElementById('quizProgressText');
  if (pBar) pBar.style.width = pct + '%';
  if (pTxt) pTxt.textContent = `Question ${currentQ + 1} / ${quizData.length}`;

  area.innerHTML = `
    <div class="quiz-question-card">
      <div class="quiz-q">${qd.q}</div>
      <div class="quiz-options">
        ${qd.opts.map((opt, i) => `
          <button class="quiz-opt" id="qopt${i}" onclick="answerQuiz(${i})">${opt}</button>
        `).join('')}
      </div>
      <div class="quiz-feedback" id="quizFeedback" style="display:none;"></div>
    </div>
  `;
  bindHoverCursors();
}

function answerQuiz(selected) {
  const qd = quizData[currentQ];
  const feedback = document.getElementById('quizFeedback');
  const opts = document.querySelectorAll('.quiz-opt');

  opts.forEach(o => o.disabled = true);
  opts[qd.correct].classList.add('correct');

  if (selected === qd.correct) {
    quizScore++;
    playAudioFx('coin');
    opts[selected].classList.add('correct');
    feedback.className = 'quiz-feedback correct-fb';
    feedback.textContent = '✅ Verified! ' + qd.fun;
  } else {
    playAudioFx('pop');
    opts[selected].classList.add('wrong');
    feedback.className = 'quiz-feedback wrong-fb';
    feedback.textContent = '❌ Almost! ' + qd.fun;
  }
  feedback.style.display = 'block';

  setTimeout(() => {
    currentQ++;
    renderQuestion();
  }, 1400);
}

function showQuizWin() {
  const pct = (quizScore / quizData.length) * 100;
  const stars = pct >= 80 ? '⭐⭐⭐' : pct >= 60 ? '⭐⭐' : '⭐';
  document.getElementById('quizWinText').textContent = `Score: ${quizScore}/${quizData.length}! ${pct >= 80 ? '100% Verified BFF Compatibility! 💖' : 'Pretty solid score, bestie!'}`;
  document.getElementById('quizStars').textContent = stars;
  document.getElementById('level2Win')?.classList.add('show');
  document.getElementById('lvl2Status').textContent = '✅';
  createConfetti();
  playAudioFx('fanfare');
}

/* LEVEL 3: Balloon Blitz */
const balloonTypes = [
  { emoji: '🎈', points: 10, speed: 4.8 },
  { emoji: '🎀', points: 15, speed: 4.0 },
  { emoji: '🌟', points: 20, speed: 3.2 },
  { emoji: '💜', points: 25, speed: 2.8 },
  { emoji: '💣', points: -25, speed: 3.5 },
];

let balloonScore = 0, balloonPopped = 0;
let balloonTimerInterval, balloonGameActive = false;
let balloonSpawnInterval;
let balloonTimeLeft = 30;

function initBalloonGame() {
  balloonScore = 0;
  balloonPopped = 0;
  balloonTimeLeft = 30;
  updateBalloonStats();
}

function startBalloonGame() {
  balloonGameActive = true;
  const arena = document.getElementById('balloonArena');
  const startBtn = document.getElementById('balloonStart');
  if (startBtn) startBtn.style.display = 'none';

  playAudioFx('flip');

  balloonTimerInterval = setInterval(() => {
    balloonTimeLeft--;
    updateBalloonStats();

    if (balloonTimeLeft <= 0) {
      clearInterval(balloonTimerInterval);
      clearInterval(balloonSpawnInterval);
      balloonGameActive = false;
      arena.querySelectorAll('.game-balloon').forEach(b => b.remove());
      showBalloonWin();
    }
  }, 1000);

  balloonSpawnInterval = setInterval(() => {
    if (balloonGameActive) spawnGameBalloon();
  }, 650);

  for (let i = 0; i < 4; i++) setTimeout(spawnGameBalloon, i * 200);
}

function spawnGameBalloon() {
  const arena = document.getElementById('balloonArena');
  if (!arena) return;

  const type = balloonTypes[Math.floor(Math.random() * (balloonTimeLeft > 15 ? 4 : balloonTypes.length))];
  const balloon = document.createElement('div');
  balloon.className = 'game-balloon';
  balloon.textContent = type.emoji;
  balloon.dataset.points = type.points;

  const leftPct = Math.random() * 82 + 4;
  balloon.style.left = leftPct + '%';
  balloon.style.bottom = '0';
  balloon.style.animationDuration = type.speed + 's';

  balloon.addEventListener('click', (e) => {
    if (!balloonGameActive) return;
    popBalloon(balloon, type.points, e);
  });

  arena.appendChild(balloon);
  setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, type.speed * 1000 + 400);
}

function popBalloon(balloon, points, e) {
  if (balloon.classList.contains('popped')) return;
  balloon.classList.add('popped');

  playAudioFx(points > 0 ? 'pop' : 'pop');
  balloonScore = Math.max(0, balloonScore + points);
  if (points > 0) balloonPopped++;
  updateBalloonStats();

  const arena = document.getElementById('balloonArena');
  const arenaRect = arena.getBoundingClientRect();
  const popTxt = document.createElement('div');
  popTxt.className = 'pop-text';
  popTxt.textContent = (points >= 0 ? '+' : '') + points;
  popTxt.style.left = (e.clientX - arenaRect.left) + 'px';
  popTxt.style.top = (e.clientY - arenaRect.top) + 'px';
  popTxt.style.color = points > 0 ? '#fbbf24' : '#f87171';
  arena.appendChild(popTxt);
  setTimeout(() => popTxt.remove(), 800);

  setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, 250);
}

function updateBalloonStats() {
  const sEl = document.getElementById('balloonScore');
  const tEl = document.getElementById('balloonTimer');
  const pEl = document.getElementById('balloonPopped');
  if (sEl) sEl.textContent = balloonScore;
  if (tEl) tEl.textContent = balloonTimeLeft + 's';
  if (pEl) pEl.textContent = balloonPopped;
}

function showBalloonWin() {
  const stars = balloonScore >= 200 ? '⭐⭐⭐' : balloonScore >= 100 ? '⭐⭐' : '⭐';
  document.getElementById('balloonWinText').textContent = `Score: ${balloonScore} pts • Popped: ${balloonPopped} 🎈 ${balloonScore >= 200 ? 'Supreme Master! 🏆' : 'Great blitz run! 🎉'}`;
  document.getElementById('level3Win')?.classList.add('show');
  document.getElementById('lvl3Status').textContent = '✅';
  unlockStep(4);
  createConfetti();
  playAudioFx('fanfare');
}

function showCouponModal() {
  const modal = document.getElementById('couponModalOverlay');
  if (modal) modal.classList.add('active');
  unlockStep(4);
  playAudioFx('fanfare');
}

function claimCouponAndOpenStore() {
  const modal = document.getElementById('couponModalOverlay');
  if (modal) modal.classList.remove('active');
  unlockStep(4);
  navigateToStep(4);
}

// =====================================================
// 9. SCROLL OBSERVER, NAVBAR & TOASTS
// =====================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
});

if (hamburger) {
  hamburger.addEventListener('click', () => {
    document.body.classList.toggle('nav-mobile-open');
  });
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.body.classList.remove('nav-mobile-open');
  });
});

// Scroll Reveal
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('[data-scroll]').forEach(el => scrollObserver.observe(el));

// Helper: re-trigger scroll animations for elements in a newly shown step
function revealStepScrollItems(stepEl) {
  if (!stepEl) return;
  // Unobserve & re-observe so IntersectionObserver fires fresh
  stepEl.querySelectorAll('[data-scroll]').forEach(el => {
    el.classList.remove('visible');
    scrollObserver.unobserve(el);
    // Small delay ensures element is visible in DOM before re-observing
    requestAnimationFrame(() => scrollObserver.observe(el));
  });
}

// Floating hero balloons - Optimized
const heroBalloonsContainer = document.getElementById('balloons');
const heroBalloonEmojis = ['🎈', '🎀', '🌟', '🎊', '💜', '🌸', '✨', '🎁', '🧁'];

function spawnHeroBalloon() {
  if (!heroBalloonsContainer) return;
  // Cap max balloons to prevent DOM accumulation
  if (heroBalloonsContainer.children.length >= 6) return;

  const el = document.createElement('div');
  el.className = 'balloon';
  el.textContent = heroBalloonEmojis[Math.floor(Math.random() * heroBalloonEmojis.length)];
  el.style.left = Math.random() * 92 + '%';
  el.style.fontSize = (Math.random() * 1.2 + 1.2) + 'rem';
  const duration = Math.random() * 6 + 10;
  el.style.animationDuration = duration + 's';
  heroBalloonsContainer.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, duration * 1000);
}
spawnHeroBalloon();
setInterval(spawnHeroBalloon, 3500);

// Toast
const toastEl = document.getElementById('toast');
let toastTimer;

function showToast(msg, duration = 2800) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
}

// =====================================================
// INIT ON DOM LOAD
// =====================================================
window.addEventListener('DOMContentLoaded', () => {
  // Restore persisted order data for claimed view
  if (isGiftVaultClaimed() && localStorage.getItem('giftVaultActiveOrder')) {
    try {
      activeOrderData = JSON.parse(localStorage.getItem('giftVaultActiveOrder'));
    } catch (e) { activeOrderData = null; }
  }

  // Resume the step where she left off!
  currentStep = maxUnlockedStep;
  showStep(currentStep);

  // Resume store countdown timer if active AND not yet claimed
  if (!isGiftVaultClaimed() && localStorage.getItem('giftVaultTimerExpiry')) {
    startStoreCountdownTimer();
  }

  // Bind click events on navbar links
  document.querySelectorAll('#navLinks a[data-step]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const s = parseInt(link.dataset.step, 10);
      document.body.classList.remove('nav-mobile-open');
      navigateToStep(s);
    });
  });

  // Initial journey tracker render
  updateJourneyTracker();

  // Sync CSS header height vars on first load (after fonts/layout settle)
  requestAnimationFrame(() => {
    syncHeaderVars();
    // Second pass after 300ms in case fonts shift layout
    setTimeout(syncHeaderVars, 300);
  });

  // Re-sync on window resize / orientation change
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncHeaderVars, 80);
  });

  // Re-sync when navbar compresses on scroll
  window.addEventListener('scroll', () => {
    syncHeaderVars();
  }, { passive: true });

  // Watch the journey tracker element for height changes
  if (window.ResizeObserver) {
    const trackerEl = document.getElementById('journeyTracker');
    if (trackerEl) {
      new ResizeObserver(syncHeaderVars).observe(trackerEl);
    }
    const navbarEl = document.getElementById('navbar');
    if (navbarEl) {
      new ResizeObserver(syncHeaderVars).observe(navbarEl);
    }
  }
});
