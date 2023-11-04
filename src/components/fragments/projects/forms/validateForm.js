import axios from "axios";

// Function to validate form fields for employee update
export const validateFormUpdateFields = (
  user_name,
  last_name,
  password_hash,
  email,
) => {
  // Validate user_name: Should contain only Hebrew letters
  const isValidUserName = /^[א-ת]+$/i.test(user_name.trim());
 
  // Validate last_name: Should contain only Hebrew letters
  const isValidLastName = /^[א-ת]+$/i.test(last_name.trim());

  // Validate password_hash: Should be a 4-digit number
  const isValidPassword = /^\d{4}$/.test(password_hash.trim());

  // Validate email: Should be a valid email format
  const isValidEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(
    email.trim()
  );

  // Validate selectedRole: Not used in the code

  return (
    isValidUserName && isValidLastName && isValidPassword && isValidEmail
    // &&
    // isValidSelectedRole
  );
};

// Function to check if an email exists
export const checkEmailExists = (email) => {
  // Send a POST request to the server to check email existence
  return axios
    .post("http://localhost:4000/api/emailCount", { email })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error checking email:", error);
      return false;
    });
};


