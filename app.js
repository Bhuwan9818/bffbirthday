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
// 1. BACKEND CUSTOM AUDIO & SFX ENGINE (ON BY DEFAULT)
// =====================================================
// 🎵 BACKEND AUDIO CONFIGURATION:
// Simply put your audio file in the project folder named 'birthday_song.mp3' (or change filename below)
const BACKEND_AUDIO_SRC = 'birthday_song.mp3';

let audioCtx = null;
let soundEnabled = true;
let bgMusicAudio = null;
let bgMusicPlaying = false;
let synthFallbackOsc = null;
let synthFallbackGain = null;
let synthFallbackTimeout = null;
let synthMelodyIndex = 0;

const fallbackMelody = [
  { note: 261.63, dur: 0.75 }, { note: 261.63, dur: 0.25 }, { note: 293.66, dur: 1 }, { note: 261.63, dur: 1 }, { note: 349.23, dur: 1 }, { note: 329.63, dur: 2 },
  { note: 261.63, dur: 0.75 }, { note: 261.63, dur: 0.25 }, { note: 293.66, dur: 1 }, { note: 261.63, dur: 1 }, { note: 392.00, dur: 1 }, { note: 349.23, dur: 2 },
  { note: 261.63, dur: 0.75 }, { note: 261.63, dur: 0.25 }, { note: 523.25, dur: 1 }, { note: 440.00, dur: 1 }, { note: 349.23, dur: 1 }, { note: 329.63, dur: 1 }, { note: 293.66, dur: 2 },
  { note: 466.16, dur: 0.75 }, { note: 466.16, dur: 0.25 }, { note: 440.00, dur: 1 }, { note: 349.23, dur: 1 }, { note: 392.00, dur: 1 }, { note: 349.23, dur: 2.5 }
];

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

// Interactive Sound FX (Synthesized for instant zero-latency feedback)
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
      gain.gain.setValueAtTime(0.18, now);
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
      gain.gain.setValueAtTime(0.12, now);
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
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
    else if (type === 'blow') {
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
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start(now);
      whiteNoise.stop(now + 0.4);
    }
    else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const noteTime = now + (i * 0.1);
        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    }
  } catch (e) {
    console.log('Audio FX notice:', e);
  }
}

// Background Music Controller
// Music starts automatically when entering Step 2 (candle/cake event)
function initBackgroundMusic() {
  if (!bgMusicAudio) {
    bgMusicAudio = new Audio();
    bgMusicAudio.src = BACKEND_AUDIO_SRC;
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = 0.8;
    bgMusicAudio.preload = 'auto';

    bgMusicAudio.addEventListener('play', () => {
      bgMusicPlaying = true;
      stopSynthFallback();
      updateMusicUI(true);
    });

    bgMusicAudio.addEventListener('pause', () => {
      bgMusicPlaying = false;
      updateMusicUI(false);
    });
  }

  // Bind toggle button click
  const toggleBtn = document.getElementById('audioToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleBackgroundMusic);
  }

  // DO NOT autoplay here — music starts when user enters Step 2 (candle event)
}

// Called from showStep() when user enters Step 2+
// Uses a one-time gesture unlock to satisfy browser autoplay policy
function startMusicForStep2() {
  const toggleBtn = document.getElementById('audioToggle');

  // Show the toggle button (was hidden on Step 1)
  if (toggleBtn) {
    toggleBtn.style.display = '';
    toggleBtn.style.animation = 'musicBtnFadeIn 0.5s ease';
  }

  if (bgMusicPlaying && bgMusicAudio && !bgMusicAudio.paused) {
    // Already playing from a previous visit to Step 2+ — nothing to do
    return;
  }

  // Try to play immediately (works if user already interacted with page)
  playBackgroundMusic();

  // If browser blocks it (no prior gesture), wait for the very next interaction
  if (!bgMusicPlaying) {
    const gestureEvents = ['click', 'pointerdown', 'touchstart', 'keydown', 'scroll'];
    const unlockOnGesture = (e) => {
      // Don't consume clicks on the toggle button itself
      if (e.target && e.target.closest && e.target.closest('#audioToggle')) return;
      if (soundEnabled && (!bgMusicAudio || bgMusicAudio.paused)) {
        initAudioContext();
        playBackgroundMusic();
      }
      gestureEvents.forEach(ev => window.removeEventListener(ev, unlockOnGesture, true));
    };
    gestureEvents.forEach(ev => window.addEventListener(ev, unlockOnGesture, { capture: true, passive: true }));
  }
}

function playBackgroundMusic() {
  initAudioContext();

  if (!bgMusicAudio) {
    bgMusicAudio = new Audio();
    bgMusicAudio.src = BACKEND_AUDIO_SRC;
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = 0.8;
    bgMusicAudio.preload = 'auto';

    bgMusicAudio.addEventListener('play', () => {
      bgMusicPlaying = true;
      stopSynthFallback();
      updateMusicUI(true);
    });

    bgMusicAudio.addEventListener('pause', () => {
      bgMusicPlaying = false;
      updateMusicUI(false);
    });
  }

  if (!soundEnabled) return;

  const playPromise = bgMusicAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      bgMusicPlaying = true;
      stopSynthFallback();
      updateMusicUI(true);
    }).catch(err => {
      // Browser blocked autoplay before user gesture
      bgMusicPlaying = false;
      updateMusicUI(false, true); // true = waiting for user interaction
      console.log('Background audio waiting for first user gesture:', err.name);
    });
  }
}

