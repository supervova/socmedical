/**
 * -----------------------------------------------------------------------------
 * FORM VALIDATION
 * -----------------------------------------------------------------------------
 * Add the novalidate attribute to the <form>.
 * Use 'form is-validating' classes and forms.forEach((form) => {}) loop instead
 * of the 'form-needs-validation' id to validate more than one form per page.
 */

(() => {
  const form = document.getElementById('form-needs-validation');

  if (form) {
    const inputs = form.querySelectorAll(':required, [pattern]');
    const button = form.querySelector('.btn.is-submit');

    /**
     * Add and remove .has-error to multi-inputs rows
     * @param {object} el is checked input
     */
    const checkRow = (el) => {
      const row = el.closest('.form__row');
      if (row) {
        if (!el.checkValidity()) {
          row.classList.add('has-error');
        } else {
          row.classList.remove('has-error');
        }
      }
    };

    // Add and remove validation classes on blur
    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        // add .is-touched on input
        input.classList.add('is-touched');

        // SERVER-SIDE: remove the class added at the server validation stage
        // input.classList.remove('is-invalid');

        checkRow(input);

        // SERVER-SIDE: remove validation class after fix attempt
        // const errorGroup = input.closest('.form__item.has-error');

        // if (errorGroup) {
        //   errorGroup.classList.remove('has-error');
        // }
      });
    });

    // Disabling form submissions if there are invalid fields
    form.addEventListener(
      'submit',
      (event) => {
        // Prevent invalid form submission
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          button.classList.add('has-spinner');
          button.disabled = true;
        }

        form.classList.add('has-been-validated');
      },
      false
    );
  }
})();
