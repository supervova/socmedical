'use strict mode';

(() => {
  // To save mobile traffic, we prevent downloading videos on phones and tablets
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.video.is-bg source').forEach((el) => {
      el.setAttribute('src', el.getAttribute('data-src'));
    });
  }
})();
