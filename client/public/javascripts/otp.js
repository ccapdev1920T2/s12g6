function input(input) {
    let key = window.event.keyCode;

    // backspace
    if (key == 8) {
        document.getElementById("otp-" + input).value = '';
        if (input > 1) {
            document.getElementById("otp-" + (input - 1)).focus();
        }
    }

    // left arrow key
    if (key == 37) {
        if (input > 1) {
            document.getElementById("otp-" + (input - 1)).focus();
        }
        return;
    }

    // check if is 1-0
    if (key < 48 || key > 57) {
        document.getElementById("otp-" + input).value = '';
        return;
    }
    
    document.getElementById("otp-" + input).value = key - 48;
    document.getElementById("otp-" + (input + 1)).focus();
    document.getElementById("otp-" + (input + 1)).value = '';
}