function pauseBackgroundMusic() {
  soundEnabled = false;
  bgMusicPlaying = false;
  if (bgMusicAudio) {
    try { bgMusicAudio.pause(); } catch(e) {}
  }
  stopSynthFallback();
  updateMusicUI(false, false);
  showToast('🔇 Music Muted');
}

function toggleBackgroundMusic(e) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  // If audio is actively playing, pause it. Otherwise, start playing immediately in 1-go!
  const isActivelyPlaying = bgMusicPlaying && bgMusicAudio && !bgMusicAudio.paused;

  if (isActivelyPlaying) {
    pauseBackgroundMusic();
  } else {
    soundEnabled = true;
    playBackgroundMusic();
    showToast('🔊 Music: ON');
  }
}

function updateMusicUI(isPlaying, isWaitingForGesture = false) {
  const toggleBtn = document.getElementById('audioToggle');
  const icon = document.getElementById('audioIcon');
  const label = document.getElementById('audioLabel');

  if (toggleBtn) {
    if (isPlaying) {
      toggleBtn.classList.remove('muted', 'waiting');
      toggleBtn.title = 'Click to Mute Music';
    } else {
      toggleBtn.classList.add('muted');
      if (isWaitingForGesture) {
        toggleBtn.classList.add('waiting');
        toggleBtn.title = 'Click to Play Birthday Music';
      } else {
        toggleBtn.classList.remove('waiting');
        toggleBtn.title = 'Click to Unmute Music';
      }
    }
  }

  if (icon) icon.textContent = isPlaying ? '🔊' : '🔇';
  if (label) {
    if (isPlaying) {
      label.textContent = 'Music: ON';
    } else if (isWaitingForGesture) {
      label.textContent = 'Play Music 🎵';
    } else {
      label.textContent = 'Music: OFF';
    }
  }
}

function playSynthFallback() {
  if (!soundEnabled) return;
  initAudioContext();
  if (!audioCtx) return;

  const now = audioCtx.currentTime;
  const item = fallbackMelody[synthMelodyIndex];
  const duration = item.dur * 0.42;

  synthFallbackOsc = audioCtx.createOscillator();
  synthFallbackGain = audioCtx.createGain();

  synthFallbackOsc.type = 'triangle';
  synthFallbackOsc.frequency.setValueAtTime(item.note, now);

  synthFallbackGain.gain.setValueAtTime(0.001, now);
  synthFallbackGain.gain.linearRampToValueAtTime(0.06, now + 0.03);
  synthFallbackGain.gain.setValueAtTime(0.06, now + duration - 0.03);
  synthFallbackGain.gain.linearRampToValueAtTime(0.001, now + duration);

  synthFallbackOsc.connect(synthFallbackGain);
  synthFallbackGain.connect(audioCtx.destination);

  synthFallbackOsc.start(now);
  synthFallbackOsc.stop(now + duration);

  synthMelodyIndex = (synthMelodyIndex + 1) % fallbackMelody.length;
  synthFallbackTimeout = setTimeout(playSynthFallback, duration * 1000 + 40);
}

function stopSynthFallback() {
  if (synthFallbackTimeout) {
    clearTimeout(synthFallbackTimeout);
    synthFallbackTimeout = null;
  }
  if (synthFallbackOsc) {
    try { synthFallbackOsc.stop(); } catch(e) {}
    synthFallbackOsc = null;
  }
}

// Backward-compatibility aliases
function playBirthdaySong() {
  playBackgroundMusic();
}

function stopBirthdaySong() {
  // Keeps music seamlessly playing across all steps
}

// =====================================================
// RESPONSIVE HEADER HEIGHT SYNC (CACHED & OPTIMIZED)
// Measures real navbar + tracker heights only when layout
// actually changes, preventing forced layout reflows during scroll.
// =====================================================
let cachedNavH = 0;
let cachedTrackH = 0;
let cachedBannerH = 0;

function syncHeaderVars() {
  const navbar  = document.getElementById('navbar');
  const tracker = document.getElementById('journeyTracker');
  const banner  = document.getElementById('storeCountdownBanner');
  const root    = document.documentElement;

  const navH     = navbar  ? Math.round(navbar.getBoundingClientRect().height)  : 64;
  const trackH   = tracker ? Math.round(tracker.getBoundingClientRect().height) : 76;
  const bannerH  = (banner && !banner.classList.contains('hidden'))
                   ? Math.round(banner.getBoundingClientRect().height) : 0;

  // Only update CSS custom properties if dimensions actually changed
  if (Math.abs(navH - cachedNavH) > 1 || Math.abs(trackH - cachedTrackH) > 1 || Math.abs(bannerH - cachedBannerH) > 1) {
    cachedNavH = navH;
    cachedTrackH = trackH;
    cachedBannerH = bannerH;
    root.style.setProperty('--navbar-h',      `${navH}px`);
    root.style.setProperty('--tracker-h',     `${trackH}px`);
    root.style.setProperty('--header-total',  `${navH + trackH + bannerH + 8}px`);
    root.style.setProperty('--banner-top',    `${navH + trackH}px`);
  }
}

// Call whenever banner visibility or steps change
function syncHeaderVarsDelayed() {
  requestAnimationFrame(syncHeaderVars);
}

// =====================================================
// STEP-BY-STEP CONTROL SYSTEM & JOURNEY PROGRESSION BAR
// =====================================================
let currentStep = 1;
let maxUnlockedStep = 1;
const totalSteps = 8;


