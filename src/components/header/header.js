/* eslint-disable no-unused-vars, no-shadow */
(() => {
  /**
   * ---------------------------------------------------------------------------
   * TOGGLE SEARCH FORM ON MOBILES
   * ---------------------------------------------------------------------------
   */
  const form = document.getElementById('search-drawer');
  const scrim = document.getElementById('search-scrim');

  const closeSearch = () => {
    form.classList.remove('is-open');
    scrim.classList.remove('is-on');
  };

  const openSearch = (event) => {
    event.preventDefault();

    /* When the search form is already open, and the user clicks the search trigger,
    we don't want to rerun the entire event registration. We'll add an early
    return for that. */
    if (form.classList.contains('is-open')) {
      return;
    }

    // Show search and scrim
    form.classList.add('is-open');
    scrim.classList.add('is-on');
  };

  // Event Listener
  if (form && scrim) {
    window.addEventListener('click', (event) => {
      if (event.target.closest('[data-search-btn]')) {
        openSearch(event);
      } else {
        closeSearch();
      }

      if (event.target.matches('[data-search-cancel]')) {
        closeSearch();
      }
    });
  }

  /**
   * ---------------------------------------------------------------------------
   * SHOW HEADER WHEN START SCROLLING UP ON TABLETS AND DESKTOPS
   * ---------------------------------------------------------------------------
   */
  if (!document.body.classList.contains('is-home')) {
    let prevScrollPos = window.pageYOffset;
    const header = document.getElementById('header');

    window.addEventListener(
      'scroll',
      () => {
        const currentScrollPos = window.pageYOffset;
        if (currentScrollPos > prevScrollPos) {
          header.style.setProperty('--top-position', '-138px');
        } else {
          header.style.setProperty('--top-position', '0');
        }
        prevScrollPos = currentScrollPos;
      },
      false
    );
  }
})();
