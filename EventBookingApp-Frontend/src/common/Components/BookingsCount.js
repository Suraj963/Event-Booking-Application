import React from "react";

const BookingsCount = ({ icon, count, label, color }) => {
  const colorClasses = {
    bg: `bg-${color}/20`,
    text: `text-${color}`,
  };

  if (color === "primary") {
    colorClasses.bg = "bg-primary/20";
    colorClasses.text = "text-primary";
  }

  return (
    <div className="bg-card/50 p-6 rounded-2xl flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
        {React.cloneElement(icon, {
          className: `h-6 w-6 ${colorClasses.text}`,
        })}
      </div>
      <div>
        <p className="text-3xl font-bold text-foreground">{count}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default BookingsCount;