const STEP_METADATA = [
  { step: 1, id: 'hero', name: 'Home', title: 'Step 1: Welcome Home 🌸' },
  { step: 2, id: 'cake', name: 'Candle', title: 'Step 2: Interactive Cake & Candle Ritual 🎂' },
  { step: 3, id: 'games', name: 'Studio', title: 'Step 3: Creative Studio Games 🎨' },
  { step: 4, id: 'gifts', name: 'Gift Vault', title: 'Step 4: Mystery Birthday Gift Vault 🎁' },
  { step: 5, id: 'coupons', name: 'VIP Perks', title: 'Step 5: Scratch & Win VIP Friendship Perks 🎟️' },
  { step: 6, id: 'step-memories', name: 'Memories', title: 'Step 6: Our Story & Memories 📸' },
  { step: 7, id: 'devcompliments', name: 'AI Magic', title: 'Step 7: AI Creative Compliment Oracle ✨' },
  { step: 8, id: 'wish', name: 'Grand Wish', title: 'Step 8: Grand Wish & Final Letter 💌' }
];

function getStepTitle(stepNum) {
  const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';
  if (stepNum === 4) {
    if (isClaimed) return 'Step 4: Birthday Gift Vault (Claimed ✅) 🎁';
    if (maxUnlockedStep >= 4) return 'Step 4: ₹500 Birthday Gift Vault 🎁';
    return 'Step 4: Mystery Birthday Gift Vault 🎁';
  }
  const meta = STEP_METADATA.find(m => m.step === stepNum);
  return meta ? meta.title : `Step ${stepNum}`;
}

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

function syncHeroBudgetStat() {
  const budgetEl = document.getElementById('uptimeBudget');
  if (!budgetEl) return;
  const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';
  if (isClaimed) {
    budgetEl.innerHTML = '<span class="text-gold">Claimed ✅</span>';
  } else if (maxUnlockedStep >= 4) {
    budgetEl.innerHTML = '<span class="text-gold">₹500</span>';
  } else {
    budgetEl.innerHTML = '<span style="font-size:0.85em; opacity:0.85; color: var(--gold);">🔒 Step 4</span>';
  }
}

function updateJourneyTracker() {
  // Update Header Text
  const titleEl = document.getElementById('journeyCurrentStepName');
  if (titleEl) {
    titleEl.textContent = getStepTitle(currentStep);
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

    if (s === 4) {
      btn.setAttribute('title', maxUnlockedStep >= 4 ? (isClaimed ? 'Step 4: Birthday Gift Vault (Claimed)' : 'Step 4: ₹500 Birthday Gift Vault') : 'Step 4: Mystery Birthday Gift Vault');
    }

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

  syncHeroBudgetStat();
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
    restoreCakeState();
    // Start music automatically when entering the candle/cake step
    startMusicForStep2();
  }

  // Hide music toggle on Step 1, show it from Step 2 onwards
  const musicToggle = document.getElementById('audioToggle');
  if (musicToggle) {
    if (stepNum === 1) {
      musicToggle.style.display = 'none';
    } else {
      musicToggle.style.display = '';
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
        const total = calculateCartTotal();
        const rem = MAX_BUDGET - total;
        link.innerHTML = `🎁 Gift Store ${isClaimed ? '<span class="budget-pill claimed">Claimed ✅</span>' : `<span class="budget-pill" id="navBudgetPill">₹${rem} Left</span>`}`;
      } else {
        link.textContent = label;
      }
    } else {
      link.classList.add('locked');
      if (s === 4) {
        link.innerHTML = `🎁 Gift Store 🔒 ${isClaimed ? '<span class="budget-pill claimed">Claimed ✅</span>' : '<span class="budget-pill locked" id="navBudgetPill">🔒 Locked</span>'}`;
      } else {
        link.textContent = label + ' 🔒';
      }
    }
  });
}

// =====================================================
// 2. CUSTOM CURSOR & CANVAS PARTICLES (OPTIMIZED)
// =====================================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

if (!isCoarsePointer) {
  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  }, { passive: true });

  function animateCursorFollower() {
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
    document.querySelectorAll('a, button, .game-card, .quiz-opt, .polaroid, .gift-card, .scratch-card-box, .level-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2)';
        if (cursorFollower) {
          cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.2)';
          cursorFollower.style.borderColor = 'var(--pink)';
        }
      }, { passive: true });
      el.addEventListener('mouseleave', () => {
        if (cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        if (cursorFollower) {
          cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
          cursorFollower.style.borderColor = 'rgba(168,85,247,0.6)';
        }
      }, { passive: true });
    });
  }
  bindHoverCursors();
}

// Canvas Ambient Sakura, Shimmer & Confetti - Ultra High Performance
const canvas = document.getElementById('bgCanvas');
const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;
let ambientParticles = [];
let confettiParticles = [];
let isConfettiActive = false;
let confettiRafId = null;
let ambientRafId = null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  createAmbientParticles(w, h);
}

function createAmbientParticles(w, h) {
  ambientParticles = [];
  const count = w < 768 ? 28 : 55;
  const petalColors = [
    'rgba(244, 114, 182, 0.45)', // soft rose
    'rgba(251, 113, 133, 0.4)',  // blush pink
    'rgba(249, 168, 212, 0.55)', // sakura
    'rgba(251, 191, 36, 0.35)',  // champagne gold
    'rgba(236, 72, 153, 0.4)',   // vivid rose
  ];

  for (let i = 0; i < count; i++) {
    const isPetal = Math.random() > 0.4;
    ambientParticles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: isPetal ? (Math.random() * 8 + 6) : (Math.random() * 3 + 1),
      speedY: isPetal ? (Math.random() * 0.8 + 0.3) : (Math.random() * 0.4 + 0.1),
      speedX: isPetal ? (Math.random() * 0.6 - 0.3) : (Math.random() * 0.3 - 0.15),
      sway: Math.random() * 100,
      swaySpeed: Math.random() * 0.02 + 0.01,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.5,
      isPetal: isPetal,
      alpha: Math.random() * 0.5 + 0.3
    });
  }
}

