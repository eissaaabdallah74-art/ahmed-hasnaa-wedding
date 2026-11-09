/**
 * Ahmed & Hasnaa Wedding Invitation - Pure English Luxury Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Envelope Elements
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const envelopeScreen = document.getElementById('envelopeScreen');
  const invitationScreen = document.getElementById('invitationScreen');
  const openPrompt = document.getElementById('openPrompt');

  // Audio Elements
  const audio = document.getElementById('weddingAudio');
  const musicBtn = document.getElementById('musicBtn');
  const musicTooltip = document.getElementById('musicTooltip');
  const musicMenu = document.getElementById('musicMenu');
  const closeMusicMenu = document.getElementById('closeMusicMenu');
  const trackItems = document.querySelectorAll('.track-item');
  const musicFileInput = document.getElementById('musicFileInput');

  // Utility Buttons
  const shareBtn = document.getElementById('shareBtn');
  const addToCalBtn = document.getElementById('addToCalBtn');

  let isAudioPlaying = false;
  let envelopeOpened = false;

  // ==========================================================================
  // 1. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const scrollElements = document.querySelectorAll('.animate-scroll');

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollElements.forEach(el => scrollObserver.observe(el));

  // ==========================================================================
  // 2. ENVELOPE OPENING & MUSIC TRIGGER
  // ==========================================================================
  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Trigger 3D opening animation
    envelopeContainer.classList.add('opening');
    if (openPrompt) openPrompt.style.opacity = '0';

    // Start playing background music with smooth volume fade-in
    startAudioWithFade();

    // Trigger celebratory confetti burst
    launchLuxuryConfetti();

    // Transition smoothly to full invitation card
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      invitationScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger scroll observer for elements currently in viewport
      setTimeout(() => {
        document.querySelectorAll('.animate-scroll').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            el.classList.add('in-view');
          }
        });
      }, 200);

    }, 1250);
  }

  if (envelopeWrapper) envelopeWrapper.addEventListener('click', openEnvelope);
  if (openPrompt) openPrompt.addEventListener('click', openEnvelope);

  // ==========================================================================
  // 3. AUDIO PLAYBACK & VOLUME FADE-IN
  // ==========================================================================
  function startAudioWithFade() {
    audio.volume = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        isAudioPlaying = true;
        musicBtn.classList.add('playing');
        showAudioTooltip('Music Playing 🎵');

        // Smooth volume fade up to 0.75
        let vol = 0;
        const fadeInterval = setInterval(() => {
          vol += 0.05;
          if (vol >= 0.75) {
            audio.volume = 0.75;
            clearInterval(fadeInterval);
          } else {
            audio.volume = vol;
          }
        }, 80);
      }).catch(err => {
        console.log('Audio autoplay waiting for user interaction:', err);
        showAudioTooltip('Click here to play music 🎵');
      });
    }
  }

  function toggleAudio() {
    if (audio.paused) {
      audio.play().then(() => {
        isAudioPlaying = true;
        musicBtn.classList.add('playing');
        showAudioTooltip('Music Playing 🎵');
      }).catch(e => console.log(e));
    } else {
      audio.pause();
      isAudioPlaying = false;
      musicBtn.classList.remove('playing');
      showAudioTooltip('Music Paused 🔇');
    }
  }

  musicBtn.addEventListener('click', () => {
    toggleAudio();
  });

  // Right-click or long press opens track selector
  musicBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    musicMenu.classList.add('open');
  });

  if (closeMusicMenu) {
    closeMusicMenu.addEventListener('click', () => {
      musicMenu.classList.remove('open');
    });
  }

  // Switch Track from list
  trackItems.forEach(item => {
    item.addEventListener('click', () => {
      trackItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const newSrc = item.getAttribute('data-src');
      audio.src = newSrc;
      audio.play().then(() => {
        isAudioPlaying = true;
        musicBtn.classList.add('playing');
        showAudioTooltip('Track Changed 🎶');
      });
      musicMenu.classList.remove('open');
    });
  });

  // Upload Custom Music File
  if (musicFileInput) {
    musicFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        audio.src = fileUrl;
        audio.play().then(() => {
          isAudioPlaying = true;
          musicBtn.classList.add('playing');
          showAudioTooltip('Custom Track Playing 🎵');
        });
        musicMenu.classList.remove('open');
      }
    });
  }

  function showAudioTooltip(text) {
    if (!musicTooltip) return;
    musicTooltip.textContent = text;
    musicTooltip.classList.add('show');
    setTimeout(() => {
      musicTooltip.classList.remove('show');
    }, 2800);
  }

  // ==========================================================================
  // 4. CELEBRATORY GOLDEN CONFETTI
  // ==========================================================================
  function launchLuxuryConfetti() {
    if (typeof confetti !== 'function') return;

    const count = 75;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#D4AF37', '#F5E6C8', '#111111', '#C5A880', '#FFFFFF']
    };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  // ==========================================================================
  // 5. COUNTDOWN TIMER (November 12, 2026, 19:30 Local Time)
  // ==========================================================================
  const weddingDate = new Date('2026-11-12T19:30:00+02:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = days.toString().padStart(2, '0');
    document.getElementById('cdHours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('cdMins').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('cdSecs').textContent = seconds.toString().padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==========================================================================
  // 6. ADD TO CALENDAR (.ICS FILE GENERATION)
  // ==========================================================================
  if (addToCalBtn) {
    addToCalBtn.addEventListener('click', () => {
      const title = 'Wedding of Ahmed & Hasnaa';
      const description = 'Wedding celebration of Ahmed & Hasnaa at Royal Hall, Belbeis. Warmest congratulations!';
      const location = 'Royal Hall, Belbeis, Sharkia Governorate';
      const startIso = '20261112T173000Z'; // UTC (19:30 Cairo time)
      const endIso = '20261112T233000Z';

      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ahmed & Hasnaa//Wedding Invitation//EN
BEGIN:VEVENT
UID:${Date.now()}@ahmed-hasnaa-wedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startIso}
DTEND:${endIso}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Ahmed_Hasnaa_Wedding.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showAudioTooltip('Calendar Reminder Downloaded 📅');
    });
  }

  // ==========================================================================
  // 7. SHARE INVITATION
  // ==========================================================================
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Ahmed & Hasnaa Wedding Invitation 💍',
        text: 'Ahmed & Hasnaa invite you to celebrate their wedding on November 12, 2026 at Royal Hall, Belbeis ✨',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (e) {
          console.log('Share canceled or not allowed');
        }
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showAudioTooltip('Invitation Link Copied 📋');
        }).catch(() => {
          alert('Invitation URL: ' + window.location.href);
        });
      }
    });
  }

});
