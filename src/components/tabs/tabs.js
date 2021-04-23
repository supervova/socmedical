// const tabs = [].slice.call(
//   document.querySelectorAll('.tabbed-section__tabs a')
// );

// panels = document.querySelectorAll('[role="tabpanel"]');

const tabs = document.querySelectorAll('[role="tab"]');

function openTabPanel(event) {
  const elem = event.currentTarget;
  const parent = elem.closest('[data-tabbed]');
  const siblings = parent.querySelectorAll('[role="tab"]');
  const tabPanels = parent.querySelectorAll('[role="tabpanel"]');
  const tabPanel = document.getElementById(elem.getAttribute('aria-controls'));

  // Deselect selected tabs
  siblings.forEach((tab) => {
    tab.setAttribute('aria-expanded', false);
    tab.classList.remove('is-active');
  });

  // Hide open tabs: remove .is-active from .tabs__pane
  tabPanels.forEach((panel) => {
    panel.classList.remove('is-active');
  });

  // Show the current tab: add an "is-active" class
  tabPanel.classList.add('is-active');
  elem.classList.add('is-active');
}

tabs.forEach((tab) => {
  tab.addEventListener('click', (e) => {
    e.preventDefault();
    openTabPanel(e);
  });
});