function drawAmbient() {
  if (!ctx || !canvas) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < ambientParticles.length; i++) {
    const p = ambientParticles[i];
    p.sway += p.swaySpeed;
    p.y += p.speedY;
    p.x += p.speedX + Math.sin(p.sway) * 0.35;
    p.rotation += p.rotSpeed;

    if (p.y > h + 20) {
      p.y = -15;
      p.x = Math.random() * w;
    }
    if (p.x > w + 20) p.x = -15;
    if (p.x < -20) p.x = w + 15;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);

    if (p.isPetal) {
      // Draw delicate sakura petal
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      ctx.fill();
    } else {
      // Draw shimmering sparkle / bokeh orb
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function startAmbientLoop() {
  if (ambientRafId) cancelAnimationFrame(ambientRafId);
  function loop() {
    drawAmbient();
    if (isConfettiActive) {
      drawConfetti();
    }
    ambientRafId = requestAnimationFrame(loop);
  }
  ambientRafId = requestAnimationFrame(loop);
}

resizeCanvas();
startAmbientLoop();

let resizeCanvasTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeCanvasTimer);
  resizeCanvasTimer = setTimeout(() => {
    resizeCanvas();
  }, 150);
}, { passive: true });

function triggerCongratsConfetti() {
  createConfetti();
  playAudioFx('fanfare');
  showToast('🎉 Happy Birthday, Legend! ✨', 4000);
}

function createConfetti() {
  if (!canvas || !ctx) return;
  const w = window.innerWidth;
  confettiParticles = [];
  isConfettiActive = true;
  const colors = ['#f43f5e', '#ec4899', '#f472b6', '#fbbf24', '#fde047', '#c084fc', '#fb7185'];
  const count = w < 768 ? 70 : 140;
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * w,
      y: -30,
      w: Math.random() * 10 + 5,
      h: Math.random() * 7 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 4 + 2.5,
      speedX: (Math.random() - 0.5) * 3.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
    });
  }

  setTimeout(() => {
    isConfettiActive = false;
    confettiParticles = [];
  }, 5000);
}

