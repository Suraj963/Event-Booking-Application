const FormatDate = (timestamp) => {
  const date = new Date(timestamp);

  // Format date as "26 Sep 2025"
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formattedDate;
};

const convertTo12Hour = (time24) => {
  if (!time24 || typeof time24 !== "string") {
    return "";
  }

  let [hours, minutes] = time24.split(":");
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes} ${period}`;
};

const FormatApiDateTime = (timestamp, timeString) => {
  if (!timestamp || !timeString) return "Date & Time not available";
  const date = new Date(timestamp);
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  let [hours, minutes] = timeString.split(":");
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${formattedDate} • ${hours}:${minutes} ${period}`;
};

export { FormatDate, convertTo12Hour, FormatApiDateTime };
