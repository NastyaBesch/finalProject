/************************************************** */
// Parses a date string and returns a standardized date format
/************************************************** */

const parseDate = (dateString) => {
  // Check if the date string uses "/" or "-" as separators
  if (dateString.includes("/") || dateString.includes("-")) {
    let day, month, year;

    // Split the date components based on the separator used
    if (dateString.includes("/")) {
      [day, month, year] = dateString.split("/");
    } else if (dateString.includes("-")) {
      [year, month, day] = dateString.split("-");
    }

    // Return a new Date object with the standardized format "YYYY-MM-DD"
    return new Date(`${year}-${month}-${day}`);
  } else {
    // If the date string has no separator, create a Date object
    const date = new Date(dateString);

    // Get day, month, and year components with zero padding if necessary
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Return the standardized date string "DD-MM-YYYY"
    return `${day}-${month}-${year}`;
  }
};

// Export the 'parseDate' object so it can be used in other parts of the application
module.exports = parseDate;