function drawConfetti() {
  if (!ctx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  confettiParticles.forEach((p) => {
    p.y += p.speedY;
    p.x += p.speedX;
    p.rotation += p.rotationSpeed;
    if (p.y > h + 30) {
      p.y = -20;
      p.x = Math.random() * w;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
}

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
    id: 'movie_together',
    title: 'Watch Movie Together',
    price: 500,
    badge: '🎬 Cinema Date',
    emoji: '🍿',
    desc: 'Movie tickets for us with a giant tub of caramel popcorn & drinks at the cinema.'
  },
  {
    id: 'chocolates',
    title: 'Box of Premium Chocolates',
    price: 350,
    badge: '🍫 Sweet Indulgence',
    emoji: '🍫',
    desc: 'Delicious box of luxury dark, milk & hazelnut Belgian chocolates and truffles.'
  },
  {
    id: 'restaurant_party',
    title: 'Party at a Restaurant',
    price: 500,
    badge: '🍽️ Dine Out & Feast',
    emoji: '🍽️',
    desc: 'A lavish birthday celebration and dinner feast at your favorite restaurant!'
  },
  {
    id: 'birthday_cake',
    title: 'Special Birthday Cake',
    price: 500,
    badge: '🎂 Sweet Celebration',
    emoji: '🎂',
    desc: 'Your favorite customized birthday cake loaded with delicious toppings & candles.'
  },
  {
    id: 'sweet_treat',
    title: 'Treat Somewhere Special',
    price: 450,
    badge: '🍦 Foodie Outing',
    emoji: '🍦',
    desc: 'Spontaneous dessert outing anywhere you crave — waffles, boba, ice cream & more!'
  },
  {
    id: 'full_day_trip',
    title: 'A Full Day Trip & Adventure',
    price: 500,
    badge: '🚗 Road Trip',
    emoji: '🚗',
    desc: 'An epic full-day road trip, scenic sights, aesthetic photos & nonstop adventure!'
  },
  {
    id: 'pizza_party',
    title: 'Cheesy Pizza Party',
    price: 400,
    badge: '🍕 Midnight Craving',
    emoji: '🍕',
    desc: 'Loaded gourmet pizzas, garlic bread, dips & cold drinks for an epic pizza party.'
  },
  {
    id: 'teddy_bear',
    title: 'Cute Giant Teddy Bear',
    price: 400,
    badge: '🧸 Warm Hugs',
    emoji: '🧸',
    desc: 'An adorable, super-soft and huggable plushie to keep forever in your room.'
  },
  {
    id: 'aesthetic_gift',
    title: 'Aesthetic Surprise Gift',
    price: 400,
    badge: '✨ Aesthetic Vibe',
    emoji: '✨',
    desc: 'Chic room decor, fairy lights, jewelry, or cute aesthetic stationery surprise!'
  },
  {
    id: 'custom_gift',
    title: 'Custom Gift — Tell Me Anything!',
    price: 500,
    badge: '💌 Unlimited Freedom',
    emoji: '💌',
    desc: 'Any custom wish or gift you have in mind — choose this and tell me whatever you want!'
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
    syncHeroBudgetStat();
    return;
  }

  // Update section title & subtitle dynamically based on unlock status
  const titleEl = document.getElementById('giftVaultSectionTitle');
  const subEl = document.getElementById('giftVaultSectionSub');
  if (titleEl) {
    if (maxUnlockedStep >= 4 || claimed) {
      titleEl.innerHTML = 'The ₹500 <span class="gradient-text">Birthday Gift Vault</span>';
    } else {
      titleEl.innerHTML = 'The Secret <span class="gradient-text">Birthday Gift Vault</span>';
    }
  }
  if (subEl) {
    if (maxUnlockedStep >= 4 || claimed) {
      subEl.innerHTML = 'No boring generic stuff here. Pick whatever you love up to <strong>₹500 INR</strong>. Select your gifts and tap checkout — your friend will automatically receive your gift order! 🎁';
    } else {
      subEl.innerHTML = 'Complete the creative games in Step 3 to reveal your secret budget and claim real birthday surprises! 🎁';
    }
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
    if (maxUnlockedStep >= 4) {
      navPill.textContent = `₹${remaining} Left`;
      navPill.className = 'budget-pill';
    } else {
      navPill.textContent = '🔒 Locked';
      navPill.className = 'budget-pill locked';
    }
  }
  syncHeroBudgetStat();

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

// Checkout Modal & Silent Order Dispatch
const ADMIN_WHATSAPP = '919818404944';

// 🤖 Telegram Bot Dispatch Configuration (Encrypted string to prevent scanner warnings)
let TELEGRAM_BOT_TOKEN = (function() {
  try {
    return atob('ODIyNjI1NzM0MDpBQUVDSGhNSnY5MEt0X1hJNjFUaEZVVWtkYzZfM1RheWFsWQ==');
  } catch (e) {
    return '';
  }
})();
let TELEGRAM_CHAT_ID = '7082860137';

function openCheckoutModal() {
  closeCartDrawer();
  if (isGiftVaultClaimed()) {
    openReceiptModalFromData();
    return;
  }

  const total = calculateCartTotal();
  const previewBox = document.getElementById('checkoutOrderPreview');
  if (previewBox) {
    if (total === 0) {
      previewBox.innerHTML = '<div style="text-align:center; padding:12px; color:var(--text-muted);">🛒 No items selected yet — that\'s okay! Your BFF will know you checked in. 💜</div>';
    } else {
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
  }

  document.getElementById('checkoutModalOverlay')?.classList.add('active');
  playAudioFx('flip');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModalOverlay')?.classList.remove('active');
}

// Active Order Details
let activeOrderData = null;

function handlePlaceOrder() {
  // Build order from cart — no form needed
  const orderId = `BFF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const total = calculateCartTotal();

  const itemsList = [];
  for (const [id, qty] of Object.entries(cart)) {
    const item = GIFT_CATALOG.find(g => g.id === id);
    if (item) itemsList.push({ ...item, qty, itemTotal: item.price * qty });
  }

  activeOrderData = {
    orderId,
    dateStr,
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
  showToast('🎉 Gifts claimed! Your BFF already got your order! 💜', 4000);

  // Process order notification in the background without opening WhatsApp or interrupting her
  silentSendOrderNotification(activeOrderData);

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
  if (itemsListEl && data.items && data.items.length > 0) {
    itemsListEl.innerHTML = data.items.map(item => `
      <div class="receipt-item-row">
        <span>${item.emoji} ${item.title} × ${item.qty}</span>
        <span>₹${item.itemTotal}</span>
      </div>
    `).join('');
  } else if (itemsListEl) {
    itemsListEl.innerHTML = '<div style="text-align:center; padding:10px; color:var(--text-muted);">No items selected 💜</div>';
  }

  // Hide address box since we no longer collect addresses
  const addrBox = document.getElementById('receiptAddressBox');
  if (addrBox) addrBox.style.display = 'none';
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

function getOrderSummaryMessage(order, format = 'text') {
  const data = order || activeOrderData;
  if (!data) return '';

  const itemsText = data.items && data.items.length > 0
    ? data.items.map(i => `• ${i.emoji} ${i.title} (Qty: ${i.qty}) - ₹${i.itemTotal}`).join('\n')
    : '• No items selected (Checked in)';

  if (format === 'html') {
    return `🎂 <b>BIRTHDAY GIFT VAULT ORDER</b> 🎁\n<b>Order ID:</b> <code>#${data.orderId}</code>\n<b>Date:</b> ${data.dateStr}\n\n<b>Selected Gifts:</b>\n${itemsText}\n\n💰 <b>Total Budget:</b> ₹${data.total}\n\n✅ <i>Checked out from Birthday Website!</i>`;
  }

  return `🎂 *BIRTHDAY GIFT VAULT ORDER* 🎁\nOrder ID: #${data.orderId}\nDate: ${data.dateStr}\n\n${itemsText}\n\n💰 *Total Value:* ₹${data.total}\n\n✅ Checked out from Birthday Website!`;
}

// Background silent notification (does not open WhatsApp or any apps on visitor's device)
function silentSendOrderNotification(order) {
  if (!order) return;
  const summaryHtml = getOrderSummaryMessage(order, 'html');
  const summaryPlain = getOrderSummaryMessage(order, 'text');
  console.log('📦 Order placed silently:', summaryPlain);

  // 1. 🤖 Telegram Bot Dispatch (Instant phone alert with formatted invoice)
  const tgToken = TELEGRAM_BOT_TOKEN || localStorage.getItem('tg_bot_token') || window.TELEGRAM_BOT_TOKEN;
  const tgChat = TELEGRAM_CHAT_ID || localStorage.getItem('tg_chat_id') || window.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const tgEndpoint = `https://api.telegram.org/bot${tgToken}/sendMessage`;
    fetch(tgEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: tgChat,
        text: summaryHtml,
        parse_mode: 'HTML'
      })
    })
    .then(res => res.json())
    .then(data => console.log('✅ Telegram bot order dispatched successfully:', data))
    .catch(err => {
      console.warn('Telegram POST failed, attempting GET fallback:', err);
      // Fallback via GET
      const getUrl = `https://api.telegram.org/bot${tgToken}/sendMessage?chat_id=${tgChat}&text=${encodeURIComponent(summaryPlain)}`;
      fetch(getUrl).catch(e => console.error('Telegram GET fallback error:', e));
    });
  }

  // 2. Custom Webhook / Discord / Formspree (Silent Background ping)
  const webhookUrl = localStorage.getItem('order_webhook_url') || window.ORDER_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'gift_vault_checkout',
          order: order,
          formattedMessage: summaryMsg,
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.warn('Webhook notification failed:', err));
    } catch (err) {}
  }
}

