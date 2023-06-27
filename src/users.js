// "use strict";

// console.log("abcd");
// function checkUserName(name) {
//   return /^[a-zA-Z]*$/.test(name);
// }

// function checkPassword(pass) {
//   return /^[A-Za-z0-9]*$/.test(pass);
// }

// const form = document.querySelector("form");

// form.addEventListener("submit", checkInfo);

// function checkInfo(ev) {
//   ev.preventDefault();
//   const username = form.querySelector("#username").value;
//   const password = form.querySelector("#password").value;

//   if (!checkUserName(username) || !checkPassword(password)) {
//     const err = document.querySelector("#error");
//     err.textContent = "Error: incorrect input";
//     form.reset();
//   } else {
//     if (username === "" || password === "") {
//       const err = document.querySelector("#error");
//       err.textContent = "Error: incorrect input";
//       form.reset();
//     } else {
//       const err = document.querySelector("#error");
//       err.textContent = "";
//       const data = {
//         username: username,
//         password: password,
//       };

//       fetch("login", {
//         method: "POST",
//         header: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }).then((res) => {
//         if (res.status === 200) {
//           location.href = "../index.html";
//         }

//         if (res.status === 401) {
//           err.textContent = "Error: user not found";
//           form.reset();
//         }
//       });
//     }
//   }
// }
