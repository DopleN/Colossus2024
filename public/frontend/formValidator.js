class FormValidator {
  constructor() {
    this.initializeValidation();
  }

  initializeValidation() {
    // Select all forms that need custom Bootstrap validation styles
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over each form and prevent submission if invalid
    forms.forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated');
      });
    });
  }
}

export default FormValidator;
