import React from "react";

const CountCard = ({ icon, count, label }) => {
  return (
    <div className="bg-card/50 border-t-4 border-primary p-6 rounded-lg text-center shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
      <div className="flex justify-center items-center mb-4">
        {React.cloneElement(icon, { className: "h-8 w-8 text-primary" })}
      </div>

      <p className="text-4xl font-bold text-foreground mb-1">{count}</p>

      <p className="text-base text-muted-foreground">{label}</p>
    </div>
  );
};

export default CountCard;
