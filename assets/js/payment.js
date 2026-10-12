(function () {
  'use strict';

  const TIERS = {
    personal: { name: 'Personal', amount: 29,  meta: 'One-time · 1 Mac' },
    pro:      { name: 'Pro',      amount: 79,  meta: 'One-time · 1 Mac' }
  };

  function readTierFromQuery() {
    const tier = new URLSearchParams(window.location.search).get('tier');
    return TIERS[tier] ? tier : 'pro';
  }

  function digits(v) { return v.replace(/\D/g, ''); }

  function brandOf(num) {
    if (/^4/.test(num)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    return '';
  }

  function formatCardNumber(value) {
    const d = digits(value);
    if (brandOf(d) === 'amex') {
      return d.slice(0, 15).replace(/^(\d{4})(\d{1,6})?(\d{1,5})?$/, (m, a, b, c) => [a, b, c].filter(Boolean).join(' '));
    }
    return d.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(value) {
    const d = digits(value).slice(0, 4);
    if (d.length < 3) return d;
    return d.slice(0, 2) + ' / ' + d.slice(2);
  }

  function luhn(num) {
    let sum = 0, alt = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = +num[i];
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function expiryValid(v) {
    const d = digits(v);
    if (d.length !== 4) return false;
    const m = +d.slice(0, 2), y = 2000 + +d.slice(2);
    if (m < 1 || m > 12) return false;
    const now = new Date();
    return y > now.getFullYear() || (y === now.getFullYear() && m >= now.getMonth() + 1);
  }

  // Count the displayed price from its current value to the new one.
  function animateAmount(els, from, to) {
    const start = performance.now(), dur = 420;
    function step(t) {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      const v = Math.round(from + (to - from) * e);
      els.forEach((fn) => fn(v));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function init() {
    const form = document.getElementById('payment-form');
    if (!form) return;
    const { setError, clearErrorOnInput, setBusy, showTimeout, isEmail, wait } = window.AuthUI;

    const summaryTier = document.getElementById('summary-tier');
    const summaryMeta = document.getElementById('summary-meta');
    const summaryAmount = document.getElementById('summary-amount');
    const payBtn = document.getElementById('pay-btn');
    const accountBtn = document.getElementById('account-btn');
    const payLabel = payBtn.querySelector('[data-btn-label]');
    const accountLabel = accountBtn.querySelector('[data-btn-label]');
    const switcher = document.querySelector('.plan-switch');
    const pill = switcher.querySelector('.plan-switch-pill');
    const opts = Array.from(switcher.querySelectorAll('.plan-switch-opt'));

    let current = readTierFromQuery();
    let shownAmount = TIERS[current].amount;

    function renderAmount(v) {
      summaryAmount.textContent = '$' + v;
      payLabel.textContent = 'Pay $' + v;
      accountLabel.textContent = 'Create account & pay $' + v;
    }

    function movePill() {
      const active = opts.find((o) => o.dataset.tier === current);
      pill.style.width = active.offsetWidth + 'px';
      pill.style.transform = 'translateX(' + active.offsetLeft + 'px)';
    }

    function selectTier(tier, animate) {
      current = tier;
      const t = TIERS[tier];
      opts.forEach((o) => {
        const on = o.dataset.tier === tier;
        o.setAttribute('aria-checked', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
      });
      summaryTier.textContent = t.name;
      summaryMeta.textContent = t.meta;
      if (animate) animateAmount([renderAmount], shownAmount, t.amount);
      else renderAmount(t.amount);
      shownAmount = t.amount;
      movePill();
      const url = new URL(window.location.href);
      url.searchParams.set('tier', tier);
      url.searchParams.delete('amount');
      history.replaceState(null, '', url);
    }

    opts.forEach((o, i) => {
      o.addEventListener('click', () => selectTier(o.dataset.tier, true));
      o.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const next = opts[(i + (e.key === 'ArrowRight' ? 1 : opts.length - 1)) % opts.length];
        next.focus();
        selectTier(next.dataset.tier, true);
      });
    });
    selectTier(current, false);
    requestAnimationFrame(() => switcher.classList.add('is-ready'));
    window.addEventListener('resize', movePill);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(movePill);

    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvc = document.getElementById('card-cvc');
    const cardName = document.getElementById('card-name');
    const brandEl = document.getElementById('card-brand');

    cardNumber.addEventListener('input', (e) => {
      e.target.value = formatCardNumber(e.target.value);
      brandEl.dataset.brand = brandOf(digits(e.target.value));
    });
    cardExpiry.addEventListener('input', (e) => {
      const deleting = e.inputType && e.inputType.startsWith('delete');
      e.target.value = deleting ? e.target.value : formatExpiry(e.target.value);
    });
    cardCvc.addEventListener('input', (e) => {
      e.target.value = digits(e.target.value).slice(0, 4);
    });
    clearErrorOnInput(form);

    function validateCard() {
      let ok = true;
      const num = digits(cardNumber.value);
      const isAmex = brandOf(num) === 'amex';
      if (num.length < (isAmex ? 15 : 16) || !luhn(num)) { setError(form, 'card-number', 'Your card number is invalid.'); ok = false; }
      if (!expiryValid(cardExpiry.value)) { setError(form, 'card-expiry', digits(cardExpiry.value).length === 4 ? 'Your card has expired.' : 'Enter a valid expiry date.'); ok = false; }
      if (digits(cardCvc.value).length !== (isAmex ? 4 : 3)) { setError(form, 'card-cvc', 'Your security code is incomplete.'); ok = false; }
      if (cardName.value.trim().length < 2) { setError(form, 'card-name', 'Enter the name on the card.'); ok = false; }
      return ok;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateCard()) return;
      if (window.mtTrack) window.mtTrack('checkout_card', { tier: current });
      setBusy(payBtn, true, 'Verifying card…');
      await wait(1600);
      document.getElementById('payment-form-wrap').hidden = true;
      document.getElementById('account-step').hidden = false;
      document.getElementById('acct-email').focus();
      setBusy(payBtn, false, 'Pay $' + TIERS[current].amount);
    });

    const accountForm = document.getElementById('account-form');
    const alertEl = document.getElementById('account-alert');
    clearErrorOnInput(accountForm);

    accountForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = accountForm.email.value.trim();
      const password = accountForm.password.value;
      let ok = true;
      if (!isEmail(email)) { setError(accountForm, 'acct-email', 'Enter a valid email address.'); ok = false; }
      if (password.length < 8) { setError(accountForm, 'acct-password', 'Use at least 8 characters.'); ok = false; }
      if (!ok) return;

      alertEl.hidden = true;
      if (window.mtTrack) window.mtTrack('checkout_submit', { tier: current });
      setBusy(accountBtn, true, 'Creating your account…');
      await wait(4000);
      setBusy(accountBtn, true, 'Issuing licence key…');
      await wait(4500);

      showTimeout(alertEl, {
        title: 'We couldn’t finish setting up your account.',
        body: 'The licensing service didn’t respond in time, so nothing was completed and <strong>your card has not been charged</strong>. This is usually temporary — please try again in a few minutes.',
        code: '504 Gateway Timeout · lic-eu-west-1'
      });
      setBusy(accountBtn, false, 'Try again');
      if (window.mtTrack) window.mtTrack('checkout_error', { tier: current });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
