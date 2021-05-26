(() => {
  /**
   * ---------------------------------------------------------------------------
   * HIDE FIXED NAVBAR AND HEADER WHEN FOOTER APPEARS IN A VIEWPORT
   * ---------------------------------------------------------------------------
   */
  if (window.matchMedia('(min-width: 768px)').matches) {
    const { body } = document;
    const footer = document.getElementById('footer');

    const config = {
      /* To track the scrolling of not a document, but some node, we need
      to set the root property and pass to it some element selected, for example,
      with the getElementById method */
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      /* Entries is an array of observed dom nodes. We're only interested in the
      first one at [0]. It's the footer, our trigger node. Here observe whether
      or not that node is in the viewport */
      if (entries[0] && entries[0].isIntersecting) {
        body.classList.add('has-hidden-stickies');
      } else {
        body.classList.remove('has-hidden-stickies');
      }
    }, config);

    observer.observe(footer);
  }
})();