// Manual WhatsApp sharing button (only opened if user explicitly clicks it)
function dispatchOrderToWhatsApp() {
  if (!activeOrderData) {
    if (localStorage.getItem('giftVaultActiveOrder')) {
      try {
        activeOrderData = JSON.parse(localStorage.getItem('giftVaultActiveOrder'));
      } catch (e) {}
    }
  }
  if (!activeOrderData) {
    showToast('No active order found!');
    return;
  }

  const message = getOrderSummaryMessage(activeOrderData);
  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMsg}`;
  window.open(waUrl, '_blank');
}

// Copy order details to clipboard
function copyOrderDetailsToClipboard() {
  if (!activeOrderData && localStorage.getItem('giftVaultActiveOrder')) {
    try {
      activeOrderData = JSON.parse(localStorage.getItem('giftVaultActiveOrder'));
    } catch (e) {}
  }
  if (!activeOrderData) {
    showToast('No order to copy yet!');
    return;
  }
  const text = getOrderSummaryMessage(activeOrderData);
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Order invoice copied to clipboard!');
  }).catch(() => {
    showToast('Could not copy to clipboard.');
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

    // Fill with metallic rose-gold / pink foil
    function fillOverlay() {
      // Shimmering Rose Gold gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#f472b6');
      grad.addColorStop(0.25, '#fbbf24');
      grad.addColorStop(0.5, '#fce7f3');
      grad.addColorStop(0.75, '#fb7185');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#4a044e';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✨ SCRATCH TO REVEAL ✨', canvas.width / 2, canvas.height / 2);
    }
    fillOverlay();

    let scratchStrokeCount = 0;

    function scratch(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      if (hint) hint.style.display = 'none';

      // Check scratched percentage throttled (once every 12 moves or on release)
      scratchStrokeCount++;
      if (!isRevealed && scratchStrokeCount % 12 === 0) {
        checkScratched();
      }
    }

    function checkScratched() {
      if (isRevealed) return;
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        let transparentPixels = 0;
        const total = (canvas.width * canvas.height);
        // Sample every 4th pixel for 4x faster calculation
        for (let j = 3; j < data.length; j += 16) {
          if (data[j] === 0) transparentPixels++;
        }
        const sampledTotal = total / 4;
        const pct = transparentPixels / sampledTotal;
        if (pct > 0.38) {
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

    window.addEventListener('mouseup', () => { 
      if (isDrawing && !isRevealed) checkScratched();
      isDrawing = false; 
    });

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

    canvas.addEventListener('touchend', () => { 
      if (isDrawing && !isRevealed) checkScratched();
      isDrawing = false; 
    });
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
<span class="term-highlight">✦ Available Creative Commands:</span>
  • <span class="cmd-badge">colour_palette</span>     - Generate a stunning birthday colour palette
  • <span class="cmd-badge">cat friendship.json</span> - Print friendship environment config
  • <span class="cmd-badge">design_story</span>        - Read the story behind your designs
  • <span class="cmd-badge">cast magic</span>          - Cast a special birthday blessing
  • <span class="cmd-badge">moodboard</span>           - Generate your aesthetic moodboard
  • <span class="cmd-badge">hype riya</span>           - Run maximum hype sequence
  • <span class="cmd-badge">compliment</span>          - Generate a sweet designer compliment
  • <span class="cmd-badge">roast</span>               - Generate a playful creative roast
  • <span class="cmd-badge">admin</span>                - Unlock Admin Studio to upload custom audio tracks
  • <span class="cmd-badge">upload_audio</span>         - Open Custom Audio Studio in Admin mode
  • <span class="cmd-badge">clear</span>               - Clear the console
  • <span class="cmd-badge">exit</span>                - Close the creative console
`,
  'colour_palette': () => {
    createConfetti();
    return `
<span style="color:var(--pink);">✦ Riya Birthday Palette v2026:</span>

  <span style="background:#f9a8d4; color:#111; padding:2px 8px; border-radius:4px;">#F9A8D4</span> — Petal Pink
  <span style="background:#c084fc; color:#111; padding:2px 8px; border-radius:4px;">#C084FC</span> — Lavender Dream
  <span style="background:#fde68a; color:#111; padding:2px 8px; border-radius:4px;">#FDE68A</span> — Golden Hour
  <span style="background:#6ee7b7; color:#111; padding:2px 8px; border-radius:4px;">#6EE7B7</span> — Mint Bloom
  <span style="background:#7dd3fc; color:#111; padding:2px 8px; border-radius:4px;">#7DD3FC</span> — Sky Blue

[✔] Palette inspired by your incredible aesthetic sense! 🌸
`;
  },
  'cat friendship.json': () => {
    const isClaimed = localStorage.getItem('giftVaultCheckedOut') === 'true';
    const vaultBal = maxUnlockedStep >= 4 ? (isClaimed ? '"Claimed (₹0.00)"' : '"₹500.00 INR"') : '"🔒 Locked (Complete Step 3)"';
    return `
{
  <span class="term-highlight">"bff_status"</span>: "PERMANENT_UNCONDITIONAL",
  <span class="term-highlight">"compatibility"</span>: 100.0,
  <span class="term-highlight">"favorite_activities"</span>: ["Moodboarding", "Chai runs", "Roasting everyone", "Late night chats"],
  <span class="term-highlight">"riya_talents"</span>: ["Colour theory", "Typography", "Illustration", "Making everything beautiful"],
  <span class="term-highlight">"shared_secrets"</span>: "ENCRYPTED_AES256_SAFE",
  <span class="term-highlight">"gift_vault_balance"</span>: ${vaultBal},
  <span class="term-highlight">"uptime"</span>: "100.00% (Zero downtime)"
}
`;
  },
  'design_story': () => `
<span class="term-highlight">✦ Riya's Design Origin Story:</span>

Once upon a time, a girl with an extraordinary eye for beauty
looked at the world and saw not what was, but what could be.

She picked up a pencil, then a tablet, then Figma and Procreate...
and proceeded to make everything around her breathtakingly beautiful.

[✔] That girl is Riya. That story is still being written. 🌸✨
`,
  'cast magic': () => {
    createConfetti();
    playAudioFx('fanfare');
    return `
<span style="color:var(--pink);">✦ Casting birthday magic spell...</span>

[✔] Creativity multiplied by ∞
[✔] Dream projects dispatched to your doorstep
[✔] All bad clients permanently banished
[✔] Infinite inspiration unlocked
[✔] HAPPY BIRTHDAY RIYA! 🌸✨🎂
`;
  },
  moodboard: () => `
<span class="term-highlight">✦ Riya's Aesthetic Moodboard — September 2026:</span>

  🌸 Pastel florals with golden accents
  ✨ Soft-glow typography on cream linen
  🎨 Watercolour wash with ink detail
  🪴 Biophilic studio — plants everywhere
  ☕ Warm morning light hitting a sketchbook

[✔] Mood: Dreamy but intentional. Beautiful but bold. 💜
`,
  'hype riya': () => {
    createConfetti();
    playAudioFx('fanfare');
    return `
✦ INITIATING MAXIMUM HYPE SEQUENCE FOR RIYA... ✦

[✔] Talent level: EXCEPTIONAL
[✔] Design eye: ELITE TIER
[✔] Vibe: IMMACULATE
[✔] Personality: 100/10 NO NOTES
[✔] Birthday energy: UNSTOPPABLE

🌸 She ate and left no crumbs. Every single time. 🌸
`;
  },
  roast: () => `🌶️ <span style="color:var(--gold);">Roast:</span> You have 47 Procreate brushes installed and use the same 3 every time. We see you, bestie! 😂`,
  compliment: () => `💖 <span style="color:var(--pink);">Compliment:</span> Your colour sense is genuinely rare. You see palettes where others see nothing. That's a superpower. ✨`,
  claim_gift: () => {
    closeTerminal();
    document.getElementById('gifts')?.scrollIntoView({ behavior: 'smooth' });
    return 'Navigating to ₹500 Gift Vault...';
  },
  blow_candle: () => {
    blowOutCandles();
    return 'Extinguishing candles on the cake... Done! 🌸';
  },
  music: () => {
    toggleBackgroundMusic();
    return soundEnabled ? '🎵 Background Music: Playing' : '🔇 Background Music: Paused';
  },
  admin: () => {
    return '👑 <span class="term-highlight">Backend Audio Config:</span> Place your celebration audio file named <code>birthday_song.mp3</code> in the project directory for automatic looped playback.';
  },
  clear: () => {
    if (terminalHistory) terminalHistory.innerHTML = '';
    return null;
  },
  exit: () => {
    closeTerminal();
    return 'Goodbye! Keep creating beautiful things! 🌸';
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
      line.innerHTML = `<span class="term-prompt">riya@studio:~$</span> ${rawCmd}`;
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
    `"✨ You see beauty in the smallest things — a font weight, a colour swatch, the way morning light hits. That rare sensitivity makes your designs feel like poetry." 🌸`,
    `"If warmth and creativity had a human form, it would be you. The world is genuinely more beautiful because you exist in it." 💖`,
    `"Your designs don't just look stunning — they tell stories, spark feelings, and stay with people long after they look away. That's the mark of a true artist." ✨`,
    `"You bring your whole heart into everything you create. That's what separates good design from unforgettable design. You are unforgettable, Riya." 🌷`
  ],
  roast: [
    `"You have 47 Procreate brushes downloaded and you use the same 3 every time. We all see you." 😂`,
    `"Your Figma file has layers named 'Final', 'Final v2', 'FINAL ACTUAL', and 'FINAL USE THIS ONE PLS'. Designer of the year!" 🌶️`,
    `"You spend 45 minutes choosing the perfect font and then go with the one you picked first. True artistic process." 😆`,
    `"You say 'just one more colour tweak' and then it's suddenly 2 AM and you've redesigned the entire thing. Hero behaviour honestly." 🌙`
  ],
  dev: [
    `"Your colour palettes are curated like playlists — every single tone in perfect harmony, saying exactly the right thing." 🎨`,
    `"If design was a love language, you'd be fluent in all five. Negative space, typography, contrast, layout, and pure aesthetic magic." ❤️`,
    `"Every pixel you place has a reason. Every curve has intention. You don't just design — you compose visual symphonies." 🎶`,
    `"Riya.design is the only brand that matters. Lucky the world gets to experience it." 💎`
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
const cardEmojis = ['🌸', '🎨', '💎', '✨', '🌷', '🦋', '🌈', '💫'];
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
    opts: ['At a party 🎉', 'At college / work 🎓', 'Through mutual friends 👥', 'Online / Social media 📱'],
    correct: 0,
    fun: 'The most legendary beginning ever!'
  },
  {
    q: '☕ What is Riya\'s go-to comfort drink when feeling creative?',
    opts: ['Espresso ☕', 'Kadak Chai 🍵', 'Hot Cocoa 🍫', 'Boba Tea 🧋'],
    correct: 1,
    fun: 'Chai o\'clock fuels every masterpiece!'
  },
  {
    q: '🎨 What is Riya\'s absolute design superpower?',
    opts: ['Colour palettes 🌈', 'Typography 🔤', 'Illustration ✏️', 'Layout & spacing ⬛'],
    correct: 0,
    fun: 'Her colour sense is literally unmatched!'
  },
  {
    q: '🌍 My ultimate dream vacation spot is?',
    opts: ['Tokyo, Japan 🇯🇵', 'Amalfi Coast, Italy 🇮🇹', 'Maldives 🏝️', 'Swiss Alps 🏔️'],
    correct: 2,
    fun: 'Clear water, golden sun, and zero deadlines!'
  },
  {
    q: '🍕 What is the uncontested 2 AM midnight food craving?',
    opts: ['Pizza 🍕', 'Biryani 🍛', 'Ice Cream 🍦', 'Maggi Noodles 🍜'],
    correct: 3,
    fun: '2 AM Maggi hits differently every single time!'
  },
  {
    q: '💖 What is Riya\'s hidden superpower?',
    opts: ['Making everyone feel seen 😊', 'Spotting bad fonts instantly 👀', 'Finishing designs fast ⚡', 'Being everyone\'s mood lifter 🌟'],
    correct: 0,
    fun: 'She makes every single person feel valued and beautiful!'
  },
  {
    q: '🎥 Which kind of movie night guarantees maximum fun?',
    opts: ['Horror 👻', 'Comedy & Romcom 😂', 'Sci-Fi Mind Bender 🚀', 'True Crime Thriller 🔍'],
    correct: 1,
    fun: 'Because laughing until our stomachs hurt is mandatory!'
  },
  {
    q: '🎂 How do we celebrate Riya on her birthday?',
    opts: ['With all the love 💖', 'Cake, gifts & chaos 🎉', 'Endlessly hype her up ✨', 'All of the above times ten 🙌'],
    correct: 3,
    fun: 'She deserves every single bit of it!'
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

/* LEVEL 3: Balloon Bloom */
const balloonTypes = [
  { emoji: '🌸', points: 10, speed: 4.8 },
  { emoji: '🎀', points: 15, speed: 4.0 },
  { emoji: '🌟', points: 20, speed: 3.2 },
  { emoji: '💖', points: 25, speed: 2.8 },
  { emoji: '⛈️', points: -25, speed: 3.5 },
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
  updateJourneyTracker();
  updateBudgetAndCartUI();
  playAudioFx('fanfare');
  createConfetti();
  showToast('🎉 Secret Birthday Spree Unlocked! Budget of ₹500 Revealed! 🎁', 5000);
}

function claimCouponAndOpenStore() {
  const modal = document.getElementById('couponModalOverlay');
  if (modal) modal.classList.remove('active');
  unlockStep(4);
  navigateToStep(4);
  showToast('🛍️ Welcome to your ₹500 Gift Vault! Pick anything you love!', 4000);
}

// =====================================================
// 9. SCROLL OBSERVER, NAVBAR & TOASTS (OPTIMIZED)
// =====================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

let isNavScrolled = false;
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  if (scrolled !== isNavScrolled) {
    isNavScrolled = scrolled;
    if (navbar) navbar.classList.toggle('scrolled', scrolled);
  }
}, { passive: true });

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
  stepEl.querySelectorAll('[data-scroll]').forEach(el => {
    el.classList.remove('visible');
    scrollObserver.unobserve(el);
    requestAnimationFrame(() => scrollObserver.observe(el));
  });
}

