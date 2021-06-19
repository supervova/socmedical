// .dropdown(data-dropdown)
//   button.dropdown__toggle(data-dropdown-toggle)
//   ul.dropdown__menu(data-dropdown-menu)

/**
 * Change dropdown labels
 */

/**
 * Close dropdowns
 *
 * @param {object} dropdown Open dropdown menu
 */
function closeDropdowns(dropdown) {
  dropdown.classList.remove('is-open');
  dropdown
    .closest('[data-dropdown]')
    .querySelector('[data-dropdown-toggle]')
    .setAttribute('aria-expanded', false);
}

/**
 * Click on dropdown label
 * When the user clicks on the label, toggle dropdown
 *
 * @param {object} event
 */
function toggleDropdownOnLabelClick(event) {
  const button = event.target;
  const dropdownMenu = button
    .closest('[data-dropdown]')
    .querySelector('[data-dropdown-menu]');

  // Close already open dropdown
  const openDropdown = document.querySelector('.is-open[data-dropdown-menu]');
  if (openDropdown && openDropdown !== dropdownMenu) {
    closeDropdowns(openDropdown);
  }

  // Toggle dropdowns
  dropdownMenu.classList.toggle('is-open');

  // Toggle aria-expanded value
  if (button.getAttribute('aria-expanded') === 'true') {
    button.setAttribute('aria-expanded', 'false');
  } else {
    button.setAttribute('aria-expanded', 'true');
  }
}

// LISTENERS
window.addEventListener('click', (event) => {
  if (event.target.matches('[data-dropdown-toggle]')) {
    toggleDropdownOnLabelClick(event);
  } else {
    document
      .querySelectorAll('[data-dropdown-menu].is-open')
      .forEach((dropdown) => {
        closeDropdowns(dropdown);
      });
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Esc' || event.key === 'Escape') {
    document
      .querySelectorAll('[data-dropdown-menu].is-open')
      .forEach((dropdown) => {
        closeDropdowns(dropdown);
      });
  }
});

/**
 * Remove nbsp; from edit menu item
 */
(() => {
  const editBtn = document.getElementById('dropdown-menu-edit');

  if (editBtn) {
    editBtn.innerHTML.replace(/&nbsp;/gi, '');
  }
})();
