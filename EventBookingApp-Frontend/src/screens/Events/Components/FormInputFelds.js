import React, { useEffect, useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { API_URI } from "../../../common/Components";

// Input Field Component
const InputField = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  onFocus,
  onBlur,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-muted-foreground mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value || ""}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full bg-input border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:ring-2 focus:outline-none ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-border focus:ring-primary"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Text Area Component
const TextAreaField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  onFocus,
  onBlur,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-muted-foreground mb-2"
    >
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value || ""}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      rows="4"
      className={`w-full bg-input border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:ring-2 focus:outline-none ${
        error
          ? "border-red-500 focus:ring-red-500"
          : "border-border focus:ring-primary"
      }`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

// Image Upload Component
const ImageUploadField = ({ id, label, imageData, onChange, error }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (imageData) {
      if (typeof imageData === "string") {
        setPreviewUrl(`${imageData}`);
      } else if (imageData instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(imageData);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [imageData]);

  const getFileName = () => {
    if (!imageData) return "";
    if (typeof imageData === "string") return imageData;
    if (imageData.name) return imageData.name;
    return "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </label>
      <label
        htmlFor={id}
        className={`mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10 cursor-pointer hover:border-primary transition-colors ${
          error ? "border-red-500" : "border-border"
        }`}
      >
        <div className="text-center">
          <PhotoIcon
            className={`mx-auto h-12 w-12 ${
              error ? "text-red-500" : "text-muted-foreground"
            }`}
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
            <p className="relative font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-card hover:text-primary/80">
              <span>Upload a file</span>
            </p>
            <p className="pl-1">or drag and drop</p>
          </div>
          {getFileName() ? (
            <p className="text-sm text-foreground mt-2">{getFileName()}</p>
          ) : (
            <p className="text-xs leading-5 text-muted-foreground">
              PNG, JPG, GIF up to 10MB
            </p>
          )}
        </div>
        <input
          id={id}
          name={id}
          type="file"
          className="sr-only"
          onChange={onChange}
          accept="image/*"
        />
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600 text-center">{error}</p>
      )}

      {previewUrl && (
        <div className="mt-4 flex justify-center">
          <img
            src={previewUrl}
            alt="Event Preview"
            className="max-w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

// Event Type Selector Component
const EventTypeSelector = ({ selectedType, onTypeChange, error }) => {
  const types = [
    "Music",
    "Comedy",
    "Art",
    "Conference",
    "Sports",
    "Theater",
    "Other",
  ];
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Event Type
      </label>
      <div className="flex flex-wrap gap-3">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onTypeChange(type)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
              selectedType === type
                ? "bg-primary text-primary-foreground"
                : "bg-input text-muted-foreground hover:bg-muted hover:text-foreground"
            } ${error ? "border-2 border-red-500" : ""}`}
          >
            {type}
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export { InputField, TextAreaField, ImageUploadField, EventTypeSelector };
