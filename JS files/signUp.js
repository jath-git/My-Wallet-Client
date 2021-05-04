// store important IDs into manageable variables
const back = document.getElementById("back");
const makeAcc = document.getElementById('make-account');
const name = document.getElementById('name');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmed');
const inputs = document.querySelectorAll('input');

// store property from localStorage into a more accessible variable
let readAllUsers = JSON.parse(localStorage.getItem('allUsers'));

// import showError function used in all js files
import {showError} from './helper JS files/cautionTable.js';

// if Make Account button is clicked or enter is pressed, check if inputs are valid
makeAcc.addEventListener('click', () => validAccount(name.value, username.value, password.value, confirmPassword.value));
inputs.forEach(input => {
    input.addEventListener('keypress', e => {
        if (e.keyCode === 13)
            validAccount(name.value, username.value, password.value, confirmPassword.value);
    })
})

/* check if inputs are filled appropriately and if they are unique from current users,
and if so, make new account with inputted information */
function validAccount(inputName, userName, password, confirmed) {
    if (inputName === '' || userName === '' || password === '')
    {
        showError('Please fill in all fields');
    }
    else {
        if (userName in readAllUsers)
            showError('Please choose another username');
        else {
            if (confirmed === password)
                createAccount(inputName, userName, password);
            else
                showError('Passwords do not match');
        }
    }
}

// add new user to localStorage and switch to sign in page
function createAccount(inputName, userName, password) {
    readAllUsers[userName] = new User(inputName, userName, password);
    localStorage.setItem('allUsers', JSON.stringify(readAllUsers));
    goSignIn();
}

// switch to sign in page
function goSignIn() {
    window.open("signIn.html");
    window.close();
}

// switch to sign in page if back image is clicked
back.addEventListener('click', () => goSignIn());

// make new user with specific properties
function User(inputName, userName, password) {
    this.name = inputName;
    this.username = userName;
    this.password = password;
    this.balance = 0;
    this.lastDate = 'N/A';
    this.lastLog = 'N/A';
    this.accountCount = 2;
    this.accountInformation = [['Cash', 'Other', null, null, null, null, null, null], 
    ['cash', 'other', null, null, null, null, null, null], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    ['images/cash.png', 'images/other.png', 'images/add.png', 'images/add.png', 'images/add.png', 'images/add.png', 'images/add.png', 'images/add.png']];
}