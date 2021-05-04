// store important IDs into manageable variables
const home = document.getElementById('home');
const goSignUp = document.getElementById('sign-up');
const verify = document.getElementById('account-verify');
const username = document.getElementById('username');
const password = document.getElementById('password');
const inputs = document.querySelectorAll('input');

// get allUsers from localStorage
let readAllUsers = JSON.parse(localStorage.getItem('allUsers'));

// import showError function used in all js files
import { showError } from './helper JS files/cautionTable.js';

// switch to home page when clicked
home.addEventListener('click', () => {
    window.open("home.html");
    window.close();
})

// switch to sign up page when clicked
goSignUp.addEventListener('click', () => {
    window.open('signUp.html');
    window.close();
})

/* execute checks when continue is clicked or when enter is clicked 
in any of the input boxes */
verify.addEventListener('click', () => verifyAccount(username.value, password.value));
inputs.forEach(input => {
    input.addEventListener('keypress', e => {
        if (e.keyCode === 13)
            verifyAccount(username.value, password.value);
    })
})

// check if inputs are valid, if user exists and if inputs correctly identify user
function verifyAccount(userName, password) {
    if (userName === '' || password === '')
        showError('Please fill in both field');
    else {
        if (userName in readAllUsers) {
            if (password === readAllUsers[userName].password) {
                window.open('home.html');
                window.close();
                localStorage.setItem('isSigned', true);
                localStorage.setItem('currUser', JSON.stringify(readAllUsers[userName]));
            }
            else
                showError('Incorrect password');
        }
        else
            showError('User not found in system');
    }
}