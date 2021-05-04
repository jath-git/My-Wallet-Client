/* hide error message (which is under the header) and show error 
message depending on user activity */

const caution = document.getElementById('caution');
const cautionMsg = document.getElementById('caution-msg');
const errorImg = document.getElementById('error-img');

export function hideError() {
    caution.style.backgroundColor = 'transparent';
    cautionMsg.style.color = 'transparent';
    errorImg.style.display = 'none';
}

export function showError(msg) {
    cautionMsg.textContent = msg;
    caution.style.backgroundColor = 'rgb(192, 136, 63)';
    cautionMsg.style.color = 'black';
    errorImg.style.display = 'inline-block';
}