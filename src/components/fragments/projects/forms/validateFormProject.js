import axios from "axios";

// Function to validate form fields for add project
export const validateFormProjectFields = (
  project_name,
  selectedUser,
  // startDate,
  // finishDate
) => {
  // Validate project_name: Should not be empty
  const isValidProjectName = project_name !== "";

  // Validate selectedUser: Should not be empty
  const isValidUserName = selectedUser.trim() !== "";

  // Validate startDate: Should be a valid date and greater than the current time
  // const isValidStartDate = startDate !== "" && new Date(startDate) > new Date();

  // // Validate finishDate: Should be a valid date and later than the start date
  // const isValidFinishDate =
  //   finishDate !== "" && new Date(finishDate) > new Date(startDate);

  return (
    isValidProjectName &&
    // isValidStartDate &&
    // isValidFinishDate &&
    isValidUserName
  );
};
