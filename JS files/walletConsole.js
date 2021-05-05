// store important IDs into manageable variables
const home = document.getElementById("home");
const reset = document.getElementById('reset');

const consoleAdd = document.getElementById('console-add');
const balanceDisplay = document.getElementById('balance');
const colourTable = document.getElementById('colour-table');

let slots = [null, null], slotIcons = [null, null], slotAmounts = [document.getElementById('slot0-amount'), document.getElementById('slot1-amount')];
for (let i = 2; i < 8; i++) {
    slots[i] = document.getElementById('slot' + i);
    slotIcons[i] = document.getElementById('slot' + i + '-icon');
    slotAmounts[i] = document.getElementById('slot' + i + '-amount');
}

// store properties of currUser variable in localStorage to make it easily accessible
let currUser = JSON.parse(localStorage.getItem('currUser'));
let codes = currUser.accountInformation[1];
let accountAmounts = currUser.accountInformation[2];
let accountNames = currUser.accountInformation[0];
let accountBalance = currUser.balance;
let lastLog = currUser.lastLog;
let count = currUser.accountCode;
let images = currUser.accountInformation[3];

// create variables to help execute some functions
let currSlot;

// import reccuring functions used in other js files
import { hideError, showError } from './table helpers/cautionTable.js';
import { showHideInstructions } from './table helpers/pageInstructions.js';
showHideInstructions();

// set intial display for html page
updateDisplay();

// switch to home page when home icon is clicked
home.addEventListener('click', () =>  {
    window.open('home.html');
    window.close();
})

// switch to reset page when reset button is clicked
reset.addEventListener('click', () => {
    accountAmounts = [0, 0, 0, 0, 0, 0, 0, 0];
    accountBalance = 0;
    updateDisplay();
})

// analyze input of console after enter is clicked in console
consoleAdd.addEventListener('keypress', e => {
    if (e.keyCode === 13) {
        checkConsole(countSpaces(consoleAdd.value));
    }
})

// let user add, change or delete accounts created by user if the icon is clicked
for (let i = 2; i < 8; i ++) {
    slotIcons[i].addEventListener('click', () => {
        if (accountNames[i] === null)
            localStorage.setItem('addAccount', true);
        else
            localStorage.setItem('addAccount', false);
            
        localStorage.setItem('whichAccount', i);
        goAccounts();
    })
}

function checkConsole(inputs) {
    // call checkConsole with previous log inputs to repeat the previous log transaction
    if (inputs[0] === 'rep' || inputs[0] === '-' && inputs[1] === 'rep') {
        if (lastLog === 'N/A')
            resetConsole('Please enter a valid log before using rep');
        else {
            if (inputs[0] === '-')
                localStorage.setItem('minusRep', true);
            checkConsole(countSpaces(lastLog));
        }
    }
    // show error when first input if not a number
    else if (isNaN(inputs[0]) || inputs[0] === '')
        resetConsole('Invalid input');
    else {
        // if user inputted '- rep' then the opposite transaction of last log would occur
        if (localStorage.getItem('minusRep') === 'true') {
            inputs[0] *= -1;
            localStorage.setItem('minusRep', false);
        }

        /* check if console input is a valid transaction and if so, 
        change display and details about user */
        if (inputs[1] === undefined)
            resetConsole('Please enter a valid account');
        else if (codes.includes(inputs[1])) {
            if (inputs[2] === 'abs') {
                addAmount(Number(inputs[0]), codes.indexOf(inputs[1]), true, inputs);
            }
            else if (codes.includes(inputs[2])) {
                transferAmounts(Number(inputs[0]), codes.indexOf(inputs[1]), codes.indexOf(inputs[2]), inputs);
            }
            else if (inputs[2] === undefined) {
                addAmount(Number(inputs[0]), codes.indexOf(inputs[1]), false, inputs);
            }
            else
                resetConsole('Deposit account does not exist');
        }
        else
            resetConsole('Withdrawl account does not exist');
    }
}

// store each word in the console input as a specific element of inputs array
function countSpaces(str) {
    return countSpacesWrapper(str, 0, []);
}
function countSpacesWrapper(str, counter, inputs) {
    if (str.indexOf(' ') === -1) {
        inputs[counter] = str;
        return inputs;
    }
    else {
        inputs[counter] = str.substring(0, str.indexOf(' '));
        counter++;
        return countSpacesWrapper(str.substring(str.indexOf(' ') + 1), counter, inputs);
    }
}   

/* add amount to toAccount or change toAccount to amount depending on
truth value of isAbsolute */
function addAmount(amount, toAccount, isAbsolute, inputs) {
    if (isAbsolute) {
        accountBalance += amount - accountAmounts[toAccount];
        accountAmounts[toAccount] = amount;
        lastLog = inputs[0] + ' ' + inputs[1] + ' ' + inputs[2];
    }
    else {
        accountAmounts[toAccount] += amount;
        accountBalance += amount;
        lastLog = inputs[0] + ' ' + inputs[1];
    }
    resetConsole();
}

// transfer amount to toAccount and deduct from fromAccount
function transferAmounts(amount, toAccount, fromAccount, inputs) {
    if (accountAmounts[fromAccount] < amount || accountAmounts[toAccount] < (- amount))
        resetConsole('Not enough funds in account');
    else {
        accountAmounts[toAccount] += amount;
        accountAmounts[fromAccount] -= amount;
        lastLog = inputs[0] + ' ' + inputs[1] + ' ' + inputs[2];
        resetConsole();
    }
}

// show error message if message is inputted, make console empty and update display of page
function resetConsole(message) {
    if (message === undefined)
        hideError();
    else
        showError(message);
    consoleAdd.value = '';
    updateDisplay();
}

// switch to accounts page
function goAccounts() {
    window.open('accounts.html');
    window.close();
}

// update display of page and store new information about user in localStorage
function updateDisplay() {
    // change display of slots to stored values
    slotAmounts[0].textContent = (accountAmounts[0]).toFixed(2);
    slotAmounts[1].textContent = (accountAmounts[1]).toFixed(2);
    for (let i = 2; i < 8; i ++) {
        if (accountNames[i] === null) {
            slots[i].textContent = 'CLICK TO ADD ACCOUNT';
            slotAmounts[i].textContent = 'N/A';
        }
        else {
            slots[i].textContent = accountNames[i] + ' - ' + codes[i];
            slotIcons[i].src = images[i];
            slotAmounts[i].textContent = (accountAmounts[i]).toFixed(2);
        }
            slotIcons[i].src = images[i];
    }

    // display balance and change colour of display according to that balance
    balanceDisplay.textContent = '$ ' + accountBalance.toFixed(2);
    if (accountBalance === 0)
        colourTable.style.backgroundColor =  'rgb(240, 211, 116)';
    else if (accountBalance > 0)
        colourTable.style.backgroundColor = 'rgb(131, 194, 115)';
    else
        colourTable.style.backgroundColor = 'rgb(202, 136, 133)';

    // store new information into currUser in localStorage
    currUser.accountInformation = [accountNames, codes, accountAmounts, images];
    currUser.balance = accountBalance;
    currUser.lastLog = lastLog;
    currUser.accountCount = count;
    localStorage.setItem('currUser', JSON.stringify(currUser));
}