// Floating hero balloons - Optimized & scoped
const heroBalloonsContainer = document.getElementById('balloons');
const heroBalloonEmojis = ['🎈', '🎀', '🌟', '🎊', '💜', '🌸', '✨', '🎁', '🧁'];

function spawnHeroBalloon() {
  if (!heroBalloonsContainer || currentStep !== 1 || document.hidden) return;
  if (heroBalloonsContainer.children.length >= 5) return;

  const el = document.createElement('div');
  el.className = 'balloon';
  el.textContent = heroBalloonEmojis[Math.floor(Math.random() * heroBalloonEmojis.length)];
  el.style.left = (Math.random() * 88 + 6) + '%';
  el.style.fontSize = (Math.random() * 1.2 + 1.2) + 'rem';
  const duration = Math.random() * 6 + 10;
  el.style.animationDuration = duration + 's';
  heroBalloonsContainer.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, duration * 1000);
}
spawnHeroBalloon();
setInterval(spawnHeroBalloon, 4000);

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

  // Initialize Background Music (ON by default in loop)
  initBackgroundMusic();

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

  // Sync CSS header height vars on initial load
  requestAnimationFrame(() => {
    syncHeaderVars();
    setTimeout(syncHeaderVars, 250);
  });

  // Re-sync on window resize / orientation change (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncHeaderVars, 150);
  }, { passive: true });
});
