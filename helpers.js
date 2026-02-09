function validateFormData(formEl, rules = {}) {
  const formData = new FormData(formEl);
  const form = {};
  const errors = {};

  // trim all values
  for (const [name, value] of formData.entries()) {
    form[name] = value.trim();
  }

  // validation
  for (const field in rules) {
    const value = form[field];
    const fieldRules = rules[field];

    if (fieldRules.includes('required') && !value) {
      errors[field] = `${ucFirst(field)} is required`;
      continue;
    }

    if (fieldRules.includes('number') && isNaN(value)) {
      errors[field] = `${ucFirst(field)} must be a number`;
      continue;
    }
  }

  return {
    data: form,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

const ucFirst = (str = '') => (str ? str[0].toUpperCase() + str.slice(1) : '');

function displayErrors(errors, form) {
  for (const name in errors) {
    let field = form[name];
    const errorElement = document.createElement('small');
    errorElement.classList.add('text-danger');
    errorElement.classList.add('form-error');
    errorElement.textContent = errors[name];
    field.after(errorElement);
  }
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const pad = (num) => String(num).padStart(2, '0');

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

