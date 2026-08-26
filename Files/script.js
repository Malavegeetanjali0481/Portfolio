/**
 * ============================================================================
 * PORTFOLIO JAVASCRIPT LOGIC
 * Clean, lightweight, beginner-friendly Vanilla JS.
 * 
 * CUSTOMIZATION GUIDE:
 * - You can adjust your social links, email, or theme settings below.
 * - All interactive behaviors (slips, active navigation, back-to-top) are handled here.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Update footer year automatically
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     1. ACTIVE NAVIGATION & SMOOTH SCROLLING
     ========================================================================== */
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section.section');

  // Handle smooth scroll offset on navbar click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        // Compute offset so section isn't obscured under floating navbar
        const navHeight = 85;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Track active section as user scrolls
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === activeId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  /* ==========================================================================
     2. TOAST NOTIFICATION HELPER
     ========================================================================== */
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    if (toastText) {
      toastText.textContent = message;
    }
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Reliable clipboard copy fallback for all environments
  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        execCopyFallback(text, successMsg);
      });
    } else {
      execCopyFallback(text, successMsg);
    }
  }

  function execCopyFallback(text, successMsg) {
    try {
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-9999px';
      tempInput.style.top = '0';
      document.body.appendChild(tempInput);
      tempInput.focus();
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(successMsg);
    } catch (err) {
      showToast(`✂ Text: ${text}`);
    }
  }


  /* ==========================================================================
     3. "TAKE A SLIP" CONTACT BOARD INTERACTION
     ========================================================================== */
  const tearSlips = document.querySelectorAll('.tear-slip');

  tearSlips.forEach(slip => {
    slip.addEventListener('click', () => {
      const type = slip.getAttribute('data-type');
      const link = slip.getAttribute('data-link');
      const info = slip.getAttribute('data-info');
      const slipName = slip.querySelector('.slip-name')?.textContent?.trim() || 'Slip';

      // Visual paper slide animation
      slip.style.transform = 'translateX(28px) rotate(2deg) scale(1.03)';
      setTimeout(() => {
        slip.style.transform = '';
      }, 350);

      if (type === 'copy') {
        copyToClipboard(info, `✂ ${slipName} copied to clipboard!`);
      } else if (type === 'link') {
        showToast(`🚀 Opening ${slipName}...`);
        setTimeout(() => {
          window.open(link, '_blank');
        }, 250);
      }
    });
  });


  /* ==========================================================================
     4. SCROLL TO TOP BUTTON
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 250) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* ==========================================================================
     5. PALETTE THEME ACCENT SWITCHER
     ========================================================================== */
  const paletteBtn = document.getElementById('paletteThemeBtn');
  const themes = ['', 'theme-mint', 'theme-lavender', 'theme-blueprint'];
  let currentThemeIndex = 0;

  paletteBtn?.addEventListener('click', () => {
    // Remove previous theme class
    if (themes[currentThemeIndex]) {
      document.body.classList.remove(themes[currentThemeIndex]);
    }

    // Cycle to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;

    if (themes[currentThemeIndex]) {
      document.body.classList.add(themes[currentThemeIndex]);
      const themeNames = {
        'theme-mint': 'Mint Meadow 🌿',
        'theme-lavender': 'Lavender Dream 🌸',
        'theme-blueprint': 'Tech Blueprint 📘'
      };
      showToast(`Palette switched to ${themeNames[themes[currentThemeIndex]]}`);
    } else {
      showToast('Palette restored to Classic Paper 📜');
    }
  });


  /* ==========================================================================
     6. 3D TILT EFFECT ON PROFILE STAMP CARD (DESKTOP)
     ========================================================================== */
  const stampCard = document.getElementById('profileStamp');
  if (stampCard && window.innerWidth > 768) {
    stampCard.addEventListener('mousemove', (e) => {
      const rect = stampCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const tiltX = (y / rect.height) * -10;
      const tiltY = (x / rect.width) * 10;

      stampCard.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });

    stampCard.addEventListener('mouseleave', () => {
      stampCard.style.transform = 'rotate(-3.5deg)';
    });
  }
});
