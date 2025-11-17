import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PhoneIcon,
  LockClosedIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import AuthInputField from "./AuthInputField";
import { validateLoginFields } from "../Validation";
import Toast from "../../../common/Components/Toast";
import { signIn } from "../Services";
import { AuthContext } from "../../../auth";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
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
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));

    setErrors((prevErrors) => {
      const fieldErrors = validateLoginFields({
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
    const fieldErrors = validateLoginFields(formData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginFields(formData);
    setErrors(validationErrors);

    setSubmitted(true);
    setTouched({
      phone: true,
      password: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      localStorage.removeItem("token");
      try {
        const response = await signIn(formData);
        if (response.statusCode === 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("role", response.data.user.role);
          login();
          setSnackbar({
            show: true,
            message: `Logged in successfully!`,
            type: "success",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setSnackbar({
            show: true,
            message: `Incorrect Phone or Password`,
            type: "error",
          });
        }
      } catch (error) {
        setSnackbar({
          show: true,
          message: `Incorrect Phone or Password`,
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
            <img
              src="/logo.png"
              alt="Golden Occasions Logo"
              className="h-14 w-auto" // Set to h-14 as in your code
            />
            {/* Added whitespace-nowrap */}
            <span className="text-foreground text-2xl font-bold whitespace-nowrap">
              Golden Occasions
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground mt-1">
            Log in to continue your event journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
            Log In
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-muted-foreground mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Sign up
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

export default LoginPage;
