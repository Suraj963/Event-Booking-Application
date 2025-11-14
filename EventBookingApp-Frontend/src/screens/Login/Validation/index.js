const validateFormFields = (formData) => {
  const errors = {};

  if (!formData.name || !formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
    errors.name = "Name should only contain letters and spaces";
  }

  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
  }

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s+/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone =
        "Phone number must start with 6-9 and be exactly 10 digits";
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
};

const validateLoginFields = (formData) => {
  const errors = {};

  if (!formData.phone || !formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s+/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone =
        "Phone number must start with 6-9 and be exactly 10 digits";
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
};

export { validateFormFields, validateLoginFields };
