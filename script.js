// script.js
const {ipcRenderer} = require('electron');

function showToast(message) {
    var toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.style.visibility = "visible";
    setTimeout(function () {
        toast.style.visibility = "hidden";
    }, 3000);
}

document.addEventListener('DOMContentLoaded', (event) => {
    const checkButton = document.getElementById('checkButton');
    const clearButton = document.getElementById('clearButton');

    checkButton.addEventListener('click', checkAddress);
    clearButton.addEventListener('click', clearAddress);
});

function checkAddress() {
    const address = document.getElementById('address').value;
    ipcRenderer.send('check-address', address);
}

ipcRenderer.on('check-result', (event, isValid) => {
    showToast(isValid ? 'Valid Bitcoin Address' : 'Invalid Bitcoin Address');
});

function clearAddress() {
    document.getElementById('address').value = '';
}
