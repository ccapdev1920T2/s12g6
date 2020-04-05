
// const signUpButton = document.getElementById("signUp");
// let highlight = false;
// const retypePassword = document.getElementById("retypePassword");

// const validate = function() {
//     // check if all values are not empty
//     const email = document.getElementById("email").value;
//     const phoneNum = document.getElementById("phoneNum").value;
//     const password = document.getElementById("password").value;
//     const password2 = document.getElementById("retypePassword").value;
//     const terms = document.getElementById("terms").checked;

//     if (email != "" &&      // check for not empty
//         phoneNum != "" &&
//         password != "" &&
//         password2 != "" &&
//         terms)              // check if ticked 
//     {
//         if (!highlight) {
//             highlight = true;
//             signUpButton.removeAttribute("disabled");
//             signUpButton.setAttribute("class", "btn btn-primary highlight");
//         }
//     } else {
//         if (highlight) {
//             highlight = false;
//             signUpButton.disabled = true;
//             signUpButton.setAttribute("class", "btn btn-primary highlight unhighlight");
//         }
//     }
// }

// window.onkeyup = validate;
// window.onclick = validate;

// function validatePassword(password) {
//     // hide not same password error
//     if (password.length == 0) {
//         // hide all errors
//         return;
//     }
    
//     let str = 0;
//     let regex = [
//         "[@$!%*#?&_.]",
//         "[A-Z]", 
//         "[0-9]",
//         "[a-z]"
//     ];
    
//     regex.forEach((r) => {
//         if (new RegExp(r).test(password)) {
//             console.log(r);
//             str++;
//         }
//     });

//     switch(str) {
//         case 1:
//             console.log("very weak");
//             return false;
//         case 2:
//             console.log("weak");
//             return false;
//         case 3:
//             console.log("strong");
//             return true;
//         case 4:
//             console.log("very strong");
//             return true;
//     }
// }
