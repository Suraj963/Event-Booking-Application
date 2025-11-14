const validateEventFormFields = (formData) => {
  const errors = {};

  if (!formData.eventName || !formData.eventName.trim()) {
    errors.eventName = "Event name is required";
  } else if (formData.eventName.trim().length < 2) {
    errors.eventName = "Event name must be at least 2 characters";
  }

  if (!formData.location || !formData.location.trim()) {
    errors.location = "Location is required";
  } else if (formData.location.trim().length < 3) {
    errors.location = "Location must be at least 3 characters";
  }

  if (!formData.eventType) {
    errors.eventType = "Event type is required";
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = "Description is required";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!formData.eventDate) {
    errors.eventDate = "Event date is required";
  }

  if (!formData.eventTime) {
    errors.eventTime = "Event time is required";
  }

  if (!formData.totalSeats) {
    errors.totalSeats = "Total seats are required";
  } else if (isNaN(formData.totalSeats) || formData.totalSeats < 1) {
    errors.totalSeats = "Total seats must be at least 1";
  }

  if (!formData.availableSeats) {
    errors.availableSeats = "Available seats are required";
  } else if (isNaN(formData.availableSeats) || formData.availableSeats < 0) {
    errors.availableSeats = "Available seats must be 0 or greater";
  } else if (+formData.availableSeats > +formData.totalSeats) {
    errors.availableSeats = "Available seats cannot exceed total seats";
  }

  if (!formData.price && formData.price !== 0) {
    errors.price = "Price is required";
  } else if (isNaN(formData.price) || formData.price < 0) {
    errors.price = "Price must be 0 or a positive amount";
  }

  if (!formData.image) {
    errors.image = "Event image is required";
  }

  return errors;
};

export { validateEventFormFields };
