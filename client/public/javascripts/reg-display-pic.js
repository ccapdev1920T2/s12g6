// let imgInput = document.getElementById("file-input");
// let imageUpload = document.getElementById("image-upload");
// let dpView = document.getElementById("dp-view");
// let dpMainImg = document.getElementById("dp-main-img");
// let imgCtr = 0;

// const showDP = function() {
//     if (imgInput.files.length > 0) {
//         dpView.style.display = "flex";
//         imageUpload.style.display = "none";

//         let reader = new FileReader();
//         let dpOther = document.getElementById("dp-other");
//         let addNew = document.getElementById("add-new");

//         if (imgInput.files.length === 1) { // Show uploaded image as main image 
//             reader.onload = e => {
//                 dpMainImg.src = e.target.result;

//                 let dpOtherImg = document.createElement("img");                
//                 dpOtherImg.src = dpMainImg.src;
//                 dpOther.prepend(dpOtherImg);  
//                 addNew.style.display = "flex";
//             }
//             reader.readAsDataURL(imgInput.files[0]);
//         } else { // Show uploaded images as thumbnails
//             reader.onload = e => {
//                 let dpOtherImg = document.createElement("img");
//                 dpOtherImg.src = e.target.result;
//                 dpOtherImg.appendChild(dpOtherImg);
//             }
//         }
//     }
// }
// imgInput.addEventListener("change", showDP); 
