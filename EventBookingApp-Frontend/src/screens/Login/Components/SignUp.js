import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { validateFormFields } from "../Validation";
import { signUp } from "../Services";
import Toast from "../../../common/Components/Toast";
import AuthInputField from "./AuthInputField";

const SignupPage = () => {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    setErrors((prevErrors) => {
      const fieldErrors = validateFormFields({
        ...formData,
        [name]: updatedValue,
      });
      if (submitted) {
        return fieldErrors;
      } else {
        return { ...prevErrors, [name]: fieldErrors[name] };
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };
  const handleFocus = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateFormFields(formData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFormFields(formData);
    setErrors(validationErrors);

    setSubmitted(true);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await signUp(formData);
        if (response.statusCode === 200) {
          setSnackbar({
            show: true,
            message: `Registered successfully!`,
            type: "success",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setSnackbar({
            show: true,
            message: `User already exists`,
            type: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          show: true,
          message: `User already exists`,
          type: "error",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-border/20">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <span className="bg-primary p-2.5 rounded-lg">
              <SparklesIcon className="h-7 w-7 text-primary-foreground" />
            </span>
            <span className="text-foreground text-3xl font-bold">Eventify</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Create an Account
          </h1>
          <p className="text-muted-foreground mt-1">
            Join us and start discovering amazing events!
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AuthInputField
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={touched.name ? errors.name : ""}
            onFocus={handleFocus}
            onBlur={handleBlur}
            icon={UserIcon}
          />
          <AuthInputField
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={touched.email ? errors.email : ""}
            onFocus={handleFocus}
            onBlur={handleBlur}
            icon={EnvelopeIcon}
          />
          <AuthInputField
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            error={touched.phone ? errors.phone : ""}
            onFocus={handleFocus}
            onBlur={handleBlur}
            icon={PhoneIcon}
          />
          <AuthInputField
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            error={touched.password ? errors.password : ""}
            onFocus={handleFocus}
            onBlur={handleBlur}
            icon={LockClosedIcon}
          />

          <button
            type="submit"
            className="w-full text-center bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Log in
          </Link>
        </p>
      </div>

      {snackbar.show && (
        <Toast
          show={snackbar.show}
          message={snackbar.message}
          type={snackbar.type}
          onClose={handleCloseSnackbar}
        />
      )}
    </div>
  );
};

export default SignupPage;
