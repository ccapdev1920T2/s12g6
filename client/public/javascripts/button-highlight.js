const buttonHighlight = function() {
    const nextBtn = document.getElementById("next");
    let highlight = false;
    let inputs = document.querySelectorAll("input");
    let ctr = 0;
    
    for (let i=0; i<inputs.length; i++) {
        if (inputs[i].value.length !== 0) ctr++;
    }

    if (ctr === inputs.length) {
        if (!highlight) {
            highlight = true;
            nextBtn.removeAttribute("disabled");
            nextBtn.setAttribute("class", "btn btn-primary highlight");
        }
    }  
}

window.onkeyup = buttonHighlight;
window.onclick = buttonHighlight;