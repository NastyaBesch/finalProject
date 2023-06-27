import axios from "axios";

export const validateFormFields = (
  user_name,
  last_name,
  password_hash,
  email,
  selectedRole
) => {
  if (user_name.trim() === "" || !/^[א-ת]+$/i.test(user_name)) {
    setUserName("");
    setErrorMessage("אנא הכנס שם פרטי תקין");
    console.log("validate user name section");
    return { isValid: false, errorMessage: "אנא הכנס שם פרטי תקין" };
  }

  if (last_name.trim() === "" || !/^[א-ת]+$/i.test(last_name)) {
    return { isValid: false, errorMessage: "בבקשה הכנס שם משפחה תקף" };
  }

  if (password_hash.trim() === "" || !/^\d{4}$/.test(password_hash)) {
    return { isValid: false, errorMessage: "בבקשה הכנס סיסמה תקינה" };
  }

  if (
    email.trim() === "" ||
    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(email)
  ) {
    return { isValid: false, errorMessage: "בבקשה הכנס כתובת אימייל תקינה" };
  }

  if (selectedRole.trim() === "") {
    return { isValid: false, errorMessage: "בבקשה תבחר שם תפקיד" };
  }

  return { isValid: true, errorMessage: "" };
};

export const checkEmailExists = (email) => {
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
