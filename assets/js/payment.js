(function () {
  'use strict';

  function readTierFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get('tier');
    const amount = params.get('amount');
    const valid = {
      personal: { name: 'Personal', amount: 49 },
      pro:      { name: 'Pro',      amount: 99 },
      team:     { name: 'Team',     amount: 249 }
    };
    if (tier && valid[tier]) {
      return valid[tier];
    }
    return { name: 'Pro', amount: 99, fallback: true };
  }

  function formatCardNumber(value) {
    return value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length < 3) return digits;
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }

  function init() {
    const form = document.getElementById('payment-form');
    if (!form) return;

    const summaryTier = document.getElementById('summary-tier');
    const summaryAmount = document.getElementById('summary-amount');
    const payBtn = document.getElementById('pay-btn');
    const resultSuccess = document.getElementById('payment-success');
    const resultDeclined = document.getElementById('payment-declined');

    const tier = readTierFromQuery();
    if (summaryTier) summaryTier.textContent = tier.name;
    if (summaryAmount) summaryAmount.textContent = '$' + tier.amount;
    if (payBtn) payBtn.textContent = 'Pay $' + tier.amount;

    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
      cardNumber.addEventListener('input', function (e) {
        const cursor = e.target.selectionStart;
        const before = e.target.value;
        e.target.value = formatCardNumber(before);
        if (document.activeElement === e.target) {
          e.target.setSelectionRange(cursor, cursor);
        }
      });
    }

    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
      cardExpiry.addEventListener('input', function (e) {
        const cursor = e.target.selectionStart;
        const before = e.target.value;
        e.target.value = formatExpiry(before);
        if (document.activeElement === e.target) {
          e.target.setSelectionRange(cursor, cursor);
        }
      });
    }

    const cardCvc = document.getElementById('card-cvc');
    if (cardCvc) {
      cardCvc.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      btn.disabled = true;
      btn.textContent = 'Processing…';

      setTimeout(function () {
        const rawNumber = (cardNumber ? cardNumber.value : '').replace(/\s/g, '');
        form.hidden = true;

        if (rawNumber === '4000000000000002') {
          if (resultDeclined) resultDeclined.hidden = false;
        } else {
          try {
            sessionStorage.setItem('minutely_mock_purchase', JSON.stringify({
              tier: tier.name,
              amount: tier.amount,
              at: Date.now()
            }));
          } catch (err) {}
          if (resultSuccess) resultSuccess.hidden = false;
        }
      }, 900);
    });

    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', function () {
        if (resultDeclined) resultDeclined.hidden = true;
        form.hidden = false;
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Pay $' + tier.amount;
        }
        if (cardNumber) cardNumber.focus();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();