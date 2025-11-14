const InputField = ({ label, id, type, value, onChange, readOnly = false }) => (
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
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
    />
  </div>
);

export default InputField;
