/**
 * Nucleus eWallet - Interactive JavaScript
 * Modern Fintech Experience & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCalculator();
  initPricingToggle();
  initFaqAccordion();
  initModal();
  initToast();
  initSmoothScroll();
});

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky blur effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('navbar--scrolled');
    } else {
      navbar?.classList.remove('navbar--scrolled');
    }
  });

  // Mobile toggle
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('nav__menu--open');
      document.body.classList.toggle('no-scroll');
    });

    // Close on link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('nav__menu--open');
        document.body.classList.remove('no-scroll');
      });
    });
  }
}

/* ==========================================================================
   2. Interactive Fee & Savings Calculator
   ========================================================================== */
function initCalculator() {
  const slider = document.getElementById('calcSlider');
  const input = document.getElementById('calcInput');
  const feeRateEl = document.getElementById('calcFeeRate');
  const feeAmountEl = document.getElementById('calcFeeAmount');
  const netAmountEl = document.getElementById('calcNetAmount');
  const bankSavingsEl = document.getElementById('calcBankSavings');

  if (!slider || !input) return;

  function updateCalc(val) {
    const amount = Math.max(10, Math.min(10000, Number(val) || 0));
    
    // Fee tier: 3% if < $1000, 2.5% if >= $1000
    const rate = amount >= 1000 ? 0.025 : 0.03;
    const ratePercent = amount >= 1000 ? '2.5%' : '3.0%';
    const fee = amount * rate;
    const net = amount - fee;
    
    // Traditional banks charge average 6.5% + $5 fixed fee
    const bankFee = (amount * 0.065) + 5;
    const savings = Math.max(0, bankFee - fee);

    if (feeRateEl) feeRateEl.textContent = ratePercent;
    if (feeAmountEl) feeAmountEl.textContent = `$${fee.toFixed(2)} USD`;
    if (netAmountEl) netAmountEl.textContent = `$${net.toFixed(2)} USD`;
    if (bankSavingsEl) bankSavingsEl.textContent = `Ahorras ~$${savings.toFixed(2)} USD vs bancos`;

    slider.value = amount;
    input.value = amount;
  }

  slider.addEventListener('input', (e) => updateCalc(e.target.value));
  input.addEventListener('input', (e) => updateCalc(e.target.value));

  // Quick preset buttons
  document.querySelectorAll('.calc-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const presetVal = btn.dataset.amount;
      if (presetVal) updateCalc(presetVal);
    });
  });

  // Initial calculation
  updateCalc(slider.value || 500);
}

/* ==========================================================================
   3. Pricing Plan Toggle (Monthly / Annual)
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('billingToggle');
  const priceElements = document.querySelectorAll('.plan-card__price-value');

  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    priceElements.forEach(el => {
      const monthly = el.dataset.monthly;
      const annual = el.dataset.annual;
      if (isAnnual && annual !== undefined) {
        el.textContent = annual;
      } else if (!isAnnual && monthly !== undefined) {
        el.textContent = monthly;
      }
    });

    const periodLabels = document.querySelectorAll('.plan-card__period');
    periodLabels.forEach(label => {
      label.textContent = isAnnual ? '/mes (facturado anual)' : '/mes';
    });
  });
}

/* ==========================================================================
   4. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-item__question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');

      // Close other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('faq-item--open');
          const otherBtn = other.querySelector('.faq-item__question');
          otherBtn?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('faq-item--open', !isOpen);
      questionBtn.setAttribute('aria-expanded', !isOpen);
    });
  });
}

/* ==========================================================================
   5. Account Registration Modal
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('signupModal');
  const openBtns = document.querySelectorAll('[data-open-modal="signup"]');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalForm = document.getElementById('signupForm');

  if (!modal) return;

  function openModal() {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const firstInput = modal.querySelector('input');
    setTimeout(() => firstInput?.focus(), 150);
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn?.addEventListener('click', closeModal);

  // Close when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  // Modal Form Submission
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        Creando cuenta...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        modalForm.reset();
        closeModal();
        showToast('🎉 ¡Cuenta creada con éxito! Revisa tu correo para verificar tu identidad.', 'success');
      }, 1200);
    });
  }
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function initToast() {
  if (!document.getElementById('toastContainer')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || document.body;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <div class="toast__content">
      <span class="toast__icon">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span class="toast__text">${message}</span>
    </div>
    <button class="toast__close" aria-label="Cerrar">&times;</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  const closeToast = () => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('.toast__close')?.addEventListener('click', closeToast);
  setTimeout(closeToast, 4500);
}

/* ==========================================================================
   7. Smooth Scrolling
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
