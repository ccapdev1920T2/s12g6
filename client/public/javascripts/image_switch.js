let ind = 0;
let images = document.getElementsByClassName("img-item")
let imgMain = document.getElementById("img-main");
images[0].style.opacity = 1
ind = 1;

function nextImage() {
    imgMain.src = `${images[ind].src}`;
    images[ind].style.opacity = 1
    if (ind === 0) 
        images[images.length - 1].style.opacity = 0.5
    else images[ind - 1].style.opacity = 0.5
    ind = ind === images.length - 1 ? 0 : ind + 1;
}

function viewImage(id) {
    let imgToView = document.getElementById(id);
    imgMain.src = imgToView.src;

    for (let i=0; i<images.length; i++) {
        if (images[i] === imgToView) {
            images[i].style.opacity = 1;
            for (let i=0; i<images.length; i++) {
                if (images[i] !== imgToView) 
                    images[i].style.opacity = 0.5;
            }
        }
    }
}

setInterval(nextImage, 10000);